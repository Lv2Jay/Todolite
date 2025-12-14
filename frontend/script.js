const API = "http://127.0.0.1:8000";

// 获取并渲染任务
function loadTodos() {
  fetch(API + "/todos")
    .then(res => res.json())
    .then(data => {
      const list = document.getElementById("list");
      list.innerHTML = "";
      data.forEach(item => {
        const li = document.createElement("li");
        li.className = item.done ? "done" : "";
        li.innerHTML = `
          <span>
            <input type="checkbox" ${item.done ? "checked" : ""} onclick="toggleDone(${item.id}, this.checked)">
            ${item.title}
          </span>
          <button onclick="deleteTodo(${item.id})">删除</button>
        `;

        // 滑入动画
        li.style.opacity = 0;
        li.style.transform = "translateY(-10px)";
        list.appendChild(li);
        setTimeout(() => {
          li.style.transition = "all 0.3s ease";
          li.style.opacity = 1;
          li.style.transform = "translateY(0)";
        }, 50);
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
function deleteTodo(id) {
  if (confirm("确定删除吗？")) {
    const li = event.target.parentElement;

    // 消失动画
    li.style.transition = "all 0.3s ease";
    li.style.opacity = 0;
    li.style.transform = "translateX(100%)";
    
    setTimeout(() => {
      fetch(API + "/todos/" + id, { method: "DELETE" })
        .then(loadTodos);
    }, 300);
  }
}

// 切换完成状态
function toggleDone(id, done) {
  fetch(API + "/todos/" + id + "?done=" + (done ? 1 : 0), { method: "PUT" })
    .then(loadTodos);
}

// 支持回车添加
document.getElementById("input").addEventListener("keyup", function(e) {
  if (e.key === "Enter") addTodo();
});

// 初始加载
loadTodos();
