import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function RegisterPage() {
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleRegister = async () => {
    if (password !== confirmPassword) {
      alert("Пароли не совпадают");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Ошибка регистрации");
      }

      alert("Регистрация успешна!");
      navigate("/login", { state: { fromRegister: true } });
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0e1525] text-white">
      <div className="bg-[#18213A] p-10 rounded-lg w-full max-w-md">
        <h2 className="text-2xl font-bold text-[#4A90E2] mb-6 font-play">Регистрация</h2>

        <label className="block mb-2">Имя пользователя</label>
        <input value={username} onChange={e => setUsername(e.target.value)} type="text" className="w-full p-2 mb-4 bg-[#0e1525]" />

        <label className="block mb-2">Email</label>
        <input value={email} onChange={e => setEmail(e.target.value)} type="email" className="w-full p-2 mb-4 bg-[#0e1525]" />

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

        <label className="block mb-2">Подтвердите пароль</label>
        <div className="relative mb-4">
          <input
            type={showConfirmPassword ? "text" : "password"}
            value={confirmPassword}
            onChange={e => setConfirmPassword(e.target.value)}
            className="w-full p-2 bg-[#0e1525]"
          />
          <button
            type="button"
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className="absolute text-sm right-2 top-2"
          >
            Показать
          </button>
        </div>

        <button onClick={handleRegister} className="w-full bg-[#4A90E2] text-white font-bold py-2 rounded">
          Зарегистрироваться
        </button>

        <div className="flex justify-between mt-4 text-sm">
          <button onClick={() => navigate(-1)} className="text-gray-400 transition hover:text-white">
            ← Назад
          </button>
          <span>
            Уже есть аккаунт?{" "}
            <button onClick={() => navigate("/login", { state: { fromRegister: true } })} className="text-[#4A90E2] hover:underline">
              Войти
            </button>
          </span>
        </div>
      </div>
    </div>
  );
}

export default RegisterPage;
