'use strict';

const { test } = require('node:test');
const assert = require('assert');
const Fastify = require('fastify');
const WebSocket = require('ws');
const pubsubPlugin = require('../../plugins/pubsub');

test('Chat WebSocket', async (t) => {
    const app = Fastify();
    app.register(require('@fastify/websocket'));
    app.register(pubsubPlugin);
    app.register(require('../../routes/chat'));

    const address = await app.listen({ port: 0 });
    const port = address.split(':').pop();

    const ws = new WebSocket(`ws://localhost:${port}`);

    const messagePromise = new Promise((resolve, reject) => {
        const timeout = setTimeout(() => reject(new Error('Test timed out')), 5000);

        ws.on('open', () => {
            console.log('Sending message to server');
            ws.send('Hello from test');
        });

        ws.on('message', (message) => {
            console.log('Received message from server:', message.toString());
            clearTimeout(timeout);
            resolve(message.toString());
        });

        ws.on('error', (err) => {
            console.error('WebSocket error:', err);
            reject(err);
        });
    });

    const message = await messagePromise;
    assert.strictEqual(message, 'Hello from test', 'Received expected message');

    ws.close();
    await app.close();
});
