import React, { useState } from "react";
import { assets, menuLinks } from "../assets/assets";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAppContext } from "../context/AppContext";
import toast from "react-hot-toast";

const Navbar = () => {
  const { setShowLogin, user, logout, isOwner, axios, setIsOwner } =
    useAppContext();
  const location = useLocation();
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();

  const changeRole = async () => {
    try {
      const { data } = await axios.post("/api/owner/change-role");
      if (data.success) {
        setIsOwner(true);
        toast.success("Role changed successfully");
      } else {
        toast.error(data.message);
        navigate("/");
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  return (
    <>
      <div
        className={`flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 text-gray-600 border-b border-borderColor relative transition-all ${
          location.pathname === "/" ? "bg-light" : "bg-white"
        }`}
      >
        <Link to="/">
          <img src={assets.logo} className="h-8" alt="logo" />
        </Link>

        {/* Desktop menu */}
        <div className="hidden sm:flex items-center gap-8">
          {menuLinks.map((link, index) => (
            <Link key={index} to={link.path}>
              {link.name}
            </Link>
          ))}

          <div className="hidden lg:flex items-center mt-.5 text-sm gap-2 border border-borderColor px-3 rounded-full max-w-56">
            <input
              type="text"
              className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500"
              placeholder="Search Products"
            />
            <img src={assets.search_icon} alt="search" />
          </div>

          <div className="flex items-center gap-6">
            <button
              className="cursor-pointer"
              onClick={() => {
                if (isOwner) {
                  navigate("/owner");
                } else {
                  toast.error("Only owner can access dashboard");
                  changeRole();
                }
              }}
            >
              {isOwner ? "Dashboard" : "List cars"}
            </button>

            <button
              className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition-all text-white rounded-lg"
              onClick={() => user ? logout() : setShowLogin(true)}
            >
              {user ? "Logout" : "Login"}
            </button>
          </div>
        </div>

        {/* Mobile menu button */}
        <button className="sm:hidden" onClick={() => setOpen(!open)}>
          <img
            src={open ? assets.close_icon : assets.menu_icon}
            alt="menu"
            className="cursor-pointer"
          />
        </button>
      </div>

      {/* Mobile menu */}
      {open && (
        <div
          className={`sm:hidden fixed top-16 right-0 w-full h-screen bg-white border-t border-borderColor z-40 flex flex-col items-start p-4 gap-4`}
        >
          {menuLinks.map((link, index) => (
            <Link key={index} to={link.path} onClick={() => setOpen(false)}>
              {link.name}
            </Link>
          ))}

          <button
            className="cursor-pointer px-4 py-2 bg-primary text-white rounded-lg"
            onClick={() => setShowLogin(true)}
          >
            {isLoggedIn ? "Logout" : "Login"}
          </button>
        </div>
      )}
    </>
  );
};

export default Navbar;
