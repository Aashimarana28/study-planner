const taskInput = document.getElementById("taskInput");
const addButton = document.getElementById("addButton");
const taskList = document.getElementById("taskList");
const emptyMessage = document.getElementById("emptyMessage");
const clearButton = document.getElementById("clearButton");

let tasks = JSON.parse(localStorage.getItem("studyPlannerTasks") || "[]");

function saveTasks() {
  localStorage.setItem("studyPlannerTasks", JSON.stringify(tasks));
}

function updateSummary() {
  const completed = tasks.filter(task => task.completed).length;
  document.getElementById("totalCount").textContent = tasks.length;
  document.getElementById("doneCount").textContent = completed;
  document.getElementById("remainingCount").textContent = tasks.length - completed;
  emptyMessage.hidden = tasks.length > 0;
}

function renderTasks() {
  taskList.innerHTML = "";

  tasks.forEach(task => {
    const item = document.createElement("li");
    item.className = `task-item${task.completed ? " completed" : ""}`;

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.checked = task.completed;
    checkbox.setAttribute("aria-label", `Mark ${task.text} as completed`);
    checkbox.addEventListener("change", () => {
      task.completed = checkbox.checked;
      saveTasks();
      renderTasks();
    });

    const text = document.createElement("span");
    text.className = "task-text";
    text.textContent = task.text;

    const removeButton = document.createElement("button");
    removeButton.className = "delete-button";
    removeButton.textContent = "Delete";
    removeButton.addEventListener("click", () => {
      tasks = tasks.filter(item => item.id !== task.id);
      saveTasks();
      renderTasks();
    });

    item.append(checkbox, text, removeButton);
    taskList.appendChild(item);
  });

  updateSummary();
}

function addTask() {
  const text = taskInput.value.trim();
  if (!text) {
    taskInput.focus();
    return;
  }

  tasks.push({ id: Date.now(), text, completed: false });
  taskInput.value = "";
  saveTasks();
  renderTasks();
  taskInput.focus();
}

addButton.addEventListener("click", addTask);
taskInput.addEventListener("keydown", event => {
  if (event.key === "Enter") addTask();
});
clearButton.addEventListener("click", () => {
  tasks = tasks.filter(task => !task.completed);
  saveTasks();
  renderTasks();
});

renderTasks();
