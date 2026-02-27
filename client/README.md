# 🚀 FundSpark — Frontend

Frontend for the FundSpark crowdfunding platform.  
Built with React, Vite, and Tailwind CSS.

---

## 🧱 Tech Stack

- React (Vite)
- Tailwind CSS
- React Router DOM
- React Toastify
- Supabase Auth
- Fetch API

---

## ✨ Features

- User authentication (Supabase)
- Discover projects
- Search & filter projects by category
- View project details
- Donate to projects (protected)
- Create project (protected)
- Responsive navbar
- Success stories section

---

## 📂 Folder Structure
client/
├── src/
│ ├── components/
│ ├── pages/
│ ├── context/
│ ├── lib/
│ ├── layouts/
│ ├── App.jsx
│ └── main.jsx
└── README.md

---

## ⚙️ Environment Variables

Create a `.env` file inside **client/**

VITE_API_URL=http://localhost:5000
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_anon_key

---

## 📦 Installation

From client folder:

```bash
npm install

▶️ Run Development Server

npm run dev

Runs on:

http://localhost:5173

🔐 Authentication Flow

1.User logs in via Supabase

2.Access token stored in localStorage

3.Token attached to API requests

4.Protected actions:

-Create Project

-Donate

🔌 API Communication

All requests use:

src/lib/api.js

Authorization header format:

Authorization: Bearer <token>

🏗️ Build for Production

npm run build

Preview build:

npm run preview

🚀 Deployment

Frontend recommended on:

-Vercel

Build settings:

-Framework: Vite

-Build command: npm run build

-Output directory: dist
