# Agile Issue Tracker (Jira Clone)

A full-stack project management dashboard built from scratch using the MERN stack. This application features a persistent MongoDB database, a RESTful Express/Node API, and an interactive React frontend with live drag-and-drop Kanban functionality.

## Tech Stack
* **Frontend:** React, Vite, Lucide-React
* **Backend:** Node.js, Express.js
* **Database:** MongoDB, Mongoose

## Folder Structure
* `/backend`: Contains the Node/Express server, Mongoose `models`, and API `routes`.
* `/frontend`: Contains the Vite/React application and UI `components`.

## Local Setup Instructions

### 1. Database Configuration
Ensure you have MongoDB installed and running locally on your machine. The backend is configured to connect to standard local port `27017`.

### 2. Backend Setup
1. Open a terminal and navigate to the `backend` directory.
2. Run `npm install` to install dependencies (Express, Mongoose, Cors).
3. Run `node server.js` to start the backend API.
4. You should see success messages for port 5000 and the database connection.

### 3. Frontend Setup
1. Open a second terminal and navigate to the `frontend` directory.
2. Run `npm install` to install React dependencies.
3. Run `npm run dev` to start the Vite development server.
4. Open the provided localhost link (usually `http://localhost:5173`) in your browser.