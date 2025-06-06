import React, { useEffect } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

function AboutPage() {
  useEffect(() => {
    // Автоскролл к якорю при переходе с #hash
    const hash = window.location.hash;
    if (hash) {
      const element = document.querySelector(hash);
      if (element) {
        element.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, []);

  return (
    <div className="bg-[#0e1525] text-white min-h-screen font-sans">
        <div className="flex flex-col items-center px-6 pt-8">
            <Header />
        </div>
      <main className="max-w-4xl mx-auto px-6 py-12">
        <h1 className="text-4xl font-bold text-blue-500 font-play mb-10">О нас</h1>

        <section className="mb-12" id="about">
          <h2 className="text-2xl font-bold mb-4">О проекте</h2>
          <p className="text-gray-300 leading-relaxed">
            GameWorld — это независимый новостной и обзорный портал, посвящённый миру видеоигр. Мы предоставляем актуальные материалы, аналитические статьи, рецензии и уникальные авторские мнения.
          </p>
        </section>

        <section className="mb-12" id="terms">
          <h2 className="text-2xl font-bold mb-4">Условия использования</h2>
          <p className="text-gray-300 leading-relaxed">
            Используя сайт GameWorld, вы соглашаетесь с правилами поведения, уважаете авторские права и не распространяете запрещённый контент. Мы оставляем за собой право удалять материалы, нарушающие данные условия.
          </p>
        </section>

        <section className="mb-12" id="privacy">
          <h2 className="text-2xl font-bold mb-4">Политика конфиденциальности</h2>
          <p className="text-gray-300 leading-relaxed">
            Мы уважаем вашу конфиденциальность и не передаём личные данные третьим лицам без согласия. Все данные защищены и используются только для улучшения пользовательского опыта.
          </p>
        </section>

        <section className="mb-12" id="contacts">
          <h2 className="text-2xl font-bold mb-4">Контакты</h2>
          <p className="text-gray-300 leading-relaxed">
            Связаться с нами можно по email: <a href="mailto:support@gameworld.com" className="text-blue-400 underline">support@gameworld.com</a>
            <br />
            Или через наши соцсети в футере сайта.
          </p>
        </section>
      </main>
      <Footer />
    </div>
  );
}

export default AboutPage;
