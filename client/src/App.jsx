import Navbar from "./components/common/Navbar";
import { Outlet } from "react-router-dom";

export default function App() {
  return (
    <div className="min-h-screen w-full bg-[#030712] text-white overflow-x-hidden">
      <Navbar />
      <Outlet />
    </div>
  );
}