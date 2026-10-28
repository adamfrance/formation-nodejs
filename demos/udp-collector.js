const dgram = require('node:dgram');

const socket = dgram.createSocket('udp4');
let count = 0;
socket.on('message', (msg, rinfo) => {
  count += 1;
  console.log(`[#${count}] ${msg} (de ${rinfo.address}:${rinfo.port})`);
});
socket.bind(4001, () => console.log('Collecteur UDP sur le port 4001'));
