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
    const response = await fetch('https://todolist-app-39zk.onrender.com/api/tasks', {
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
      alert(`Failed to add task: ${errorData.message}`); // Show detailed error message
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
  let url = 'https://todolist-app-39zk.onrender.com/api/tasks'; // Default fetch all tasks

  if (filter === 'history') {
    url = 'https://todolist-app-39zk.onrender.com/api/tasks/history'; // Fetch only deleted tasks
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
          item.style.display =  (isCompleted && !isDeleted) ? 'flex' : 'none';
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
    }s
  });
}

// Function to search tasks based on search input, respecting the current filter
function searchTasks(searchTerm) {
  fetchTasks().then(() => {
    const taskItems = document.querySelectorAll('#taskList li');
    const lowercasedSearch = searchTerm.toLowerCase().trim();
    const activeFilter = document.querySelector('.filter-btn.active')?.getAttribute('onclick')?.match(/filterTasks\('([^']+)'\)/)?.[1] || 'all';

    taskItems.forEach(item => {
      const taskText = item.querySelector('.task-text').textContent.toLowerCase();
      const taskDescription = item.dataset.description || ''; // Search descriptions too
      const isCompleted = item.classList.contains('completed');
      const isDeleted = item.classList.contains('deleted');

      // Determine if the task should be shown based on the current filter and search term
      let shouldShow = false;
      switch (activeFilter) {
        case 'active':
          shouldShow = (!isCompleted && !isDeleted) && (taskText.includes(lowercasedSearch) || taskDescription.includes(lowercasedSearch));
          break;
        case 'completed':
          shouldShow = isCompleted && (taskText.includes(lowercasedSearch) || taskDescription.includes(lowercasedSearch));
          break;
        case 'history':
          shouldShow = isDeleted && (taskText.includes(lowercasedSearch) || taskDescription.includes(lowercasedSearch));
          break;
        case 'all':
        default:
          shouldShow = (taskText.includes(lowercasedSearch) || taskDescription.includes(lowercasedSearch));
          break;
      }

      item.style.display = shouldShow ? 'flex' : 'none';
    });
  });
}




// Function to delete a task (soft delete)

function showConfirmDeleteModal(taskId) {
  const modal = document.getElementById('confirmDeleteModal');
  modal.style.display = 'block'; // Make sure it's visible
  modal.classList.add('show');
  modal.dataset.taskId = taskId;
}

function hideConfirmDeleteModal() {
  const modal = document.getElementById('confirmDeleteModal');
  modal.classList.remove('show');
  modal.style.display = 'none'; // Hide it
  modal.dataset.taskId = '';
}

// Function to delete a task (soft delete) with confirmation modal
async function deleteTask(taskId) {
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
  

  confirmDeleteBtn.addEventListener('click', async () => {
    const taskId = document.getElementById('confirmDeleteModal').dataset.taskId;
    if (!taskId) return;

    try {
      // Send a PATCH request to update the deleted status of the task
      const response = await fetch(`https://todolist-app-39zk.onrender.com/api/tasks/${taskId}/delete`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const deletedTask = await response.json();
        console.log('Task deleted:', deletedTask);

        // Update the task in the DOM
        const taskItem = document.querySelector(`#task-${taskId}`);
        taskItem.classList.add('deleted'); // Mark it as deleted visually
        taskItem.querySelector('.task-actions').style.display = 'none'; // Hide actions for deleted tasks

        // Hide the modal
        hideConfirmDeleteModal(); // Ensure the modal is hidden after deletion

        // Optionally show a notification
        // alert("Task deleted!");
      } else {
        const errorData = await response.json(); // Parse the error response
        console.error('Failed to delete task:', errorData);
        // alert("Failed to delete task. Please try again.");
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      // alert('An error occurred while deleting the task. Please try again.');
    }
  });

  cancelDeleteBtn.addEventListener('click', () => {
    hideConfirmDeleteModal(); // Hide modal if user cancels
  });
});


// Function to display tasks in the task list (updated)
function displayTasks(tasks) {
  const taskList = document.getElementById('taskList');
  taskList.innerHTML = ''; // Clear existing tasks

  tasks.forEach(task => {
    const li = document.createElement('li');
    li.className = task.completed ? 'completed' : 'active';
    if (task.deleted) li.className += ' deleted';

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


// Initialize the page by fetching tasks when it loads
document.addEventListener('DOMContentLoaded', () => {
  fetchTasks(); // Fetch tasks when the page loads
  filterTasks('active'); // Default to showing active tasks
});



// Function to toggle task completion
async function toggleTaskCompletion(taskId, checkbox) {
  const completed = checkbox.checked; // Get the checkbox status (true or false)

  try {
    // Send a PATCH request to update the task's completion status
    const response = await fetch(`https://todolist-app-39zk.onrender.com/api/tasks/${taskId}`, {
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
document.getElementById("taskForm").addEventListener("submit", handleFormSubmit); // Form submission listener
