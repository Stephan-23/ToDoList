const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 5000;

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => {
    console.error("MongoDB Connection Error:", err);
    process.exit(1); // Exit if connection fails
  });

// Routes
const Todo = require('./models/todo');

// Add a new task
app.post('/api/tasks', async (req, res) => {
  try {
    const newTask = new Todo(req.body);
    await newTask.save();
    res.status(201).json(newTask); // Send back the created task
  } catch (error) {
    console.error("Error saving task:", error);
    res.status(400).json({ message: error.message }); // Send detailed error message
  }
});



// Fetch all tasks
app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Todo.find(); // Fetch all tasks from MongoDB
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});
// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));