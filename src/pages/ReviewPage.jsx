import React, { useEffect, useState, useContext } from "react";
import { useParams } from "react-router-dom";
import { AuthContext } from "../AuthContext";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CommentSection from "../components/CommentSection";


function ReviewPage() {
  const { id } = useParams();
  const [review, setReview] = useState(null);
  const { userData, setUserData } = useContext(AuthContext);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/reviews/${id}`)
      .then(res => res.json())
      .then(data => setReview(data));

    fetch(`${import.meta.env.VITE_API_URL}/comments?reviewId=${id}`)
      .then(res => res.json())
      .then(setComments);

    fetch(`${import.meta.env.VITE_API_URL}/reviews/updateViews`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id: Number(id) }),
    });
  }, [id]);
  
useEffect(() => {
  if (!userData) return;

  fetch(`${import.meta.env.VITE_API_URL}/users/updateViews`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      email: userData.email,
      reviewId: Number(id)
    })
  })
    .then(res => res.json())
    .then(data => {
      if (data.success && data.views !== undefined) {
        // Обновим локальные данные, чтобы в профиле отразилось
        const updatedUser = { ...userData, views: data.views };
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setUserData(updatedUser);
      }
    });
}, [id, userData]);


  const handleAddComment = async () => {
    if (!newComment.trim()) return;

    const comment = {
      reviewId: Number(id),
      author: userData.username,
      avatar: userData.avatar, // <--- добавлено
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
      setComments(prev => [...prev, comment]);
      setNewComment("");
    }
  };

  if (!review) return <div className="text-white p-10">Загрузка обзора...</div>;

  return (
    <div className="bg-[#0e1525] text-white min-h-screen font-sans flex flex-col items-center px-6 pt-8 relative">
      {/* Шапка */}
      <Header />

      {/* Контент */}
      <main className="px-6 pt-8 max-w-7xl mx-auto flex-1">
        <h1 className="text-3xl font-bold font-play mb-2">
          {review.game}
        </h1>

        {/* Информация о пользователе и дате */}
<div className="flex justify-between items-start text-sm text-gray-400 mb-2">
  {/* Левая часть: имя, рейтинг, поделиться */}
  <div className="flex items-center gap-4">
    <span>{review.author}</span>
    <span className="text-white font-bold">
      <span className="text-blue-400">{review.rating?.toFixed(1)}</span>
      <span className="text-gray-400"> /10</span>
    </span>
    <button className="text-blue-400 hover:underline flex items-center gap-1">
      <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7.23689 11.1183C7.40523 10.7817 7.50023 10.4017 7.50023 10C7.50023 9.59833 7.40523 9.21833 7.23689 8.88167M7.23689 11.1183C6.98498 11.622 6.5704 12.0258 6.06031 12.2645C5.55022 12.5031 4.9745 12.5625 4.42643 12.4331C3.87836 12.3037 3.39004 11.993 3.04057 11.5514C2.69111 11.1098 2.50098 10.5631 2.50098 10C2.50098 9.43686 2.69111 8.89021 3.04057 8.44861C3.39004 8.00701 3.87836 7.69634 4.42643 7.56692C4.9745 7.4375 5.55022 7.49691 6.06031 7.73553C6.5704 7.97416 6.98498 8.37801 7.23689 8.88167M7.23689 11.1183L12.7636 13.8817M7.23689 8.88167L12.7636 6.11833M12.7636 13.8817C12.6167 14.1753 12.5291 14.4951 12.5058 14.8226C12.4825 15.1501 12.524 15.479 12.6278 15.7905C12.7316 16.102 12.8957 16.39 13.1108 16.6381C13.3259 16.8861 13.5878 17.0894 13.8815 17.2363C14.1751 17.3831 14.4949 17.4707 14.8224 17.494C15.1499 17.5173 15.4788 17.4759 15.7903 17.372C16.1018 17.2682 16.3898 17.1041 16.6379 16.889C16.8859 16.6739 17.0892 16.412 17.2361 16.1183C17.5327 15.5252 17.5815 14.8386 17.3719 14.2095C17.1622 13.5804 16.7112 13.0604 16.1181 12.7638C15.5251 12.4672 14.8384 12.4183 14.2093 12.628C13.5802 12.8376 13.0602 13.2886 12.7636 13.8817ZM12.7636 6.11833C12.9104 6.412 13.1137 6.67387 13.3618 6.88898C13.6098 7.10409 13.8978 7.26824 14.2093 7.37205C14.5208 7.47586 14.8497 7.51729 15.1772 7.49399C15.5048 7.47069 15.8245 7.38311 16.1181 7.23625C16.4118 7.08939 16.6737 6.88612 16.8888 6.63806C17.1039 6.38999 17.2681 6.10199 17.3719 5.79049C17.4757 5.47899 17.5171 5.15009 17.4938 4.82257C17.4705 4.49506 17.3829 4.17534 17.2361 3.88167C16.9395 3.28858 16.4194 2.8376 15.7903 2.62795C15.1612 2.4183 14.4746 2.46715 13.8815 2.76375C13.2884 3.06035 12.8374 3.58041 12.6278 4.20951C12.4181 4.83862 12.467 5.52524 12.7636 6.11833Z" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
      </svg>
      Поделиться
    </button>
  </div>

  {/* Правая часть: дата */}
  <div className="text-sm text-right text-gray-400">
    {new Date(review.date).toLocaleDateString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
    })}
  </div>
</div>


        <img
          src={review.image}
          alt={review.game}
          className="rounded w-full h-60 md:h-[600px] object-contain mb-8"
        />


        <div className="flex gap-6 mt-6">
  {/* Левый текстовый блок */}
  <div className="flex-1 text-sm leading-relaxed text-[#D1D5DB] whitespace-pre-wrap">
    {review.text}
  </div>

  {/* Блок оценки справа */}
<div className="w-[220px] bg-[#1B2234] p-4 rounded-lg text-sm self-start shrink-0">
  <h3 className="font-bold text-white mb-2">Оценка</h3>
  <div className="flex justify-between py-1"><span>Графика</span><span>{review.graphics}/10</span></div>
  <div className="flex justify-between py-1"><span>Сюжет</span><span>{review.story}/10</span></div>
  <div className="flex justify-between py-1"><span>Геймплей</span><span>{review.gameplay}/10</span></div>
  <div className="flex justify-between py-1"><span>Звук</span><span>{review.sound}/10</span></div>
  <div className="border-t border-[#2A3246] mt-3 pt-2 font-bold text-blue-400 flex justify-between">
    <span>Итог</span><span>{review.rating}/10</span>
  </div>
</div>

</div>


        {/* Комментарии */}
        <CommentSection reviewId={id} />
      </main>

      {/* Футер */}
      <Footer />
    </div>
  );
}

export default ReviewPage;
