import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-toastify";
import AuthCard from "../components/common/AuthCard";

const Signup = () => {
  const { register } = useAuth();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(form);
      toast.success("Account created. Please login.");
    } catch {
      toast.error("Signup failed");
    }
  };

  return (
    <AuthCard title="Create Account">
      <form onSubmit={handleSubmit} autoComplete="off" className="space-y-4">
        
        <input
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          placeholder="Name"
          value={form.name}
          onChange={(e) =>
            setForm({ ...form, name: e.target.value })
          }
        />

        <input
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm({ ...form, email: e.target.value })
          }
        />

        <input
          type="password"
          className="w-full p-3 bg-gray-900 border border-gray-700 rounded-lg text-white"
          placeholder="Password"
          value={form.password}
          onChange={(e) =>
            setForm({ ...form, password: e.target.value })
          }
        />

        <button className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-lg py-3 font-semibold text-white">
          Sign Up
        </button>
      </form>
    </AuthCard>
  );
};

export default Signup;