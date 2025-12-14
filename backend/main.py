from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import sqlite3

app = FastAPI()

# 允许前端访问
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# 数据库
conn = sqlite3.connect("todo.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS todo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT,
    done INTEGER DEFAULT 0
)
""")
conn.commit()

# 获取所有任务
@app.get("/todos")
def get_todos():
    cursor.execute("SELECT id, title, done FROM todo")
    return [{"id": row[0], "title": row[1], "done": row[2]} for row in cursor.fetchall()]

# 添加任务
@app.post("/todos")
def add_todo(title: str):
    cursor.execute("INSERT INTO todo (title) VALUES (?)", (title,))
    conn.commit()
    return {"message": "ok"}

# 删除任务
@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    cursor.execute("DELETE FROM todo WHERE id = ?", (todo_id,))
    conn.commit()
    return {"message": "deleted"}

# 更新完成状态
@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, done: int):
    cursor.execute("UPDATE todo SET done = ? WHERE id = ?", (done, todo_id))
    conn.commit()
    return {"message": "updated"}
