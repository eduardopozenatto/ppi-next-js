---
status: complete
phase: 08-usu-rios-permiss-es-notifica-es-e-relat-rios
source: [08-01-SUMMARY.md]
started: 2026-04-22T09:57:21-03:00
updated: 2026-04-22T09:57:21-03:00
---

## Current Test
<!-- OVERWRITE each test - shows where we are -->

number: 1
name: Cold Start Smoke Test
expected: |
  Kill any running server/service. Clear ephemeral state (temp DBs, caches, lock files). Start the application from scratch. Server boots without errors, any seed/migration completes, and a primary query (health check, homepage load, or basic API call) returns live data.
awaiting: user response

## Tests

### 1. Cold Start Smoke Test
expected: Kill any running server/service. Clear ephemeral state (temp DBs, caches, lock files). Start the application from scratch. Server boots without errors, any seed/migration completes, and a primary query (health check, homepage load, or basic API call) returns live data.
result: pass

### 2. Users Management - Soft Delete
expected: Deleting a user via DELETE /api/users/:id does not remove them from the database, but sets `isActive: false`. Existing loans associated with that user are preserved.
result: pass

### 3. Users Management - Permission Overrides
expected: Updating a user's tagId or role requires an admin user. Updating custom permission overrides for a specific tag is correctly stored and fetched on the user object.
result: pass

### 4. Tags CRUD and Validation
expected: Creating a tag requires a valid hex color and accepts exactly the 11 permission boolean keys. Trying to delete a tag that is currently assigned to a user returns an error preventing deletion.
result: pass

### 5. Categories CRUD and Counts
expected: The list of categories returned by GET /api/categories includes a `linkedItemsCount` dynamically populated from the database. Deleting a category that has inventory items returns an error.
result: pass

### 6. Automated Notifications Trigger
expected: Changing a pending loan's status to `active` (Approval) automatically creates an 'approval' notification for the borrower. Changing a pending loan's status to `cancelled` (Rejection) creates a 'rejection' notification containing the labObservation.
result: pass

### 7. Notifications Read Status
expected: Fetching GET /api/notifications returns only notifications belonging to the logged-in user. Calling PUT /api/notifications/:id/read successfully updates the notification's `read` status to true.
result: pass

### 8. Inventory Reports KPI
expected: Calling GET /api/reports/inventory returns aggregate KPIs including totalItems, availableQuantity, activeUsers, grouping of items by category, and the top 5 most borrowed items.
result: pass

### 9. Loans Reports Filtering
expected: Calling GET /api/reports/loans?period=30 correctly filters loans created in the last 30 days and returns grouped counts by status (pending, active, overdue, returned).
result: pass

## Summary

total: 9
passed: 9
issues: 0
pending: 0
skipped: 0
blocked: 0

## Gaps

