# Nour's Order Desk — Testing

## 1. Testing Environment

- **Framework:** Next.js 16
- **Language:** TypeScript
- **API Testing Tool:** Thunder Client
- **Frontend Testing:** Web browser and Chrome DevTools
- **Base URL:** `http://localhost:3000`
- **Storage:** In-memory array

## 2. API Testing Results

The API was tested using Thunder Client to verify CRUD operations, input validation, server-side calculations, and HTTP status codes.

| Test Case | Expected Result | Actual Result | Status |
|---|---|---|---|
| GET all orders | 200 OK, returns order list | 200 OK | Pass |
| GET order by ID | 200 OK, returns matching order | 200 OK | Pass |
| POST valid order | 201 Created | 201 Created, order created | Pass |
| POST invalid quantity (-3) | 400 Bad Request | 400 Bad Request | Pass |
| PATCH valid order | 200 OK, updates fields and total | 200 OK, total = 60 | Pass |
| PATCH invalid quantity (-5) | 400 Bad Request | 400 Bad Request | Pass |
| GET after invalid PATCH | 200 OK, data unchanged | Quantity = 5, total = 60, status = Preparing | Pass |
| DELETE existing order | 204 No Content | 204 No Content | Pass |
| GET deleted order | 404 Not Found | 404 Not Found | Pass |

### Validation Verification

**Invalid POST:** An order with quantity `-3` was rejected with `400 Bad Request` because quantity must be a positive integer.

**Valid PATCH:** Updating quantity to `5` and unit price to `12` resulted in a server-calculated total of `60`, with status `Preparing`.

**Invalid PATCH:** An update containing quantity `-5` and status `Delivered` was rejected with `400 Bad Request`. A follow-up GET confirmed that the previously stored quantity, total, and status remained unchanged.

**DELETE verification:** Deleting an order returned `204 No Content`. A subsequent GET for the same ID returned `404 Not Found`.

## 3. Frontend Testing Results

The dashboard was tested directly in the browser to verify the complete order-management workflow.

| Feature | Expected Behavior | Actual Result | Status |
|---|---|---|---|
| Dashboard loading | Displays orders and summary statistics | Orders and statistics displayed | Pass |
| Add order | Creates and displays a new order | Order created and displayed | Pass |
| Edit order | Updates order information and total | Changes saved and total recalculated | Pass |
| Change status | Updates the selected order's status | Status updated successfully | Pass |
| Delete order | Shows confirmation and removes order | Confirmation displayed; order removed | Pass |
| Search | Filters orders using the search input | Matching orders displayed | Pass |
| Status filter | Displays orders matching selected status | Orders filtered correctly | Pass |
| Mobile responsiveness | Layout adapts to smaller screens | Mobile layout displayed correctly | Pass |

## 4. Evidence

The following screenshots are stored in the `evidence/` folder.

| Test | Screenshot |
|---|---|
| GET all orders | [get-orders.png](../evidence/get-orders.png) |
| GET order by ID | [get-orderby-Id.png](../evidence/get-orderby-Id.png) |
| POST successful | [post-success.png](../evidence/post-success.png) |
| POST invalid | [post-invalid.png](../evidence/post-invalid.png) |
| PATCH successful | [patch-success.png](../evidence/patch-success.png) |
| PATCH invalid | [patch-invalid.png](../evidence/patch-invalid.png) |
| DELETE successful | [delete-success.png](../evidence/delete-success.png) |
| Desktop dashboard | [dashboard-desktop.png](../evidence/dashboard-desktop.png) |
| Mobile dashboard | [dashboard-mobile.png](../evidence/dashboard-mobile.png) |

## 5. Build and Code Checks

The following commands will be executed from the project root to verify code quality, TypeScript correctness, and production build readiness.

| Command | Actual Result | Status |
|---|---|---|
| `npm run lint` | Pending execution | Pending |
| `npx tsc --noEmit` | Pending execution | Pending |
| `npm run build` | Pending execution | Pending |

## 6. Known Limitations

- Orders are stored in an in-memory array rather than a database.
- Changes are not permanently saved after a server restart.
- Authentication, payment processing, and Instagram integration are outside the assignment scope.

## 7. Conclusion

API testing confirmed successful order creation, retrieval, updating, deletion, validation, and correct HTTP status handling.

Frontend testing confirmed that users can manage orders through the dashboard, including creating, editing, changing statuses, deleting, searching, and filtering.

The application was also checked on desktop and mobile screen sizes.

Build and code-check results will be recorded after executing the available project commands.

### Demo Recording
The recording demonstrates creating, editing, changing the status, searching, filtering, and deleting orders. It also explains how the frontend communicates with the API and how orders are validated and created.

[Watch Demo Recording](https://drive.google.com/file/d/1g5q64F5UGbCdgqsw5SQjGSjxoxx5I0Gm/view?usp=drive_link)