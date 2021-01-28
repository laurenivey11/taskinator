var formEl = document.querySelector("#task-form");
var tasksToDoEl = document.querySelector("#tasks-to-do");
var taskIdCounter = 0;
var pageContentEl = document.querySelector("#page-content");
var tasksInProgressEl = document.querySelector("#tasks-in-progress");
var tasksCompletedEl = document.querySelector("#tasks-completed");
var tasks = [];

var taskFormHandler = function (event) {
  event.preventDefault();
  var taskNameInput = document.querySelector("input[name='task-name']").value;
  var taskTypeInput = document.querySelector("select[name='task-type']").value;

    if (!taskNameInput || !taskTypeInput) {
        alert("You need to fill out the task form!");
        return false
    }

    formEl.reset();

  var isEdit = formEl.hasAttribute("data-task-id");
 
  if (isEdit) {
    var taskId = formEl.getAttribute("data-task-id");
    completeEditTask(taskNameInput, taskTypeInput, taskId);
  }
  else {
    var taskDataObj = {
      name: taskNameInput,
      type: taskTypeInput,
      status: "to do"
    }
  };

  createTaskEl(taskDataObj);

};

var createTaskEl = function(taskDataObj) {
  
    // create list item
  var listItemEl = document.createElement("li");
  listItemEl.className = "task-item";

  listItemEl.setAttribute("data-task-id", taskIdCounter);
  listItemEl.setAttribute("draggable", "true");

  // create div to hold task info and add to list item
  var taskInfoEl = document.createElement("div");
  taskInfoEl.className = "task-info";

  // add HTML content to div
  taskInfoEl.innerHTML = "<h3 class='task-name'>" + taskDataObj.name + "</h3><span class='task-type'>" + taskDataObj.type + "</span>";
  listItemEl.appendChild(taskInfoEl);

  var taskActionsEl = createTaskActions(taskIdCounter);
  listItemEl.appendChild(taskActionsEl);

  // add entire list item to list
  tasksToDoEl.appendChild(listItemEl); 
  
  taskDataObj.id = taskIdCounter;

  tasks.push(taskDataObj);

  saveTasks();

  taskIdCounter++;

};

var createTaskActions = function(taskId) {
  var actionContainerEl = document.createElement("div");
  actionContainerEl.className = "task-actions";

  var editButtonEl = document.createElement("button");
  editButtonEl.textContent = "Edit";
  editButtonEl.className = "btn edit-btn";
  editButtonEl.setAttribute("data-task-id", taskId)

  actionContainerEl.appendChild(editButtonEl);

  var deleteButtonEl = document.createElement("button");
  deleteButtonEl.textContent = "Delete";
  deleteButtonEl.className = "btn delete-btn";
  deleteButtonEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(deleteButtonEl);

  var statusSelectEl = document.createElement("select");
  statusSelectEl.className = "select-status";
  statusSelectEl.setAttribute("name", "status-change");
  statusSelectEl.setAttribute("data-task-id", taskId);

  actionContainerEl.appendChild(statusSelectEl);

  var statusChoices = ["To Do", "In Progress", "Completed"];

  for (var i = 0; i < statusChoices.length; i++) {
    var statusOptionEl = document.createElement("option");
    statusOptionEl.textContent = statusChoices[i];
    statusOptionEl.setAttribute("value", statusChoices[i]);

    statusSelectEl.appendChild(statusOptionEl);
  }

  return actionContainerEl;

};

formEl.addEventListener("submit", taskFormHandler);

var taskButtonHandler = function(event) {
  var targetEl = event.target

  if (targetEl.matches(".edit-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    editTask(taskId);
  }
  if (targetEl.matches(".delete-btn")) {
    var taskId = targetEl.getAttribute("data-task-id");
    deleteTask(taskId);
  }
};

var deleteTask = function(taskId) {
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  taskSelected.remove();

  saveTasks();
};

var editTask = function(taskId) {

  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

  var taskName = taskSelected.querySelector("h3.task-name").textContent;

  var taskType = taskSelected.querySelector("span.task-type").textContent;

  document.querySelector("input[name='task-name']").value = taskName;
  document.querySelector("select[name='task-type']").value = taskType;
  document.querySelector("#save-task").textContent = "Save Task";
  formEl.setAttribute("data-task-id", taskId);
};

var completeEditTask = function(taskName, taskType, taskId) {
  // find the matching task list item
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");

// set new values
  taskSelected.querySelector("h3.task-name").textContent = taskName;
  taskSelected.querySelector("span.task-type").textContent = taskType;

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
       tasks[i].name = taskName;
     tasks[i].type = taskType;
   }

   saveTasks();
};

