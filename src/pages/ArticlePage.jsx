import { useParams } from "react-router-dom";
import { useEffect, useState, useContext } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { AuthContext } from "../AuthContext";
import CommentSection from "../components/CommentSection";


function ArticlePage() {
  const { id } = useParams();
  const [article, setArticle] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const { userData } = useContext(AuthContext);

useEffect(() => {
  fetch(`${import.meta.env.VITE_API_URL}/articles/${id}`)
    .then(res => res.json())
    .then(setArticle)
    .catch(() => setArticle(null));

  fetch(`${import.meta.env.VITE_API_URL}/comments?reviewId=${id}`)
    .then(res => res.json())
    .then(setComments);

  if (userData?.email) {
    fetch(`${import.meta.env.VITE_API_URL}/users/updateViews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: userData.email, articleId: Number(id) })
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
}, [id, userData]);

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    const comment = {
      author: userData?.username || "Гость",
      text: newComment,
      reviewId: parseInt(id),
      date: new Date().toISOString(),
      likes: 0,
      likedBy: [],
    };

    const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment),
    });

    if (res.ok) {
      const saved = await res.json();
      setComments(prev => [...prev, { ...comment, ...saved }]);
      setNewComment("");
    }
  };

  if (!article) return <div className="text-white p-10">Статья не найдена</div>;

  return (
    <div className="bg-[#0e1525] text-white min-h-screen font-sans flex flex-col items-center px-6 pt-8 relative">
      <Header />
      <main className="max-w-4xl mx-auto px-6 py-8 flex-1">
        <h1 className="text-3xl font-bold mb-2">{article.title}</h1>
        <p className="text-gray-400 text-sm mb-6">
          {article.author} • {new Date(article.date).toLocaleDateString("ru-RU")}
        </p>
        <img src={article.image} alt={article.title} className="w-full rounded mb-6" />
        {article.subtitle && <h2 className="text-xl font-semibold mb-4">{article.subtitle}</h2>}
        <p className="leading-relaxed text-lg whitespace-pre-line">{article.content}</p>

        {/* 💬 Комментарии */}
        <CommentSection reviewId={id} />
      </main>
      <Footer />
    </div>
  );
}

export default ArticlePage;