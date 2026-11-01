# Nour's Order Desk

A responsive order-management dashboard built with Next.js, TypeScript, and Tailwind CSS for a small handmade candle business.

**Developer:** Dima Nemer  
**Project:** Nour's Order Desk  
**Branch:** `[Add your actual Git branch name]`

## Project Overview

Nour runs a handmade candle business in Beirut and receives customer orders through Instagram messages. Managing these orders manually can make it difficult to track customer information, quantities, prices, and delivery statuses.

Nour's Order Desk provides a simple internal dashboard to organize and manage orders in one place.

The application supports creating, viewing, updating, and deleting orders through REST API endpoints built with Next.js Route Handlers.

## Features

- Create new customer orders.
- View all orders and their details.
- Edit customer, product, quantity, and price information.
- Update order status: Pending, Preparing, or Delivered.
- Delete orders with confirmation.
- Calculate order totals on the server.
- Validate inputs and return appropriate API errors.
- Search and filter orders by status.
- Display order statistics, loading states, and error messages.
- Responsive dashboard for desktop and mobile.

## Technologies Used

- **Next.js 16** — App Router and API Route Handlers
- **React** — Interactive user interface
- **TypeScript** — Type-safe data structures
- **Tailwind CSS** — Responsive styling
- **Thunder Client** — API testing

## Installation and Setup

### 1. Clone the repository

```bash
git clone https://github.com/DimaNemer/NourCandleBusiness.git
cd nour-business
```

### 2. Install dependencies

```bash
npm install
```

### 3. Run the development server

```bash
npm run dev
```

### 4. Open the application

Visit:

http://localhost:3000

No environment variables or database configuration are required.

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/api/orders` | Retrieve all orders |
| GET | `/api/orders/[id]` | Retrieve an order by ID |
| POST | `/api/orders` | Create an order |
| PATCH | `/api/orders/[id]` | Update an existing order |
| DELETE | `/api/orders/[id]` | Delete an order |

The API returns appropriate HTTP status codes, including `200`, `201`, `204`, `400`, and `404`.

## Data Storage and Limitations

The application uses an **in-memory array** instead of a database.

The shared order store is maintained using `globalThis`, allowing the API Route Handlers to access the same data while the server process is running.

However:

- Orders are not permanently saved.
- Newly created orders and updates may be lost after a server restart or development reload.
- Initial sample orders are available for testing.
- The application does not include authentication, payment processing, or Instagram integration.

These limitations are intentional and follow the assignment scope.

## Project Documentation

- [Implementation Plan](docs/PLAN.md)
- [API Documentation](docs/API.md)
- [Testing Results](docs/TESTING.md)
- [Engineering Review and AI Reflection](docs/REVIEW.md)

## Project Structure

```text
app/
  api/
    orders/
      route.ts
      [id]/
        route.ts
  page.tsx
  globals.css

components/
  OrderDashboard.tsx
  OrderCard.tsx
  OrderForm.tsx

lib/
  orders.ts

docs/
  PLAN.md
  API.md
  TESTING.md
  REVIEW.md

evidence/
images

public/
  image/
```

## Notes

This project was developed as an individual assignment to practice REST API design, server-side validation, CRUD operations, React state management, and frontend-backend integration.

AI assistance was used for planning, implementation guidance, and debugging. The application logic and API behavior were reviewed and tested during development.