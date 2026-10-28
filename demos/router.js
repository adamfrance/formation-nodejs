class Router {
  #routes = [];

  add(method, pattern, handler) {
    const keys = [];
    const source = pattern.replace(/:(\w+)/g, (_, key) => {
      keys.push(key);
      return '([^/]+)';
    });
    this.#routes.push({ method, regex: new RegExp(`^${source}/?$`), keys, handler });
    return this;
  }

  get(pattern, handler) { return this.add('GET', pattern, handler); }
  post(pattern, handler) { return this.add('POST', pattern, handler); }
  put(pattern, handler) { return this.add('PUT', pattern, handler); }
  delete(pattern, handler) { return this.add('DELETE', pattern, handler); }

  match(method, pathname) {
    for (const route of this.#routes) {
      if (route.method !== method) continue;
      const m = route.regex.exec(pathname);
      if (!m) continue;
      const params = Object.fromEntries(
        route.keys.map((key, i) => [key, decodeURIComponent(m[i + 1])]),
      );
      return { handler: route.handler, params };
    }
    return null;
  }
}

module.exports = Router;
