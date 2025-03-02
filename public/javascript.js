
//show or hide the addtask model
function showAddTaskModal() {
    document.getElementById("addTaskModal").style.display = "block";
  }
  
  function hideAddTaskModal() {
    document.getElementById("addTaskModal").style.display = "none";
  }

  
// Event listeners
document.getElementById("addTaskBtn").addEventListener("click", showAddTaskModal);
document.getElementById("cancelTaskBtn").addEventListener("click", hideAddTaskModal);
document.getElementById("addTaskModalBtn").addEventListener("click", hideAddTaskModal); // Temporarily just hides the modal
document.getElementById("searchInput").addEventListener("keypress", function (e) {
  if (e.key === "Enter") {
    // Optionally, trigger search functionality here (to be implemented)
    console.log("Search pressed:", document.getElementById("searchInput").value);
  }
});