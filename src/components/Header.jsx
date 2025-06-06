// src/components/Header.jsx
import React, { useContext, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function Header() {
  const navigate = useNavigate();
  const { isAuthenticated, userData } = useContext(AuthContext);
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="flex items-center justify-between w-full max-w-7xl relative h-[113px] mx-auto">
      <h1
        onClick={() => navigate("/")}
        className="text-[36px] font-bold text-[#4A90E2] font-play cursor-pointer"
      >
        GameWorld
      </h1>
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        className="md:hidden text-2xl px-2"
      >
        ☰
      </button>
      <nav
        className={`${menuOpen ? 'flex' : 'hidden'} absolute md:static left-0 top-full md:top-auto md:left-1/2 md:-translate-x-1/2 flex-col md:flex-row gap-4 md:gap-10 items-center bg-[#18213A] md:bg-transparent w-full md:w-auto p-4 md:p-0`}
      >
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
