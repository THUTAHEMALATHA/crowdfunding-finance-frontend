import { createContext, useContext, useEffect, useState } from "react";
import { apiFetch } from "../lib/api";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
  try {
    const saved = localStorage.getItem("user");

    if (!saved || saved === "undefined") {
      return null;
    }

    return JSON.parse(saved);
  } catch (err) {
    console.error("User parse failed:", err);
    return null;
  }
});
// 

const login = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
  setUser(userData);
};

// 
  const register = async (payload) => {
    await apiFetch("/api/auth/register", {
      method: "POST",
      body: JSON.stringify(payload),
    });
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);