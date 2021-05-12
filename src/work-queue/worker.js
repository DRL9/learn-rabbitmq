const run = require('../mq');

/**
 * round-robin:
 * rabbitmq 会按顺序平均把消息分发给各个 comsumer
 */

run().then(async (conn) => {
    const channel = await conn.createChannel();
    // 告诉mq, 我只能同时处理2条， 等我有空闲再发送新的给我
    await channel.prefetch(2);
    channel.consume(
        'time_task',
        (msg) => {
            let content = msg.content.toString();
            const time = /\d+/.exec(content)[0] - 0;
            console.log(new Date(), 'receive', content);
            setTimeout(() => {
                // 主动确认, 告诉 mq 可以从队列中删除该消息了
                // 如果该 comsumer 断开连接，却没有 ack 该消息， mq会把它再次发给其他comsumer
                channel.ack(msg);
            }, 1000 * time);
        },
        {
            // 不要自动确认
            noAck: false,
        }
    );
});
