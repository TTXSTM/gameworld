import React, { useEffect, useState, useContext, useRef } from "react";
import { useParams } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../AuthContext";

function NewsArticlePage() {
  const { id } = useParams();
  const [news, setNews] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { userData } = useContext(AuthContext);
  const hasSentView = useRef(false);

  useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/news/${id}`)
    .then(res => res.json())
    .then(setNews);

  fetch(`${import.meta.env.VITE_API_URL}/comments?reviewId=${id}`)
    .then(res => res.json())
    .then(setComments);

if (!hasSentView.current && userData?.email) {
  hasSentView.current = true;

  fetch(`${import.meta.env.VITE_API_URL}/news/updateViews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id: Number(id) }),
  });

  fetch(`${import.meta.env.VITE_API_URL}/users/updateViews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userData.email,
      newsId: Number(id)
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.views !== undefined) {
        const updated = { ...userData, views: data.views };
        setUserData(updated);
        localStorage.setItem("userData", JSON.stringify(updated));
      }
    });
}
}, [id]);

  const handleComment = async () => {
    if (!newComment.trim()) return;

    const comment = {
      reviewId: Number(id),
      author: userData.username,
      avatar: userData.avatar,
      text: newComment,
      date: new Date().toISOString(),
      likes: 0,
    };

    const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });

    if (res.ok) {
      setComments(prev => [...prev, comment]);
      setNewComment("");
    }
  };

  if (!news) return <div className="text-white p-10">Загрузка статьи...</div>;

  return (
    <div className="bg-[#0e1525] text-white min-h-screen font-sans">
      <Header />
      <main className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold">{news.title}</h1>
          <p className="text-sm text-gray-400 mb-4">
            {news.author} • Просмотров: {news.views}
          </p>
          <img src={news.image} alt={news.title} className="w-full h-[400px] object-cover rounded mb-6" />
          <p className="text-lg text-[#D1D5DB] whitespace-pre-wrap mb-6">{news.content}</p>

        <h2 className="text-xl font-bold mb-2">Комментарии</h2>
        <textarea
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Оставьте комментарий..."
          className="w-full bg-[#1B2234] text-white p-3 rounded resize-none mb-2"
        />
        <button
          onClick={handleComment}
          className="bg-blue-500 px-4 py-2 rounded font-bold text-sm"
        >
          Отправить
        </button>

        <div className="space-y-4 mt-6">
          {comments.map((c, i) => (
            <div key={i} className="bg-[#1B2234] p-4 rounded text-sm flex gap-4">
              <img
                src={c.avatar ? `http://172.19.0.1:5001${c.avatar}` : "/default-avatar.png"}
                alt="аватар"
                className="w-8 h-8 rounded-full object-cover"
              />
              <div>
                <div className="text-white font-bold">{c.author}</div>
                <div className="text-gray-400 text-xs">{new Date(c.date).toLocaleDateString("ru-RU")}</div>
                <div className="text-[#B4B4B4] mt-1">{c.text}</div>
              </div>
            </div>
          ))}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default NewsArticlePage;
