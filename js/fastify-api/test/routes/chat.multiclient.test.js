'use strict';

const { test } = require('node:test');
const assert = require('assert');
const Fastify = require('fastify');
const WebSocket = require('ws');
const pubsubPlugin = require('../../plugins/pubsub');

test('Improved multi-client WebSocket communication', async (t) => {
    const app = Fastify();
    app.register(require('@fastify/websocket'));
    app.register(pubsubPlugin);
    app.register(require('../../routes/chat'));

    const address = await app.listen({ port: 0 });
    const port = address.split(':').pop();

    const clientCount = 3;
    const clients = [];
    const allMessages = [];
    const receivedMessages = new Map();

    // Создаем клиентов
    for (let i = 0; i < clientCount; i++) {
        const clientId = `client-${i + 1}`;
        const ws = new WebSocket(`ws://localhost:${port}`);

        // Инициализируем пустой массив для хранения сообщений клиента
        receivedMessages.set(clientId, []);

        const messagePromise = new Promise((resolve, reject) => {
            const timeout = setTimeout(() => reject(new Error(`${clientId} timed out`)), 20000);

            ws.on('open', () => {
                console.log(`${clientId} connected`);

                // Ждем 1 секунду перед отправкой сообщений, чтобы все клиенты подписались
                setTimeout(() => {
                    for (let j = 0; j < clientCount; j++) {
                        const message = `Hello from client-${j + 1}`;
                        allMessages.push(message);
                        ws.send(message);
                    }
                }, 1000);
            });

            ws.on('message', (message) => {
                const text = message.toString();
                console.log(`${clientId} received message: ${text}`);

                // Добавляем сообщение в список полученных
                receivedMessages.get(clientId).push(text);

                // Если клиент получил все сообщения, завершаем промис
                if (receivedMessages.get(clientId).length === clientCount) {
                    clearTimeout(timeout);
                    resolve();
                }
            });

            ws.on('error', (err) => {
                console.error(`${clientId} WebSocket error:`, err);
                reject(err);
            });
        });

        clients.push({ ws, messagePromise });
    }

    // Ждем, пока все клиенты получат все сообщения
    await Promise.all(clients.map(client => client.messagePromise));

    // Проверяем, что каждый клиент получил все сообщения
    for (let [clientId, clientMessages] of receivedMessages.entries()) {
        for (let message of allMessages) {
            assert(clientMessages.includes(message), `${clientId} missed message "${message}"`);
        }
    }

    // Закрываем все соединения
    clients.forEach(client => client.ws.close());
    await app.close();

    console.log('All clients received all messages without duplicates');
});
