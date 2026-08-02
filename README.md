# 🍸 DrinkIt

DrinkIt is a modern, full-stack alcohol and snacks delivery platform, designed with an architecture similar to Zomato/Swiggy but specifically tailored for alcohol delivery with built-in compliance and age verification systems

## 🚀 Tech Stack

**Frontend:**
- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS** (Custom dark mode aesthetic)
- **Radix UI** & **Lucide React** for accessible UI components
- **Redux Toolkit** & **React Query** for state management
- **Socket.io-client** for real-time delivery tracking

**Backend:**
- **Node.js & Express** with TypeScript
- **PostgreSQL** (via **Prisma 5 ORM**) for transactional data (Users, Orders, Delivery)
- **MongoDB** (via **Mongoose**) for high-volume flexible data (Products, Inventory, Categories)
- **Redis** for high-speed caching
- **Socket.io** for real-time event streaming
- **OpenAI API** for AI-driven age verification (ID & selfie match) and product recommendations
- **JWT & bcrypt** for authentication

**Infrastructure:**
- **Docker & Docker Compose** for local development services
- **Kubernetes** manifests prepared for production deployment
- **Prometheus & Grafana** for monitoring (port 3000)

## 📁 Project Structure

- `/frontend` - The Next.js web application (Runs on port 3001)
- `/backend` - The Node.js Express API (Runs on port 5000)
- `/docker` - Docker Compose configurations and NGINX setup
- `/kubernetes` - K8s deployment manifests
- `/monitoring` - Prometheus & Grafana configurations
- `/scripts` - Utilities for deployment and database seeding
- `/docs` - Project planning and database schemas

## 🛠️ Local Development Setup

### 1. Start Infrastructure Services

The project requires PostgreSQL (port 5433), MongoDB (port 27017), and Redis (port 6379).
We use Docker Compose to spin these up easily:

```bash
docker-compose up -d
```

### 2. Setup Backend

Open a new terminal and navigate to the backend directory:

```bash
cd backend
npm install
```

Ensure your `.env` file matches `.env.example`.
Initialize the Prisma PostgreSQL schema:

```bash
npx prisma generate
npx prisma db push
```

Start the backend development server:

```bash
npm run dev
```
*(The backend API will run on http://localhost:5000)*

### 3. Setup Frontend

Open a new terminal and navigate to the frontend directory:

```bash
cd frontend
npm install
```

Ensure your `.env.local` contains the correct API and Socket URLs.
Start the frontend development server:

```bash
npm run dev
```
*(The frontend will run on http://localhost:3001 to avoid conflicts with Grafana on 3000)*

## ✨ Key Features

- **Polyglot Persistence**: Strategic use of SQL (PostgreSQL) for relational constraints and NoSQL (MongoDB) for catalog flexibility.
- **AI Age Verification**: Upload a government ID and a selfie to instantly verify age compliance using OpenAI Vision.
- **Real-Time Tracking**: Live order and delivery partner tracking using Socket.io.
- **State Law Compliance**: Built-in middleware to respect state-specific alcohol delivery timings, minimum ages, and dry days.
- **Premium UI**: Designed with a sleek, dark-themed, glassmorphic aesthetic to provide a high-end user experience.
