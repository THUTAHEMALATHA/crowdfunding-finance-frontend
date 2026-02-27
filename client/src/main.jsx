import React from "react";
import ReactDOM from "react-dom/client";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App.jsx"
import Home from "./pages/Home";
import Login from "./pages/Login";
import ProjectDetail from "./pages/ProjectDetail";
import CreateProject from "./pages/CreateProject";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "./context/AuthContext";

import Signup from "./pages/Signup";
import Layout from "./layouts/Layout";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />, // ✅ VERY IMPORTANT
    children: [
      { index: true, element: <Home /> },
      { path: "login", element: <Login /> },
      { path: "project/:id", element: <ProjectDetail /> },
      { path: "signup", element: <Signup /> },
      { path: "create", element: <CreateProject /> },
    ],
  },
]);

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <RouterProvider router={router} />
    <ToastContainer position="top-right" theme="dark" />
  </AuthProvider>
);