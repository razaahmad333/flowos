
````text
You are working on the FlowOS Lite project (Express backend + Next.js frontend, multi-tenant SaaS for hospitals/clinics).

I want you to refactor the current implementation according to the following requirements:

====================================================================
1) FIX DUPLICATE KEY ISSUE & INTRODUCE MASTER DEPARTMENTS
====================================================================

Right now, applying templates is causing:
“E11000 duplicate key error ... index: code_1 dup key: { code: 'GENERAL_OP' }”

This likely happens because:
- The `departments` collection has a unique index on `code` alone, not scoped by hospital,
- Template application tries to create the same `code` for multiple hospitals or re-apply.

I want a cleaner design with:

### A. Global MasterDepartment collection

Create a new model:

`src/models/MasterDepartment.ts`:

- Fields:
  - `_id: ObjectId`
  - `code: string`          // e.g. "GENERAL_OP"
  - `defaultName: string`   // e.g. "General OPD"
  - `category?: string`
  - `description?: string`
  - `tags?: string[]`       // e.g. ["generic_clinic", "multispeciality_opd"]
  - `isActive: boolean`
  - `createdAt`, `updatedAt`

- Index:
  - `{ code: 1 }` unique

Seed or define a few master departments with tags, e.g.:
- GENERAL_OP ("General OPD", tag: ["generic_clinic", "multispeciality_opd"])
- PEDIATRICS_OP
- ORTHO_OP
- GYNAE_OP
etc.

### B. Hospital-specific Department model refactor

Update the existing `Department` model to:

- `hospitalId: ObjectId` (ref Hospital)
- `masterDepartmentId?: ObjectId` (ref MasterDepartment)
- `code: string`
- `name: string`           // label used in UI
- `isCustom: boolean`      // true if not tied to a master template
- `isActive: boolean`
- timestamps

Indexes:

- Remove any unique index on `code` alone.
- Add:
  - `{ hospitalId: 1, code: 1 }` with `unique: true`
  - `{ hospitalId: 1, masterDepartmentId: 1 }` with `unique: true, sparse: true`

### C. Template application logic

In the template application service (e.g. `templateService` or inside `hospitalService`):

When applying a template (like `generic_clinic`) for a specific `hospitalId`:

1. Find relevant master departments:
   - `MasterDepartment.find({ tags: templateKey, isActive: true })`

2. For each master department, **upsert** a department:

```ts
Department.updateOne(
  {
    hospitalId,
    masterDepartmentId: master._id,
  },
  {
    $setOnInsert: {
      hospitalId,
      masterDepartmentId: master._id,
      code: master.code,
      name: master.defaultName,
      isCustom: false,
      isActive: true,
    },
  },
  { upsert: true }
);
````

This ensures:

* Applying template twice does NOT create duplicates.
* Different hospitals can safely use the same master `code`.

If there is any existing template-apply logic that just blindly inserts departments, refactor it to use this upsert pattern.

====================================================================
2) CUSTOM LABELS PER HOSPITAL
=============================

When an admin edits the department name, only update the **hospital-specific Department document**:

* Do NOT modify MasterDepartment.
* So if MasterDepartment.defaultName = "General OPD", Hospital A may override the name to "OPD – Ground Floor", and it must be stored in `Department.name` for that hospital only.

Ensure all queries that drive UI lists use the hospital-specific `Department` model and show `name`.

====================================================================
3) LOGIN UX: REDIRECT & SHOW USER NAME
======================================

I want to polish the UX for login and home behavior:

### A. After login / signup

* On successful `POST /api/v1/auth/login` or `POST /api/v1/auth/register-admin`, the frontend should:

  1. Store JWT + user info + hospital info (as it already does or as per existing auth context).
  2. Immediately redirect to `/dashboard`.

* Implement this with Next.js router (e.g. `router.push('/dashboard')`) in the login/signup forms.

### B. Dashboard greeting

* In the main dashboard (`/dashboard`), show a greeting:

  E.g.: `"Welcome, {user.name}"` or `"Hi, {user.name}"`

* `user.name` should come from the auth context/local storage, not hard-coded.

### C. Home route behavior

* On `/` (home page):

  * If user is logged in:

    * Either automatically redirect to `/dashboard`
    * OR show hero section + a prominent "Go to Dashboard" button instead of "Login".

  Choose one approach and implement consistently.

====================================================================
4) HEADER & FOOTER ON LOGIN AND OTHER PUBLIC PAGES
==================================================

Right now, login/signup may be using a bare layout.

Refactor the frontend layout as follows:

### A. MarketingLayout

Create a `MarketingLayout` component (e.g. `src/components/layout/MarketingLayout.tsx`) with:

* Header containing:

  * Logo / product name
  * Navigation links: Home, Services, Pricing, About
  * Right-aligned button:

    * "Login" (if not authenticated)
    * "Dashboard" (if authenticated)

* Footer containing:

  * Copyright
  * Minimal links or tagline

### B. Use MarketingLayout on:

* Home (`/`)
* Services (`/services`)
* Pricing (`/pricing`)
* About (`/about`)
* Login (`/login`)
* Signup (`/signup`)

So login/signup pages are no longer blank; they are embedded in the same site shell, with consistent navigation.

### C. Keep AppLayout for dashboard

Continue using a separate `AppLayout` (sidebar, internal nav) for authenticated app routes like:

* `/dashboard`
* `/dashboard/departments`
* `/dashboard/doctors`
* `/dashboard/users`
* `/dashboard/settings`

====================================================================
5) INTEGRATION WITH EXISTING CODE
=================================

* Ensure any existing code that references Department still works with new fields.
* Make sure indexes are updated:

  * Drop old unique index on `code` if it exists.
  * Add compound indexes as described.
* Ensure template APIs now use MasterDepartment + upsert pattern.
* Ensure all new/modified routes compile and existing tests still pass.

====================================================================
FINAL CHECKLIST
===============

When you’re done, I expect:

1. New `MasterDepartment` model with seed data.
2. Updated `Department` model with:

   * `hospitalId`
   * `masterDepartmentId`
   * `code`, `name`, `isCustom`, `isActive`
   * Proper indexes.
3. Template apply logic:

   * Uses `MasterDepartment` → upsert into `Department` per hospital.
4. Login/signup:

   * Redirect to `/dashboard` on success.
5. Dashboard:

   * Shows `user.name` greeting.
6. MarketingLayout:

   * Used across public pages + login/signup.
7. `/`:

   * Handles logged-in user correctly (redirect or “Go to Dashboard” button).

Now refactor the backend and frontend to satisfy all of the above, keeping the existing FlowOS Lite architecture intact.

``