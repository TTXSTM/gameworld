// src/components/Header.jsx
import React, { useContext } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, userData } = useContext(AuthContext);

  return (
    <header className="flex items-center justify-between w-full max-w-7xl relative h-[113px] mx-auto">
      <h1
        onClick={() => navigate("/")}
        className="text-[36px] font-bold text-[#4A90E2] font-play cursor-pointer"
      >
        GameWorld
      </h1>
      <nav className="absolute left-1/2 -translate-x-1/2 flex gap-10 items-center">
        <Link to="/news" className="text-[20px] hover:text-[#4A90E2]">Новости</Link>
        <Link to="/reviews" className="text-[20px] hover:text-[#4A90E2]">Обзоры</Link>
        <Link to="/video" className="text-[20px] hover:text-[#4A90E2]">Видео</Link>
        <Link to="/about" className="text-[20px] hover:text-[#4A90E2]">О нас</Link>
      </nav>
      <div className="flex gap-4">
        {isAuthenticated ? (
          <img
            src={userData?.avatar ? `http://172.19.0.1:5001${userData.avatar}` : "/avatar-icon.png"}
            alt="avatar"
            className="w-[60px] h-[60px] rounded-full object-cover cursor-pointer"
            onClick={() => navigate("/profile")}
          />
        ) : (
          <>
            <button
              onClick={() => navigate("/login")}
              className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Вход
            </button>
            <button
              onClick={() => navigate("/register")}
              className="border border-white hover:bg-white hover:text-black text-white font-bold py-2 px-4 rounded"
            >
              Регистрация
            </button>
          </>
        )}
      </div>
    </header>
  );
}

export default Header;
