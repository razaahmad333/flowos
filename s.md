* **Express** (not Fastify)
* Normal **JWT auth** for humans
* **HMAC-SHA256 auth** for machine-to-machine (integration) with:

  * key IDs
  * rotation support
  * timestamp + nonce
  * replay protection via Redis

You can paste this directly into Anti Gravity.

---

## 🔐 Anti Gravity Prompt — Lite Web Portal + Express + HMAC Security

````text
You are an expert full-stack engineer and security-conscious architect.

We are building the **Lite SaaS version** of a product for hospitals/clinics.

Think of it as:
- A self-service web portal where a clinic admin can:
    1) Register as an admin
    2) Create a hospital/clinic workspace (tenant)
    3) Log in and manage:
        - Users (staff)
        - Departments
        - Doctors
- Plus a secure foundation for future **HMIS integrations** using **HMAC-SHA256** with:
    - key IDs + rotation
    - timestamp + nonce
    - replay protection

We will call the product "FlowOS Lite" in this prompt (I may rename later).

Your task:
Implement a **working Lite version with a web portal** and a **top-grade backend security foundation**:

- Backend:
    - Node.js
    - Express
    - TypeScript
    - MongoDB (Mongoose)
    - Redis (for replay protection and future queues)
    - JWT auth for humans (admins/users)
    - HMAC-SHA256 auth for integration endpoints:
        - key ID + secret
        - signature header
        - timestamp + nonce
        - replay protection via Redis

- Frontend:
    - Next.js + TypeScript
    - Tailwind CSS (if not, use simple CSS modules)
    - Clean admin portal UX

We are only focusing on:
- Multi-tenant Lite backend (hospital as tenant)
- Web portal onboarding + masters (users/departments/doctors)
- Security foundation with HMAC integration middleware (even if only one sample route uses it now)

We are NOT implementing queue/tokens or AI yet.

====================================================================
PROJECT STRUCTURE
====================================================================

Create a monorepo-style structure or two folders:

backend/
  package.json
  tsconfig.json
  Dockerfile
  docker-compose.yml
  .env.example

  src/
    app.ts
    server.ts

    config/
      env.ts
      db.ts
      redis.ts
      logger.ts

    models/
      Hospital.ts
      User.ts
      Department.ts
      Doctor.ts
      IntegrationClient.ts
      AuditEvent.ts
      HmacReplay.ts   // optional or use Redis only

    middleware/
      authMiddleware.ts
      tenantMiddleware.ts
      rbacMiddleware.ts
      errorHandler.ts
      hmacMiddleware.ts   // HMAC verification + replay protection

    services/
      authService.ts
      hospitalService.ts
      departmentService.ts
      doctorService.ts
      userService.ts
      integrationService.ts
      auditService.ts
      featureService.ts
      hmacService.ts

    controllers/
      authController.ts
      hospitalController.ts
      departmentController.ts
      doctorController.ts
      userController.ts
      integrationController.ts   // for sample HMAC endpoint

    routes/
      authRoutes.ts
      hospitalRoutes.ts
      departmentRoutes.ts
      doctorRoutes.ts
      userRoutes.ts
      integrationRoutes.ts
      index.ts

    utils/
      password.ts
      tokens.ts
      httpResponses.ts
      validation.ts
      cryptoUtils.ts   // for HMAC & canonical string building

    types/
      common.ts
      auth.ts
      integration.ts

frontend/
  package.json
  next.config.js
  tailwind.config.js (if Tailwind)
  postcss.config.js (if Tailwind)
  src/
    app/ or pages/
      layout.tsx / _app.tsx / _document.tsx
      page.tsx or index.tsx   // login/landing
      signup/
      login/
      dashboard/
      dashboard/departments/
      dashboard/doctors/
      dashboard/users/
      dashboard/settings/
    components/
      layout/
        AppLayout.tsx
        AuthLayout.tsx
      common/
        Button.tsx
        Input.tsx
        Select.tsx
        Table.tsx
      forms/
        SignupForm.tsx
        LoginForm.tsx
        DepartmentForm.tsx
        DoctorForm.tsx
        UserForm.tsx
    lib/
      apiClient.ts
      auth.ts
    types/
      index.ts
    styles/

