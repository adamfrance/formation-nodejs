// fetch : un délai maximal, puis le statut, avant de lire la réponse
const url = process.argv[2] ?? 'https://jsonplaceholder.typicode.com/todos?_limit=3';

async function main() {
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(3000) });
    console.log('statut :', res.status);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const todos = await res.json();
    for (const todo of todos) console.log('-', todo.title);
  } catch (err) {
    console.error('Erreur :', err.name === 'TimeoutError' ? 'délai dépassé' : err.message);
    process.exitCode = 1;
  }
}

main();
