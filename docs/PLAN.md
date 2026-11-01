# Nour's Order Desk Plan

## 1. Client Problem

Nour runs a small handmade candle business in Beirut and receives customer orders through Instagram messages.

Managing orders manually makes it difficult to track customer details, quantities, prices, and order statuses.

The goal is to build a simple internal dashboard where Nour can organize her orders, update their progress, and avoid calculation mistakes.

## 2. Required Features

- Display all orders with customer, product, quantity, price, total, and status.
- Add new orders through a form.
- Edit existing order information.
- Update order status: Pending, Preparing, or Delivered.
- Delete orders with confirmation.
- Calculate order totals on the server.
- Validate submitted data and display useful error messages.
- Show order counts, loading states, and empty states.
- Provide a responsive interface for desktop and mobile.

## 3. API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/orders` | Retrieve all orders |
| GET | `/api/orders/[id]` | Retrieve one order |
| POST | `/api/orders` | Create a new order |
| PATCH | `/api/orders/[id]` | Update selected order fields |
| DELETE | `/api/orders/[id]` | Delete an order |

The API uses an in-memory array to store orders. A database is not required for this assignment.

## 4. Implementation Steps

1. **Set up the project:** Create a Next.js application using TypeScript and Tailwind CSS.
2. **Define the data model:** Create the `Order` interface, order statuses, and shared in-memory store.
3. **Build the API:** Implement the five Route Handler endpoints with validation, error responses, and server-side total calculations.
4. **Test the API:** Use Thunder Client to verify successful requests, invalid input, and unknown order IDs.
5. **Build the dashboard:** Create reusable React components for displaying, adding, editing, and deleting orders.
6. **Connect frontend and backend:** Use `fetch()` to communicate with the API and refresh the displayed data after changes.
7. **Test and document:** Verify the complete order workflow, check mobile responsiveness, capture evidence, and complete the required documentation.

## 5. Scope and Limitations

This application is an internal order-management tool, not an online store.

It does not include authentication, payment processing, Instagram integration, or permanent database storage. Orders are stored in memory and may be lost when the server restarts.