const list = document.querySelector('#list');
const form = document.querySelector('#form');
const errorBox = document.querySelector('#error');

async function api(path, options) {
  const res = await fetch(path, { headers: { 'Content-Type': 'application/json' }, ...options });
  if (!res.ok) throw new Error((await res.json()).error ?? `HTTP ${res.status}`);
  return res.status === 204 ? null : res.json();
}

function render(tasks) {
  list.replaceChildren(...tasks.map((task) => {
    const li = document.createElement('li');
    li.className = task.done ? 'done' : '';
    const box = Object.assign(document.createElement('input'), { type: 'checkbox', checked: task.done });
    box.addEventListener('change', () => act(() => api(`/api/tasks/${task.id}`, { method: 'PUT', body: JSON.stringify({ done: box.checked }) })));
    const label = document.createElement('span');
    label.textContent = ` ${task.title} `;           // textContent : pas d'injection HTML
    const del = Object.assign(document.createElement('button'), { textContent: 'Supprimer' });
    del.addEventListener('click', () => act(() => api(`/api/tasks/${task.id}`, { method: 'DELETE' })));
    li.append(box, label, del);
    return li;
  }));
}

async function refresh() { render(await api('/api/tasks?limit=100')); }

async function act(action) {
  errorBox.textContent = '';
  try { await action(); await refresh(); } catch (err) { errorBox.textContent = err.message; }
}

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const title = document.querySelector('#title');
  act(() => api('/api/tasks', { method: 'POST', body: JSON.stringify({ title: title.value }) }))
    .then(() => { title.value = ''; });
});

refresh().catch((err) => { errorBox.textContent = err.message; });
