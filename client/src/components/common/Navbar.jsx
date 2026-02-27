import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useState } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    navigate("/");
  };

  return (
    <div className="border-b border-gray-800 bg-[#020617]/80 backdrop-blur sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 md:px-6 py-4 flex items-center justify-between">
        
        {/* ✅ LOGO */}
        <Link to="/" className="text-xl md:text-2xl font-bold text-white">
          FundSpark
        </Link>

        {/* ✅ DESKTOP MENU */}
        <div className="hidden md:flex items-center gap-3">
          {!user ? (
            <>
              <Link
                to="/login"
                className="px-4 py-2 border border-gray-700 rounded-lg text-white hover:border-gray-500"
              >
                Login
              </Link>

              <Link
                to="/signup"
                className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
              >
                Sign Up
              </Link>
            </>
          ) : (
            <>
              {/* 🔥 CREATE PROJECT */}
              <Link
                to="/create"
                className="px-4 py-2 bg-blue-600 rounded-lg text-white hover:bg-blue-700"
              >
                Create Project
              </Link>

              <button
                onClick={handleLogout}
                className="px-4 py-2 border border-gray-700 rounded-lg text-white hover:border-gray-500"
              >
                Logout
              </button>
            </>
          )}
        </div>

        {/* ✅ MOBILE HAMBURGER */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="md:hidden text-white text-2xl"
        >
          ☰
        </button>
      </div>

      {/* ✅ MOBILE MENU */}
      {menuOpen && (
        <div className="md:hidden px-4 pb-4">
          <div className="flex flex-col gap-3">
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 border border-gray-700 rounded-lg text-white text-center"
                >
                  Login
                </Link>

                <Link
                  to="/signup"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 bg-blue-600 rounded-lg text-white text-center"
                >
                  Sign Up
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/create"
                  onClick={() => setMenuOpen(false)}
                  className="px-4 py-2 bg-blue-600 rounded-lg text-white text-center"
                >
                  Create Project
                </Link>

                <button
                  onClick={handleLogout}
                  className="px-4 py-2 border border-gray-700 rounded-lg text-white"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;