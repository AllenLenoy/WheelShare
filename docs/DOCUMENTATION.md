# WheelShare — Technical Documentation

> **Version:** 1.0.0  
> **Last Updated:** July 2026  
> **Author:** Allen Lenoy

---

## Table of Contents

1. [Introduction](#1-introduction)
2. [System Overview](#2-system-overview)
3. [Backend Architecture](#3-backend-architecture)
   - [Server Entry Point](#31-server-entry-point-serverjs)
   - [Database Configuration](#32-database-configuration)
   - [Data Models](#33-data-models)
   - [Middleware Pipeline](#34-middleware-pipeline)
   - [Controllers](#35-controllers)
   - [Routing](#36-routing)
4. [Frontend Architecture](#4-frontend-architecture)
   - [Application Bootstrap](#41-application-bootstrap)
   - [Routing Strategy](#42-routing-strategy)
   - [Services & State Management](#43-services--state-management)
   - [Interceptors](#44-interceptors)
   - [Guards](#45-guards)
   - [Component Modules](#46-component-modules)
5. [Authentication & Authorization](#5-authentication--authorization)
   - [JWT Token Flow](#51-jwt-token-flow)
   - [Password Security](#52-password-security)
   - [Role-Based Access Control](#53-role-based-access-control)
   - [Frontend Auth State](#54-frontend-auth-state)
6. [Core Business Flows](#6-core-business-flows)
   - [User Registration](#61-user-registration)
   - [Vehicle Management](#62-vehicle-management)
   - [Booking Lifecycle](#63-booking-lifecycle)
   - [Review System](#64-review-system)
   - [Admin Operations](#65-admin-operations)
7. [Image Upload Pipeline](#7-image-upload-pipeline)
8. [Error Handling Strategy](#8-error-handling-strategy)
9. [Security Measures](#9-security-measures)
10. [Deployment Guide](#10-deployment-guide)
    - [Docker Architecture](#101-docker-architecture)
    - [Environment Configuration](#102-environment-configuration)
11. [Database Seeding](#11-database-seeding)
12. [Troubleshooting](#12-troubleshooting)

---

## 1. Introduction

WheelShare is a full-stack peer-to-peer vehicle rental platform that enables vehicle owners to list their cars, bikes, and scooters for rent, while customers can browse, search, and book vehicles through an intuitive web interface. The platform features an admin dashboard for platform-wide oversight.

### Design Principles

- **Separation of Concerns:** Backend follows MVC (Model–View–Controller) pattern; frontend follows Angular's component-service pattern.
- **Stateless Authentication:** JWT tokens allow horizontal scaling without session affinity.
- **Defense in Depth:** Multiple security layers protect against common web vulnerabilities.
- **Progressive Loading:** Lazy-loaded routes reduce initial bundle size.
- **DRY (Don't Repeat Yourself):** Shared middleware, reusable services, and TypeScript interfaces enforce consistency.

---

## 2. System Overview

### Technology Stack Summary

| Layer | Technology | Version |
|---|---|---|
| Frontend Framework | Angular (Standalone Components) | 19.2 |
| Language | TypeScript | 5.7 |
| Backend Runtime | Node.js | 18+ |
| Backend Framework | Express.js | 5.x |
| Database | MongoDB | 6+ |
| ODM | Mongoose | 9.x |
| Auth | JSON Web Tokens | 9.x |
| Hashing | bcryptjs | 3.x |
| File Upload | Multer + multer-storage-cloudinary | 2.x |
| Image CDN | Cloudinary | 1.x |
| Security | Helmet, CORS, express-rate-limit, express-mongo-sanitize | Latest |
| Containerization | Docker + Docker Compose | Latest |

### High-Level Data Flow

```
  Browser (Angular SPA)
        │
        │  HTTP/JSON + JWT in Authorization header
        ▼
  Express Server (port 5000)
        │
        │  Middleware Pipeline (Helmet → CORS → Parser → Rate Limiter)
        │  Auth Middleware (JWT verification)
        │  Role Middleware (RBAC check)
        ▼
  Controllers (business logic)
        │
        │  Mongoose ODM (schema validation, queries)
        ▼
  MongoDB (document store)
```

---

## 3. Backend Architecture

### 3.1 Server Entry Point (`server.js`)

The `server.js` file is the main entry point for the Express application. It executes the following steps **in order**:

1. **Import dependencies** — Express, CORS, Helmet, express-rate-limit, dotenv
2. **Import route modules** — auth, vehicles, bookings, reviews, admin
3. **Initialize Express** — `const app = express()`
4. **Connect to MongoDB** — `connectDB()` (from `config/db.js`)
5. **Configure middleware pipeline** — Helmet → CORS → JSON parser → rate limiter
6. **Register API routes** — Mount each router on its URL prefix
7. **Add health check** — `GET /` returns a plain text confirmation
8. **Add global error handler** — Catches all unhandled errors
9. **Start listening** — Opens the configured port (default: 5000)

### 3.2 Database Configuration

**File:** `backend/config/db.js`

- Uses Mongoose to connect to MongoDB via the `MONGO_URI` environment variable
- On connection failure, the process exits with code 1 (fatal) — there's no point running an API that can't reach its database
- No deprecated options needed — Mongoose 9.x handles all connection settings internally

**File:** `backend/config/cloudinary.js`

- Configures Cloudinary SDK with credentials from environment variables
- Sets up `CloudinaryStorage` for Multer, targeting the `wheelshare_vehicles` folder
- Exports both the `cloudinary` instance and the `upload` middleware

### 3.3 Data Models

#### User Model (`models/user.js`)

| Field | Type | Constraints |
|---|---|---|
| `name` | String | Required, trimmed |
| `email` | String | Required, unique, lowercase |
| `password` | String | Required (stored as bcrypt hash) |
| `role` | String | Enum: `customer`, `owner`, `admin`. Default: `customer` |
| `createdAt` | Date | Auto-generated |
| `updatedAt` | Date | Auto-generated |

**Key behaviors:**
- The `unique` constraint on `email` prevents duplicate registrations at the database level
- The `lowercase` transform normalizes email addresses before storage
- Passwords are hashed externally in the controller (not via a pre-save hook)

#### Vehicle Model (`models/Vehicle.js`)

| Field | Type | Constraints |
|---|---|---|
| `owner` | ObjectId (→ User) | Required, references User collection |
| `name` | String | Required |
| `brand` | String | Required |
| `model` | String | Required |
| `year` | Number | Required |
| `type` | String | Required, enum: `Car`, `Bike`, `Scooter` |
| `fuelType` | String | Required, enum: `Petrol`, `Diesel`, `Electric`, `Hybrid` |
| `transmission` | String | Required, enum: `Manual`, `Automatic` |
| `pricePerDay` | Number | Required |
| `location` | String | Required |
| `image` | String | Default: `""` (primary image URL) |
| `images` | [String] | Default: `[]` (gallery) |
| `seats` | Number | Default: `5` |
| `description` | String | Default: `""` |
| `averageRating` | Number | Default: `0` |
| `available` | Boolean | Default: `true` |

**Key behaviors:**
- The `owner` field creates a one-to-many relationship (one User owns many Vehicles)
- Enum validations prevent invalid vehicle types/fuel types at the database level
- The `available` flag is used by the search controller to filter out unavailable vehicles

#### Booking Model (`models/Booking.js`)

| Field | Type | Constraints |
|---|---|---|
| `customer` | ObjectId (→ User) | Required |
| `vehicle` | ObjectId (→ Vehicle) | Required |
| `owner` | ObjectId (→ User) | Required |
| `startDate` | Date | Required |
| `endDate` | Date | Required |
| `totalPrice` | Number | Required |
| `paymentStatus` | String | Enum: `Pending`, `Paid`, `Refunded`. Default: `Pending` |
| `status` | String | Enum: `Pending`, `Accepted`, `Rejected`, `Cancelled`, `Completed`. Default: `Pending` |

**Key behaviors:**
- Three-way reference: customer (who booked), vehicle (what was booked), owner (who owns the vehicle)
- The `owner` field is denormalized from the vehicle document at booking creation time for fast owner-side queries
- Status and paymentStatus are independent fields allowing flexible state management

#### Review Model (`models/Review.js`)

| Field | Type | Constraints |
|---|---|---|
| `user` | ObjectId (→ User) | Required |
| `vehicle` | ObjectId (→ Vehicle) | Required |
| `rating` | Number | Required, min: 1, max: 5 |
| `comment` | String | Required |

**Key behaviors:**
- The controller enforces one review per user per vehicle (checked via `findOne` before creation)
- Rating is constrained to 1–5 by Mongoose's `min`/`max` validators

### 3.4 Middleware Pipeline

Middleware functions execute **in registration order** on every incoming request:

```
Request →  Helmet  →  CORS  →  JSON Parser  →  Rate Limiter  →  Route Handler
```

#### Global Middleware (applied to ALL routes)

| Middleware | Source | Purpose |
|---|---|---|
| `helmet()` | `helmet` package | Sets 15+ security-related HTTP response headers |
| `cors()` | `cors` package | Enables Cross-Origin Resource Sharing for the Angular frontend |
| `express.json()` | Express built-in | Parses JSON request bodies into `req.body` |
| `globalLimiter` | `express-rate-limit` | Limits each IP to 100 requests per 15-minute window |

#### Route-Specific Middleware

| Middleware | Applied To | Purpose |
|---|---|---|
| `authLimiter` | Auth routes only | Stricter limit: 10 requests per 15 min (brute-force protection) |
| `protect` | Protected routes | Verifies JWT token, attaches `req.user` |
| `authorize(roles)` | Role-restricted routes | Checks `req.user.role` against allowed roles |
| `upload.single("image")` | Vehicle POST/PUT | Processes file upload via Multer → Cloudinary |

#### `protect` Middleware — Step by Step

1. Check for `Authorization` header starting with `Bearer`
2. Extract the token string from the header
3. Verify the token using `jwt.verify()` with the secret key
4. Fetch the full user document from MongoDB using the decoded `id`
5. Attach the user to `req.user` (excluding the password field)
6. Call `next()` to pass control to the next middleware or controller
7. If verification fails → return 401 Unauthorized
8. If no token exists → return 401 Unauthorized

#### `authorize` Middleware — Step by Step

1. Receives allowed roles as arguments (e.g., `authorize("owner", "admin")`)
2. Returns a middleware function (higher-order function pattern)
3. Checks if `req.user.role` is included in the allowed roles array
4. If yes → calls `next()` to proceed
5. If no → returns 403 Forbidden with the user's actual role in the message

### 3.5 Controllers

#### Auth Controller (`controllers/auth.controller.js`)

| Function | Route | Description |
|---|---|---|
| `register` | POST `/api/auth/register` | Validates uniqueness, hashes password, creates user, returns JWT |
| `login` | POST `/api/auth/login` | Finds user by email, compares hashed password, returns JWT |
| `getProfile` | GET `/api/auth/profile` | Returns current user (from `req.user._id`), excludes password |
| `updateProfile` | PUT `/api/auth/profile` | Updates name/email, returns fresh JWT |
| `changePassword` | PUT `/api/auth/change-password` | Verifies old password, hashes and saves new one |

**Key implementation details:**
- The `generateToken` helper encodes only the user's `_id` in the JWT payload
- Password comparison uses `bcrypt.compare()` which is timing-safe
- The login error message is intentionally generic ("Invalid email or password") to prevent user enumeration

#### Vehicle Controller (`controllers/vehicle.controller.js`)

| Function | Route | Description |
|---|---|---|
| `addVehicle` | POST `/api/vehicles` | Creates vehicle with owner set to `req.user._id` |
| `getAllVehicles` | GET `/api/vehicles` | Returns all vehicles with populated owner info |
| `getVehicleById` | GET `/api/vehicles/:id` | Returns single vehicle with populated owner |
| `updateVehicle` | PUT `/api/vehicles/:id` | Updates vehicle (owner or admin only) |
| `deleteVehicle` | DELETE `/api/vehicles/:id` | Deletes vehicle (owner or admin only) |
| `getOwnerVehicles` | GET `/api/vehicles/owner/:ownerId` | Returns all vehicles owned by a specific user |
| `searchVehicles` | GET `/api/vehicles/search` | Dynamic query builder with regex and price filters |

**Key implementation details:**
- Image handling supports three sources: URL string in body, file upload via Multer, or Cloudinary path
- Update/delete operations verify ownership: `vehicle.owner.toString() !== req.user._id.toString()`
- Search uses MongoDB's `$regex` with case-insensitive flag and `$lte` for price ceiling
- Search always filters `available: true` to hide unavailable vehicles

#### Booking Controller (`controllers/booking.controller.js`)

| Function | Route | Description |
|---|---|---|
| `createBooking` | POST `/api/bookings` | Creates booking, auto-sets customer and owner |
| `getCustomerBookings` | GET `/api/bookings/my-bookings` | Returns bookings where customer = current user |
| `getOwnerBookings` | GET `/api/bookings/owner-bookings` | Returns bookings where owner = current user |
| `getBookingDetails` | GET `/api/bookings/:id` | Returns full booking (customer, owner, or admin only) |
| `updateBookingStatus` | PUT `/api/bookings/:id/status` | Unified status update with role-based validation |

**Status update permissions:**
- **Customer** → Can only set `Cancelled` on their own bookings
- **Owner** → Can set `Accepted`, `Rejected`, or `Completed` on bookings for their vehicles
- **Admin** → Can set any status on any booking

#### Review Controller (`controllers/review.controller.js`)

| Function | Route | Description |
|---|---|---|
| `addReview` | POST `/api/reviews` | Adds review (one per user per vehicle) |
| `getVehicleReviews` | GET `/api/reviews/vehicle/:vehicleId` | Returns all reviews for a vehicle |
| `updateReview` | PUT `/api/reviews/:id` | Updates review (author or admin only) |
| `deleteReview` | DELETE `/api/reviews/:id` | Deletes review (author or admin only) |

#### Admin Controller (`controllers/admin.controller.js`)

| Function | Route | Description |
|---|---|---|
| `getAllUsers` | GET `/api/admin/users` | Returns all users (passwords excluded) |
| `getAllVehicles` | GET `/api/admin/vehicles` | Returns all vehicles with owner details |
| `getAllBookings` | GET `/api/admin/bookings` | Returns all bookings with full population |
| `deleteUser` | DELETE `/api/admin/user/:id` | Deletes a user account |
| `updateUserRole` | PUT `/api/admin/user/:id/role` | Changes a user's role |
| `getDashboardStats` | GET `/api/admin/dashboard` | Returns aggregate counts + revenue |

**Revenue calculation:** Sums `totalPrice` of all bookings with `status: "Completed"`.

### 3.6 Routing

Routes are organized into five modules, each mounted on a URL prefix in `server.js`:

| Prefix | Router File | Middleware |
|---|---|---|
| `/api/auth` | `auth.routes.js` | Auth rate limiter (10 req/15 min) on register/login |
| `/api/vehicles` | `vehicle.routes.js` | `protect` + `authorize("owner", "admin")` on POST/PUT/DELETE |
| `/api/bookings` | `booking.routes.js` | `protect` on ALL routes via `router.use(protect)` |
| `/api/reviews` | `review.routes.js` | `protect` on POST/PUT/DELETE |
| `/api/admin` | `admin.routes.js` | `protect` + `authorize("admin")` on ALL routes via `router.use()` |

---

## 4. Frontend Architecture

### 4.1 Application Bootstrap

**Entry point:** `src/main.ts` → bootstraps `AppComponent` with `appConfig`

**Configuration (`app.config.ts`):**
- `provideZoneChangeDetection({ eventCoalescing: true })` — batches DOM updates for performance
- `provideRouter(routes)` — activates client-side routing
- `provideHttpClient(withInterceptors([authInterceptor, loadingInterceptor]))` — HTTP client with two interceptors

### 4.2 Routing Strategy

The application uses a **mixed loading strategy**:

**Eagerly Loaded** (included in the main bundle):
- Home, Login, Register, Vehicle list, Vehicle details
- Book Car, Booking history, Customer dashboard, Profile
- 404 Not Found

**Lazy Loaded** (separate chunks, downloaded on demand):
- **Owner module:** Dashboard, Vehicles, Add/Edit Vehicle, Bookings
- **Admin module:** Dashboard, Users, Vehicles, Bookings

Lazy loading is implemented using dynamic imports:
```typescript
loadComponent: () => import('./owner/dashboard/dashboard.component')
    .then(m => m.OwnerDashboardComponent)
```

### 4.3 Services & State Management

WheelShare uses **RxJS BehaviorSubject** for reactive state management instead of a dedicated state library like NgRx:

#### AuthService — The Core State Manager

```
┌──────────────┐     .next(user)     ┌──────────────────┐
│    Login     │────────────────────►│  BehaviorSubject  │
│   Register   │                     │   (userSubject)   │
│   Logout     │────── .next(null) ─►│                   │
└──────────────┘                     └────────┬──────────┘
                                              │
                                     .asObservable()
                                              │
                                     ┌────────▼──────────┐
                                     │    user$           │
                                     │  (public stream)   │
                                     └────────┬──────────┘
                                              │
                              ┌───────────────┼───────────────┐
                              ▼               ▼               ▼
                         ┌─────────┐    ┌──────────┐    ┌──────────┐
                         │ Navbar  │    │  Guards   │    │Dashboard │
                         │Component│    │          │    │Component │
                         └─────────┘    └──────────┘    └──────────┘
```

- **BehaviorSubject** retains the latest value and immediately emits it to new subscribers
- On page refresh, the subject is initialized from `localStorage` to restore login state
- Login/register save the token and user to `localStorage` and push to the subject
- Logout clears `localStorage` and pushes `null` to the subject

### 4.4 Interceptors

**Auth Interceptor (`interceptors/auth.interceptor.ts`):**
1. Reads the JWT token from `localStorage`
2. If a token exists, clones the outgoing request with an `Authorization: Bearer <token>` header
3. If no token exists, passes the request through unchanged
4. This runs automatically on **every** HTTP request

**Loading Interceptor (`interceptors/loading.interceptor.ts`):**
1. Calls `LoadingService.show()` when a request starts
2. Calls `LoadingService.hide()` when the response arrives
3. Used to display a global loading spinner/progress bar

### 4.5 Guards

All guards are implemented as **functional guards** (Angular 14+ style using `inject()`):

| Guard | Logic | Redirect |
|---|---|---|
| `authGuard` | `AuthService.isLoggedIn()` returns true | `/auth/login` with `returnUrl` |
| `ownerGuard` | `AuthService.getUserRole() === 'owner'` | `/auth/login` |
| `adminGuard` | `AuthService.getUserRole() === 'admin'` | `/auth/login` |

The `returnUrl` pattern enables seamless post-login redirect: when a guest tries to access `/book/123`, they are sent to `/auth/login?returnUrl=/book/123`, and after login the app can redirect them back.

### 4.6 Component Modules

#### Public Components
| Component | Path | Purpose |
|---|---|---|
| `HomeComponent` | `/` | Landing page with hero section and featured vehicles |
| `CarListComponent` | `/vehicles` | Browsable vehicle grid with filters |
| `CarDetailsComponent` | `/vehicles/:id` | Full vehicle detail page with reviews |
| `VehicleCardComponent` | (shared) | Reusable card component for vehicle listings |

#### Auth Components
| Component | Path | Purpose |
|---|---|---|
| `LoginComponent` | `/auth/login` | Email/password login form |
| `RegisterComponent` | `/auth/register` | Registration form with role selection |

#### Customer Components
| Component | Path | Purpose |
|---|---|---|
| `CustomerDashboardComponent` | `/customer/dashboard` | Customer's personal dashboard |
| `BookCarComponent` | `/book/:carId` | Date selection and booking confirmation |
| `BookingHistoryComponent` | `/customer/bookings` | View and manage past bookings |
| `ProfileComponent` | `/customer/profile` | Edit profile and change password |

#### Owner Components (Lazy Loaded)
| Component | Path | Purpose |
|---|---|---|
| `OwnerDashboardComponent` | `/owner/dashboard` | Owner's fleet overview |
| `OwnerVehiclesComponent` | `/owner/vehicles` | List of owned vehicles |
| `AddVehicleComponent` | `/owner/add-vehicle` | Vehicle creation form with image upload |
| `EditVehicleComponent` | `/owner/edit-vehicle/:id` | Vehicle editing form |
| `OwnerBookingsComponent` | `/owner/bookings` | Manage incoming booking requests |

#### Admin Components (Lazy Loaded)
| Component | Path | Purpose |
|---|---|---|
| `AdminDashboardComponent` | `/admin/dashboard` | Platform statistics and analytics |
| `AdminUsersComponent` | `/admin/users` | User management (role changes, deletion) |
| `AdminVehiclesComponent` | `/admin/vehicles` | All vehicles across the platform |
| `AdminBookingsComponent` | `/admin/bookings` | All bookings across the platform |

---

## 5. Authentication & Authorization

### 5.1 JWT Token Flow

```
                    REGISTRATION / LOGIN
                           │
                           ▼
              ┌──────────────────────────┐
              │  Server generates JWT    │
              │  jwt.sign({ id }, secret,│
              │    { expiresIn: '30d' }) │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │  Token sent to client    │
              │  in response JSON body   │
              └──────────┬───────────────┘
                         │
                         ▼
              ┌──────────────────────────┐
              │  Client stores token     │
              │  in localStorage         │
              └──────────┬───────────────┘
                         │
              ┌──────────▼───────────────┐
              │  Every subsequent request│
              │  Auth interceptor adds:  │
              │  Authorization: Bearer   │
              │    <token>               │
              └──────────┬───────────────┘
                         │
              ┌──────────▼───────────────┐
              │  protect middleware       │
              │  jwt.verify(token,secret)│
              │  Decodes { id: "..." }   │
              │  Fetches User from DB    │
              │  Attaches to req.user    │
              └──────────────────────────┘
```

**Token structure (decoded):**
```json
{
  "id": "667abc123def456ghi789",
  "iat": 1721836800,
  "exp": 1724428800
}
```

### 5.2 Password Security

- **Hashing algorithm:** bcrypt via `bcryptjs`
- **Salt rounds:** 10 (configurable, balances security vs performance)
- **Storage:** Only the hashed password is stored in MongoDB
- **Comparison:** `bcrypt.compare()` is timing-safe (prevents timing attacks)
- **Never returned:** `User.findById().select('-password')` ensures the hash is never sent to the client

### 5.3 Role-Based Access Control

Three roles with hierarchical permissions:

```
Admin (full platform access)
  └── Owner (vehicle + booking management)
        └── Customer (browse + book)
```

The RBAC system uses two middleware functions working in tandem:

1. `protect` → Ensures the user is authenticated (has a valid JWT)
2. `authorize(...roles)` → Ensures the user's role is in the allowed list

Example route protection:
```javascript
// Only owners and admins can add vehicles
router.post("/", protect, authorize("owner", "admin"), upload.single("image"), addVehicle);
```

### 5.4 Frontend Auth State

The Angular frontend manages auth state through three mechanisms:

1. **localStorage** — Persists token and user data across page refreshes
2. **BehaviorSubject** — Reactive state that components can subscribe to
3. **Route Guards** — Prevent navigation to unauthorized pages

---

## 6. Core Business Flows

### 6.1 User Registration

```
1. User fills registration form (name, email, password, role)
2. Angular posts to POST /api/auth/register
3. Backend checks if email already exists
4. If exists → 400 "User already exists"
5. If new → Hash password with bcrypt (10 rounds)
6. Create user document in MongoDB
7. Generate JWT token with user._id
8. Return user data + token
9. Frontend stores in localStorage + BehaviorSubject
10. UI updates (Navbar shows user name, role-specific navigation)
```

### 6.2 Vehicle Management

**Adding a Vehicle (Owner):**
```
1. Owner navigates to /owner/add-vehicle
2. ownerGuard verifies role = "owner"
3. Owner fills form with vehicle details
4. If image file → Multer processes upload → Cloudinary stores it → URL returned
5. If image URL → Used directly
6. Controller creates vehicle with owner = req.user._id
7. Vehicle appears in owner's fleet and public listings
```

**Searching Vehicles (Public):**
```
1. User enters search criteria on /vehicles page
2. Frontend calls GET /api/vehicles/search?type=Car&location=bangalore&price=5000
3. Controller builds MongoDB query dynamically:
   - type → $regex (case-insensitive)
   - location → $regex (case-insensitive)
   - brand → $regex (case-insensitive)
   - price → $lte (less than or equal)
   - available → always true
4. Results returned with populated owner info
```

### 6.3 Booking Lifecycle

```
        ┌─────────────────────────────────────────────────┐
        │                                                 │
        ▼                                                 │
   ┌─────────┐                                           │
   │ Pending  │──── Customer cancels ────► Cancelled      │
   │ (default)│                                           │
   └────┬─────┘                                           │
        │                                                 │
        ├── Owner rejects ──────────────► Rejected        │
        │                                                 │
        └── Owner accepts                                 │
              │                                           │
              ▼                                           │
        ┌──────────┐                                      │
        │ Accepted │── Owner completes ──► Completed      │
        └──────────┘        │                             │
                            │                             │
                            └── Revenue counted in        │
                                admin dashboard stats     │
                                                          │
```

**Who can do what:**
| Action | Customer | Owner | Admin |
|---|:---:|:---:|:---:|
| Create booking | ✅ | ❌ | ❌ |
| Cancel own booking | ✅ | ❌ | ✅ |
| Accept booking | ❌ | ✅ | ✅ |
| Reject booking | ❌ | ✅ | ✅ |
| Complete booking | ❌ | ✅ | ✅ |
| View own bookings | ✅ | ✅ | ✅ |
| View all bookings | ❌ | ❌ | ✅ |

### 6.4 Review System

- Each user can review a vehicle **exactly once** (enforced by a `findOne` check before creation)
- Ratings are constrained to 1–5 by Mongoose validators
- Only the review author (or an admin) can update or delete a review
- Reviews are public and displayed on the vehicle detail page

### 6.5 Admin Operations

The admin dashboard provides platform-wide visibility:

| Metric | Source |
|---|---|
| Total Users | `User.countDocuments()` |
| Total Vehicles | `Vehicle.countDocuments()` |
| Total Bookings | `Booking.countDocuments()` |
| Total Revenue | Sum of `totalPrice` where `status === "Completed"` |

Admin capabilities:
- **User management:** View all users, change roles, delete accounts
- **Vehicle oversight:** View all vehicles, delete any vehicle
- **Booking oversight:** View all bookings with full customer/vehicle/owner details

---

## 7. Image Upload Pipeline

```
                      ┌─────────────────┐
                      │  Client sends   │
                      │  multipart/form │
                      │  with "image"   │
                      └────────┬────────┘
                               │
                      ┌────────▼────────┐
                      │     Multer      │
                      │  Parses the     │
                      │  file stream    │
                      └────────┬────────┘
                               │
                      ┌────────▼────────┐
                      │  Cloudinary     │
                      │  Storage        │
                      │  Adapter        │
                      │  (multer-       │
                      │  storage-       │
                      │  cloudinary)    │
                      └────────┬────────┘
                               │
                      ┌────────▼────────┐
                      │  Cloudinary CDN │
                      │  Stores image   │
                      │  in folder:     │
                      │  wheelshare_    │
                      │  vehicles       │
                      └────────┬────────┘
                               │
                      ┌────────▼────────┐
                      │  req.file.path  │
                      │  = Cloudinary   │
                      │  public URL     │
                      └────────┬────────┘
                               │
                      ┌────────▼────────┐
                      │  Controller     │
                      │  saves URL to   │
                      │  vehicle.image  │
                      │  in MongoDB     │
                      └─────────────────┘
```

**Supported formats:** JPG, JPEG, PNG, WebP

**Alternative:** If no file is uploaded, the controller accepts an image URL via `req.body.image` or `req.body.imageUrl`.

---

## 8. Error Handling Strategy

### Backend Error Handling

**Controller level:** Each controller function wraps its logic in try/catch:
```javascript
try {
    // ... business logic
} catch (error) {
    res.status(500).json({ message: error.message });
}
```

**Global error handler** (registered last in `server.js`):
- Catches any unhandled errors from the middleware/controller chain
- Sets appropriate HTTP status code (defaults to 500)
- Returns a clean JSON response instead of an HTML error page
- **In development:** Includes the stack trace for debugging
- **In production:** Hides the stack trace for security

### Frontend Error Handling

- Services return RxJS Observables; components handle errors in their subscribe callbacks
- Toast notifications display user-friendly error messages
- HTTP errors (401) trigger logout + redirect to login page

---

## 9. Security Measures

| Threat | Mitigation |
|---|---|
| **Brute-force login** | Auth rate limiter: 10 attempts per 15 minutes per IP |
| **DDoS / spam** | Global rate limiter: 100 requests per 15 minutes per IP |
| **XSS (Cross-Site Scripting)** | Helmet sets Content-Security-Policy and X-XSS-Protection headers |
| **Clickjacking** | Helmet sets X-Frame-Options header |
| **MIME sniffing** | Helmet sets X-Content-Type-Options: nosniff |
| **NoSQL injection** | express-mongo-sanitize strips `$` and `.` from req.body/query/params |
| **Password theft** | bcrypt hashing with 10 salt rounds; passwords never returned in API responses |
| **Token tampering** | JWT verification with server-side secret key |
| **Token expiry** | Tokens expire after 30 days by default |
| **Unauthorized access** | JWT + RBAC middleware stack on protected routes |
| **CORS attacks** | CORS middleware configured for trusted origins |
| **Data leakage** | `.select("-password")` on all user queries; stack traces hidden in production |

---

## 10. Deployment Guide

### 10.1 Docker Architecture

The `docker-compose.yml` defines three interconnected services:

```
┌─────────────────────────────────────────────────┐
│                wheelshare-net                    │
│            (Docker bridge network)               │
│                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌────────┐ │
│  │  Frontend    │  │   Backend    │  │ Mongo  │ │
│  │  (Nginx)     │  │  (Node.js)  │  │ (DB)   │ │
│  │  Port: 8080  │  │  Port: 5000  │  │  27017 │ │
│  │              │  │              │──►│        │ │
│  │  depends_on: │  │  depends_on: │  │        │ │
│  │   backend    │  │    mongo     │  │        │ │
│  └──────────────┘  └──────────────┘  └────────┘ │
└─────────────────────────────────────────────────┘
```

**Service startup order:** MongoDB → Backend → Frontend (enforced by `depends_on`)

### 10.2 Environment Configuration

For Docker deployment, environment variables are set directly in `docker-compose.yml`:

```yaml
environment:
  - PORT=5000
  - MONGO_URI=mongodb://admin:password123@mongo:27017/wheelshare?authSource=admin
  - JWT_SECRET=supersecret_wheelshare_key_2026
  - JWT_EXPIRES_IN=30d
```

> ⚠️ **Important:** For production, replace the JWT secret and MongoDB credentials with strong, unique values. Consider using Docker secrets or a `.env` file mounted as a volume.

---

## 11. Database Seeding

The `backend/seed_vehicles.js` script populates the database with sample vehicle data for development and testing:

```bash
cd backend
node seed_vehicles.js
```

This is useful for:
- Quick demo setup
- Testing the vehicle listing and search features
- Populating the database after a fresh Docker deployment

---

## 12. Troubleshooting

| Problem | Solution |
|---|---|
| `MongoDB Connection Failed` | Ensure MongoDB is running locally or your Atlas URI is correct in `.env` |
| `CORS error in browser` | Verify the backend is running and `cors()` middleware is configured |
| `401 Not authorized, no token` | Ensure the `Authorization: Bearer <token>` header is being sent |
| `403 User role 'customer' is not authorized` | The endpoint requires `owner` or `admin` role |
| `Rate limit exceeded` | Wait 15 minutes or restart the server (rate limits are in-memory) |
| `Cloudinary upload fails` | Check your `CLOUDINARY_*` environment variables are set correctly |
| `Angular dev server can't reach backend` | Ensure backend is running on port 5000 |
| `Docker containers fail to start` | Run `docker-compose down -v` then `docker-compose up --build` |
| `Vehicle images not displaying` | Check if the image URL is valid; Cloudinary credentials may be expired |
| `Cannot GET /owner/dashboard` | This is a client-side route; ensure you're accessing via the Angular app, not directly |

---

<div align="center">
  <p><em>This documentation is maintained alongside the WheelShare codebase.</em></p>
</div>
