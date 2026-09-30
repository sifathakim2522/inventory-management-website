# Inventory Management Website

A React and Express application for managing products, categories, suppliers, users, and orders, with a dashboard and MongoDB persistence.

## Stack

React, Vite, Tailwind CSS, Axios, Express, Mongoose, JWT, and bcrypt.

## Structure

- frontend/ — web interface.
- server/ — authentication, inventory routes, database connection, and setup scripts.

## Run locally

Use Node.js 22.12+ and npm, with a reachable MongoDB database.

Copy server/.env.example to server/.env and set MONGO_URI and a strong JWT_KEY.

```sh
cd server
npm ci
npm start
```

In another terminal:

```sh
cd frontend
npm ci
npm run dev
```

The API defaults to http://localhost:5000. The frontend currently references that address directly, so keep the default API port for local development. Open the URL printed by Vite.

Account setup utilities exist in server/registeradmin.js and server/seed.js. Review their contents and database targets before running them; do not assume they are safe to run against production data.

## Checks and current limitations

- Run npm run build and npm run lint in frontend/.
- The server test script is a placeholder; automated backend tests are not implemented.
- API addresses should become configurable before deployment.
- Review access controls and validation before using real business data.
- Keep database credentials and JWT secrets in local environment files.

## Next steps

Automated API tests, documented account provisioning, configurable API URLs, and deployment instructions.

## Attribution

Preserve existing dependency and asset notices. This README does not introduce a new license.
