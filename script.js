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
// Fetch all tasks and sort them by priority
/*app.get('/api/tasks', async (req, res) => {
  try {
    const tasks = await Todo.find().sort({ priority: 1 }); // Sorting by priority (Low, Medium, High)
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});*/


// Update task completion status
// Update task completion status
app.patch('/api/tasks/:id', async (req, res) => {
  try {
    const taskId = req.params.id;
    const completedStatus = req.body.completed; // Get the status from the request body

    // Get the current date to set completedAt if the task is completed
    const completedAt = completedStatus ? new Date() : null;

    // Find the task and update the completed field and completedAt field
    const task = await Todo.findByIdAndUpdate(taskId, 
      { 
        completed: completedStatus, 
        completedAt: completedAt 
      }, 
      { new: true }
    );

    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }

    // Send back the updated task
    res.json(task); // Return the updated task
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});


// Default route
app.get("/", (req, res) => {
  res.send("API is running...");
});

// Start the server
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));