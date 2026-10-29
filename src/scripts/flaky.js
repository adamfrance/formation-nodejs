// Simule un appel distant instable : les ids impairs échouent à la première tentative
const attempts = new Map();
let inFlight = 0;
let maxInFlight = 0;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function flakyFetch(id) {
  const n = (attempts.get(id) ?? 0) + 1;
  attempts.set(id, n);
  inFlight += 1;
  maxInFlight = Math.max(maxInFlight, inFlight);
  try {
    await sleep(30);
    if (id % 5 === 0) throw new Error(`ressource ${id} définitivement indisponible`);
    if (id % 2 === 1 && n === 1) throw new Error(`échec temporaire sur ${id}`);
    return { id, title: `Tâche distante ${id}`, attempts: n };
  } finally {
    inFlight -= 1;
  }
}

module.exports = { flakyFetch, stats: () => ({ maxInFlight }) };
