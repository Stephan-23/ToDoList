#Todo List Application
#Overview
This is a simple, responsive todo list application built with HTML, CSS, and JavaScript for the frontend, and Node.js with Express for the backend, using MongoDB (via MongoDB Atlas) for data storage. The app allows users to add, toggle completion, visually delete, filter (Active, Completed, Deleted, All), and search tasks. It features a dark-themed UI, a confirmation modal for deletions, and real-time search functionality.
The application is designed to be deployed publicly, accessible from any device (computers, tablets, phones), and can be hosted with a static frontend on GitHub Pages or Vercel, paired with a backend on a server platform like Heroku, Render, or Vercel.

#Features
Add Tasks: Create new tasks with a title, description, and priority (Low, Medium, High).

Toggle Completion: Mark tasks as completed or uncompleted with a checkbox.

Visual Delete: Remove tasks from the UI with a confirmation modal (tasks remain in the database unless explicitly deleted via backend).

Filter Tasks: View tasks by Active, Completed, Deleted (History), or All.

Search Tasks: Real-time search by task title and description, respecting the current filter.

Responsive Design: Works on desktops, tablets, and phones with a dark-themed UI.

Backend API: RESTful API for managing tasks, hosted on a Node.js/Express server with MongoDB.

#Prerequisites
Before you begin, ensure you have the following installed:
Node.js (v14 or higher)

npm (Node Package Manager, comes with Node.js)

MongoDB (or MongoDB Atlas for cloud hosting)

Git (for version control and deployment)

#Installation
#1. Clone the Repository
bash

git clone https://github.com/Stephan-23/ToDoList.git
cd todo-app

#2. Install Dependencies
Navigate to the server directory for the backend:
bash
cd server
npm install

No additional dependencies are needed for the frontend (public folder), as it uses plain HTML, CSS, and JavaScript.

#Usage
Open the app in a web browser (locally or deployed).

Use the "ADD NEW TASK" button to create tasks with a title, description, and priority.

Toggle task completion with the checkbox.

Click the delete () button to visually remove a task (confirmation modal appears).

Use the filter buttons (Active, Completed, Deleted, All) to view tasks.

Search tasks by typing in the search input field—results update in real-time and respect the current filter.

#Technologies Used
Frontend: HTML5, CSS3, JavaScript (ES6+)

Backend: Node.js, Express.js

Database: MongoDB (via Mongoose or direct connection with MongoDB Atlas)

Deployment: Render (backend) and Vercel

#Contact
Author: Thembinkosi Dladla

Email: thembinkosidladla75@gmail.com

GitHub: https://github.com/Stephan-23






