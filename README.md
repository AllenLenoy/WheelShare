<div align="center">
  <img src="https://via.placeholder.com/150x150.png?text=WheelShare" alt="WheelShare Logo" width="150" height="150">
  <h1 align="center">WheelShare 🚗</h1>

  <p align="center">
    A modern, scalable peer-to-peer car rental platform bridging the gap between vehicle owners and renters.
    <br />
    <a href="#getting-started"><strong>Explore the docs »</strong></a>
    <br />
    <br />
    <a href="#">View Demo</a>
    ·
    <a href="#">Report Bug</a>
    ·
    <a href="#">Request Feature</a>
  </p>
</div>

<!-- BADGES -->
<div align="center">
  <img src="https://img.shields.io/badge/Angular-19.0.0-DD0031?style=for-the-badge&logo=angular&logoColor=white" alt="Angular" />
  <img src="https://img.shields.io/badge/Node.js-18.x-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-5.x-404D59?style=for-the-badge" alt="Express" />
  <img src="https://img.shields.io/badge/MongoDB-9.x-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Docker-Enabled-2496ED?style=for-the-badge&logo=docker&logoColor=white" alt="Docker" />
</div>
<br />

<!-- TABLE OF CONTENTS -->
<details>
  <summary>Table of Contents</summary>
  <ol>
    <li><a href="#about-the-project">About The Project</a></li>
    <li><a href="#key-features">Key Features</a></li>
    <li><a href="#tech-stack">Tech Stack</a></li>
    <li>
      <a href="#getting-started">Getting Started</a>
      <ul>
        <li><a href="#prerequisites">Prerequisites</a></li>
        <li><a href="#installation--local-development">Installation</a></li>
        <li><a href="#docker-deployment">Docker Deployment</a></li>
      </ul>
    </li>
    <li><a href="#system-architecture">System Architecture</a></li>
    <li><a href="#api-reference">API Reference</a></li>
    <li><a href="#contributing">Contributing</a></li>
    <li><a href="#license">License</a></li>
  </ol>
</details>

---

## About The Project

**WheelShare** is a full-stack web application designed to revolutionize local car rentals. By connecting individuals who have underutilized vehicles with locals or travelers looking for short-term transportation, WheelShare creates an affordable, sustainable, and community-driven ecosystem.

The platform is designed with a strong focus on security (JWT & Role-Based Access Control), modern UI/UX (Angular 19), and robust backend performance (Express + MongoDB).

## Key Features

- 🔐 **Robust Authentication:** Secure JWT-based authentication with `bcryptjs` password hashing.
- 👥 **Role-Based Access Control (RBAC):**
  - **Customers:** Browse cars, make bookings, and track rental history.
  - **Owners:** Add/Edit/Delete vehicles, manage fleet availability, and approve bookings.
  - **Admins:** Global oversight over all users, vehicles, and platform metrics.
- 🔍 **Advanced Vehicle Discovery:** Interactive vehicle listing with dynamic filtering, detailed specifications, and image galleries.
- 📅 **Streamlined Booking Engine:** Instant date validation, collision prevention, and status tracking (Pending → Confirmed → Completed).
- 🖼️ **Cloud Media Management:** Seamless integration with Cloudinary & Multer for high-performance vehicle image hosting.
- 🛡️ **Security-First Backend:** Configured with Helmet, Express Rate Limit, CORS, and Express Mongo Sanitize to defend against common vulnerabilities.

## Tech Stack

### Client (Frontend)
- **Framework:** Angular 19 (Standalone Components)
- **Styling:** Custom Vanilla CSS with scalable Design Tokens (CSS Variables)
- **Routing:** Angular Router (Lazy Loading & Route Guards)
- **State/Async:** RxJS Observables

### Server (Backend)
- **Runtime:** Node.js
- **Framework:** Express.js 5.x
- **Database:** MongoDB (Mongoose ODM)
- **Auth:** JSON Web Tokens (JWT)

### Infrastructure
- **Containerization:** Docker & Docker Compose
- **Media Hosting:** Cloudinary

---

## Getting Started

Follow these instructions to get a copy of the project up and running on your local machine for development and testing.

### Prerequisites

* Node.js (v18.x or higher)
* npm (v9.x or higher)
* Angular CLI (`npm install -g @angular/cli`)
* MongoDB (Local instance or MongoDB Atlas cluster)

### Installation & Local Development

1. **Clone the repository** (if applicable):
   ```bash
   git clone https://github.com/your-username/wheelshare.git
   cd wheelshare
   ```

2. **Setup the Backend API:**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
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
   npm run dev
   ```

3. **Setup the Frontend Client:**
   Open a new terminal session.
   ```bash
   cd frontend
   npm install
   ```
   Start the Angular development server:
   ```bash
   npm start
   ```

4. **View the Application:**
   Navigate to `http://localhost:4200` in your browser.

### Docker Deployment

For a streamlined deployment process, the project includes a `docker-compose.yml` file.

```bash
# Build the images and spin up the containers (MongoDB, Backend, Frontend)
docker-compose up --build
```
- Frontend: `http://localhost:8080`
- Backend API: `http://localhost:5000`

---

## System Architecture

```text
WheelShare/
├── backend/
│   ├── config/          # Database & third-party integrations
│   ├── controllers/     # Route logic (Auth, Booking, Vehicle, Admin)
│   ├── middleware/      # Authentication, role validation, error handling
│   ├── models/          # Mongoose data schemas
│   ├── routes/          # API endpoint definitions
│   └── server.js        # Express application entry point
│
├── frontend/
│   ├── src/app/
│   │   ├── admin/       # Admin dashboard & management views
│   │   ├── auth/        # Login and registration flows
│   │   ├── booking/     # Checkout and booking status views
│   │   ├── customer/    # Renter dashboard
│   │   ├── owner/       # Fleet management dashboard
│   │   ├── vehicles/    # Public listings and detail views
│   │   ├── services/    # API communication layer
│   │   ├── guards/      # Angular route protection
│   │   └── interceptors/# HTTP request/response manipulation
│
├── docker-compose.yml
└── README.md
```

---

## API Reference

The backend exposes a standard RESTful API. Below are the core resource endpoints:

* **Authentication:** `POST /api/auth/register`, `POST /api/auth/login`
* **Vehicles:** `GET /api/vehicles`, `GET /api/vehicles/:id`, `POST /api/vehicles` (Protected)
* **Bookings:** `POST /api/bookings`, `GET /api/bookings/my-bookings` (Protected)
* **Admin:** `GET /api/admin/users`, `GET /api/admin/stats` (Protected - Admin Only)

*(For detailed request/response payloads, refer to the Postman collection or Swagger UI - if integrated later).*

---

## Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## License

Distributed under the MIT License. See `LICENSE` for more information.

<p align="right">(<a href="#readme-top">back to top</a>)</p>
