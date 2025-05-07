# Fastify Chat API

A simple real-time chat server built with Fastify, WebSocket, and Redis. This project demonstrates how to create a basic WebSocket server with multi-client support using Fastify and Redis for message broadcasting.

## 📦 Features

* Real-time chat with multiple clients
* WebSocket communication
* Redis Pub/Sub for message distribution
* Automated tests for multi-client communication

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

* Node.js (v20+)
* Docker (for Redis)

### Install dependencies

```bash
npm install
```

### Run Redis

```bash
docker run -d --name fastify-chat-redis -p 6379:6379 redis
```

### Run the server

```bash
npm run dev
```

The server should now be running at **[http://localhost:3000](http://localhost:3000)**.

---

## 🧪 Running Tests

### Run all tests

```bash
npm test
```
---
