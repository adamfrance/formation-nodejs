console.log('A');
setTimeout(() => console.log('B'), 0);
setImmediate(() => console.log('C'));
Promise.resolve().then(() => console.log('D'));
process.nextTick(() => console.log('E'));
(async () => {
  console.log('F');
  await null;
  console.log('G');
})();
console.log('H');
