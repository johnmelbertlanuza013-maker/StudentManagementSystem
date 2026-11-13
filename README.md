# John Melbert Lanuza — Portfolio and Student Information System

**Developer:** John Melbert Lanuza  
**Contact:** johnmelbertlanuza22@gmail.com  
**Course activity:** Integrative Programming and Technologies II — ORM/CRUD integration


## Project description

A personal portfolio website with an integrated **Student Management System**. The system lets users **add, view, edit, delete and search** fictional student records. React displays the interface; Express handles HTTP API requests; Prisma ORM runs database queries; and **MySQL** stores the records persistently.

**Important:** The repository contains project source code and setup instructions, not a hosted website. To use actual CRUD, you must run both apps and a MySQL database. This application is a classroom demo without account authentication, so do not use real students' personal information or deploy it publicly as-is.

## Technologies used

| Component | Technology |
| --- | --- |
| Front-end | React 18, Vite 6, CSS |
| Back-end | Node.js, Express |
| ORM | Prisma ORM v6 |
| Database | MySQL |
| Communication | REST API and JSON |
| Source hosting | Git and GitHub |

## Project structure

```text
John_Melbert_Lanuza_React_MySQL_Portfolio/
├── README.md
├── .gitignore
├── frontend/
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   └── src/
│       ├── main.jsx
│       ├── App.jsx
│       └── styles.css
└── backend/
    ├── .env.example
    ├── package.json
    ├── prisma/
    │   ├── schema.prisma
    │   └── migrations/
    ├── src/
    │   ├── server.js
    │   └── validation.js
    └── tests/
        └── validation.test.js
```

## What you need

- A Windows, macOS, or Linux computer with **Node.js 20.19+** and npm.
- A running **MySQL database server** (MySQL Workbench, MySQL Server, or XAMPP with MySQL/MariaDB may be used locally).
- A code editor, e.g. Visual Studio Code.
- Internet access during first-time `npm install`.

> An Android phone can view your GitHub repository, but running the full Node.js + MySQL system is much easier on a laptop or desktop. GitHub Pages cannot run the server or database by itself.

## Installation and setup

### 1. Extract the ZIP

Unzip `John_Melbert_Lanuza_React_MySQL_Portfolio.zip`, then open the extracted project folder with Visual Studio Code.

### 2. Create your MySQL database

Start MySQL and open a SQL editor (MySQL Workbench or another local MySQL tool). Run:

```sql
CREATE DATABASE IF NOT EXISTS john_lanuza_students;
```

Create/use a **local database user with permission to access this database**. Keep their username and password ready. Prefer not to use the MySQL root account for real deployments.

### 3. Configure the back-end database URL

Open a first terminal **inside the `backend` folder**:

```bash
cd backend
npm install
```

Copy `.env.example` to a new file named `.env` in the same folder. Edit `.env`:

```env
DATABASE_URL="mysql://YOUR_USER:YOUR_PASSWORD@localhost:3306/john_lanuza_students"
PORT=5000
```

Replace `YOUR_USER` and `YOUR_PASSWORD` with your own MySQL login. If your password contains characters like `@`, `#`, or `:`, URL-encode those characters in the connection string. **Never upload `.env` to GitHub.**

### 4. Prepare the tables using Prisma

Still inside `backend`, run:

```bash
npm run db:setup
```

This generates Prisma Client and applies the supplied SQL migration to create the `Student` table. The data will be stored in MySQL and kept after restarts.

### 5. Start the back-end

```bash
npm start
```

The API should start at **http://localhost:5000**. Keep this terminal open. To verify database connectivity, open **http://localhost:5000/api/health**; a working connection returns `"database": "connected"`.

### 6. Install and start the React front-end

Open a **second terminal** inside the project folder:

```bash
cd frontend
npm install
npm run dev
```

Open **http://localhost:5173** in your web browser. Click **Student App** in the menu to try your CRUD application.

> The Vite developer server forwards `/api` requests to `http://localhost:5000` through the proxy set in `frontend/vite.config.js`. Both servers must be running to perform CRUD operations.

## Features and CRUD examples

- **Create:** Fill in a fictional student's name, email, course, year, and status; click **Add Student**.
- **Read:** The records table loads saved data from MySQL. Click the refresh icon to retrieve them again.
- **Update:** Click **Edit** on a record, make changes, then click **Save Changes**.
- **Delete:** Click **Delete** and confirm to remove a record.
- **Search:** Type a name, email, or course in the search box to filter displayed records.
- **Persistence:** Close and restart both servers, then check that records remain in MySQL.

### ORM operations and API routes

| HTTP method | Route | Prisma ORM operation |
| --- | --- | --- |
| GET | `/api/students` | `prisma.student.findMany()` |
| GET | `/api/students/:id` | `prisma.student.findUnique()` |
| POST | `/api/students` | `prisma.student.create()` |
| PUT | `/api/students/:id` | `prisma.student.update()` |
| DELETE | `/api/students/:id` | `prisma.student.delete()` |
| GET | `/api/health` | `prisma.student.count()` |

Example JSON payload for POST/PUT:

```json
{
  "fullName": "Alex Example",
  "email": "alex.example@example.com",
  "course": "BSIT",
  "yearLevel": 2,
  "status": "ACTIVE"
}
```

Each email must be unique. The API validates fields and returns understandable errors for invalid input and duplicate email addresses.

## How the system works

```text
User (Browser)
      ↓
React + CSS Front-end
      ↓ (HTTP/JSON)
Node.js + Express REST API
      ↓
Prisma ORM v6
      ↓
MySQL student database
```

