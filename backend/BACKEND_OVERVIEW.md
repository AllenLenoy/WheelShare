# WheelShare Backend - Detailed Implementation Overview

This document provides a detailed breakdown of the backend architecture, modules, and APIs implemented for the **WheelShare** vehicle rental application.

## Tech Stack
- **Node.js** & **Express.js**: Core server framework.
- **MongoDB** & **Mongoose**: Database and ODM.
- **JWT (JSON Web Tokens)**: Authentication and authorization.
- **bcryptjs**: Password hashing for secure storage.

---

## 1. Authentication & Security Module

**Goal:** Secure the application and manage user identities.

### Implemented Files
- **`models/user.js`**: Schema containing `name`, `email` (unique), `password`, and `role` (customer, owner, admin).
- **`middleware/auth.middleware.js`**: Contains the `protect` function which intercepts requests, reads the `Authorization: Bearer <token>` header, verifies the JWT, and attaches the user document to `req.user`.
- **`middleware/role.middleware.js`**: Contains the `authorize(...roles)` function which checks if `req.user.role` matches the allowed roles for a specific route.
- **`controllers/auth.controller.js`**: 
  - `register`: Hashes passwords using bcrypt and creates a new user. Returns a JWT.
  - `login`: Compares passwords and issues a JWT.
  - `getProfile`: Returns the logged-in user's profile (excluding password).
  - `updateProfile`: Allows a user to update their name and email.
  - `changePassword`: Allows a user to securely change their password.
- **`routes/auth.routes.js`**: Maps the endpoints.

### API Endpoints
- `POST /api/auth/register` - Public
- `POST /api/auth/login` - Public
- `GET /api/auth/profile` - Protected
- `PUT /api/auth/profile` - Protected
- `PUT /api/auth/change-password` - Protected

---

## 2. Vehicle Module

**Goal:** Manage vehicle listings, allowing owners to post vehicles and customers to browse/search.

### Implemented Files
- **`models/Vehicle.js`**: Schema containing comprehensive vehicle details (`brand`, `model`, `year`, `type`, `fuelType`, `transmission`, `pricePerDay`, `location`, `image`, `available`) and references the `owner` (User).
- **`controllers/vehicle.controller.js`**:
  - `addVehicle`: Automatically assigns `req.user._id` as the owner.
  - `getAllVehicles`: Fetches all vehicles.
  - `searchVehicles`: Filters vehicles based on query parameters (type, location, price, brand).
  - `getVehicleById`: Fetches a single vehicle.
  - `getOwnerVehicles`: Fetches all vehicles belonging to a specific owner.
  - `updateVehicle` & `deleteVehicle`: Includes permission checks so only the specific owner (or an admin) can modify the vehicle.
- **`routes/vehicle.routes.js`**: Maps the endpoints and applies `protect` and `authorize("owner", "admin")` to modification routes.

### API Endpoints
- `GET /api/vehicles` - Public
- `GET /api/vehicles/search` - Public
- `GET /api/vehicles/:id` - Public
- `GET /api/vehicles/owner/:ownerId` - Public
- `POST /api/vehicles` - Protected (Owner/Admin)
- `PUT /api/vehicles/:id` - Protected (Owner/Admin)
- `DELETE /api/vehicles/:id` - Protected (Owner/Admin)

---

## 3. Booking Module

**Goal:** Allow customers to rent vehicles and owners to manage those rentals.

### Implemented Files
- **`models/Booking.js`**: Schema linking a `customer`, a `vehicle`, and an `owner`. Tracks `startDate`, `endDate`, `totalPrice`, `paymentStatus` (Pending, Paid, Refunded), and `status` (Pending, Accepted, Rejected, Cancelled, Completed).
- **`controllers/booking.controller.js`**:
  - `createBooking`: Customers can initiate a rental request. (Includes required field validation).
  - `getCustomerBookings`: Customers can view their own booking history.
  - `getOwnerBookings`: Owners can view requests made for their vehicles.
  - `getBookingDetails`: View a specific booking (restricted to the involved customer, owner, or an admin).
  - `updateBookingStatus`: A unified endpoint where:
    - Customers can change status to `Cancelled`.
    - Owners can change status to `Accepted`, `Rejected`, or `Completed`.
- **`routes/booking.routes.js`**: All routes are protected by JWT authentication.

### API Endpoints
- `POST /api/bookings` - Protected
- `GET /api/bookings/my-bookings` - Protected
- `GET /api/bookings/owner-bookings` - Protected (Owner/Admin)
- `GET /api/bookings/:id` - Protected
- `PUT /api/bookings/:id/status` - Protected

---

## 4. Review Module

**Goal:** Allow users to rate and review vehicles they have rented.

### Implemented Files
- **`models/Review.js`**: Schema linking a `user`, a `vehicle`, a `rating` (1-5), and a `comment`.
- **`controllers/review.controller.js`**:
  - `addReview`: Creates a new review attached to the logged-in user. **Enforces a strict one-review-per-user-per-vehicle policy**.
  - `getVehicleReviews`: Fetches all reviews for a specific vehicle (Public).
  - `updateReview` & `deleteReview`: Restricted to the author of the review or an admin.
- **`routes/review.routes.js`**: Maps the endpoints with appropriate protections.

### API Endpoints
- `POST /api/reviews` - Protected
- `GET /api/reviews/vehicle/:vehicleId` - Public
- `PUT /api/reviews/:id` - Protected
- `DELETE /api/reviews/:id` - Protected

---

## 5. Admin Dashboard Module

**Goal:** Provide an overarching management system for application administrators.

### Implemented Files
- **`controllers/admin.controller.js`**:
  - Retrieves all platform data (`getAllUsers`, `getAllVehicles`, `getAllBookings`).
  - Performs administrative deletions (`deleteUser`, `deleteVehicle`).
  - Generates top-level metrics (`getDashboardStats` counting users, vehicles, total bookings, **active bookings**, and **completed bookings**).
- **`routes/admin.routes.js`**: 
  - **Crucially**, every route here uses `router.use(protect)` AND `router.use(authorize("admin"))`, ensuring absolute security.

### API Endpoints
- `GET /api/admin/users` - Protected (Admin)
- `GET /api/admin/vehicles` - Protected (Admin)
- `GET /api/admin/bookings` - Protected (Admin)
- `DELETE /api/admin/user/:id` - Protected (Admin)
- `DELETE /api/admin/vehicle/:id` - Protected (Admin)
- `GET /api/admin/dashboard` - Protected (Admin)

---

## Application Entry Point (`server.js`)
The `server.js` file was updated to tie everything together:
- Establishes the MongoDB connection via `config/db.js`.
- Configures global middleware (`cors`, `express.json()`).
- Registers all five router modules under their respective base paths (`/api/auth`, `/api/vehicles`, `/api/bookings`, `/api/reviews`, `/api/admin`).
