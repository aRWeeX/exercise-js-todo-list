/**
 * Task List Manager
 * - Allows users to add, reorder, and delete tasks.
 * - Uses localStorage to persist tasks across sessions.
 */

// Retrieve existing tasks from localStorage or initialize an empty object
const taskListStr = localStorage.getItem("taskList");
const taskListObj = taskListStr ? JSON.parse(taskListStr) : {};

/**
 * Check if an object is empty (has no keys).
 * @param {Object} obj - The object to check.
 * @returns {boolean} True if the object is empty, otherwise false.
 */
function isEmpty(obj) {
  return Object.keys(obj).length === 0;
}

// Populate the task list UI with tasks stored in localStorage
function readInTodoList() {
  const todoList = document.querySelector(".todo-list");

  // Clear the existing list before repopulating
  todoList.children[0].innerHTML = "";

  // Loop through tasks and add them to the list
  if (!isEmpty(taskListObj)) {
    for (const key in taskListObj) {
      todoList.children[0].insertAdjacentHTML(
        "beforeend",
        `
        <li>
          <p>${taskListObj[key]}</p>
          <div>
            <!-- Icons for task actions: move up, move down, and delete -->
            <span class="material-symbols-outlined">arrow_upward</span>
            <span class="material-symbols-outlined">arrow_downward</span>
            <span class="material-symbols-outlined">close</span>
          </div>
        </li>
        `
      );
    }
  }
}

// Ensure the task list is read in once the DOM is fully loaded
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", readInTodoList);
} else {
  readInTodoList();
}

// Form elements for adding tasks
const form = document.querySelector("form");
const input = document.getElementById("task");

// Handle form submission to add a new task
form.addEventListener("submit", (event) => {
  event.preventDefault();

  // Get the task input and validate it
  const task = input.value.trim();

  if (!task) {
    alert("Task cannot be empty!");
    return;
  }

  // Add the task to the taskListObj with a unique key
  const index = Object.keys(taskListObj).length;
  taskListObj[`task${index}`] = task;

  // Update localStorage and re-render the list
  localStorage.setItem("taskList", JSON.stringify(taskListObj));
  readInTodoList();

  // Clear the input field after adding the task
  input.value = "";
});

// Clear all tasks from the list and localStorage
function clearList() {
  if (confirm("Are you sure you want to clear the list?")) {
    // Clear localStorage and reset the taskListObj
    localStorage.clear();
    Object.keys(taskListObj).forEach((key) => delete taskListObj[key]);

    // Re-render the empty list
    readInTodoList();
  }
}

// Task list container element
const todoListContainer = document.querySelector(".todo-list > ul");

// Update localStorage after changes to the task list
function updateTodoList() {
  // Collect all tasks currently displayed in the list
  const elements = todoListContainer.querySelectorAll("li > p");
  const updatedTaskListObj = {};

  // Update taskListObj with the current task order and content
  elements.forEach((task, index) => {
    updatedTaskListObj[`task${index}`] = task.innerText;
  });

  // Replace taskListObj content and sync with localStorage
  Object.keys(taskListObj).forEach((key) => delete taskListObj[key]);
  Object.assign(taskListObj, updatedTaskListObj);
  localStorage.setItem("taskList", JSON.stringify(taskListObj));
}

// Handle task actions: move up, move down, or delete
todoListContainer.addEventListener("click", (event) => {
  const liElement = event.target.closest("li");

  // Move task up in the list
  if (
    event.target.innerText === "arrow_upward" &&
    liElement.previousElementSibling
  ) {
    todoListContainer.insertBefore(liElement, liElement.previousElementSibling);
    updateTodoList();

    // Move task down in the list
  } else if (
    event.target.innerText === "arrow_downward" &&
    liElement.nextElementSibling
  ) {
    todoListContainer.insertBefore(liElement.nextElementSibling, liElement);
    updateTodoList();

    // Remove the task from the list
  } else if (event.target.innerText === "close") {
    liElement.remove();
    updateTodoList();
  }
});
