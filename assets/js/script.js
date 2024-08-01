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
  // use diff method to calculate date range (closeness to deadline)
  let dateRange = currentDate.diff(deadline, "day");
  let taskDeadlineColor;

  // assigns color based on date range (closeness to deadline)
  if (task.status !== "done") {
    if (dateRange > 0) {
      taskDeadlineColor = "past-due";
    } else if (dateRange > -4) {
      taskDeadlineColor = "due-soon";
    } else {
      taskDeadlineColor = "on-track";
    }
  } else {
    taskDeadlineColor = "on-track";
  }

  // creates div where card will be placed
  const cardBox = $("<div>");
  // adds jquery and boostrap css classes for card functionality
  cardBox.addClass(
    "card draggable mb-2 task-card " + taskDeadlineColor.toString()
  );
  // adds data attribute using unique id
  cardBox.attr("data-task-id", task.id);

  //creates div in card body, adds class to card body
  const cardBody = $("<div>");
  cardBody.addClass("card-body");

  // creates title element in card, adds class for card title, creates text for title
  const cardTitle = $("<h5>");
  cardTitle.addClass("card-title");
  cardTitle.text(task.title);

  // creates paragraph element in card, adds class for card text, creates text for task description
  const cardText = $("<p>");
  cardText.addClass("card-text");
  cardText.text(task.description);

  // creates second paragraph element in card, adds second class for card text, creates text for due date
  const cardDeadline = $("<p>");
  cardDeadline.addClass("card-text text-muted");
  cardDeadline.text(deadline.format("MM-DD-YYYY"));

  // creates button element in card, adds class for delete button, creates delete button
  const cardDeleteBtn = $("<button>");
  cardDeleteBtn.addClass("btn btn-sm btn-danger float-end delete-task");
  cardDeleteBtn.attr("data-task-id", task.id);
  cardDeleteBtn.text("Delete");

  // appends card title, card text, card deadline, card delete button, and card body
  cardBody.append(cardTitle);
  cardBody.append(cardText);
  cardBody.append(cardDeadline);
  cardBody.append(cardDeleteBtn);
  cardBox.append(cardBody);

  return cardBox;
}

// Todo: create a function to render the task list and make cards draggable
function renderTaskList() {
  // selects card div by id
  let todoEl = $("#todo-cards");
  let inprogressEl = $("#in-progress-cards");
  let doneEl = $("#done-cards");
  // empties out conent from task list to prepare for reload from local storage
  todoEl.empty();
  inprogressEl.empty();
  doneEl.empty();

  // for loop goes through task list in local storage
  for (let i = 0; i < taskList.length; i++) {
    const currentTask = taskList[i];
    const currentCard = createTaskCard(currentTask);

    // searches local storage by status, appends to corresponding lane
    if (currentTask.status === "done") {
      doneEl.append(currentCard);
    } else if (currentTask.status === "in-progress") {
      inprogressEl.append(currentCard);
    } else if (currentTask.status === "to-do") {
      todoEl.append(currentCard);
    }

    // creates event listener to delete card on click
    $(".delete-task").on("click", handleDeleteTask);

    // uses jquery, makes cards "draggable"
    $(".task-card").draggable({
      opacity: 0.7,
      zIndex: 100,
      helper: function (event) {
        eventTarget = $(event.target);
        const original = eventTarget.hasClass("ui-draggable")
          ? eventTarget
          : eventTarget.closest(".task-card");
        return original.clone().css({
          width: original.outerWidth(),
        });
      },
    });
  }
}

// Todo: create a function to handle adding a new task
function handleAddTask(event) {
  // prevents page from reloading
  event.preventDefault();
  // selects element by id, retrives user input values
  const taskTitle = $("#task-title").val();
  const taskDescription = $("#task-description").val();
  const taskDeadline = $("#task-deadline").val();

  // creates object with key values from user input
  const newTask = {
    // assigns task unique id
    id: generateTaskId(),
    title: taskTitle,
    description: taskDescription,
    deadline: taskDeadline,
    // must start in "to-do" status
    status: "to-do",
  };

  // adds new task on the end of array
  taskList.push(newTask);
  // makes current list of tasks into string for local storage
  localStorage.setItem("tasks", JSON.stringify(taskList));
  // makes current unique id into string for local storage
  localStorage.setItem("nextId", JSON.stringify(nextId));

  // selects modal by id, modal method "hides" modal
  $("#formModal").modal("hide");
  // calls function that loads tasks into lanes
  renderTaskList();
}

// Todo: create a function to handle deleting a task
function handleDeleteTask(event) {
  const taskDeleteBtn = $(event.currentTarget);
  const taskId = taskDeleteBtn.data("task-id");
  console.log(taskId);

  const deletedTaskIndex = taskList.findIndex(
    (task) => task.id === parseInt(taskId)
  );
  if (deletedTaskIndex !== -1) {
    taskList.splice(deletedTaskIndex, 1);
    localStorage.setItem("tasks", JSON.stringify(taskList));
    renderTaskList();
    taskDeleteBtn.closest(".task-card").remove();
  }
}

// Todo: create a function to handle dropping a task into a new status lane
function handleDrop(event, ui) {
  const taskId = ui.draggable.data("task-id");
  const dropLaneTarget = $(event.target).closest(".lane").attr("id");

  const droppedTask = taskList.find((task) => task.id === taskId);
  droppedTask.status = dropLaneTarget;

  localStorage.setItem("tasks", JSON.stringify(taskList));
  renderTaskList();
}

// Todo: when the page loads, render the task list, add event listeners, make lanes droppable, and make the due date field a date picker
$(document).ready(function () {
  renderTaskList();
  $(".lane").droppable({
    accept: ".task-card",
    drop: handleDrop,
  });
  $("#newTaskForm").on("submit", handleAddTask);
});
