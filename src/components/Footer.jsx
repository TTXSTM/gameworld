import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  return (
    <footer className="w-full max-w-7xl mt-20 border-t border-white/10 pt-12 pb-6 mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 text-[#B4B4B4] gap-12">
        <div>
          <h3 className="text-[#4A90E2] font-bold text-3xl font-play mb-4">GameWorld</h3>
          <p className="font-play text-sm leading-relaxed">
            Ваш источник новостей и обзоров из мира видеоигр. Будьте в курсе последних релизов, анонсов и игровых событий.
          </p>
          <div className="flex gap-4 mt-4">
            <img src="/twitter-icon.svg" alt="Twitter" className="w-6 h-6" />
            <img src="/youtube-icon.svg" alt="YouTube" className="w-6 h-6" />
            <img src="/discord-icon.svg" alt="Discord" className="w-6 h-6" />
            <img src="/telegram-icon.svg" alt="Telegram" className="w-6 h-6" />
          </div>
        </div>

        <div>
          <h4 className="text-white font-bold font-play text-lg mb-4">Разделы</h4>
          <ul className="space-y-2 text-sm font-play">
            <li>
              <Link to="/news" className="hover:text-white transition-colors">Новости</Link>
            </li>
            <li>
              <Link to="/reviews" className="hover:text-white transition-colors">Обзоры</Link>
            </li>
            <li>
              <Link to="/video" className="hover:text-white transition-colors">Видео</Link>
            </li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-bold font-play text-lg mb-4">О нас</h4>
          <ul className="space-y-2 text-sm font-play">
            <li>
              <Link to="/about" className="hover:text-white transition-colors">О проекте</Link>
            </li>
            <li>
              <Link to="/about#terms" className="hover:text-white transition-colors">Условия использования</Link>
            </li>
            <li>
              <Link to="/about#privacy" className="hover:text-white transition-colors">Политика конфиденциальности</Link>
            </li>
            <li>
              <Link to="/about#contacts" className="hover:text-white transition-colors">Контакты</Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="mt-12 text-center text-xs text-[#777] font-play">
        © 2025 GameWorld. Все права защищены
      </div>
    </footer>
  );
}

export default Footer;
