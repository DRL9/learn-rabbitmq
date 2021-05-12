const amqplib = require('amqplib');

async function run() {
    return amqplib.connect({
        hostname: '192.168.1.229',
        username: 'user',
        password: 'user',
    });
}

module.exports = run;
