# 🚀 WorkTrack — Employee Attendance & Payroll Analytics System

WorkTrack is a **full-stack MERN web application** that automates employee attendance tracking, monitors workforce productivity, and generates payroll-ready reports.

The system supports **role-based access (Manager & Employee)**, real-time attendance monitoring, performance analytics dashboards, and downloadable payroll CSV reports.

This project demonstrates backend API development, authentication, database handling, and dashboard UI development.

---

## 🎯 Problem Statement

Many small organizations still maintain attendance manually using registers or spreadsheets, which leads to:

* Incorrect attendance calculation
* Payroll mistakes
* No productivity tracking
* No centralized monitoring
* Time-consuming report preparation

**WorkTrack solves this by digitizing attendance and providing analytics + payroll automation.**

---

## ✨ Features

### 👩‍💼 Employee Panel

* Secure Login (JWT Authentication)
* Daily Check-In & Check-Out
* Automatic Late / Half-Day Detection
* Monthly Attendance Summary
* Attendance History
* Personal Attendance Statistics (Charts)

### 👨‍💻 Manager Panel

* View All Employees Attendance
* Filter Attendance By Date
* Team Performance Analytics
* Productivity Classification
* Payroll CSV Download

---

## 🧠 Attendance Logic

| Check-in Time      | Status   |
| ------------------ | -------- |
| Before 9:30 AM     | Present  |
| After 9:30 AM      | Late     |
| After 11:00 AM     | Half-Day |
| Work hours < 4 hrs | Half-Day |

---

## 🏗️ System Architecture

```
React Frontend  →  Express Backend API  →  MongoDB Database
                     ↓
                JWT Authentication
```

---

## 🛠️ Tech Stack

### Frontend

* React.js
* React Router
* Axios
* Recharts
* CSS3 (Responsive UI)

### Backend

* Node.js
* Express.js
* REST API Architecture
* Middleware Authorization

### Database

* MongoDB Atlas
* Mongoose

### Authentication

* JSON Web Token (JWT)

### Utilities

* json2csv (Payroll Export)
* Nodemon
* Vite

---

## 🔐 Authentication Flow

1. User logs in
2. Backend verifies credentials
3. JWT token is generated
4. Token stored in browser (localStorage)
5. Each API request carries the token
6. Middleware verifies access

---

## 📁 Project Structure

```
WorkTrack
│
├── Frontend
│   ├── components
│   ├── pages
│   │   ├── employee
│   │   └── manager
│   ├── utils/api.js
│   └── App.jsx
│
├── BackendAttendanceSystem
│   ├── controllers
│   │   └── attendanceController.js
│   ├── models
│   │   ├── User.js
│   │   └── Attendance.js
│   ├── routes
│   │   └── attendanceRoutes.js
│   ├── middleware
│   │   ├── authMiddleware.js
│   │   └── managerMiddleware.js
│   └── server.js
│
└── README.md
```

---

## ⚙️ Installation

### 1️⃣ Clone Repository

```
git clone https://github.com/ruthikasri/WorkTrack.git
cd WorkTrack
```

---

### 2️⃣ Backend Setup

```
cd BackendAttendanceSystem
npm install
```

Create a `.env` file:

```
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_secret_key
PORT=5000
```

Run backend:

```
npm run dev
```

---

### 3️⃣ Frontend Setup

Open another terminal:

```
cd Frontend
npm install
npm run dev
```

Application runs at:

```
http://localhost:5173
```

---

## 📊 Payroll Report

The manager can download a CSV file containing:

* Employee Name
* Employee ID
* Date
* Check-In Time
* Check-Out Time
* Total Hours
* Attendance Status

The file is Excel compatible and ready for payroll calculation.

---

## 📈 Employee Analytics

Employees are categorized based on attendance:

| Category       | Meaning          |
| -------------- | ---------------- |
| Regular        | Mostly present   |
| Irregular      | Frequently late  |
| Low Productive | Mostly half-days |

---

## 🧪 API Endpoints

### Employee

```
POST  /api/attendance/checkin
POST  /api/attendance/checkout
GET   /api/attendance/status
GET   /api/attendance/myhistory
GET   /api/attendance/my-monthly-summary
GET   /api/attendance/my-stats
```

### Manager

```
GET   /api/attendance/all
GET   /api/attendance/filter?date=YYYY-MM-DD
GET   /api/attendance/analytics
GET   /api/attendance/download
```

---

## 🔮 Future Enhancements

* Leave Management
* Email Notifications
* Salary Calculation
* Biometric Integration
* Mobile Application
* Cloud Deployment

---

## 👩‍🎓 Author

**Ruthika Sri**
B.E Electronics and Communication Engineering

---
