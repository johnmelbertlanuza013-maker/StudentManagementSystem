# Student Management System

**Developer:** John Melbert Lanuza  
**Project:** Integrative Programming and Technologies II

A student record management project using **React, Express, Prisma ORM, and MySQL**.

## Features

- Add students
- View and search records
- Edit student information
- Delete records
- Save records in MySQL

## Technologies

- **Frontend:** React + Vite
- **Backend:** Node.js + Express
- **ORM:** Prisma
- **Database:** MySQL 8

## How to Run

You need Node.js 20.19+ and a running MySQL 8 database.

1. Create the database using `backend/database/create_database.sql`.
2. Copy `backend/.env.example` to `backend/.env` and enter your MySQL connection details.
3. In the `backend` folder, run:
   ```bash
   npm install
   npm run db:setup
   npm start
   ```
4. In the `frontend` folder, run:
   ```bash
   npm install
   npm run dev
   ```
5. Open **http://localhost:5173**.

The API runs at **http://localhost:5000**. You can check the database connection at `/api/health`.

## Testing

- `npm test` in `backend` runs validation tests.
- `npm run test:crud` in `backend` tests the CRUD operations against your running app and MySQL database.
- GitHub Actions also tests the project using a temporary MySQL 8 database.

**Note:** This is a school demo. Use fictional student records only. The GitHub repository holds the source code; the live MySQL database and backend must be set up separately. Keep `.env` and database passwords private.
