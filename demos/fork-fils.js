// Le fils reçoit les tâches par le canal IPC et renvoie les statistiques
process.on('message', ({ tasks }) => {
  const done = tasks.filter((t) => t.done).length;
  process.send({ pid: process.pid, total: tasks.length, done });
});