====================================================================
BACKEND – MULTI-TENANT & MODELS
====================================================================

Tenants = Hospitals.

All tenant-scoped entities must include `hospitalId: ObjectId` (ref Hospital).

### Hospital model

Fields:
- name: string
- code: string (slug, short unique string per deployment)
- plan: 'lite' | 'dedicated' | 'enterprise' (for now always 'lite')
- features: {
    integrationEnabled: boolean;
    webhookEnabled: boolean;
    customBranding: boolean;
    patientPWA: boolean;
  }
  (Defaults for Lite:
    integrationEnabled: false,
    webhookEnabled: false,
    customBranding: false,
    patientPWA: true
  )
- createdAt, updatedAt

### User model

Fields:
- hospitalId: ObjectId (ref Hospital)
- name: string
- email: string
- phone?: string
- passwordHash: string (bcrypt)
- roles: string[]  // ['SUPERADMIN'], ['ADMIN'], ['RECEPTION'], etc.
- status: 'ACTIVE' | 'DISABLED'
- createdAt, updatedAt

Indexes:
- Unique compound index { hospitalId, email }

### Department model

Fields:
- hospitalId
- name
- code
- isActive: boolean (default: true)
- createdAt, updatedAt

### Doctor model

Fields:
- hospitalId
- name
- code
- departmentId: ObjectId (ref Department)
- isActive: boolean (default: true)
- createdAt, updatedAt

### IntegrationClient model (for HMAC auth)

Fields:
- hospitalId
- name
- clientId: string
- keys: [
    {
      keyId: string;
      secret: string;       // plaintext for now, but DO NOT log it; mark TODO for encryption at rest
      isActive: boolean;
      createdAt: Date;
    }
  ]
- allowedIPs?: string[]
- createdAt, updatedAt

Only one or two keys will be active at a time, to support key rotation.

### AuditEvent model

Fields:
- hospitalId
- userId?: ObjectId (ref User)
- action: string   // e.g. "USER_CREATED", "DEPARTMENT_UPDATED"
- module: string   // e.g. "USER", "DEPARTMENT", "AUTH"
- oldValue?: any
- newValue?: any
- ip?: string
- userAgent?: string
- createdAt

====================================================================
BACKEND – AUTH (HUMANS via JWT)
====================================================================

Implement Express + TypeScript backend with:

- `POST /api/v1/auth/register-admin`
  Request:
  {
    hospitalName: string,
    adminName: string,
    email: string,
    password: string
  }

  Behavior:
  - Create a Hospital with plan 'lite' and default features.
  - Create a SUPERADMIN User with that hospitalId.
  - Return:
    - JWT access token
    - user info
    - hospital info

- `POST /api/v1/auth/login`
  Request:
  {
    email: string,
    password: string
  }

  Behavior:
  - Find user by email (within any hospital).
  - Validate password.
  - Load hospital by user.hospitalId.
  - Return JWT + user + hospital.

JWT payload:
- userId
- hospitalId
- roles

Use:
- bcrypt for passwords
- HS256 JWT with secret from env

Implement:

- `authMiddleware`:
  - Reads Authorization: Bearer <token>.
  - Verifies JWT.
  - Attaches `req.user = { id, hospitalId, roles }`.
  - On failure: 401.

- `tenantMiddleware`:
  - Uses `req.user.hospitalId` to fetch Hospital.
  - Attaches `req.tenant = { hospitalId, plan, features }`.
  - On missing/inactive → 403.

- `rbacMiddleware`:
  - Helper `requireRoles('SUPERADMIN', 'ADMIN')`.
  - Checks `req.user.roles`.
  - SUPERADMIN can do everything.

====================================================================
BACKEND – HMAC AUTH FOR INTEGRATION ENDPOINTS
====================================================================

We want **top-grade HMAC-SHA256 API security** for future HMIS integrations.

Design:

Client (HMIS or other system) will send:

- `X-Client-Id`: IntegrationClient.clientId
- `X-Key-Id`: keyId of specific active key
- `X-Timestamp`: UNIX timestamp in seconds (or ISO string)
- `X-Nonce`: random string (UUID)
- `X-Signature`: HMAC-SHA256 signature (hex or base64)

