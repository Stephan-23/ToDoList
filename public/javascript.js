// Function to show the add task modal
function showAddTaskModal() {
  document.getElementById("addTaskModal").style.display = "block";
}

// Function to hide the add task modal
function hideAddTaskModal() {
  document.getElementById("addTaskModal").style.display = "none";
}
async function handleFormSubmit(event) {
  event.preventDefault(); // Prevent the default form submission

  // Get form values
  const taskTitle = document.getElementById("taskTitle").value;
  const taskDescription = document.getElementById("taskDescription").value;
  const taskPriority = document.getElementById("taskPriority").value;

  // Create a new task object
  const newTask = {
    task: taskTitle,
    description: taskDescription,
    priority: taskPriority,
  };

  console.log("Sending payload:", newTask); // Debugging: Log the payload

  try {
    // Send a POST request to the server
    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });

    if (response.ok) {
      const task = await response.json();
      console.log('Task added:', task);

      // Show feedback to the user
      alert("Task added successfully!");
      hideAddTaskModal(); // Close the modal
    } else {
      const errorData = await response.json(); // Parse the error response
      console.error('Failed to add task:', errorData);
      alert(`Failed to add task: ${errorData.message}`); // Show detailed error message
    }
  } catch (error) {
    console.error('Error:', error);
    alert("An error occurred. Please try again.");
  }
}


// Function to fetch all tasks from the backend
// Function to fetch all tasks from the backend
async function fetchTasks() {
  try {
    const response = await fetch('http://localhost:5000/api/tasks', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (response.ok) {
      const tasks = await response.json();
      displayTasks(tasks); // Display all tasks initially
    } else {
      console.error('Failed to fetch tasks:', response.status);
      alert('Failed to fetch tasks. Please try again.');
    }
  } catch (error) {
    console.error('Error fetching tasks:', error);
    alert('An error occurred while fetching tasks. Please try again.');
  }
}

// Function to filter tasks based on the button clicked
function filterTasks(filter) {
  fetchTasks().then(() => {
    const taskItems = document.querySelectorAll('#taskList li');
    taskItems.forEach(item => {
      const isCompleted = item.classList.contains('completed');
      const isDeleted = item.classList.contains('deleted');

      switch (filter) {
        case 'active':
          item.style.display = (!isCompleted && !isDeleted) ? 'flex' : 'none';
          break;
        case 'completed':
          item.style.display = isCompleted ? 'flex' : 'none';
          break;
        case 'history':
          item.style.display = isDeleted ? 'flex' : 'none';
          break;
        case 'all':
        default:
          item.style.display = 'flex'; // Show all tasks by default
          break;
      }
    });

    // Update active filter button styling
    document.querySelectorAll('.filter-btn').forEach(btn => {
      btn.classList.remove('active');
    });
    document.querySelector(`.filter-btn[onclick="filterTasks('${filter}')"]`).classList.add('active');
  });
}

// Display tasks in the task list
function displayTasks(tasks) {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = ''; // Clear existing tasks

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : 'active';
    li.innerHTML = `
      <div class="task-content">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion('${task._id}', this)">
        <span class="task-text">${task.task}</span>
      </div>
      <div class="task-actions">
        <button class="edit-btn" onclick="editTask('${task._id}')">✏️</button>
        <button class="delete-btn" onclick="deleteTask('${task._id}')">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Initialize the page by fetching tasks when it loads
document.addEventListener('DOMContentLoaded', () => {
  fetchTasks(); // Fetch tasks when the page loads
  filterTasks('all'); // Default to showing all tasks
});



// Event listeners
document.getElementById("addTaskBtn").addEventListener("click", showAddTaskModal);
document.getElementById("cancelTaskBtn").addEventListener("click", hideAddTaskModal);
document.getElementById("taskForm").addEventListener("submit", handleFormSubmit); // Form submission listener


