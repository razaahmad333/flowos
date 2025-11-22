# FlowOS Backend

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Set up environment variables:
   Copy `.env.example` to `.env` and update values.

3. Run locally:
   ```bash
   npm run dev
   ```

4. Run with Docker:
   ```bash
   docker-compose up --build
   ```

## API Endpoints

- `POST /api/v1/auth/register-hospital-admin`
- `POST /api/v1/auth/login`
- `GET /api/v1/hospital/me`
- `GET /api/v1/departments`
- `POST /api/v1/departments`
- `GET /api/v1/doctors`
- `POST /api/v1/doctors`
