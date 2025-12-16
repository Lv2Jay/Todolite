from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import sqlite3

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

# ---------- 数据库 ----------
conn = sqlite3.connect("todo.db", check_same_thread=False)
cursor = conn.cursor()
cursor.execute("""
CREATE TABLE IF NOT EXISTS todo (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    done INTEGER DEFAULT 0
)
""")
conn.commit()

# ---------- 数据模型 ----------
class TodoCreate(BaseModel):
    title: str

class TodoUpdate(BaseModel):
    done: int

# ---------- API ----------
@app.get("/todos")
def get_todos():
    cursor.execute("SELECT id, title, done FROM todo")
    rows = cursor.fetchall()
    return [
        {"id": r[0], "title": r[1], "done": r[2]}
        for r in rows
    ]

@app.post("/todos")
def add_todo(todo: TodoCreate):
    cursor.execute(
        "INSERT INTO todo (title) VALUES (?)",
        (todo.title,)
    )
    conn.commit()
    return {"message": "ok"}

@app.put("/todos/{todo_id}")
def update_todo(todo_id: int, todo: TodoUpdate):
    cursor.execute(
        "UPDATE todo SET done = ? WHERE id = ?",
        (todo.done, todo_id)
    )
    conn.commit()
    return {"message": "updated"}

@app.delete("/todos/{todo_id}")
def delete_todo(todo_id: int):
    cursor.execute(
        "DELETE FROM todo WHERE id = ?",
        (todo_id,)
    )
    conn.commit()
    return {"message": "deleted"}
