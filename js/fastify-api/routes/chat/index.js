'use strict'

module.exports = async function (fastify, opts) {
    fastify.get('/', { websocket: true }, (connection, req) => {
        console.log('Client connected');

        connection.on('message', (message) => {
            console.log('[WS] Received from client:', message);
            fastify.publishMessage(message);
        });

        fastify.subscribeToMessages((message) => {
            console.log('[WS] Sending to client:', message);
            if (connection.readyState === 1) {
                connection.send(message);
            }
        });

        connection.on('close', () => {
            console.log('Client disconnected');
        });
    });
};
