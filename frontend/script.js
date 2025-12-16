const API = "http://127.0.0.1:8000";

const list = document.getElementById("list");
const input = document.getElementById("input");
const addBtn = document.getElementById("addBtn");
const stats = document.getElementById("stats");
const empty = document.getElementById("empty");
const confirmDelete = document.getElementById("confirmDelete");

/* ===== 设置持久化 ===== */
confirmDelete.checked =
  localStorage.getItem("confirmDelete") === "true";

confirmDelete.onchange = () => {
  localStorage.setItem("confirmDelete", confirmDelete.checked);
};

addBtn.onclick = addTodo;
input.onkeyup = e => e.key === "Enter" && addTodo();

loadTodos();

/* ===== 主加载 ===== */
function loadTodos() {
  fetch(API + "/todos")
    .then(r => r.json())
    .then(todos => {
      renderStats(todos);
      renderList(todos);
    });
}

/* ===== 统计 ===== */
function renderStats(todos) {
  const total = todos.length;
  const done = todos.filter(t => t.done).length;
  stats.textContent =
    `共 ${total} 个任务 · 已完成 ${done} · 待完成 ${total - done}`;
}

/* ===== 列表渲染 ===== */
function renderList(todos) {
  list.innerHTML = "";
  empty.style.display = todos.length ? "none" : "block";

  todos.forEach(todo => {
    const li = document.createElement("li");
    li.dataset.id = todo.id;
    li.className = todo.done ? "done" : "";

    li.innerHTML = `
      <div class="left">
        <input type="checkbox" ${todo.done ? "checked" : ""}>
        <span class="text">${todo.title}</span>
      </div>
      <button>删除</button>
    `;

    li.querySelector("input").onchange = e =>
      toggleDone(todo.id, e.target.checked);

    li.querySelector("button").onclick = e =>
      deleteTodo(todo.id, e);

    list.appendChild(li);
  });
}

/* ===== 添加 ===== */
function addTodo() {
  const title = input.value.trim();
  if (!title) return alert("任务不能为空");

  fetch(API + "/todos", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ title })
  }).then(() => {
    input.value = "";
    loadTodos();
  });
}

/* ===== 删除 ===== */
function deleteTodo(id, e) {
  if (confirmDelete.checked && !confirm("确定删除吗？")) return;

  const li = e.target.closest("li");
  li.style.opacity = 0;
  li.style.transform = "translateX(80px)";

  setTimeout(() => {
    fetch(API + "/todos/" + id, { method: "DELETE" })
      .then(loadTodos);
  }, 300);
}

/* ===== 完成切换 ===== */
function toggleDone(id, done) {
  fetch(API + "/todos/" + id, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ done: done ? 1 : 0 })
  }).then(loadTodos);
}