When a student record is added, React sends the information to Express. Express validates the input and calls a Prisma function, which writes to MySQL. React fetches the updated records and shows them on the page. The same pattern applies to reading, editing, and deleting data.

## Testing

Run these tests inside the `backend` folder:

```bash
npm test
```

The seven included Node.js unit tests cover valid and invalid inputs and student ID parsing. The project also requires **manual end-to-end testing** after installing dependencies and connecting MySQL. Do not claim successful database integration until it has been run on your machine.

## Uploading to GitHub

1. Go to [github.com](https://github.com) and sign in.
2. Click **New repository**. Suggested name: `JohnMelbertLanuza-StudentManagementSystem`.
3. Upload the **extracted files and folders**, including both `frontend` and `backend` (and `README.md`). Do not upload the ZIP as your only file.
4. Do **not** upload `.env`, `node_modules`, or any real student information.
5. Commit the changes. Copy your repository URL, which will look like: `https://github.com/YOUR_USERNAME/JohnMelbertLanuza-StudentManagementSystem`.
6. Paste that **actual repository link** in the comment section of your Google Classroom assignment.

If GitHub's mobile upload screen does not preserve folder structure, use a computer with Git:

```bash
git init
git add .
git commit -m "Build portfolio with Prisma ORM student CRUD"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/JohnMelbertLanuza-StudentManagementSystem.git
git push -u origin main
```

Create the empty repository first and replace `YOUR_USERNAME`. Git credentials may be required.

### Can it be opened through a GitHub Pages link?

GitHub Pages hosts only static files and **does not run Express or MySQL**. To demonstrate CRUD, run it locally or deploy the React frontend plus backend and database to supported hosting. A GitHub repository link alone shows your code, not a running app.

## Troubleshooting

- **`npm` command not found:** Install Node.js 20.19 or newer, then restart your terminal.
- **Database offline:** Check that MySQL is running, your `.env` URL is correct, and the backend is running on port 5000.
- **Prisma fails to connect:** Confirm your database exists and your user has permissions.
- **No table found:** Run `npm run db:setup` from `backend`.
- **Duplicate email error:** Use a different sample email for each student.
- **Port 5173/5000 taken:** Stop the other service using it, or adjust Vite/Express config together.
- **Website opens but records don't load:** Verify the React and Express terminals are both still running, then visit `/api/health`.

## Short project explanation for defense

> “My portfolio contains a Student Management System. I created the front-end using React and the back-end using Node.js and Express. I used Prisma ORM to connect the program to a MySQL database. The system supports adding, viewing, editing, deleting and searching for student records. MySQL saves the data even after the program is restarted.”

## Important development status

The source files and input-validation tests were checked during preparation. A complete `npm install` and live MySQL test were **not possible in the preparation environment** because package registry access was unavailable and there was no configured local MySQL server. Follow the setup instructions above and test CRUD locally before submitting.

## Ready-to-test MySQL integration (added)

This GitHub repository includes the **actual Prisma MySQL schema and migration**, a
**local MySQL Docker Compose option**, and a GitHub Actions workflow that starts a
short-lived MySQL 8 server and tests Create, Read, Update, and Delete automatically.

### Simple setup on a computer (MySQL Workbench / XAMPP)

1. Install and start MySQL on a laptop/desktop. Use MySQL Workbench or phpMyAdmin to
   run `backend/database/create_database.sql`. If using XAMPP, its database service
   may be MariaDB rather than Oracle MySQL; use MySQL 8 for an exact match.
2. In `backend`, copy `.env.example` to `.env` and replace the placeholders with
   your own **local** MySQL username and password. Do not post your password in chat
   or commit `.env` to GitHub.
3. Open a terminal in `backend` and run `npm install`, then `npm run db:setup`.
   Prisma creates the **Student** table in the MySQL database.
4. Run `npm start`. Visit `http://localhost:5000/api/health` to see whether the
   database is connected.
5. In a second terminal open `frontend`, run `npm install` and `npm run dev`, then
   visit `http://localhost:5173`.
6. After both servers are running, open a third terminal in `backend` and run
   `npm run test:crud`. It creates a **fictional test record**, reads and updates
   it, then deletes it. You should see **PASS** messages for each operation.

### Optional: start MySQL with Docker Desktop

If Docker Desktop is installed instead of a local MySQL server:

```bash
# from repository root
cp .env.mysql.example .env.mysql
# edit .env.mysql and replace BOTH placeholder passwords
# then run:
docker compose --env-file .env.mysql -f compose.mysql.yml up -d
```

Copy `backend/.env.example` to `backend/.env` and set the database URL using
`john_app` as the username and the **MYSQL_APP_PASSWORD** you set in `.env.mysql`:

```env
DATABASE_URL="mysql://john_app:YOUR_APP_PASSWORD@127.0.0.1:3306/john_lanuza_students"
PORT=5000
```

Then run `npm install`, `npm run db:setup`, and `npm start` in `backend` as above.
The Docker Compose volume stores records between restarts. Keep `.env.mysql`
and `backend/.env` private; both are excluded from Git.

### Testing through GitHub Actions (does not host your database)

Open the repository's **Actions** tab and select **MySQL + Prisma CRUD tests**.
It automatically starts a *temporary* MySQL 8 database, runs migrations,
performs the CRUD smoke test, and builds the React frontend. A green check
confirms the project worked in that test environment; it **does not** mean a
permanent online MySQL database or publicly hosted live app exists.

This classroom demo has no authentication. Use **fictional student records only**
and do not expose the backend directly to the internet as-is.
