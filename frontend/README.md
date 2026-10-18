# Smart Event Management Frontend

React + Vite frontend for the Smart Event Management and Crowd Analytics Platform.

## Run locally
1. Install Node.js (LTS).
2. In this folder run `npm install`.
3. Start the Spring Boot backend at `http://localhost:8080`.
4. Run `npm run dev` and open the URL printed by Vite (normally `http://localhost:5173`).

## Backend integration
The event list/detail and authentication pages use the backend endpoints already described in the project (`/api/events`, `/api/auth/login`, `/api/auth/register`). Other pages call conventional endpoints such as `/api/bookings/my` and `/api/admin/analytics`; those pages need matching backend controllers to work fully. A message is shown when an endpoint is unavailable. The frontend does not create backend functionality or database tables.

## Notes
- API base URL can be overridden with `VITE_API_URL`, for example `http://localhost:8080/api`.
- Public registration should create a normal STUDENT account. Promote an administrator only in a local development database and never expose an admin-role change to public registration.
