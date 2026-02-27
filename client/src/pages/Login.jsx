import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import AuthCard from "../components/common/AuthCard";
import { useNavigate, useLocation } from "react-router-dom";
import { supabase } from "../lib/supabaseClient"; // ✅ important

const Login = () => {
  const { login } = useAuth(); // keep your context
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from || "/";

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      // ✅ Supabase login
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) throw error;

      // ✅ CRITICAL — token save (THIS WAS MISSING)
      localStorage.setItem("token", data.session.access_token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // ✅ update your auth context (optional but good)
      if (login) {
        login(data.user);
      }

      toast.success("Login successful");

      // ✅ redirect to home
      navigate(from, { replace: true });
    } catch (err) {
      toast.error(err.message || "Invalid credentials");
    }
  };

  return (
    <AuthCard title="Welcome Back">
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
        <input
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg p-3">
          Login
        </button>
      </form>
    </AuthCard>
  );
};

export default Login;