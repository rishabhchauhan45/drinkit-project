# DrinkIt - Database Schema Documentation

## Overview
DrinkIt uses a **polyglot persistence** strategy:
- **PostgreSQL** (via Prisma): User accounts, addresses, orders, deliveries — structured relational data
- **MongoDB** (via Mongoose): Products, inventory, categories — flexible document data
- **Redis**: Session cache, rate limiting, real-time data

---

## PostgreSQL Schema (Prisma)

### Enums

| Enum | Values |
|------|--------|
| `Role` | USER, ADMIN, DELIVERY_PARTNER |
| `OrderStatus` | PENDING, CONFIRMED, PREPARING, OUT_FOR_DELIVERY, DELIVERED, CANCELLED |
| `PaymentStatus` | PENDING, PAID, FAILED |
| `DeliveryStatus` | ASSIGNED, PICKED_UP, IN_TRANSIT, DELIVERED |

### User Model
| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id @default(cuid()) |
| email | String | @unique |
| phone | String | @unique |
| name | String | |
| age | Int | |
| password | String | hashed with bcrypt |
| isVerified | Boolean | @default(false) |
| role | Role | @default(USER) |
| addresses | Address[] | one-to-many |
| orders | Order[] | one-to-many |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

### Address Model
| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id @default(cuid()) |
| userId | String | FK → User |
| lat | Float | |
| lng | Float | |
| address | String | |
| landmark | String? | optional |
| isDefault | Boolean | @default(false) |
| createdAt | DateTime | @default(now()) |

### Order Model
| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id @default(cuid()) |
| userId | String | FK → User |
| products | Json | array of {productId, name, qty, price} |
| totalAmount | Float | |
| deliveryFee | Float | |
| tax | Float | |
| status | OrderStatus | @default(PENDING) |
| deliveryId | String? | |
| createdAt | DateTime | @default(now()) |
| updatedAt | DateTime | @updatedAt |

### Delivery Model
| Field | Type | Constraints |
|-------|------|-------------|
| id | String | @id @default(cuid()) |
| orderId | String | @unique, FK → Order |
| partnerId | String | |
| partnerName | String | |
| partnerPhone | String | |
| currentLat | Float | |
| currentLng | Float | |
| status | DeliveryStatus | @default(ASSIGNED) |
| estimatedTime | Int | minutes |

---

## MongoDB Schema (Mongoose)

### Product Schema
| Field | Type | Notes |
|-------|------|-------|
| name | String | required |
| category | String (enum) | WHISKEY, VODKA, RUM, GIN, WINE, BEER, SNACKS, MIXERS |
| subCategory | String | optional |
| price | Number | required |
| mrp | Number | |
| discount | Number | default: 0 |
| volume | String | e.g., "750ml" |
| abv | Number | alcohol by volume % |
| brand | String | required |
| description | String | |
| images | [String] | array of URLs |
| stock | Number | required |
| tags | [String] | for search |
| pairings | [ObjectId] | ref: Product |
| ratings | Object | { average: Number, count: Number } |

### Inventory Schema
| Field | Type | Notes |
|-------|------|-------|
| productId | ObjectId | ref: Product |
| warehouse | String | |
| quantity | Number | |
| reserved | Number | default: 0 |
| lastRestocked | Date | |
| threshold | Number | default: 20 (alert level) |

### Category Schema
| Field | Type | Notes |
|-------|------|-------|
| name | String | required, unique |
| icon | String | emoji/icon name |
| image | String | URL |
| isActive | Boolean | default: true |

---

## Entity Relationships

```
User 1──────* Address
User 1──────* Order
Order 1──────1 Delivery

Product *────* Product (pairings)
Product 1────* Inventory (per warehouse)
Category 1───* Product (via category field)
```