Signature computed over a **canonical string**, for example:

`<HTTP_METHOD>\n<PATH>\n<sorted_query_string>\n<body_hash>\n<timestamp>\n<nonce>\n<keyId>`

Where:
- body_hash = SHA256 of raw body (stringified JSON).
- sorted_query_string = query params sorted by key (even if empty).

Server side:

1. Fetch IntegrationClient by `clientId`.
2. From `keys[]`, find key where `keyId` matches and `isActive = true`.
3. Recompute canonical string and HMAC-SHA256 using `secret`.
4. Compare with `X-Signature` using constant-time comparison.

Replay protection:

- Reject requests where `timestamp` is older than allowed drift (e.g. > 5 minutes difference from server clock).
- Use Redis to store `(clientId, keyId, nonce)` as key with TTL = 10 minutes:
    - If key already exists → reject as replay.
    - If not, set it and proceed.

Key rotation:

- IntegrationClient can hold multiple active keys:
    - e.g. old key and new key both marked isActive = true during rotation period.
- HMAC middleware must support verifying using the key that matches `X-Key-Id`.

Implement:

- `hmacService.ts`:
    - `buildCanonicalString(req)` helper.
    - `verifyHmacSignature(req)` that:
        - looks up IntegrationClient by clientId
        - finds correct key
        - recomputes signature
        - checks signature, timestamp, and nonce (using Redis).
- `hmacMiddleware.ts`:
    - Express middleware for integration routes.
    - On failure, respond 401 with a clear error code.
    - On success, attach `req.integrationClient` and `req.tenant` (`hospitalId` from IntegrationClient).

Create a **sample integration endpoint**:

- `POST /api/v1/integration/ping-secure`
  - Protected only by HMAC (no JWT).
  - Uses `hmacMiddleware`.
  - Returns `{ ok: true, hospitalId, clientId }` for testing.

====================================================================
BACKEND – CORE CRUD APIs FOR LITE PORTAL
====================================================================

All APIs must be tenant-scoped: use `req.tenant.hospitalId` in queries.

**Hospital**

- `GET /api/v1/hospital/me`
  - Returns current hospital: name, code, plan, features.

**Departments**

- `GET /api/v1/departments`
- `POST /api/v1/departments`
- `PATCH /api/v1/departments/:id`
- `DELETE /api/v1/departments/:id` (soft delete: isActive = false)

**Doctors**

- `GET /api/v1/doctors`
- `POST /api/v1/doctors`
- `PATCH /api/v1/doctors/:id`
- `DELETE /api/v1/doctors/:id`

**Users (staff)**

- `GET /api/v1/users`
- `POST /api/v1/users`
  - Only SUPERADMIN/ADMIN.
  - Fields: name, email, phone, roles[], status.
- `PATCH /api/v1/users/:id`
  - Update name, roles, status.
- Optional: `POST /api/v1/users/:id/reset-password`
  - For now, can respond with TODO or simple flow.

All these must:

- Use `authMiddleware` + `tenantMiddleware`.
- Use `rbacMiddleware` where needed (e.g. only ADMIN/SUPERADMIN can create users/departments/doctors).

====================================================================
BACKEND – AUDIT LOGGING
====================================================================

Implement `auditService.logEvent({ hospitalId, userId, action, module, oldValue, newValue, ip, userAgent })`.

Call it for:

- Admin registration.
- Login (optional).
- Department create/update/delete.
- Doctor create/update/delete.
- User create/update/status change.

Just store logs in AuditEvent collection.

====================================================================
BACKEND – CONFIG, ENV, DOCKER
====================================================================

Implement:

- `config/env.ts`:
    - Reads env vars: PORT, MONGO_URI, REDIS_URL, JWT_SECRET, NODE_ENV.
- `config/db.ts`:
    - Connects to MongoDB with Mongoose.
- `config/redis.ts`:
    - Connects to Redis; export client for replay protection.
- `config/logger.ts`:
    - Basic logger with console (or pino/winston).

