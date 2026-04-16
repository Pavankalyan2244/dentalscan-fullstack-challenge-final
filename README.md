# DentalScan Full Stack Challenge

## 🚀 Overview

This project is a full-stack implementation of a dental scanning workflow. It focuses on improving user experience during scanning, handling backend notifications, and enabling patient–dentist communication.

---

## 🎯 Demo

* Scan flow with real-time guidance overlay
* Notification triggered on scan completion
* Messaging between patient and dentist

---

## ✨ Features

### 📸 Scan Enhancement (Frontend)

* Visual guidance circle overlay for proper positioning
* Real-time feedback (Move closer / Hold steady / Perfect position)
* Responsive and centered camera UI
* Smooth performance for live camera feed

### 🔔 Notification System (Backend)

* Prisma-based Notification model
* API triggered automatically when scan completes
* Asynchronous non-blocking flow

### 💬 Patient–Dentist Messaging

* Messaging input UI
* Backend API to persist messages
* Simple thread-based communication

---

## 🛠 Tech Stack

* Next.js 14 (App Router)
* React
* Tailwind CSS
* Prisma ORM
* SQLite

---

## ▶️ How to Run

```bash
npm install
npx prisma db push
npm run dev
```

---

## 🎥 Loom Video

👉 https://www.loom.com/share/9eb8c32aa75140a7a565072e9b914933

---

## 📌 Notes

* Camera uses browser mediaDevices API
* Notifications are simulated (no external services required)
* Messaging uses a demo thread for simplicity

---

## 👤 Author

Pavan Kalyan Gundlapally
