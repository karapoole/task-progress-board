// Retrieve tasks and nextId from localStorage
let taskList = JSON.parse(localStorage.getItem("tasks")) || [];
let nextId = JSON.parse(localStorage.getItem("nextId")) || 0;

// Todo: create a function to generate a unique task id
function generateTaskId() {
  return nextId++;
}

// Todo: create a function to create a task card
function createTaskCard(task) {
  let deadline = dayjs(task.deadline);
  let currentDate = dayjs();

  const cardBox = $("<div>");
  cardBox.addClass("card draggable mb-2 task-card ${taskDeadlineColor}");
  cardBox.attr("data-id", "${task.id}");
  const cardBody = $("<div>");
  cardBody.addClass("card-body");
  const cardTitle = $("<h5>");
  cardTitle.addClass("card-title");
  const cardText = $("<p>");
  cardText.addClass("card-text");
  const cardDeadline = $("<p>");
  cardDeadline.addClass("card-text text-muted");
  const cardDeleteBtn = $("<button>");
  cardDeleteBtn.addClass("btn btn-sm btn-danger float-end delete-task");
  cardDeleteBtn.attr("${task.id}");
  cardBody.append(cardTitle);
  cardBody.append(cardText);
  cardBody.append(cardDeadline);
  cardBody.append(cardDeleteBtn);
  cardBox.append(cardBody);
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  $("#to-do .droppable").empty();
  $("#in-progress .droppable").empty();
  $("#done .droppable").empty();

  for (let i = 0; i > taskList.length; i++) {
    const currentTask = taskList[i];
    const currentCard = createTaskCard(currentTask);
  }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  event.preventDefault();
  const taskTitle = $("#task-title").val();
  const taskDescription = $("#task-description").val();
  const taskDeadline = $("#task-deadline").val();

  const newTask = {
    id: generateTaskId(),
    title: taskTitle,
    description: taskDescription,
    deadline: taskDeadline,
    status: "to-do",
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
