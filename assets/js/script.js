// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  const taskTitle = $("#task-title").val();
  const taskDescription = $("#task-description").val();
  const taskDeadline = $("#task-deadline").val();

  console.log("Got the info!");
  const newTask = {
    id: generateTaskId(),
    title: taskTitle,
    description: taskDescription,
    deadline: taskDeadline,
    status: "todo",
  };

  taskList.push(newTask);
  localStorage.setItem("tasks", JSON.stringify(taskList));
  localStorage.setItem("nextId", JSON.stringify(nextId));

  $("#formModal").modal("hide");
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  $("#newTaskForm").on("submit", handleAddTask);
});

// modal
// const formModal = document.getElementById("formModal");
// if (formModal) {
//   formModal.addEventListener("show.bs.modal", (event) => {
//     modalBodyInput.value = recipient;
//   });
// }
