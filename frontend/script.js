const API = "http://127.0.0.1:8000";

const list = document.getElementById("list");
const input = document.getElementById("input");
const addBtn = document.getElementById("addBtn");
const confirmDelete = document.getElementById("confirmDelete");

/* ===== 初始化 ===== */
loadTodos();

/* ===== 事件 ===== */
addBtn.onclick = addTodo;
input.addEventListener("keyup", e => e.key === "Enter" && addTodo());

/* ===== 加载任务（局部更新，不闪） ===== */
function loadTodos() {
  fetch(API + "/todos")
    .then(res => res.json())
    .then(todos => {
      const existing = [...list.children].map(li => +li.dataset.id);
      const incoming = todos.map(t => t.id);

      // 删除不存在的
      existing.forEach(id => {
        if (!incoming.includes(id)) {
          list.querySelector(`[data-id='${id}']`)?.remove();
        }
      });

      // 新增或更新
      todos.forEach(todo => {
        let li = list.querySelector(`[data-id='${todo.id}']`);
        if (!li) {
          li = createTodoItem(todo);
          list.appendChild(li);

          // 入场动画
          li.style.opacity = 0;
          li.style.transform = "translateY(-10px)";
          requestAnimationFrame(() => {
            li.style.opacity = 1;
            li.style.transform = "translateY(0)";
          });
        } else {
          updateTodoItem(li, todo);
        }
      });
    });
}

/* ===== 创建 Todo ===== */
function createTodoItem(todo) {
  const li = document.createElement("li");
  li.dataset.id = todo.id;

  li.innerHTML = `
    <div class="left">
      <input type="checkbox" />
      <span class="text"></span>
    </div>
    <button>删除</button>
  `;

  li.querySelector("input").onchange = e =>
    toggleDone(todo.id, e.target.checked);

  li.querySelector("button").onclick = e =>
    deleteTodo(todo.id, e);

  updateTodoItem(li, todo);
  return li;
}

/* ===== 更新 Todo ===== */
function updateTodoItem(li, todo) {
  li.className = todo.done ? "done" : "";
  li.querySelector(".text").textContent = todo.title;
  li.querySelector("input").checked = !!todo.done;
}

/* ===== 添加 ===== */
function addTodo() {
  const title = input.value.trim();
  if (!title) return alert("任务不能为空");

  fetch(API + "/todos?title=" + encodeURIComponent(title), {
    method: "POST"
  }).then(() => {
    input.value = "";
    loadTodos();
  });
}

/* ===== 删除 ===== */
function deleteTodo(id, event) {
  if (confirmDelete.checked && !confirm("确定删除该任务吗？")) return;

  const li = event.target.closest("li");
  li.style.opacity = 0;
  li.style.transform = "translateX(80px)";

  setTimeout(() => {
    fetch(API + "/todos/" + id, { method: "DELETE" })
      .then(() => li.remove());
  }, 300);
}

/* ===== 切换完成 ===== */
function toggleDone(id, done) {
  fetch(API + `/todos/${id}?done=${done ? 1 : 0}`, {
    method: "PUT"
  }).then(loadTodos);
}
