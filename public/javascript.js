// Function to show the add task modal
function showAddTaskModal() {
  document.getElementById("addTaskModal").style.display = "block";
}

// Function to hide the add task modal
function hideAddTaskModal() {
  document.getElementById("addTaskModal").style.display = "none";
}

// Handle form submission for adding a new task
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

      // Dynamically add the new task to the DOM
      addTaskToDOM(task);

      hideAddTaskModal(); // Close the modal
    } else {
      const errorData = await response.json(); // Parse the error response
      console.error('Failed to add task:', errorData);
      alert(`Failed to add task: ${errorData.message}`);
    }
  } catch (error) {
    console.error('Error:', error);
    alert("An error occurred. Please try again.");
  }
}

// Function to add the task to the DOM
function addTaskToDOM(task) {
  const taskList = document.getElementById('taskList');
  const li = document.createElement('li');
  li.className = task.completed ? 'completed' : 'active';
  li.id = `task-${task._id}`; // Add an ID to each task item
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
}

// Function to fetch all tasks from the backend
async function fetchTasks(filter = 'all') {
  let url = 'http://localhost:5000/api/tasks'; // Default fetch all tasks

  if (filter === 'history') {
    url = 'http://localhost:5000/api/tasks/history'; // Fetch only deleted tasks
  }

  try {
    const response = await fetch(url);
    if (response.ok) {
      const tasks = await response.json();
      displayTasks(tasks); // Display tasks based on the filter
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

    // Reapply search filter after filtering by buttons
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    if (searchTerm) {
      searchTasks(searchTerm);
    }
  });
}

// Function to search tasks based on search input
function searchTasks(searchTerm) {
  fetchTasks().then(() => {
    const taskItems = document.querySelectorAll('#taskList li');
    const lowercasedSearch = searchTerm.toLowerCase().trim();

    taskItems.forEach(item => {
      const taskText = item.querySelector('.task-text').textContent.toLowerCase();
      const taskDescription = item.dataset.description || ''; // Search descriptions too

      // Show task if search term matches title or description
      const matches = taskText.includes(lowercasedSearch) || taskDescription.includes(lowercasedSearch);
      item.style.display = matches ? 'flex' : 'none';
    });
  });
}

// Function to show the delete confirmation modal
function showConfirmDeleteModal(taskId) {
  const modal = document.getElementById('confirmDeleteModal');
  modal.style.display = 'block';
  modal.classList.add('show');
  modal.dataset.taskId = taskId;
}

// Function to hide the delete confirmation modal
function hideConfirmDeleteModal() {
  const modal = document.getElementById('confirmDeleteModal');
  modal.classList.remove('show');
  modal.style.display = 'none';
  modal.dataset.taskId = '';
}

// Function to "visually delete" a task (remove from DOM without database change)
function deleteTask(taskId) {
  // Show the confirmation modal instead of the native confirm dialog
  showConfirmDeleteModal(taskId);
}

// Add event listeners for the confirmation modal buttons
document.addEventListener('DOMContentLoaded', () => {
  const confirmDeleteBtn = document.getElementById('confirmDeleteBtn');
  const cancelDeleteBtn = document.getElementById('cancelDeleteBtn');

  // Search input event listener for real-time filtering
  const searchInput = document.getElementById('searchInput');
  searchInput.addEventListener('input', (e) => {
    searchTasks(e.target.value);
  });

  confirmDeleteBtn.addEventListener('click', () => {
    const taskId = document.getElementById('confirmDeleteModal').dataset.taskId;
    if (!taskId) return;

    // Remove the task from the DOM immediately
    const taskItem = document.querySelector(`#task-${taskId}`);
    if (taskItem) {
      taskItem.remove(); // Remove the task element from the DOM
    }

    // Hide the modal immediately after "deleting"
    hideConfirmDeleteModal();

    // Optionally show a notification
    alert("Task removed from view!");
  });

  cancelDeleteBtn.addEventListener('click', () => {
    hideConfirmDeleteModal();
  });

  fetchTasks(); // Fetch tasks when the page loads
  filterTasks('active'); // Default to showing active tasks
});

// Function to display tasks in the task list (updated)
function displayTasks(tasks) {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = ''; // Clear existing tasks

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : 'active';
    if (task.deleted) li.className += ' deleted';

    // Store description in a data attribute for search
    li.dataset.description = task.description || '';

    // Format dates
    const createdDate = new Date(task.createdAt).toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    });
    const completedDate = task.completedAt ? new Date(task.completedAt).toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }) : null;
    const deletedDate = task.deletedAt ? new Date(task.deletedAt).toLocaleDateString('en-US', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric' 
    }) : null;

    li.id = `task-${task._id}`; // Ensure each task has a unique ID
    li.innerHTML = `
      <div class="task-content">
        <input type="checkbox" ${task.completed ? 'checked' : ''} onchange="toggleTaskCompletion('${task._id}', this)">
        <div class="task-details">
          <span class="task-text">${task.task}</span>
          <span class="task-dates">
            Created: ${createdDate}${completedDate ? ` | Completed: ${completedDate}` : ''}${deletedDate ? ` | Deleted: ${deletedDate}` : ''}
          </span>
        </div>
      </div>
      <div class="task-actions">
        <button class="edit-btn" onclick="editTask('${task._id}')">✏️</button>
        <button class="delete-btn" onclick="deleteTask('${task._id}')">🗑️</button>
      </div>
    `;
    taskList.appendChild(li);
  });
}

// Function to toggle task completion
async function toggleTaskCompletion(taskId, checkbox) {
  const completed = checkbox.checked; // Get the checkbox status (true or false)

  try {
    // Send a PATCH request to update the task's completion status
    const response = await fetch(`http://localhost:5000/api/tasks/${taskId}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ completed }),
    });

    if (response.ok) {
      const updatedTask = await response.json();
      console.log('Task updated:', updatedTask);

      // Find the task item in the DOM by its ID
      const taskItem = document.querySelector(`#task-${taskId}`);
      
      // Update the task's status in the DOM
      if (completed) {
        taskItem.classList.add('completed');
      } else {
        taskItem.classList.remove('completed');
      }

      // Show success message
      alert("Status updated");

    } else {
      // Log the response status code if something goes wrong
      console.error('Failed to update task. Response status:', response.status);
      const errorData = await response.json(); // Parse the error response
      console.error('Error details:', errorData);
      alert("Failed to update task. Please try again.");
    }
  } catch (error) {
    console.error('Error updating task:', error);
    alert('An error occurred while updating the task. Please try again.');
  }
}

// Event listeners
document.getElementById("addTaskBtn").addEventListener("click", showAddTaskModal);
document.getElementById("cancelTaskBtn").addEventListener("click", hideAddTaskModal);
document.getElementById("taskForm").addEventListener("submit", handleFormSubmit);