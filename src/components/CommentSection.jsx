import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../AuthContext";

function CommentSection({ reviewId }) {
  const { userData } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/comments?reviewId=${reviewId}`)
      .then(res => res.json())
      .then(setComments);
  }, [reviewId]);

  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const comment = {
      reviewId: Number(reviewId),
      author: userData.username,
      avatar: userData.avatar,
      text: newComment,
      date: new Date().toISOString(),
      likes: 0
    };

    const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/add`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(comment)
    });

    if (res.ok) {
      const saved = await res.json();
      setComments(prev => [...prev, { ...comment, id: saved.id }]);
      setNewComment("");
    }
  };

  const handleLike = async (commentId, index) => {
    const res = await fetch(`${import.meta.env.VITE_API_URL}/comments/updateLike`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: commentId, user: userData.email }),
    });

    const data = await res.json();

    if (res.ok) {
      setComments(prev =>
        prev.map((c, i) =>
          i === index ? { ...c, likes: (c.likes || 0) + 1 } : c
        )
      );
    } else {
      alert(data.error || "Ошибка при лайке");
    }
  };

  return (
    <section className="mt-10">
      <h3 className="text-xl font-bold mb-4">Комментарии</h3>

      <textarea
        value={newComment}
        onChange={(e) => setNewComment(e.target.value)}
        placeholder="Оставьте комментарий..."
        className="w-full bg-[#1B2234] text-white p-3 rounded resize-none mb-2"
      />

      <button
        onClick={handleAddComment}
        className="bg-blue-500 hover:bg-blue-600 px-4 py-2 rounded text-white font-bold text-sm"
      >
        Отправить
      </button>

      <div className="mt-6 space-y-4 mb-20">
        {comments.map((c, i) => (
          <div key={i} className="bg-[#1B2234] p-4 rounded text-sm flex items-start gap-4">
            <img
              src={c.avatar ? `http://172.19.0.1:5001${c.avatar}` : "/default-avatar.png"}
              alt="аватар"
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-1">
                <span className="text-white font-bold">{c.author}</span>
                <span className="text-gray-400 text-xs">
                  {new Date(c.date).toLocaleDateString("ru-RU", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </span>
              </div>
              <div className="text-[#B4B4B4] mb-2">{c.text}</div>

              <button
                onClick={() => handleLike(c.id, i)}
                className="flex items-center text-sm text-blue-400 gap-1 cursor-pointer hover:text-blue-500 transition"
              >
                👍 <span>{c.likes ?? 0}</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default CommentSection;
