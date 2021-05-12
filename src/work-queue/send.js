const run = require('../mq');

/**
 * 将资源密集型的任务发送到队列里面， 不需要马上完成
 */

run().then(async (conn) => {
    const channel = await conn.createChannel();
    const queueName = 'time_task';
    await channel.assertQueue(queueName, {
        // 保证mq重启的时候， 该队列从磁盘恢复
        // 如果直接声明了该队列， 并标记为false, 那么会报错，因为durable不能重复声明
        durable: true,
    });
    Array(Number(process.argv[2]) || 10)
        .fill(1)
        .forEach((_, idx) => {
            channel.sendToQueue(queueName, Buffer.from('task' + idx), {
                // 保证该消息在重启时候不消失
                // 不一定能完成保证， 因为RabbitMQ没有做fsync(2)， 有可能消息只能存在cache中
                persistent: true,
            });
        });
    setTimeout(() => {
        conn.close();
        process.exit(0);
    }, 500);
});