Create `.env.example`:

```env
PORT=4000
MONGO_URI=mongodb://mongo:27017/flowos-lite
REDIS_URL=redis://redis:6379
JWT_SECRET=supersecret
NODE_ENV=development
HMAC_ALLOWED_DRIFT_SECONDS=300
HMAC_NONCE_TTL_SECONDS=600
````

Create `docker-compose.yml`:

* `api` (backend)
* `mongo`
* `redis`

Expose API on port 4000.

====================================================================
FRONTEND – LITE WEB PORTAL
==========================

Frontend is the admin-facing portal for Lite.

Use Next.js + TypeScript + Tailwind.

Basic pages:

1. **Signup (`/signup`)**

   * Form fields:

     * Hospital Name
     * Admin Name
     * Email
     * Password
   * On submit:

     * POST `/api/v1/auth/register-admin`
     * On success:

       * Store JWT (in localStorage or http-only cookie; you decide)
       * Store basic user + hospital info in a simple auth store/context
       * Redirect to `/dashboard`

2. **Login (`/login` or `/`)**

   * Email + password
   * POST `/api/v1/auth/login`
   * Same handling as signup.

3. **Dashboard Layout (`/dashboard`)**

   * Use `AppLayout` with sidebar navigation:

     * Dashboard
     * Departments
     * Doctors
     * Users
     * Settings
     * Logout
   * Show:

     * Greeting: “Welcome, {adminName}”
     * Hospital name + plan
     * Simple stats (#departments, #doctors, #users) pulled from API.

4. **Departments (`/dashboard/departments`)**

   * Table list: name, code, status.
   * “Add Department” button → opens form (modal or separate page).
   * Ability to edit & deactivate.

5. **Doctors (`/dashboard/doctors`)**

   * Table: name, code, department.
   * “Add Doctor”:

     * name, code, department (dropdown from `/departments`).

6. **Users (`/dashboard/users`)**

   * Table: name, email, roles, status.
   * “Add User” form:

     * name, email, phone, role (single select, e.g. ADMIN/RECEPTION/DOCTOR).
   * Toggle status (ACTIVE/DISABLED).

7. **Settings (`/dashboard/settings`)**

   * Read-only display of hospital details:

     * name, code, plan, features.
   * Later can add edit capabilities.

Frontend MUST:

* Use `NEXT_PUBLIC_API_BASE_URL` for all requests.
* Use a central `apiClient.ts`:

  * Attaches Authorization header with stored JWT.
  * Handles errors generically.
* Have simple auth guard:

  * If no JWT → redirect to /login from dashboard routes.

====================================================================
QUALITY & TESTING
=================

At the end, ensure:

1. `docker-compose up` brings up:

   * Mongo
   * Redis
   * Backend API

2. `npm run dev` in frontend connects to backend at `http://localhost:4000` (or as per env).

3. Manual test flow:

   * Sign up via `/signup`.
   * Confirm new hospital & SUPERADMIN user in DB.
   * Login as that admin.
   * Create departments/doctors/users.
   * Refresh page → data persists.
   * Call sample HMAC endpoint (`/api/v1/integration/ping-secure`) using a constructed clientId/keyId/secret to verify signature, timestamp, nonce, and replay prevention.

====================================================================
DELIVERABLE SUMMARY
===================

At the end, show:

1. Folder structures for backend/ and frontend/.
2. Key backend files:

   * app.ts, server.ts
   * env.ts, db.ts, redis.ts
   * Hospital/User/Department/Doctor/IntegrationClient/AuditEvent models
   * authMiddleware, tenantMiddleware, rbacMiddleware, hmacMiddleware
   * auth routes & controllers
   * integration ping route using HMAC
3. Key frontend files:

   * signup/login pages
   * dashboard layout
   * one CRUD page (departments) as example
4. Short explanation of:

   * How multi-tenancy is enforced (hospitalId).
   * How JWT auth works.
   * How HMAC signature, key rotation, timestamp + nonce, and replay protection work.

Now implement this Lite SaaS web portal (backend with Express + HMAC, and frontend) according to the above spec.
Focus only on this scope (no queue/tokens yet).
