# TodoLite

 一个轻量级全栈前端任务管理系统
 支持任务增删查、完成状态切换，前端原生 JS + HTML + CSS，后端 FastAPI + SQLite。

---

## 功能特点

- 添加、删除、查看任务
- 切换任务完成状态（勾选完成/未完成）
- 前端界面动画：任务新增滑入、删除滑出
- 前后端分离，RESTful API 返回 JSON
- 简单部署，无需数据库安装，自动生成 SQLite 文件

---

## 技术栈

| 前端 | 后端 |
|------|------|
| HTML5 / CSS3 / 原生 JS | Python / FastAPI |
| 动态交互与动画 | SQLite 数据库 |
| fetch API 请求 | Uvicorn 运行服务 |
| 前端动画优化用户体验 | CORS 支持前后端分离 |

---

## 运行方式

### 后端

1. 进入 `backend` 目录：
```
cd backend
```
2. 安装依赖 
```
pip install fastapi uvicorn
```
3. 启动后端服务
```
uvicorn main:app --reload
```
### 前端

打开 `frontend/index.html`

浏览器即可访问 TodoLite，前端会调用后端 API
