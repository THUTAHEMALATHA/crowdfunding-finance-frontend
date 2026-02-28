# 🚀 Crowdfunding Finance Platform (Frontend)

A modern crowdfunding platform that connects project creators with backers.  
Users can create projects, donate securely, and track funding progress.

---

## 🌐 Live Demo

🔗 Frontend Live:  
https://crowdfunding-frontend-two.vercel.app/

🔗 Backend API:  
https://crowdfund-backend-3xdd.onrender.com

🔗 Backend Repository:  
https://github.com/THUTAHEMALATHA/backend-crowdfund

---

## 🧠 Tech Stack

**Frontend**

- React (Vite)
- React Router DOM
- Tailwind CSS
- Supabase JS
- React Toastify

**Deployment**

- Vercel

---

## ✨ Features

- 🔐 User Authentication (Supabase)
- 🧭 Protected Routes
- 📢 Create Project
- 💰 Donate to Projects
- 📱 Fully Responsive UI
- ⚡ Fast Vite build
- 🔔 Toast notifications
- 🖼️ Project image support

---

## 📂 Project Structure

client/
├── src/
│ ├── assets/
│ ├── components/
│ │ ├── common/
│ │ │ └── Navbar.jsx
│ ├── context/
│ │ └── AuthContext.jsx
│ ├── lib/
│ │ ├── api.js
│ │ └── supabaseClient.js
│ ├── pages/
│ │ ├── Home.jsx
│ │ ├── Login.jsx
│ │ ├── Signup.jsx
│ │ ├── CreateProject.jsx
│ │ └── ProjectDetail.jsx
│ ├── App.jsx
│ └── main.jsx

---

## ⚙️ Environment Variables

Create `.env` inside **client/**

```env
VITE_SUPABASE_URL=your_url
VITE_SUPABASE_ANON_KEY=your_key
VITE_API_URL=your_backend_url

🧪 Run Locally (VS Code)

1️⃣ Install dependencies

cd client
npm install

2️⃣ Start dev server

npm run dev

App runs at:

http://localhost:5173

🏗️ Build for Production

npm run build
npm run preview

## 📸 Screenshots

### 🏠 Home Page
![Home](./screenshots/home.png)

### 🔐 Login Page
![Login](./screenshots/login.png)

### 🚀 Create Project
![Create](./screenshots/create-project.png)

🚀 Deployment (Vercel)

1.Push code to GitHub

2.Import project in Vercel

3.Add environment variables

4.Deploy


👤 Author

T.Hemalatha

-GitHub: your-profile

-Project: CrowdfundingPlatform_Finance

⭐ Acknowledgements

-Supabase

-React

-Vercel

-Tailwind CSS