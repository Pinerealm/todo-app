const form = document.querySelector("#todo-form");
const input = document.querySelector("#todo-input");
const list = document.querySelector("#todo-list");
const themeToggle = document.querySelector("#theme-toggle");
const themeIcon = document.querySelector(".theme-icon");
const progressSection = document.querySelector("#progress-section");
const progressFill = document.querySelector("#progress-fill");
const progressLabel = document.querySelector("#progress-label");
const progressPct = document.querySelector("#progress-pct");
const progressBar = document.querySelector("#progress-bar-wrap");
const filterBar = document.querySelector("#filter-bar");
const filterBtns = document.querySelectorAll(".filter-btn");

let currentFilter = "all";

// ── Empty state ───────────────────────────────────────────
const emptyState = document.createElement("p");
emptyState.className = "empty-state";
emptyState.innerHTML =
  '<span class="empty-state-icon" aria-hidden="true">✅</span>No tasks yet. Add one above to get started.';

function getTodoItems() {
  return [...list.querySelectorAll(".todo-item")];
}

function updateProgress() {
  const all = getTodoItems();
  const total = all.length;
  const done = all.filter((item) => item.classList.contains("completed")).length;

  if (total === 0) {
    progressSection.hidden = true;
    filterBar.hidden = true;
    return;
  }

  progressSection.hidden = false;
  filterBar.hidden = false;

  const pct = Math.round((done / total) * 100);
  progressFill.style.width = `${pct}%`;
  progressLabel.textContent = `${done} of ${total} done`;
  progressPct.textContent = `${pct}%`;
  progressBar.setAttribute("aria-valuenow", pct);
}

function applyFilter() {
  getTodoItems().forEach((item) => {
    const isCompleted = item.classList.contains("completed");
    item.hidden = !(
      currentFilter === "all" ||
      (currentFilter === "active" && !isCompleted) ||
      (currentFilter === "completed" && isCompleted)
    );
  });
}

function renderEmptyState() {
  updateProgress();

  if (getTodoItems().length === 0) {
    list.replaceChildren(emptyState);
    return;
  }

  if (emptyState.parentElement === list) {
    emptyState.remove();
  }

  applyFilter();
}

// ── Create todo item ──────────────────────────────────────
function createTodoItem(text) {
  const item = document.createElement("li");
  item.className = "todo-item";

  const checkbox = document.createElement("input");
  checkbox.type = "checkbox";
  checkbox.className = "todo-checkbox";
  checkbox.setAttribute("aria-label", `Mark "${text}" as complete`);
  checkbox.addEventListener("change", () => {
    item.classList.toggle("completed", checkbox.checked);
    applyFilter();
    updateProgress();
  });

  const label = document.createElement("span");
  label.className = "todo-text";
  label.textContent = text;
  label.addEventListener("click", () => {
    checkbox.click();
  });

  const deleteButton = document.createElement("button");
  deleteButton.type = "button";
  deleteButton.className = "delete-button";
  deleteButton.textContent = "Delete";
  deleteButton.setAttribute("aria-label", `Delete "${text}"`);
  deleteButton.addEventListener("click", () => {
    item.classList.add("removing");
    item.addEventListener(
      "animationend",
      () => {
        item.remove();
        renderEmptyState();
      },
      { once: true },
    );
  });

  item.append(checkbox, label, deleteButton);
  return item;
}

// ── Submit ────────────────────────────────────────────────
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

// ── Filters ───────────────────────────────────────────────
filterBtns.forEach((btn) => {
  btn.addEventListener("click", () => {
    currentFilter = btn.dataset.filter;
    filterBtns.forEach((b) => b.classList.remove("active"));
    btn.classList.add("active");
    applyFilter();
  });
});

// ── Init ──────────────────────────────────────────────────
renderEmptyState();

// ── Theme ─────────────────────────────────────────────────
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
