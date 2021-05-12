const run = require('../mq');

run().then(async (conn) => {
    const channel = await conn.createChannel();
    console.log('channel ok');

    const queueName = 'hello';
    // 如果队列不存在， 那么就会创建它
    await channel.assertQueue(queueName, {
        durable: false,
    });
    channel.sendToQueue(queueName, Buffer.from('hello world'));
});
