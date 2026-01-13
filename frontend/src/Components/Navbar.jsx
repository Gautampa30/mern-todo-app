import React, { useState, useEffect } from "react";
import assets from "../assets/todo-icon-2048x2048-pij2pwiy.png";

const Navbar = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("username");
    const storedEmail = localStorage.getItem("email");
    if (storedUsername) {
      setUsername(storedUsername);
    }
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <div className="bg-gradient-to-r from-slate-700 to-slate-800 w-full text-white h-16 flex items-center justify-between px-6 shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-12 p-1 cursor-pointer">
          <img src={assets} alt="Todo Icon" />
        </div>
        <div className="font-bold text-xl">TODO LIST</div>
      </div>

      {username && (
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-indigo-400 text-white rounded-full flex items-center justify-center font-bold text-sm">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-medium opacity-90">Welcome</span>
            <span className="text-sm font-semibold">{username}</span>
            {email && <span className="text-xs opacity-75">{email}</span>}
          </div>
        </div>
      )}
    </div>
  );
};

export default Navbar;
