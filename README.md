# 📋 Task Manager App (Trello Clone)

A full-stack task management application inspired by Trello. It features a Kanban-style interface with drag-and-drop functionality, allowing users to organize tasks into columns and boards. Built with the **PERN Stack** (PostgreSQL, Express/NestJS, React, Node).

![Project Status](https://img.shields.io/badge/status-completed-green)

## 🚀 Features

* **🔐 Authentication:** Secure Login & Register using JWT (JSON Web Tokens).
* **📂 Board Management:** Create, Rename, and Delete Boards.
* **📝 List & Task Management:** Create columns and tasks dynamically.
* **✨ Drag & Drop:** Smooth drag-and-drop for tasks between columns (powered by `@hello-pangea/dnd`).
* **✏️ Inline Editing:** Click-to-edit functionality for tasks and column titles.
* **🗑️ CRUD Operations:** Full Create, Read, Update, Delete capabilities.
* **📱 Responsive Design:** Clean UI that works on different screen sizes.

## 🛠️ Tech Stack

### Backend
* **Framework:** [NestJS](https://nestjs.com/)
* **Database:** PostgreSQL
* **ORM:** Prisma
* **Authentication:** Passport.js & JWT

### Frontend
* **Library:** React (with TypeScript)
* **Build Tool:** Vite
* **Styling:** CSS Modules / Inline Styles
* **HTTP Client:** Axios
* **Drag & Drop:** @hello-pangea/dnd

---

## ⚙️ Installation & Setup

Follow these steps to run the project locally.

### 1. Clone the repository
```bash
git clone [https://github.com/Fivkas/task-manager-app.git](https://github.com/Fivkas/task-manager-app.git)
cd task-manager-app
```

### 2. Backend Setup
Navigate to the backend folder and install dependencies:

```bash
cd backend
npm install
```

Create a .env file in the backend folder and add your database credentials:

DATABASE_URL="postgresql://USER:PASSWORD@localhost:5432/taskmanager?schema=public"
JWT_SECRET="super-secret-key"

Run migrations and start the server:

```bash
npx prisma migrate dev
npm run start:dev
```

The backend should now be running on http://localhost:3000

### 3. Frontend Setup
Open a new terminal, navigate to the frontend folder, and install dependencies:

```bash
cd frontend
npm install
```

Start the React application:

```bash
npm run dev
```

The frontend should now be running on http://localhost:5173


## 🚀 Deployment

This project is ready for deployment using the "Golden Stack":

Database: Neon Tech (Postgres)

Backend: Render

Frontend: Vercel