# DrinkIt - Project Plan

## Summary
**DrinkIt** - Alcohol & Snacks Delivery Platform with AI age verification. A full-stack delivery platform similar to Zomato/Swiggy but specialized for alcohol and snacks, featuring real-time delivery tracking, AI-powered age verification, and intelligent product recommendations.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | Next.js 15, TypeScript, React 18 |
| Backend | Node.js, Express.js, TypeScript |
| Database (Relational) | PostgreSQL (via Prisma ORM) |
| Database (Document) | MongoDB (via Mongoose) |
| Cache | Redis (via ioredis) |
| Message Queue | Kafka |
| Real-time | Socket.io |
| AI/ML | OpenAI API (age verification, recommendations) |
| Containerization | Docker, Docker Compose |
| Orchestration | Kubernetes |
| Monitoring | Prometheus, Grafana |
| Auth | JWT + bcrypt |
| Validation | Zod |

---

## 7-Day Implementation Roadmap

### Day 1: Project Setup & Infrastructure
- [x] Initialize project structure (frontend, backend, docker, k8s, docs, monitoring)
- [x] Set up Docker Compose (PostgreSQL, MongoDB, Redis)
- [x] Configure Prisma schema & MongoDB models
- [x] Set up Express server with middleware (cors, helmet, morgan, rate-limit)
- [x] Environment configuration (.env)

### Day 2: Authentication & User Management
- [x] JWT-based authentication (register, login, profile)
- [x] Password hashing with bcrypt
- [x] Role-based access control (USER, ADMIN, DELIVERY_PARTNER)
- [x] Zod request validation middleware
- [ ] AI age verification endpoint (OpenAI integration)

### Day 3: Product & Inventory Management
- [ ] Product CRUD APIs (MongoDB)
- [ ] Category management
- [ ] Inventory tracking with low-stock alerts
- [ ] Product search with filters (category, price, brand)
- [ ] Product image handling

### Day 4: Order Management & Payment
- [ ] Order creation with cart validation
- [ ] Order status workflow (PENDING → CONFIRMED → PREPARING → OUT_FOR_DELIVERY → DELIVERED)
- [ ] Payment integration placeholder
- [ ] Order history & tracking APIs
- [ ] Delivery fee calculation

### Day 5: Real-time Features & Delivery
- [ ] Socket.io integration for live order tracking
- [ ] Delivery partner assignment logic
- [ ] Real-time location updates
- [ ] Push notification system (via Kafka)
- [ ] ETA calculation

### Day 6: Frontend Development
- [ ] Landing page with product catalog
- [ ] User authentication UI (login/register)
- [ ] Product browsing with filters
- [ ] Cart & checkout flow
- [ ] Order tracking dashboard
- [ ] Admin panel for order management

### Day 7: DevOps & Monitoring
- [ ] Dockerize frontend & backend
- [ ] Kubernetes deployment manifests
- [ ] Prometheus metrics collection
- [ ] Grafana dashboards (API latency, error rates, order volume)
- [ ] CI/CD pipeline setup
- [ ] Load testing & performance optimization

---

## Architecture

```
┌─────────────┐     ┌──────────────┐     ┌─────────────┐
│   Next.js   │────▶│   Express    │────▶│ PostgreSQL  │
│  Frontend   │     │   Backend    │     │  (Prisma)   │
│  Port 3001  │     │  Port 5000   │     │  Port 5432  │
└─────────────┘     └──────┬───────┘     └─────────────┘
                           │
                    ┌──────┼───────┐
                    │      │       │
              ┌─────▼──┐ ┌─▼────┐ ┌▼──────────┐
              │MongoDB │ │Redis │ │  Kafka    │
              │Port    │ │Port  │ │  Port     │
              │27017   │ │6379  │ │  9092     │
              └────────┘ └──────┘ └───────────┘
```
