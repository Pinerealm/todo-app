const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector(".theme-icon");

const emptyState = document.createElement("p");
emptyState.className = "empty-state";
emptyState.textContent = "No todos yet. Add one above to get started.";

function renderEmptyState() {
  if (list.children.length === 0) {
    list.replaceChildren(emptyState);
    return;
  }

  if (emptyState.parentElement === list) {
    emptyState.remove();
  }
}

function createTodoItem(text) {
  const item = document.createElement("li");
  item.className = "todo-item";

  const label = document.createElement("span");
  label.className = "todo-text";
  label.textContent = text;
  label.addEventListener("click", () => {
    item.classList.toggle("completed");
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.addEventListener("click", () => {
    item.remove();
    renderEmptyState();
  });

  item.append(label, deleteButton);
  return item;
}

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const todoText = input.value.trim();
  if (todoText === "") {
    input.focus();
    return;
  }

  list.append(createTodoItem(todoText));
  input.value = "";
  input.focus();
  renderEmptyState();
});

renderEmptyState();

function loadTheme() {
  const savedTheme = localStorage.getItem("theme") || "light";
  document.documentElement.setAttribute("data-theme", savedTheme);
  updateThemeIcon(savedTheme);
}

function updateThemeIcon(theme) {
  themeIcon.textContent = theme === "dark" ? "☀️" : "🌙";
}

function toggleTheme() {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  const newTheme = currentTheme === "dark" ? "light" : "dark";
  
  document.documentElement.setAttribute("data-theme", newTheme);
  localStorage.setItem("theme", newTheme);
  updateThemeIcon(newTheme);
}

themeToggle.addEventListener("click", toggleTheme);

loadTheme();
