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
    const response = await fetch('http://localhost:5000/api/tasks', { // Update the URL here
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

// Event listeners
document.getElementById("addTaskBtn").addEventListener("click", showAddTaskModal);
document.getElementById("cancelTaskBtn").addEventListener("click", hideAddTaskModal);
document.getElementById("taskForm").addEventListener("submit", handleFormSubmit); // Form submission listener


