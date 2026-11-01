# API Documentation — Nour's Order Desk

## Overview

Nour's Order Desk uses Next.js Route Handlers to manage customer orders through a REST API.

**Base URL:** `http://localhost:3000`

All requests that send data use JSON. Orders are stored in memory, and totals are calculated on the server.

## Order Data Model

Each order contains:

| Field | Type | Description |
|---|---|---|
| `id` | string | Server-generated unique identifier |
| `customerName` | string | Customer's name |
| `phone` | string | Customer's phone number |
| `productName` | string | Candle or product name |
| `quantity` | number | Positive integer |
| `unitPrice` | number | Non-negative price, maximum two decimal places |
| `total` | number | Calculated by the server |
| `status` | string | Pending, Preparing, or Delivered |

## 1. GET /api/orders

Retrieves all orders.

**Success status:** `200 OK`

Example response:

```json
[
  {
    "id": "1",
    "customerName": "Dima",
    "phone": "01101010",
    "productName": "Vanilla Candle",
    "quantity": 3,
    "unitPrice": 8,
    "total": 24,
    "status": "Pending"
  }
]
```

If there are no orders, the API returns an empty array.

## 2. GET /api/orders/[id]

Retrieves a single order using its ID.

Example request:

```http
GET /api/orders/1
```

**Success status:** `200 OK`

Example response:

```json
{
  "id": "1",
  "customerName": "Dima",
  "phone": "01101010",
  "productName": "Vanilla Candle",
  "quantity": 3,
  "unitPrice": 8,
  "total": 24,
  "status": "Pending"
}
```

If the ID does not exist:

**Status:** `404 Not Found`

```json
{
  "error": "Order not found"
}
```

## 3. POST /api/orders

Creates a new order.

Example request:

```json
{
  "customerName": "Demo Sara",
  "phone": "DEMO-001",
  "productName": "Vanilla Candle",
  "quantity": 3,
  "unitPrice": 8
}
```

**Success status:** `201 Created`

Example response:

```json
{
  "id": "<generated-uuid>",
  "customerName": "Demo Sara",
  "phone": "DEMO-001",
  "productName": "Vanilla Candle",
  "quantity": 3,
  "unitPrice": 8,
  "total": 24,
  "status": "Pending"
}
```

The server generates the ID, calculates the total, and sets the default status to Pending.

## 4. PATCH /api/orders/[id]

Updates only the fields included in the request.

Example request:

```http
PATCH /api/orders/1
```

```json
{
  "quantity": 4,
  "status": "Preparing"
}
```

**Success status:** `200 OK`

Example response, assuming the original order is unchanged:

```json
{
  "id": "1",
  "customerName": "Dima",
  "phone": "01101010",
  "productName": "Vanilla Candle",
  "quantity": 4,
  "unitPrice": 8,
  "total": 32,
  "status": "Preparing"
}
```

Unspecified fields remain unchanged. The total is recalculated when necessary.

An empty update or invalid field value returns `400 Bad Request`. An unknown ID returns `404 Not Found`.

The implementation rejects attempts to update server-controlled fields such as `id` and `total`.

## 5. DELETE /api/orders/[id]

Deletes an existing order.

Example request:

```http
DELETE /api/orders/1
```

**Success status:** `204 No Content`

The response body is empty.

If the order does not exist:

**Status:** `404 Not Found`

```json
{
  "error": "Order not found"
}
```

## Validation Rules

- Customer name, phone number, and product name must be non-empty strings.
- Text values are trimmed before storage.
- Quantity must be a positive integer greater than or equal to 1.
- Unit price must be a finite, non-negative number with no more than two decimal places.
- Status must be Pending, Preparing, or Delivered.
- POST requires all five input fields.
- PATCH accepts partial updates but rejects an empty request.
- Invalid requests must not modify stored orders.
- The client cannot control the order ID or calculated total.
- Malformed JSON returns an error response.

## HTTP Status Codes

| Code | Meaning |
|---|---|
| 200 | Request successful |
| 201 | Order created successfully |
| 204 | Order deleted successfully; no response body |
| 400 | Invalid request data or malformed JSON |
| 404 | Order not found |
| 500 | Unexpected server error |

## Storage Limitations

Orders are stored in a shared in-memory array rather than a database.

Changes are not permanently saved and may be lost after a server restart or development reload.