// src/pages/NewsPage.jsx
import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Link } from "react-router-dom";

function NewsPage() {
  const [newsList, setNewsList] = useState([]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/news`)
      .then(res => res.json())
      .then(setNewsList);
  }, []);

  return (
    <div className="bg-[#0e1525] text-white min-h-screen font-sans ">
      <div className="flex flex-col items-center px-6 pt-8">
            <Header />
      </div>
      <div className="max-w-7xl mx-auto px-6 pt-10">
        <h1 className="text-4xl font-bold mb-6 text-blue-500 font-play">Новости</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {newsList.map(news => (
            <Link to={`/news/${news.id}`} key={news.id}>
              <div className="bg-[#1B2234] p-4 rounded hover:opacity-90 transition">
                <img src={news.image} alt={news.title} className="w-full h-48 object-cover rounded mb-3" />
                <h2 className="text-xl font-bold">{news.title}</h2>
                <p className="text-gray-400 text-sm">{news.description}</p>
                <p className="text-xs text-gray-500 mt-2">👁 {news.views} просмотров</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default NewsPage;
