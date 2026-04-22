---
status: complete
phase: 07-crud-inventario-emprestimos
source: [07-01-SUMMARY.md]
started: "2026-04-22T12:18:00Z"
updated: "2026-04-22T12:25:00Z"
---

## Current Test

number: 2
name: Inventory List with Pagination
expected: |
  `curl http://localhost:3001/api/inventory` returns a JSON response with `data` array, `total`, `page`, `perPage`, and `totalPages` fields.
awaiting: user response (session paused — user moved to Phase 8 planning)

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running backend server. Run `cd backend && pnpm dev`. Server boots on port 3001 without errors. `curl http://localhost:3001/api/health` returns `{ "status": "ok" }` with status 200.
result: pass

### 2. Inventory List with Pagination
expected: `curl http://localhost:3001/api/inventory` returns a JSON response with `data` array, `total`, `page`, `perPage`, and `totalPages` fields. Items include `id`, `name`, `quantity`, `availableQuantity`, `category` string.
result: pass

### 3. Inventory Create (Auth Required)
expected: POST `/api/inventory` without auth token returns 401. With a valid JWT and `manipular_estoque` permission, POST with `{ "name": "Test Item", "quantity": 5, "categoryId": "<valid-id>" }` returns 201 with the created item.
result: pass

### 4. Inventory Image Upload
expected: POST `/api/inventory/:id/image` with a multipart form containing an image file (JPEG/PNG) returns 200 with updated item. The `image` field contains the upload path. Non-image files are rejected with an error.
result: pass

### 5. Loan Creation with Stock Deduction
expected: POST `/api/loans` with `{ "items": [{ "inventoryItemId": "<id>", "quantity": 1 }], "dueDate": "<future-iso>" }` creates a loan with status "pending". The inventory item's `availableQuantity` decreases by the requested amount.
result: pass

### 6. Loan Approval Updates Quantities
expected: PUT `/api/loans/:id/status` with `{ "status": "active" }` (requires `aprovar_emprestimos` permission) changes loan status to "active" and increments the inventory item's `loanedQuantity`.
result: pass

### 7. Loan Return Restores Quantities
expected: PUT `/api/loans/:id/status` with `{ "status": "returned" }` changes loan status to "returned", increments `availableQuantity`, decrements `loanedQuantity`, and sets `returnedDate`.
result: pass

### 8. Auth Guard on Protected Routes
expected: POST/PUT/DELETE requests to `/api/inventory` and `/api/loans` without a valid JWT return 401 "Você não está autenticado". Requests with a valid JWT but without the required permission return 403.
result: pass

## Summary

total: 8
passed: 8
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

[none yet]
