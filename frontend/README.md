# WheelShare 🚗

WheelShare is a modern, peer-to-peer car rental platform built with Angular 19. It connects car owners with renters, providing a seamless, secure, and affordable way to rent and share vehicles.

## Features (In Development)
- **User Authentication:** Secure login and registration for renters and car owners.
- **Browse & Search:** Easily browse available vehicles with filters for location, price, and car type.
- **Booking System:** Instant booking with a streamlined checkout process.
- **Owner Dashboard:** A dedicated space for car owners to manage their fleet, track bookings, and view earnings.
- **Responsive Design:** A fully responsive, modern UI built with custom CSS variables and modern layout techniques.

## Project Structure
The application follows a modular structure based on features:
- `src/app/auth/` - Authentication components (Login, Register)
- `src/app/booking/` - Booking process and checkout
- `src/app/customer/` - Customer dashboard and profile
- `src/app/home/` - Landing page with hero video and featured cars
- `src/app/layouts/` - Shared UI layouts (Navbar, Footer)
- `src/app/owner/` - Car owner dashboard
- `src/app/vehicles/` - Car listing and detailed view pages

## Tech Stack
- **Frontend Framework:** Angular 19 (Standalone Components)
- **Styling:** Custom Vanilla CSS with CSS Custom Properties (Variables)
- **Routing:** Angular Router
- **Fonts:** Google Fonts (Outfit, Inter)

## Development Server
To start a local development server, run:
```bash
npm start
```
Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Building
To build the project run:
```bash
npm run build
```
This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.
