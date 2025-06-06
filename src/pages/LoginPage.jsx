import React, { useState, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { AuthContext } from "../AuthContext";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const fromRegister = location.state?.fromRegister;
  const { setIsAuthenticated, setUsername } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleBack = () => {
    if (fromRegister) {
      navigate("/register");
    } else {
      navigate("/", { replace: true });
    }
  };

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost:5001/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка входа");
      }

      if (data.username) {
        localStorage.setItem("userData", JSON.stringify(data));
        setUsername(data.username);
        setIsAuthenticated(true);
        alert(`Добро пожаловать, ${data.username}!`);
        navigate("/");
      } else {
        alert("Ошибка входа");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1525] text-white">
      <div className="bg-[#18213A] p-10 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#4A90E2] mb-6 font-play">Вход</h2>

        <label className="block mb-2">Email</label>
        <input
          value={email}
          onChange={e => setEmail(e.target.value)}
          type="email"
          className="w-full p-2 mb-4 bg-[#0e1525]"
        />

        <label className="block mb-2">Пароль</label>
        <div className="relative mb-4">
          <input
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={e => setPassword(e.target.value)}
            className="w-full p-2 bg-[#0e1525]"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute text-sm right-2 top-2"
          >
            Показать
          </button>
        </div>

        <button
          onClick={handleLogin}
          className="w-full bg-[#4A90E2] text-white font-bold py-2 rounded mb-2"
        >
          Войти
        </button>
        <button onClick={handleBack} className="text-sm underline">
          ← Назад
        </button>

        <div className="mt-4 text-sm text-center text-gray-400">
          Нет аккаунта?{" "}
          <button
            onClick={() => navigate("/register")}
            className="text-[#4A90E2] hover:underline"
          >
            Зарегистрироваться
          </button>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;
