<div align="center">
  <h1>🚗 WheelShare</h1>
  <p><strong>A modern peer-to-peer vehicle rental platform connecting owners with renters</strong></p>

  <p>
    <a href="#-getting-started"><strong>Quick Start »</strong></a>
    &nbsp;·&nbsp;
    <a href="#-api-reference"><strong>API Docs »</strong></a>
    &nbsp;·&nbsp;
    <a href="#-architecture"><strong>Architecture »</strong></a>
    &nbsp;·&nbsp;
    <a href="https://github.com/AllenLenoy/WheelShare/issues">Report Bug</a>
    &nbsp;·&nbsp;
    <a href="https://github.com/AllenLenoy/WheelShare/issues">Request Feature</a>
  </p>

  <br />

  <!-- BADGES -->
  <img src="https://img.shields.io/badge/Angular-19.2-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular 19" />
  <img src="https://img.shields.io/badge/Node.js-18+-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express 5" />
  <img src="https://img.shields.io/badge/MongoDB-Mongoose%209-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
  <img src="https://img.shields.io/badge/License-MIT-blue?style=for-the-badge" alt="MIT License" />
</div>

<br />

---

## 📑 Table of Contents

- [About the Project](#-about-the-project)
- [Key Features](#-key-features)
- [Tech Stack](#-tech-stack)
- [Architecture](#-architecture)
  - [High-Level Overview](#high-level-overview)
  - [Project Structure](#project-structure)
  - [Database Schema (ERD)](#database-schema-erd)
  - [Request Lifecycle](#request-lifecycle)
- [User Flows](#-user-flows)
  - [Authentication Flow](#1-authentication-flow)
  - [Vehicle Booking Flow](#2-vehicle-booking-flow)
  - [Owner Management Flow](#3-owner-management-flow)
  - [Admin Dashboard Flow](#4-admin-dashboard-flow)
- [Getting Started](#-getting-started)
  - [Prerequisites](#prerequisites)
  - [Local Development Setup](#local-development-setup)
  - [Docker Deployment](#docker-deployment)
  - [Seeding Sample Data](#seeding-sample-data)
- [Environment Variables](#-environment-variables)
- [API Reference](#-api-reference)
  - [Authentication](#authentication-apiauth)
  - [Vehicles](#vehicles-apivehicles)
  - [Bookings](#bookings-apibookings)
  - [Reviews](#reviews-apireviews)
  - [Admin](#admin-apiadmin)
- [Security Model](#-security-model)
- [Frontend Architecture](#-frontend-architecture)
- [Contributing](#-contributing)
- [License](#-license)

---

## 📖 About the Project

**WheelShare** is a full-stack web application designed to revolutionize local vehicle rentals. It connects individuals who have underutilized vehicles (cars, bikes, scooters) with locals or travelers looking for short-term transportation — creating an affordable, sustainable, and community-driven ecosystem.

The platform supports three distinct user roles (**Customer**, **Owner**, **Admin**), each with their own dedicated dashboard and capabilities. Built with a security-first approach using JWT authentication, role-based access control, rate limiting, and HTTP security headers.

---

## ✨ Key Features

| Category | Feature | Description |
|---|---|---|
| 🔐 **Auth** | JWT Authentication | Stateless session management with `bcryptjs` password hashing (10 salt rounds) |
| 👥 **RBAC** | Role-Based Access Control | Three-tier permission system: Customer, Owner, Admin |
| 🚗 **Vehicles** | Vehicle Management | Full CRUD with image uploads via Cloudinary, multi-type support (Car, Bike, Scooter) |
| 🔍 **Search** | Advanced Discovery | Filter by type, location, brand, and max price with case-insensitive regex matching |
| 📅 **Bookings** | Booking Engine | Date-range booking with status lifecycle: Pending → Accepted → Completed |
| ⭐ **Reviews** | Rating System | 1–5 star ratings with comments, one review per user per vehicle |
| 📊 **Admin** | Analytics Dashboard | Platform-wide stats: total users, vehicles, bookings, and revenue |
| 🖼️ **Media** | Cloud Image Hosting | Cloudinary + Multer integration for high-performance vehicle image storage |
| 🛡️ **Security** | Defense-in-Depth | Helmet, CORS, express-rate-limit, express-mongo-sanitize |
| 🐳 **DevOps** | Docker Compose | One-command deployment with MongoDB, Backend, and Frontend containers |
| 🌗 **UI** | Theme Support | Built-in light/dark mode toggle with CSS design tokens |
| ⚡ **Performance** | Lazy Loading | Owner and Admin modules are lazy-loaded to reduce initial bundle size |

---

## 🛠 Tech Stack

### Frontend (Client)
| Technology | Purpose |
|---|---|
| **Angular 19** | UI framework (Standalone Components, no NgModules) |
| **TypeScript 5.7** | Type-safe development |
| **RxJS 7.8** | Reactive state management with `BehaviorSubject` |
| **Angular Router** | Client-side routing with lazy loading and route guards |
| **Vanilla CSS** | Custom design system with CSS variables (design tokens) |

### Backend (Server)
| Technology | Purpose |
|---|---|
| **Node.js 18+** | JavaScript runtime |
| **Express.js 5.x** | Web framework for RESTful API |
| **Mongoose 9.x** | MongoDB ODM for schema validation and queries |
| **JSON Web Tokens** | Stateless authentication |
| **bcryptjs** | Password hashing (10 salt rounds) |
| **Multer + Cloudinary** | File upload processing and cloud image storage |

### Infrastructure
| Technology | Purpose |
|---|---|
| **Docker & Docker Compose** | Containerized deployment (3 services) |
| **MongoDB** | NoSQL document database |
| **Cloudinary** | Cloud-based media management CDN |

---

## 🏗 Architecture

### High-Level Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        CLIENT (Browser)                         │
│                                                                 │
│  ┌──────────┐  ┌───────────┐  ┌──────────┐  ┌──────────────┐   │
│  │   Home   │  │  Vehicles │  │ Customer │  │ Owner/Admin  │   │
│  │   Page   │  │  Listing  │  │Dashboard │  │  Dashboards  │   │
│  └──────────┘  └───────────┘  └──────────┘  └──────────────┘   │
│                        │                                        │
│              ┌─────────▼─────────┐                              │
│              │  Angular Services │ (AuthService, VehicleService, │
│              │  + HTTP Client    │  BookingService, etc.)        │
│              └─────────┬─────────┘                              │
│                        │                                        │
│              ┌─────────▼─────────┐                              │
│              │  Auth Interceptor │ (auto-attaches JWT token)    │
│              └─────────┬─────────┘                              │
└────────────────────────┼────────────────────────────────────────┘
                         │ HTTP (JSON)
                         ▼
┌─────────────────────────────────────────────────────────────────┐
│                    SERVER (Express.js 5)                        │
│                                                                 │
│  ┌─────────┐  ┌──────┐  ┌──────────┐  ┌───────────────────┐   │
│  │ Helmet  │→ │ CORS │→ │ JSON     │→ │ Rate Limiter      │   │
│  │ Headers │  │      │  │ Parser   │  │ (100 req/15 min)  │   │
│  └─────────┘  └──────┘  └──────────┘  └─────────┬─────────┘   │
│                                                  │              │
│                                    ┌─────────────▼───────────┐  │
│                                    │     Route Matching      │  │
│                                    │  /api/auth    → Auth    │  │
│                                    │  /api/vehicles→ Vehicle │  │
│                                    │  /api/bookings→ Booking │  │
│                                    │  /api/reviews → Review  │  │
│                                    │  /api/admin   → Admin   │  │
│                                    └─────────────┬───────────┘  │
│                                                  │              │
│                    ┌─────────────┬────────────────┤              │
│                    ▼             ▼                ▼              │
│             ┌───────────┐ ┌───────────┐ ┌────────────────┐      │
│             │  protect  │ │ authorize │ │  Multer Upload │      │
│             │(JWT check)│ │(role RBAC)│ │  (Cloudinary)  │      │
│             └─────┬─────┘ └─────┬─────┘ └────────┬───────┘      │
│                   │             │                │               │
│                   └─────────────┴────────────────┘               │
│                                 │                                │
│                    ┌────────────▼────────────┐                   │
│                    │      Controllers        │                   │
│                    │  (Business Logic Layer) │                   │
│                    └────────────┬────────────┘                   │
│                                │                                │
│                    ┌───────────▼────────────┐                   │
│                    │  Mongoose ODM Models   │                   │
│                    │  (Schema Validation)   │                   │
│                    └───────────┬────────────┘                   │
└────────────────────────────────┼────────────────────────────────┘
                                 │
                                 ▼
                    ┌────────────────────────┐
                    │    MongoDB Database    │
                    │  (Users, Vehicles,     │
                    │   Bookings, Reviews)   │
                    └────────────────────────┘
```

### Project Structure

```
WheelShare/
│
├── backend/                          # Node.js + Express API
│   ├── config/
│   │   ├── db.js                     # MongoDB connection (Mongoose)
│   │   └── cloudinary.js             # Cloudinary + Multer configuration
│   │
│   ├── controllers/                  # Business logic layer
│   │   ├── auth.controller.js        # Register, Login, Profile, Password
│   │   ├── vehicle.controller.js     # CRUD + Search for vehicles
│   │   ├── booking.controller.js     # Create, Read, Status updates
│   │   ├── review.controller.js      # Add, Read, Update, Delete reviews
│   │   └── admin.controller.js       # Users, Vehicles, Bookings, Stats
│   │
│   ├── middleware/
│   │   ├── auth.middleware.js        # JWT verification → attaches req.user
│   │   └── role.middleware.js        # Role-based authorization (RBAC)
│   │
│   ├── models/                       # Mongoose schemas
│   │   ├── user.js                   # User (name, email, password, role)
│   │   ├── Vehicle.js                # Vehicle (15+ fields, owner ref)
│   │   ├── Booking.js                # Booking (customer, vehicle, dates, status)
│   │   └── Review.js                 # Review (user, vehicle, rating, comment)
│   │
│   ├── routes/                       # API endpoint definitions
│   │   ├── auth.routes.js            # /api/auth/* (with auth rate limiter)
│   │   ├── vehicle.routes.js         # /api/vehicles/*
│   │   ├── booking.routes.js         # /api/bookings/*
│   │   ├── review.routes.js          # /api/reviews/*
│   │   └── admin.routes.js           # /api/admin/* (admin-only)
│   │
│   ├── seed_vehicles.js              # Database seeder with sample vehicles
│   ├── server.js                     # Express app entry point
│   ├── Dockerfile                    # Backend container config
│   ├── package.json
│   └── .env                          # Environment variables (gitignored)
│
├── frontend/                         # Angular 19 SPA
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/                 # Login & Register components
│   │   │   ├── home/                 # Landing page
│   │   │   ├── vehicles/             # Car list, Car details, Vehicle card
│   │   │   ├── booking/              # Book car, Booking history
│   │   │   ├── customer/             # Customer dashboard, Profile
│   │   │   ├── owner/                # Dashboard, Vehicles, Add/Edit, Bookings
│   │   │   ├── admin/                # Dashboard, Users, Vehicles, Bookings
│   │   │   ├── services/             # API communication layer (8 services)
│   │   │   ├── guards/               # Route protection (auth, owner, admin)
│   │   │   ├── interceptors/         # HTTP middleware (auth token, loading)
│   │   │   ├── models/               # TypeScript interfaces
│   │   │   ├── shared/               # Reusable UI components
│   │   │   ├── layouts/              # Page layout templates
│   │   │   ├── not-found/            # 404 page
│   │   │   ├── app.routes.ts         # Route definitions (eager + lazy)
│   │   │   ├── app.config.ts         # Angular DI configuration
│   │   │   └── app.component.ts      # Root component
│   │   │
│   │   ├── styles.css                # Global styles & design tokens
│   │   └── index.html                # SPA entry point
│   │
│   ├── Dockerfile                    # Frontend container (Nginx)
│   ├── angular.json
│   ├── tsconfig.json
│   └── package.json
│
├── docker-compose.yml                # Multi-service orchestration
├── .gitignore
└── README.md
```

### Database Schema (ERD)

```
┌──────────────────────────┐
│          User            │
├──────────────────────────┤
│ _id        : ObjectId   │◄──────────────────────────────────────┐
│ name       : String     │                                       │
│ email      : String (U) │     ┌─────────────────────────────┐   │
│ password   : String     │     │         Vehicle             │   │
│ role       : Enum       │     ├─────────────────────────────┤   │
│   "customer"            │     │ _id          : ObjectId     │◄──┼───┐
│   "owner"               │     │ owner        : ObjectId ────┤───┘   │
│   "admin"               │     │ name         : String       │       │
│ createdAt  : Date       │     │ brand        : String       │       │
│ updatedAt  : Date       │     │ model        : String       │       │
└──────────────────────────┘     │ year         : Number       │       │
         │                       │ type         : Enum         │       │
         │                       │   "Car" | "Bike" | "Scooter"       │
         │                       │ fuelType     : Enum         │       │
         │                       │   "Petrol" | "Diesel"       │       │
         │                       │   "Electric" | "Hybrid"     │       │
         │                       │ transmission : Enum         │       │
         │                       │   "Manual" | "Automatic"    │       │
         │                       │ pricePerDay  : Number       │       │
         │                       │ location     : String       │       │
         │                       │ image        : String       │       │
         │                       │ images       : [String]     │       │
         │                       │ seats        : Number (=5)  │       │
         │                       │ description  : String       │       │
         │                       │ averageRating: Number (=0)  │       │
         │                       │ available    : Boolean (=T) │       │
         │                       │ createdAt    : Date         │       │
         │                       │ updatedAt    : Date         │       │
         │                       └─────────────────────────────┘       │
         │                                                             │
         │   ┌──────────────────────────────┐                          │
         │   │          Booking             │                          │
         │   ├──────────────────────────────┤                          │
         ├──►│ customer      : ObjectId ────┤── references User        │
         │   │ vehicle       : ObjectId ────┤── references Vehicle ────┘
         ├──►│ owner         : ObjectId ────┤── references User
         │   │ startDate     : Date         │
         │   │ endDate       : Date         │
         │   │ totalPrice    : Number       │
         │   │ paymentStatus : Enum         │
         │   │   "Pending" | "Paid"         │
         │   │   "Refunded"                 │
         │   │ status        : Enum         │
         │   │   "Pending" | "Accepted"     │
         │   │   "Rejected" | "Cancelled"   │
         │   │   "Completed"                │
         │   │ createdAt     : Date         │
         │   │ updatedAt     : Date         │
         │   └──────────────────────────────┘
         │
         │   ┌──────────────────────────────┐
         │   │          Review              │
         │   ├──────────────────────────────┤
         └──►│ user    : ObjectId ──────────┤── references User
             │ vehicle : ObjectId ──────────┤── references Vehicle
             │ rating  : Number (1–5)       │
             │ comment : String             │
             │ createdAt : Date             │
             │ updatedAt : Date             │
             └──────────────────────────────┘
```

### Request Lifecycle

Every HTTP request passes through these layers in order:

```
Client Request
      │
      ▼
┌─ Helmet ──────────────┐  Sets 15+ security HTTP headers
└───────────┬───────────┘
            ▼
┌─ CORS ────────────────┐  Allows Angular frontend to connect
└───────────┬───────────┘
            ▼
┌─ JSON Parser ─────────┐  Parses req.body from JSON
└───────────┬───────────┘
            ▼
┌─ Global Rate Limiter ─┐  100 requests per 15 min per IP
└───────────┬───────────┘
            ▼
┌─ Route Matching ──────┐  Dispatches to correct router
└───────────┬───────────┘
            ▼
┌─ Auth Rate Limiter ───┐  10 attempts per 15 min (auth routes only)
└───────────┬───────────┘
            ▼
┌─ protect Middleware ──┐  Verifies JWT → attaches req.user
└───────────┬───────────┘
            ▼
┌─ authorize Middleware ┐  Checks req.user.role against allowed roles
└───────────┬───────────┘
            ▼
┌─ Multer/Cloudinary ───┐  Processes file uploads (vehicle routes only)
└───────────┬───────────┘
            ▼
┌─ Controller ──────────┐  Executes business logic
└───────────┬───────────┘
            ▼
┌─ Mongoose ODM ────────┐  Schema validation + database operations
└───────────┬───────────┘
            ▼
┌─ Global Error Handler ┐  Catches uncaught errors → JSON response
└───────────┬───────────┘
            ▼
      JSON Response
```

---

## 🔄 User Flows

### 1. Authentication Flow

```
┌──────────────┐          ┌──────────────┐          ┌──────────────┐
│   User opens │          │  Angular     │          │   Express    │
│   /auth/     │          │  AuthService │          │   Backend    │
│   register   │          │              │          │              │
└──────┬───────┘          └──────┬───────┘          └──────┬───────┘
       │                         │                         │
       │  Fills form & submits   │                         │
       │────────────────────────►│                         │
       │                         │  POST /api/auth/register│
       │                         │────────────────────────►│
       │                         │                         │ Hash password
       │                         │                         │ (bcrypt, 10 rounds)
       │                         │                         │
       │                         │                         │ Create User doc
       │                         │                         │ in MongoDB
       │                         │                         │
       │                         │    { user, token }      │ Generate JWT
       │                         │◄────────────────────────│
       │                         │                         │
       │                         │ Store token + user      │
       │                         │ in localStorage         │
       │                         │                         │
       │                         │ Update BehaviorSubject  │
       │                         │ (Navbar reacts)         │
       │                         │                         │
       │  Redirect to Dashboard  │                         │
       │◄────────────────────────│                         │
       │                         │                         │
```

**How it works:**
1. User fills the registration/login form in the Angular component
2. `AuthService` sends a POST request to the backend
3. Backend hashes the password, creates the user, and returns a JWT token
4. `AuthService` stores the token in `localStorage` and updates the `BehaviorSubject`
5. The `authInterceptor` automatically attaches the token to all future requests
6. The Navbar component reacts to the `BehaviorSubject` change and updates the UI

### 2. Vehicle Booking Flow

```
  Customer                     Frontend                      Backend                    Database
     │                            │                             │                          │
     │  Browses /vehicles         │                             │                          │
     │───────────────────────────►│  GET /api/vehicles          │                          │
     │                            │────────────────────────────►│  Vehicle.find()          │
     │                            │                             │─────────────────────────►│
     │                            │◄────────────────────────────│◄─────────────────────────│
     │  Sees vehicle list         │                             │                          │
     │◄───────────────────────────│                             │                          │
     │                            │                             │                          │
     │  Clicks "Book Now"         │                             │                          │
     │───────────────────────────►│                             │                          │
     │                            │  authGuard checks token    │                          │
     │                            │  ✓ Logged in → allow       │                          │
     │                            │                             │                          │
     │  Selects dates, confirms   │                             │                          │
     │───────────────────────────►│  POST /api/bookings         │                          │
     │                            │  { vehicleId, startDate,    │                          │
     │                            │    endDate, totalPrice }    │                          │
     │                            │────────────────────────────►│  Booking.create()        │
     │                            │                             │─────────────────────────►│
     │                            │◄────────────────────────────│◄─────────────────────────│
     │  Booking created           │                             │                          │
     │  (status: "Pending")       │                             │                          │
     │◄───────────────────────────│                             │                          │
     │                            │                             │                          │
```

**Booking Status Lifecycle:**
```
                   ┌──── Customer cancels ────► Cancelled
                   │
 Pending ──────────┤
                   │                              ┌──── Owner completes ────► Completed
                   └──── Owner accepts ──────► Accepted
                   │
                   └──── Owner rejects ──────► Rejected
```

### 3. Owner Management Flow

```
Owner logs in → Owner Dashboard (/owner/dashboard)
    │
    ├── View Fleet (/owner/vehicles)
    │     └── See all vehicles you own with availability status
    │
    ├── Add Vehicle (/owner/add-vehicle)
    │     └── Upload image to Cloudinary → Save vehicle to MongoDB
    │
    ├── Edit Vehicle (/owner/edit-vehicle/:id)
    │     └── Only if you are the owner of that vehicle
    │
    └── Manage Bookings (/owner/bookings)
          └── View all bookings for your vehicles
          └── Accept / Reject / Complete booking requests
```

### 4. Admin Dashboard Flow

```
Admin logs in → Admin Dashboard (/admin/dashboard)
    │
    ├── Dashboard Stats (/admin/dashboard)
    │     └── Total users, vehicles, bookings, revenue
    │
    ├── User Management (/admin/users)
    │     ├── View all users
    │     ├── Change user roles (customer ↔ owner ↔ admin)
    │     └── Delete users
    │
    ├── Vehicle Management (/admin/vehicles)
    │     └── View all vehicles, delete any vehicle
    │
    └── Booking Management (/admin/bookings)
          └── View all bookings across the platform
```

---

## 🚀 Getting Started

### Prerequisites

| Tool | Version | Required For |
|---|---|---|
| **Node.js** | v18.x or higher | Running backend & building frontend |
| **npm** | v9.x or higher | Package management |
| **Angular CLI** | v19.x | Frontend development server |
| **MongoDB** | v6+ (local) or MongoDB Atlas | Database |
| **Docker** *(optional)* | Latest | Containerized deployment |

### Local Development Setup

**1. Clone the repository:**
```bash
git clone https://github.com/AllenLenoy/WheelShare.git
cd WheelShare
```

**2. Setup the Backend:**
```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory:
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/wheelshare
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=30d
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Start the backend server:
```bash
# Development (with auto-restart via Nodemon)
npm run dev

# Production
npm start
```

**3. Setup the Frontend:**

Open a **new terminal** window:
```bash
cd frontend
npm install
npm start
```

**4. Open in Browser:**

Navigate to **http://localhost:4200** — the Angular dev server proxies API calls to the backend at port 5000.

### Docker Deployment

Deploy the entire stack (MongoDB + Backend + Frontend) with a single command:

```bash
docker-compose up --build
```

| Service | URL | Container Name |
|---|---|---|
| Frontend | http://localhost:8080 | `wheelshare-frontend` |
| Backend API | http://localhost:5000 | `wheelshare-backend` |
| MongoDB | `localhost:27017` | `wheelshare-mongo` |

To stop and remove containers:
```bash
docker-compose down
```

To stop and also remove stored data:
```bash
docker-compose down -v
```

### Seeding Sample Data

Populate the database with sample vehicles:
```bash
cd backend
node seed_vehicles.js
```

---

## 🔐 Environment Variables

| Variable | Description | Default | Required |
|---|---|---|---|
| `PORT` | Backend server port | `5000` | No |
| `MONGO_URI` | MongoDB connection string | — | **Yes** |
| `JWT_SECRET` | Secret key for signing JWT tokens | `secret123` | **Yes** |
| `JWT_EXPIRES_IN` | Token expiry duration | `30d` | No |
| `CLOUDINARY_CLOUD_NAME` | Cloudinary account cloud name | — | Yes* |
| `CLOUDINARY_API_KEY` | Cloudinary API key | — | Yes* |
| `CLOUDINARY_API_SECRET` | Cloudinary API secret | — | Yes* |

> *Cloudinary credentials are required only if you use image upload functionality. Vehicle creation with image URLs still works without them.

---

## 📚 API Reference

Base URL: `http://localhost:5000`

All responses follow the format:
```json
{
  "message": "Description of the result",
  "data": { ... }
}
```

Error responses:
```json
{
  "success": false,
  "message": "Error description",
  "stack": "..." // Only in development mode
}
```

---

### Authentication (`/api/auth`)

> Auth routes have a strict rate limit: **10 requests per 15 minutes per IP**.

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/auth/register` | ❌ Public | Register a new user |
| `POST` | `/api/auth/login` | ❌ Public | Login and receive JWT token |
| `GET` | `/api/auth/profile` | 🔒 Token | Get current user's profile |
| `PUT` | `/api/auth/profile` | 🔒 Token | Update name/email |
| `PUT` | `/api/auth/change-password` | 🔒 Token | Change password |

<details>
<summary><strong>POST /api/auth/register</strong></summary>

**Request Body:**
```json
{
  "name": "Allen Lenoy",
  "email": "allen@example.com",
  "password": "securepassword123",
  "role": "customer"          // "customer" | "owner" | "admin"
}
```

**Response (201):**
```json
{
  "message": "User Registered Successfully",
  "user": {
    "_id": "667abc123def456...",
    "name": "Allen Lenoy",
    "email": "allen@example.com",
    "role": "customer",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```
</details>

<details>
<summary><strong>POST /api/auth/login</strong></summary>

**Request Body:**
```json
{
  "email": "allen@example.com",
  "password": "securepassword123"
}
```

**Response (200):**
```json
{
  "message": "User Logged In Successfully",
  "user": {
    "_id": "667abc123def456...",
    "name": "Allen Lenoy",
    "email": "allen@example.com",
    "role": "customer",
    "token": "eyJhbGciOiJIUzI1NiIs..."
  }
}
```

**Error (401):**
```json
{
  "message": "Invalid email or password"
}
```
</details>

<details>
<summary><strong>PUT /api/auth/change-password</strong></summary>

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "oldPassword": "currentpassword",
  "newPassword": "newsecurepassword"
}
```

**Response (200):**
```json
{
  "message": "Password updated successfully"
}
```
</details>

---

### Vehicles (`/api/vehicles`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/vehicles` | ❌ Public | Get all vehicles |
| `GET` | `/api/vehicles/search` | ❌ Public | Search with filters |
| `GET` | `/api/vehicles/:id` | ❌ Public | Get vehicle by ID |
| `GET` | `/api/vehicles/owner/:ownerId` | ❌ Public | Get all vehicles by owner |
| `POST` | `/api/vehicles` | 🔒 Owner/Admin | Add a new vehicle |
| `PUT` | `/api/vehicles/:id` | 🔒 Owner/Admin | Update a vehicle |
| `DELETE` | `/api/vehicles/:id` | 🔒 Owner/Admin | Delete a vehicle |

<details>
<summary><strong>GET /api/vehicles/search</strong> — Query Parameters</summary>

| Param | Type | Description |
|---|---|---|
| `type` | String | Vehicle type (`Car`, `Bike`, `Scooter`) |
| `location` | String | Location (case-insensitive regex) |
| `brand` | String | Brand name (case-insensitive regex) |
| `price` | Number | Maximum price per day |

**Example:**
```
GET /api/vehicles/search?type=Car&location=bangalore&price=5000
```
</details>

<details>
<summary><strong>POST /api/vehicles</strong> — Add Vehicle</summary>

**Headers:** `Authorization: Bearer <token>`  
**Content-Type:** `multipart/form-data` (for image upload) or `application/json` (for image URL)

**Form Fields / JSON Body:**
```json
{
  "name": "Swift Dzire",
  "brand": "Maruti Suzuki",
  "model": "Dzire VXi",
  "year": 2024,
  "type": "Car",
  "fuelType": "Petrol",
  "transmission": "Manual",
  "pricePerDay": 1500,
  "location": "Bangalore",
  "seats": 5,
  "description": "Well-maintained family sedan",
  "image": "https://example.com/car.jpg"
}
```
Or upload via `image` field in multipart form data → goes to Cloudinary.
</details>

---

### Bookings (`/api/bookings`)

> **All booking routes require authentication.**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/bookings` | 🔒 Token | Create a new booking |
| `GET` | `/api/bookings/my-bookings` | 🔒 Token | Get customer's bookings |
| `GET` | `/api/bookings/owner-bookings` | 🔒 Owner/Admin | Get owner's received bookings |
| `GET` | `/api/bookings/:id` | 🔒 Token | Get booking details |
| `PUT` | `/api/bookings/:id/status` | 🔒 Token | Update booking status |

<details>
<summary><strong>POST /api/bookings</strong></summary>

**Headers:** `Authorization: Bearer <token>`

**Request Body:**
```json
{
  "vehicleId": "667abc123def456...",
  "startDate": "2026-08-01T00:00:00.000Z",
  "endDate": "2026-08-05T00:00:00.000Z",
  "totalPrice": 6000
}
```
</details>

<details>
<summary><strong>PUT /api/bookings/:id/status</strong> — Status Update Rules</summary>

| Role | Allowed Status Updates |
|---|---|
| **Customer** | `Cancelled` (own bookings only) |
| **Owner** | `Accepted`, `Rejected`, `Completed` (own vehicles' bookings only) |
| **Admin** | Any status on any booking |

**Request Body:**
```json
{
  "status": "Accepted"
}
```
</details>

---

### Reviews (`/api/reviews`)

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `POST` | `/api/reviews` | 🔒 Token | Add a review (one per vehicle) |
| `GET` | `/api/reviews/vehicle/:vehicleId` | ❌ Public | Get reviews for a vehicle |
| `PUT` | `/api/reviews/:id` | 🔒 Token | Update own review |
| `DELETE` | `/api/reviews/:id` | 🔒 Token | Delete own review |

<details>
<summary><strong>POST /api/reviews</strong></summary>

**Request Body:**
```json
{
  "vehicleId": "667abc123def456...",
  "rating": 4,
  "comment": "Great car, very clean and fuel efficient!"
}
```

> ⚠️ A user can only review a vehicle **once**. Duplicate reviews return `400`.
</details>

---

### Admin (`/api/admin`)

> **All admin routes require authentication AND `admin` role.**

| Method | Endpoint | Auth | Description |
|---|---|---|---|
| `GET` | `/api/admin/dashboard` | 🔒 Admin | Get platform-wide statistics |
| `GET` | `/api/admin/users` | 🔒 Admin | List all users |
| `GET` | `/api/admin/vehicles` | 🔒 Admin | List all vehicles |
| `GET` | `/api/admin/bookings` | 🔒 Admin | List all bookings |
| `PUT` | `/api/admin/user/:id/role` | 🔒 Admin | Change a user's role |
| `DELETE` | `/api/admin/user/:id` | 🔒 Admin | Delete a user |
| `DELETE` | `/api/admin/vehicle/:id` | 🔒 Admin | Delete a vehicle |

<details>
<summary><strong>GET /api/admin/dashboard</strong> — Response</summary>

```json
{
  "totalUsers": 42,
  "totalVehicles": 18,
  "totalBookings": 156,
  "totalRevenue": 234500
}
```

> Revenue is calculated from the sum of `totalPrice` across all bookings with status `Completed`.
</details>

---

## 🛡 Security Model

WheelShare implements a **defense-in-depth** security strategy:

| Layer | Implementation | Purpose |
|---|---|---|
| **HTTP Headers** | `helmet` | Sets 15+ security headers (X-Frame-Options, CSP, etc.) |
| **CORS** | `cors` | Restricts cross-origin requests to trusted frontends |
| **Rate Limiting** | `express-rate-limit` | Global: 100 req/15 min; Auth: 10 req/15 min |
| **Authentication** | JWT (`jsonwebtoken`) | Stateless session tokens with configurable expiry |
| **Password Security** | `bcryptjs` | 10-round salted password hashing |
| **Authorization** | Custom RBAC middleware | Role-based route protection (customer, owner, admin) |
| **Input Sanitization** | `express-mongo-sanitize` | Prevents NoSQL injection attacks |
| **Data Validation** | Mongoose schemas | Enum constraints, required fields, type checking |
| **Error Handling** | Global error handler | Hides stack traces in production mode |

### Authentication Flow (JWT)
```
1. User sends credentials → POST /api/auth/login
2. Server verifies password with bcrypt.compare()
3. Server generates JWT containing { id: user._id }
4. Client stores JWT in localStorage
5. Auth interceptor attaches "Bearer <token>" to every request
6. protect middleware verifies token on protected routes
7. authorize middleware checks role for restricted routes
```

### Role Permission Matrix

| Action | Customer | Owner | Admin |
|---|:---:|:---:|:---:|
| Browse vehicles | ✅ | ✅ | ✅ |
| Create booking | ✅ | ✅ | ✅ |
| View own bookings | ✅ | ✅ | ✅ |
| Cancel own booking | ✅ | ❌ | ✅ |
| Add vehicle | ❌ | ✅ | ✅ |
| Edit own vehicle | ❌ | ✅ | ✅ |
| Accept/Reject bookings | ❌ | ✅ | ✅ |
| View all users | ❌ | ❌ | ✅ |
| Delete any user | ❌ | ❌ | ✅ |
| Change user roles | ❌ | ❌ | ✅ |
| View platform stats | ❌ | ❌ | ✅ |

---

## 🎨 Frontend Architecture

### Component Hierarchy

```
AppComponent
├── Navbar (shared)
├── Footer (shared)
│
├── HomeComponent                      (/)
├── LoginComponent                     (/auth/login)
├── RegisterComponent                  (/auth/register)
├── CarListComponent                   (/vehicles)
├── CarDetailsComponent                (/vehicles/:id)
│
├── [authGuard protected]
│   ├── BookCarComponent               (/book/:carId)
│   ├── CustomerDashboardComponent     (/customer/dashboard)
│   ├── BookingHistoryComponent        (/customer/bookings)
│   └── ProfileComponent              (/customer/profile)
│
├── [ownerGuard protected] ── LAZY LOADED
│   ├── OwnerDashboardComponent        (/owner/dashboard)
│   ├── OwnerVehiclesComponent         (/owner/vehicles)
│   ├── AddVehicleComponent            (/owner/add-vehicle)
│   ├── EditVehicleComponent           (/owner/edit-vehicle/:id)
│   └── OwnerBookingsComponent         (/owner/bookings)
│
├── [adminGuard protected] ── LAZY LOADED
│   ├── AdminDashboardComponent        (/admin/dashboard)
│   ├── AdminUsersComponent            (/admin/users)
│   ├── AdminVehiclesComponent         (/admin/vehicles)
│   └── AdminBookingsComponent         (/admin/bookings)
│
└── NotFoundComponent                  (/**)
```

### Service Layer

| Service | Responsibility |
|---|---|
| `AuthService` | Login, register, logout, profile management, JWT state (`BehaviorSubject`) |
| `VehicleService` | Vehicle CRUD operations, search, owner vehicle listing |
| `BookingService` | Booking creation, retrieval, status updates |
| `ReviewService` | Review CRUD for vehicles |
| `AdminService` | Admin-only endpoints (users, stats, role changes) |
| `ThemeService` | Light/dark mode toggle persistence |
| `ToastService` | Global notification system |
| `LoadingService` | Global loading spinner state |

### Interceptors

| Interceptor | Purpose |
|---|---|
| `authInterceptor` | Automatically attaches `Authorization: Bearer <token>` header to every outgoing request |
| `loadingInterceptor` | Triggers global loading spinner on request start, hides on completion |

### Route Guards

| Guard | Checks | Protects |
|---|---|---|
| `authGuard` | `AuthService.isLoggedIn()` | Customer routes (bookings, profile) |
| `ownerGuard` | User role is `owner` | Owner dashboard and vehicle management |
| `adminGuard` | User role is `admin` | Admin dashboard and user management |

> Guards redirect unauthorized users to `/auth/login` with a `returnUrl` query parameter for post-login redirect.

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch:
   ```bash
   git checkout -b feature/amazing-feature
   ```
3. **Commit** your changes:
   ```bash
   git commit -m "feat: add amazing feature"
   ```
4. **Push** to your branch:
   ```bash
   git push origin feature/amazing-feature
   ```
5. **Open** a Pull Request

### Commit Convention

This project follows [Conventional Commits](https://www.conventionalcommits.org/):

| Prefix | Use For |
|---|---|
| `feat:` | New features |
| `fix:` | Bug fixes |
| `docs:` | Documentation changes |
| `style:` | Code formatting (no logic changes) |
| `refactor:` | Code restructuring |
| `test:` | Adding or updating tests |
| `chore:` | Build tools, dependencies |

---

## 📄 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

<div align="center">
  <p>Built with ❤️ by <a href="https://github.com/AllenLenoy">Allen Lenoy</a></p>
  <p>
    <a href="#-wheelshare">⬆ Back to Top</a>
  </p>
</div>