alert("Task Updated!");

formEl.removeAttribute("data-task-id");
document.querySelector("#save-task").textContent = "Add Task";
};

var taskStatusChangeHandler = function(event) {
  var taskId = event.target.getAttribute("data-task-id");

  // get currently selected option's value and convert to lowercase (easier to sort and change)
  var statusValue = event.target.value.toLowerCase();

  // find the parent task element bases on ID
  var taskSelected = document.querySelector(".task-item[data-task-id='" + taskId + "']");
  
  if (statusValue === "to do") {
    tasksToDoEl.appendChild(taskSelected);
  } else if (statusValue === "in progress") {
    tasksInProgressEl.appendChild(taskSelected);
  } else if (statusValue === "completed") {
    tasksCompletedEl.appendChild(taskSelected);
  }

  for (var i = 0; i < tasks.length; i++) {
    if (tasks[i].id === parseInt(taskId)) {
      tasks[i].status = statusValue;
    }
  }
  console.log("hello");
  saveTasks();

};

var dragTaskHandler = function(event) {
  if (event.target.matches("li.task-item")) {
    var taskId = event.target.getAttribute("data-task-id");
    event.dataTransfer.setData("text/plain", taskId);
  }

};

var dropZoneDragHandler = function(event) {
  var taskListEl = event.target.closest(".task-list");
  if (taskListEl) {
    event.preventDefault();
  }

};

var dropTaskHandler = function(event) {
  var id = event.dataTransfer.getData("text/plain");
  var draggableElement = document.querySelector("[data-task-id='" + id + "']");
  var dropZoneEl = event.target.closest(".task-list");
  var statusType = dropZoneEl.id;

  var statusSelectEl = draggableElement.querySelector("select[name='status-change']");

  if (statusType === "tasks-to-do") {
    statusSelectEl.selectedIndex = 0;
  } 
  else if (statusType === "tasks-in-progress") {
    statusSelectEl.selectedIndex = 1;
  } 
  else if (statusType === "tasks-completed") {
    statusSelectEl.selectedIndex = 2;
  }

  dropZoneEl.appendChild(draggableElement);
};

var dragLeaveHandler = function(event) {
  var taskListEl = event.target.closest(".task-list");
  if (taskListEl) {
    taskListEl.removeAttribute("style");
  }

  saveTasks();
};


var saveTasks = function() {
  localStorage.setItem("tasks", JSON.stringify(tasks));
};

var loadTasks = function() {
  // get tasks from localStorage
  var savedTasks = localStorage.getItem("tasks");
  // convery tasks from string to array
  savedTasks = JSON.parse(savedTasks);
  //iterate througha tasks aarray and create tasks on the page
 
  for (var i = 0; i < savedTasks.length; i++) {
    createTaskEl(savedTasks[i]);
    savedTasks[i].id =taskIdCounter
    

    var listItemEl = document.createElement("li");
    listItemEl.className = "task-item";
  
    listItemEl.setAttribute("data-task-id", savedTasks[i].id);
    listItemEl.setAttribute("draggable", "true");

    var taskInfoEl = document.createElement("div");
    taskInfoEl.className = "task-info";

    taskInfoEl.innerHTML = "<h3 class='task-name'>" + savedTasks[i].name + "</h3><span class='task-type'>" + savedTasks[i].type + "</span>";
    listItemEl.appendChild(taskInfoEl);
  
    var taskActionsEl = createTaskActions(taskIdCounter);
    listItemEl.appendChild(taskActionsEl);
    console.log(listItemEl);

    if (savedTasks[i].status === "to do") {
      listItemEl.querySelector("select[name='status-change']").selectedIndex = 0;
      tasksToDoEl.appendChild(listItemEl);
    } else if (savedTasks[id].status === "in progress") {
      listItemEl.querySelector("select[name='status-change']").selectedIndex = 1;
      tasksInProgressEl.appendChild(listItemEl);
    } else if (savedTasks[id].status === "completed") {
      listItemEl.querySelector("select[name='status-change']").selectedIndex = 2;
      tasksCompletedEl.appendChild(listItemEl);
    }

    taskIdCounter++;

    console.log(listItemEl);
  }  

  





};


pageContentEl.addEventListener("click", taskButtonHandler);
pageContentEl.addEventListener("change", taskStatusChangeHandler);

pageContentEl.addEventListener("dragstart", dragTaskHandler);
pageContentEl.addEventListener("dragover", dropZoneDragHandler);
pageContentEl.addEventListener("drop", dropTaskHandler)
pageContentEl.addEventListener("dragleave", dragLeaveHandler);
loadTasks();