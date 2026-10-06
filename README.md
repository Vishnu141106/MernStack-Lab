# SmartStudy - MERN Stack Study Planner (Local MongoDB)

A full-stack MERN application configured to use a **locally installed MongoDB Server** and **MongoDB Compass** (Zero cloud dependencies / No MongoDB Atlas).

---

## 🏗️ Architecture

```
React (Vite)                Express Server              Local MongoDB            GUI Client
http://localhost:5173  ---> http://localhost:5000  ---> mongodb://127.0.0.1:27017  ---> MongoDB Compass
     (Frontend)                 (Backend)               database: smartstudy     (View & Inspect)
                                                        collection: tasks
```

* **Frontend**: React (Vite) + Axios (communicates strictly with Express API)
* **Backend**: Node.js + Express + Mongoose (connects directly to local MongoDB)
* **Database**: Local MongoDB Server (`mongodb://127.0.0.1:27017/smartstudy`)
* **Inspection**: MongoDB Compass

---

## 📋 Data Model (Collection: `tasks`)

Each document in `smartstudy.tasks` follows this schema:

```json
{
  "subject": "Java",
  "title": "Practice Arrays",
  "description": "Solve 5 array problems",
  "date": "2026-10-05",
  "priority": "High",
  "status": "Pending"
}
```

---

## 🚀 Step-by-Step Setup & Running Guide

### Step 1: Ensure Local MongoDB Server is Running on Windows

If MongoDB is not running, choose one of these methods:

#### Method A: Command Prompt (Run as Administrator)
```cmd
net start MongoDB
```

#### Method B: Windows Services
1. Press `Win + R`, type `services.msc`, and press **Enter**.
2. Find **MongoDB Server (MongoDB)** in the list.
3. Right-click and choose **Start**.

#### Method C: Manual mongod Command
```cmd
mongod --dbpath "C:\data\db"
```

*(Note: If you haven't installed MongoDB Community Server yet, download the MSI from [mongodb.com/try/download/community](https://www.mongodb.com/try/download/community) and choose "Run service as Network Service user" during setup).*

---

### Step 2: Open MongoDB Compass & Connect

1. Launch **MongoDB Compass**.
2. In the connection string bar, enter:
   ```
   mongodb://127.0.0.1:27017
   ```
3. Click **Connect**.
4. Once connected, you will see `smartstudy` (or it will appear as soon as your first task is added) with the `tasks` collection.

---

### Step 3: Start the Express Backend

1. Open a terminal in the `backend` folder:
   ```bash
   cd backend
   npm run dev
   ```
2. The server will run on **`http://localhost:5000`** and connect to `mongodb://127.0.0.1:27017/smartstudy`.

---

### Step 4: Start the React Frontend

1. Open another terminal in the `frontend` folder:
   ```bash
   cd frontend
   npm run dev
   ```
2. Open your browser and navigate to **`http://localhost:5173`**.

---

## 🧪 Testing the Complete Flow with MongoDB Compass

1. **Add Task**:
   - On `http://localhost:5173`, click **+ New Task**.
   - Enter `Subject: Java`, `Title: Practice Arrays`, `Description: Solve 5 array problems`, `Date: 2026-10-05`, `Priority: High`, `Status: Pending`.
   - Click **Add Task to MongoDB**.
   - Switch to **MongoDB Compass** → Select `smartstudy` → `tasks` → Click **Refresh**. The new document will appear!

2. **Edit Task**:
   - On the website, click the **Edit** button on the task card.
   - Change `status` to **In Progress** or edit description.
   - Save and refresh Compass. Notice the changes are updated live.

3. **Delete Task**:
   - On the website, click **Delete** and confirm.
   - Refresh Compass. Notice the document is removed from the `tasks` collection.

---

## 📡 API Endpoints (Express Backend)

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/tasks` | Fetch all tasks (supports query filtering) |
| `GET` | `/api/tasks/:id` | Fetch task by ID |
| `POST` | `/api/tasks` | Create a new study task |
| `PUT` | `/api/tasks/:id` | Update an existing task |
| `DELETE` | `/api/tasks/:id` | Delete a task |
| `GET` | `/api/health` | Health & MongoDB status check |