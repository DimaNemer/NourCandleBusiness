# REVIEW — Nour's Order Desk

## 1. Trace one Add Order action from the form to the Route Handler and back.

When the user clicks **New Order**, the `OrderForm` component opens. The user enters the customer name, phone number, product name, quantity, and unit price.

After submitting the form, `OrderDashboard` sends a `POST` request to `/api/orders` using `fetch()`, with the form data converted to JSON.

The POST Route Handler in `app/api/orders/route.ts` reads the request body and calls `validateOrderInput()` to check the submitted fields. If the data is valid, `createOrder()` generates an ID, calculates the total, sets the initial status to `Pending`, and saves the order in the in-memory array.

The server returns the created order with HTTP status `201 Created`. The dashboard then fetches the updated order list and displays the new order.

## 2. Where is the total calculated, and why is that decision important?

The total is calculated on the server in `lib/orders.ts`, inside `createOrder()` and `updateOrder()`.

The calculation converts the unit price into cents, multiplies it by the quantity, and converts the result back into dollars.

This is important because the server should not trust a total supplied by the client. It also helps avoid floating-point calculation problems.

For example, three candles priced at $8 each produce a total of $24, regardless of whether the client sends `total: 0`.

## 3. Show one invalid request. Why did it fail, and did stored data remain unchanged?

One invalid request is:

```http
PATCH /api/orders/1
Content-Type: application/json
```

```json
{
  "quantity": -2
}
```

The request should fail with HTTP `400 Bad Request` because the quantity must be a positive integer.

The validation function checks the new values before updating the stored order. Therefore, an invalid request should not modify the existing data.

## 4. What is the difference between PATCH and replacing an entire object?

PATCH updates only the fields included in the request, while preserving the other fields.

For example, sending:

```json
{
  "status": "Delivered"
}
```

changes only the order's status. The customer name, phone number, product name, quantity, and unit price remain unchanged.

Replacing an entire object means providing a complete new representation of the order rather than updating only selected fields.

In this application, PATCH also recalculates the total whenever the quantity or unit price changes.

## 5. What happens to your orders after a server restart?

The application stores orders in an in-memory array instead of a database.

The `globalThis` store helps share data between Route Handlers while the server process is running, but it does not provide permanent storage.

When the server process restarts, newly created orders and changes to existing orders are lost, and the initial seed orders are loaded again.

This limitation is acceptable for the assignment because persistent database storage is not required.

## 6. Which AI suggestion did you correct or verify, and what evidence helped you decide?

While building the dashboard, I encountered a React ESLint warning because the AI-generated `OrderForm` component used `useEffect()` to update multiple state variables directly from the `order` prop.

The warning explained that calling `setState()` synchronously inside an effect can cause unnecessary renders.

I corrected the implementation by initializing the form state directly from the `order` prop using `useState()`. The dashboard already used a `key` based on the order ID, allowing React to initialize a fresh form when editing another order.

This helped me understand that an AI-generated solution can work conceptually but still need improvements based on framework warnings and code review.

