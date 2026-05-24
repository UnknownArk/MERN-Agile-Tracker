# MERN Agile Issue Tracker (Jira Clone)

**Live Demo:** [View the Live Application Here](https://mern-agile-tracker.vercel.app)

A full-stack, responsive project management dashboard built from scratch. This application replicates the core functionality of Jira, allowing users to create workspaces, add tasks, and manage their workflow using a seamless drag-and-drop Kanban interface.

## Features
* **Interactive Kanban Board:** Full HTML5 Drag-and-Drop API integration for moving tasks between 'To Do', 'In Progress', and 'Done' columns.
* **Real-time State Management:** Instant UI updates synced seamlessly with the database.
* **RESTful API:** Robust backend architecture handling full CRUD operations for projects and tasks.
* **Persistent Data:** Cloud-hosted MongoDB database ensuring zero data loss across sessions.
* **Responsive UI:** Clean, modern interface styled with standard CSS and Lucide-React iconography.

## Tech Stack
* **Frontend:** React.js, Vite, HTML5 Drag-and-Drop, CSS3 (Deployed on Vercel)
* **Backend:** Node.js, Express.js, CORS (Deployed on Render)
* **Database:** MongoDB Atlas, Mongoose ORM

---

## Local Setup & Installation

To run this project locally on your machine, follow these steps:

### 1. Clone the Repository
\`\`\`bash
git clone https://github.com/YOUR_USERNAME/MERN-Agile-Tracker.git
cd MERN-Agile-Tracker
\`\`\`

### 2. Environment Variables
Create a `.env` file in the `backend` directory and add your MongoDB connection string:
\`\`\`text
MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/jira-db
PORT=5000
\`\`\`

### 3. Backend Installation
Open a terminal in the root directory and start the Express server:
\`\`\`bash
cd backend
npm install
node server.js
\`\`\`
*The server will run on http://localhost:5000*

### 4. Frontend Installation
Open a second terminal in the root directory and start the React app:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`
*The client will run on http://localhost:5173*

---

## Folder Structure

MERN-Agile-Tracker/
|
├── backend/
│   ├── models/        # Mongoose database schemas (Project.js, Task.js)
│   ├── routes/        # Express API endpoints
│   ├── .env           # Environment variables (Ignored by Git)
│   └── server.js      # Main application entry point
|
└── frontend/
    ├── src/
    │   ├── components/# Reusable UI elements (Sidebar, KanbanBoard)
    │   ├── App.jsx    # Main React component
    │   └── main.jsx   # DOM rendering
    └── vite.config.js # Vite bundler configuration

## Author
**PRADNESH R**
* GitHub: [@UnknownArk](https://github.com/UnknownArk/)
* LinkedIn: [Pradnesh R](https://www.linkedin.com/in/pradnesh-r/)