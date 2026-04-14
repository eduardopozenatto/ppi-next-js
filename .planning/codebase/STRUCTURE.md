# Directory Structure

## Project Root

```
ppi-next-js/
├── frontend/                     # Main application directory
│   ├── app/                      # Next.js App Router
│   ├── components/               # Reusable UI components
│   ├── contexts/                 # React context providers
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utilities, config, validation
│   ├── mocks/                    # Mock data (in-memory backend)
│   ├── public/                   # Static assets (SVG icons)
│   ├── types/                    # TypeScript type definitions
│   ├── package.json
│   ├── tsconfig.json
│   ├── tailwind.config.ts
│   ├── next.config.ts
│   ├── eslint.config.mjs
│   ├── postcss.config.mjs
│   └── proxy.ts                  # Next.js middleware (no-op)
├── config.docx                   # Requirements document (LabControl)
├── frontend_skills.md            # Frontend development guide
└── README.md
```

## App Router (`frontend/app/`)

```
app/
├── layout.tsx                    # Root layout (Poppins font, AppProviders)
├── types.ts                      # Mode type ("login" | "register")
├── src/
│   └── globals.css               # Global CSS tokens, theme, resets
├── _data/                        # Empty (reserved for data loading)
├── (public)/                     # Unauthenticated routes
│   ├── layout.tsx                # Pass-through layout (no shell)
│   ├── page.tsx                  # Landing page (login/register toggle)
│   ├── login/page.tsx            # Login page
│   ├── register/page.tsx         # Registration page
│   └── recovery/page.tsx         # Password recovery page
└── (auth)/                       # Authenticated routes (requires AuthGate)
    ├── layout.tsx                # AuthGate → AppShell → ToastProvider
    ├── dashboard/page.tsx        # Main dashboard
    ├── items/page.tsx            # Item catalog search
    ├── loans/
    │   ├── page.tsx              # Loan list (tabs: active, pending, history)
    │   ├── new/page.tsx          # New loan form
    │   └── [id]/page.tsx         # Loan detail page
    ├── inventory/
    │   ├── page.tsx              # Inventory management table
    │   ├── new/page.tsx          # New inventory item form
    │   └── [id]/page.tsx         # Inventory item detail
    ├── cart/page.tsx              # Shopping cart → loan request
    ├── notifications/page.tsx    # User notifications
    ├── settings/
    │   ├── page.tsx              # User settings (notification prefs)
    │   └── profile/
    │       ├── page.tsx          # Profile settings page
    │       └── ProfileSummary.tsx # Profile edit component
    ├── approvals/
    │   ├── page.tsx              # Loan approvals (admin/estagiário)
    │   └── ApprovalsActions.tsx  # Approve/reject action handlers
    └── admin/                    # Admin-only routes (requires AdminGate)
        ├── layout.tsx            # AdminGate wrapper
        ├── users/page.tsx        # User management
        ├── reports/page.tsx      # Reports with KPI cards and export
        └── settings/
            ├── page.tsx          # Admin settings tabs
            ├── SystemSettingsMock.tsx
            ├── categories/page.tsx  # Category management
            ├── tags/page.tsx        # Tag/role management
            └── permissions/page.tsx # Permission management
```

## Components (`frontend/components/`)

```
components/
├── Body/
│   ├── FormCard.tsx              # Card wrapper for auth forms
│   └── Slogan.tsx                # LabControl branding/logo
├── Button/
│   ├── Button.tsx                # Primary/secondary/ghost button primitive
│   └── Link.tsx                  # Button-styled Next.js Link
├── Input/
│   └── Input.tsx                 # Labeled input with forwarded ref
├── Link/
│   └── Link.tsx                  # Styled anchor/link component
├── auth/
│   ├── Form.tsx                  # Auth form wrapper
│   ├── FormBody.tsx              # Form body content
│   ├── Header.tsx                # Auth page header
│   ├── Title.tsx                 # Form title component
│   ├── AuthFormFooter.tsx        # Login/register toggle footer
│   └── RecoveryForm.tsx          # Password recovery form
├── inventory/
│   ├── CatalogSearchBar.tsx      # Search + category filter bar
│   ├── CategoryList.tsx          # Category label list
│   ├── InventoryCatalogGrid.tsx  # Item grid with cards
│   ├── InventoryManagementTable.tsx # Admin inventory table
│   └── NewInventoryItemForm.tsx  # Add item form (with image upload)
├── layout/
│   ├── AdminGate.tsx             # Admin role check + redirect
│   ├── AppShell.tsx              # Desktop sidebar + mobile drawer layout
│   ├── AppSidebar.tsx            # Navigation sidebar with permission filtering
│   └── AuthGate.tsx              # Auth check + redirect to login
├── loans/
│   ├── LoanStatusBadge.tsx       # Colored status badge
│   └── NewLoanForm.tsx           # New loan form with Zod validation
├── providers/
│   └── AppProviders.tsx          # Composes AuthProvider
├── search/                       # Empty (reserved)
└── shared/
    ├── EmptyState.tsx            # Empty state with icon + message
    ├── PageHeader.tsx            # Page title + description header
    └── Toast.tsx                 # Toast notification system (context + UI)
```

## Supporting Directories

```
contexts/
└── AuthContext.tsx               # Auth state management (login, register, logout)

hooks/
└── useAuth.ts                   # Re-exports useAuthContext as useAuth

lib/
├── api/
│   └── client.ts                # API base URL constant
├── navigation.ts                # Nav config, permission helpers, isLabAdmin()
├── utils.ts                     # cn(), formatDate(), formatCurrency()
└── validations/
    ├── inventory.ts             # newInventoryItemSchema (Zod)
    └── loan.ts                  # newLoanSchema (Zod)

mocks/
├── cart.ts                      # Cart line items
├── inventory-items.ts           # Lab equipment records
├── loans.ts                     # Loan records
├── notifications.ts             # Notification records
├── session-user.ts              # Mock users + register function
├── settings.ts                  # Tags, categories, permission overrides
├── storage-categories.ts        # Category strings
└── users.ts                     # Admin user list

types/
├── api.ts                       # ApiResponse, PaginatedResponse, ApiError
├── lab-inventory.ts             # LabInventoryListItem
├── lab-session.ts               # LabSessionUser, LabUserPermissions, LabUserTag
├── loan.ts                      # Loan, LoanItem, LoanStatus
├── settings.ts                  # TagPermissions, Tag, Category, UserPermissionOverride
└── user.ts                      # User, UserRole

public/
├── buttonIcons/                 # Navigation and action SVG icons
└── *.svg                        # Utility SVG icons (filter, trash, pencil, etc.)
```

## Naming Conventions

| Pattern | Convention | Example |
|---------|-----------|---------|
| **Components** | PascalCase | `AppShell.tsx`, `AuthGate.tsx` |
| **Hooks** | camelCase with `use` prefix | `useAuth.ts` |
| **Utils** | camelCase | `utils.ts`, `navigation.ts` |
| **Types** | PascalCase interfaces | `LabSessionUser`, `TagPermissions` |
| **Mocks** | kebab-case files, SCREAMING_SNAKE constants | `session-user.ts`, `MOCK_LOANS` |
| **Routes** | kebab-case directories | `admin/settings/permissions/` |
| **CSS variables** | kebab-case with prefix | `--color-primary`, `--color-bg-subtle` |

## File Stats

- **Total source files (TS/TSX/CSS):** ~85 files
- **Route pages:** ~20 pages
- **Components:** ~30 components
- **Mock data files:** 8 files
- **Type definition files:** 6 files
