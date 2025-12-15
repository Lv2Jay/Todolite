const API = "http://127.0.0.1:8000";
const list = document.getElementById("list");
const confirmCheckbox = document.getElementById("confirmDelete");

// 渲染任务
function loadTodos() {
  fetch(API + "/todos")
    .then(res => res.json())
    .then(data => {
      const existingIds = Array.from(list.children).map(li => Number(li.dataset.id));
      const newIds = data.map(item => item.id);

      // 删除已经不存在的任务元素
      existingIds.forEach(id => {
        if (!newIds.includes(id)) {
          const li = list.querySelector(`li[data-id='${id}']`);
          if (li) li.remove();
        }
      });

      // 添加或更新任务
      data.forEach(item => {
        let li = list.querySelector(`li[data-id='${item.id}']`);
        if (!li) {
          // 新增任务元素
          li = document.createElement("li");
          li.dataset.id = item.id;
          li.style.opacity = 0;
          li.style.transform = "translateY(-10px)";
          list.appendChild(li);

          // 滑入动画
          setTimeout(() => {
            li.style.transition = "all 0.3s ease";
            li.style.opacity = 1;
            li.style.transform = "translateY(0)";
          }, 50);
        }

        li.className = item.done ? "done" : "";
        li.innerHTML = `
          <span>
            <input type="checkbox" ${item.done ? "checked" : ""} onclick="toggleDone(${item.id}, this.checked)">
            ${item.title}
          </span>
          <button onclick="deleteTodo(${item.id}, event)">删除</button>
        `;
      });
    });
}

// 添加任务
function addTodo() {
  const input = document.getElementById("input");
  const title = input.value.trim();
  if (!title) {
    alert("任务不能为空！");
    return;
  }

  fetch(API + "/todos?title=" + encodeURIComponent(title), { method: "POST" })
    .then(() => {
      input.value = "";
      loadTodos();
    });
}

// 删除任务
function deleteTodo(id, event) {
  const needConfirm = confirmCheckbox.checked;
  if (needConfirm && !confirm("确定删除吗？")) return;

  const li = event.target.closest("li");

  // 删除动画
  li.style.opacity = 0;
  li.style.transform = "translateX(100%)";
  setTimeout(() => {
    fetch(API + "/todos/" + id, { method: "DELETE" })
      .then(() => li.remove());
  }, 300);
}

// 切换完成状态
function toggleDone(id, done) {
  fetch(API + "/todos/" + id + "?done=" + (done ? 1 : 0), { method: "PUT" })
    .then(() => {
      const li = list.querySelector(`li[data-id='${id}']`);
      if (li) li.className = done ? "done" : "";
    });
}

// 回车添加
document.getElementById("input").addEventListener("keyup", function(e) {
  if (e.key === "Enter") addTodo();
});

// 初始加载
loadTodos();
