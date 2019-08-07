var events = require('events');

var eventEmitter = new events.EventEmitter();

eventEmitter.on('connection', () => {
  // makes "connection"
  console.log('Connection completed');
  console.log('Sending data');
  eventEmitter.emit('send_data');
});

eventEmitter.on('send_data', () => {
  // receives data
  console.log('Received data');
});

eventEmitter.emit('connection');

console.log('program ended')
