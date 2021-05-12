const run = require('../mq');

run().then(async (conn) => {
    const channel = await conn.createChannel();
    const queueName = 'hello';
    await channel.assertQueue(queueName, { durable: false });

    channel.consume(
        queueName,
        (msg) => {
            console.log('receive', msg.content.toString());
        },
        {
            noAck: true,
        }
    );
});
