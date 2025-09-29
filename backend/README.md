# Multi-Tenant SaaS Notes API

This is the backend for a multi-tenant notes application built with Node.js, Express, and MongoDB. It features JWT-based authentication, role-based access control, tenant isolation, and subscription-based feature gating.

## Key Features

- **Multi-tenancy**: Shared schema approach with a `tenantId` on relevant collections to ensure data isolation.
- **Authentication**: JWT-based authentication for secure access.
- **Authorization**: Role-based access control (Admin, Member).
- **Subscription Plans**: 'Free' plan with a 3-note limit and a 'Pro' plan with unlimited notes.
- **API Endpoints**: Full CRUD functionality for notes.

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose)
- **Authentication**: JSON Web Tokens (JWT)
- **Password Hashing**: bcryptjs
- **Environment Variables**: dotenv
- **CORS**: cors

## Prerequisites

- [Node.js](https://nodejs.org/) (v14 or later)
- [MongoDB](https://www.mongodb.com/) (local or a cloud instance like MongoDB Atlas)

## Setup and Installation

1.  **Clone the repository:**
    ```bash
    git clone <repository-url>
    cd saas-notes-backend
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    ```

3.  **Create a `.env` file** in the root directory and add the following variables:
    ```
    PORT=5001
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    ```

4.  **Seed the database** with initial tenants and users:
    This command will create the 'Acme' and 'Globex' tenants, along with their respective admin and member users.
    ```bash
    npm run seed
    ```
    **Predefined Test Accounts (password: `password`)**:
    - `admin@acme.test` (Admin, Acme)
    - `user@acme.test` (Member, Acme)
    - `admin@globex.test` (Admin, Globex)
    - `user@globex.test` (Member, Globex)

5.  **Start the server:**
    - For production: `npm start`
    - For development with auto-reloading: `npm run dev`

    The server will be running on `http://localhost:5001`.

## API Endpoints

- **Health Check**: `GET /health`
- **Authentication**: `POST /api/auth/login`
- **Notes (CRUD)**:
  - `GET /api/notes`
  - `POST /api/notes`
  - `GET /api/notes/:id`
  - `PUT /api/notes/:id`
  - `DELETE /api/notes/:id`
- **Tenants**:
  - `POST /api/tenants/:slug/upgrade` (Admin only)

All notes and tenant endpoints are protected and require a JWT Bearer token in the `Authorization` header.