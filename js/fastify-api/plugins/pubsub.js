'use strict'

const fp = require('fastify-plugin');
const Redis = require('ioredis');

async function pubsubPlugin(fastify, opts) {
    const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';
    const pub = new Redis(redisUrl);
    const sub = new Redis(redisUrl);

    pub.on('connect', () => console.log('Redis pub connected'));
    sub.on('connect', () => console.log('Redis sub connected'));

    fastify.decorate('publishMessage', (message) => {
        console.log('[Pub] Publishing message:', message);
        pub.publish('chat', message).then(() => {
            console.log('[Pub] Message published:', message);
        }).catch((err) => {
            console.error('[Pub] Error publishing message:', err);
        });
    });

    fastify.decorate('subscribeToMessages', (callback) => {
        console.log('[Sub] Subscribing to chat channel');
        sub.subscribe('chat', (err) => {
            if (err) {
                console.error('[Sub] Redis subscribe error:', err);
            } else {
                console.log('[Sub] Successfully subscribed to chat channel');
            }
        });

        sub.on('message', (channel, message) => {
            console.log('[Sub] Received message from Redis:', message);
            callback(message);
        });
    });

    fastify.addHook('onClose', async (instance) => {
        console.log('Closing Redis connections');
        await pub.quit();
        await sub.quit();
    });
}

module.exports = fp(pubsubPlugin);
