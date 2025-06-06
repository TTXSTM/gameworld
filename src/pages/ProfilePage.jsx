import React, { useState, useContext, useEffect } from "react";
import "../index.css";
import { AuthContext } from "../AuthContext";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";

const gameImages = {
  "Cyberpunk 2077: Phantom Liberty": "/cyberpunk.jpg",
  "Baldur's Gate 3": "/baldurs.jpg",
  "Starfield": "/starfield.jpg",
  "Diablo IV": "/diablo.jpg",
  "Black Myth: Wukong": "/wukong-banner.jpg",
  "Hogwarts Legacy": "/hogwarts.jpg"
};

function ProfilePage() {
  const { userData, setUserData } = useContext(AuthContext);
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState("");
  const [newEmail, setNewEmail] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [avatarFile, setAvatarFile] = useState(null);
  const [activeTab, setActiveTab] = useState("reviews");
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("success");
  const [showMessageBox, setShowMessageBox] = useState(false);
  const navigate = useNavigate();
  const [myReviews, setMyReviews] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const { setIsAuthenticated, setUsername } = useContext(AuthContext);
  const [editingReviewId, setEditingReviewId] = useState(null);
  const [editedText, setEditedText] = useState("");
  const [showEditForm, setShowEditForm] = useState(false);
  const [editReviewData, setEditReviewData] = useState(null);
  const [editedRatings, setEditedRatings] = useState({
    graphics: "",
    story: "",
    gameplay: "",
    sound: ""
  });

  useEffect(() => {
    const loadReviews = async () => {
      if (userData) {
        setNewName(userData.username);
        setNewEmail(userData.email);

        const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews`);
        const data = await res.json();
        const userReviews = data.filter(r => r.author === userData.username);

        const commentsRes = await fetch(`${import.meta.env.VITE_API_URL}/comments`);
        const allComments = await (await fetch(`${import.meta.env.VITE_API_URL}/comments`)).json();

        const userComments = allComments.filter(c => c.author === userData.username);
        const likedCount = allComments.filter(c => (c.likedBy || []).includes(userData.email)).length;
        
        const enrichedReviews = userReviews.map(review => {
          const reviewComments = allComments.filter(c => c.reviewId === review.id);
          const totalComments = reviewComments.length;
          const totalLikes = reviewComments.reduce((acc, c) => acc + (c.likes || 0), 0);
          return { ...review, totalComments, totalLikes };
        });

        const totalLikesAll = enrichedReviews.reduce((sum, r) => sum + (r.totalLikes || 0), 0);
        const totalCommentsAll = enrichedReviews.reduce((sum, r) => sum + (r.totalComments || 0), 0);

        const updatedUser = {
          ...userData,
          comments: userComments.length,
          likes: likedCount,
          views: userData.views || 0
        };

        const newAchievements = [];

        const allAchievements = [
          { name: "Первые шаги", check: () => updatedUser.views >= 5 },
          { name: "Активный читатель", check: () => false },
          { name: "Социальная бабочка", check: () => updatedUser.comments >= 10 },
          { name: "Эксперт контента", check: () => updatedUser.likes >= 50 },
          { name: "Верный подписчик", check: () => false },
          { name: "Киберспортсмен", check: () => true },
          { name: "Первооткрыватель", check: () => false },
          { name: "Народный критик", check: () => userReviews.length >= 5 }
        ];

        const currentAchievements = userData.achievements || [];

        allAchievements.forEach(({ name, check }) => {
          if (check() && !currentAchievements.includes(name)) {
            newAchievements.push(name);
          }
        });

        if (newAchievements.length > 0) {
          const updated = {
            ...updatedUser,
            achievements: [...currentAchievements, ...newAchievements],
          };

          setUserData(updated);
          localStorage.setItem("userData", JSON.stringify(updated));

          await fetch(`${import.meta.env.VITE_API_URL}/users/updateAchievements`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: userData.email,
              achievements: updated.achievements,
            }),
          });

          newAchievements.forEach(name => {
            showMessage(`Достижение получено: ${name}`);
          });
        }

        setUserData(updatedUser);
        localStorage.setItem("userData", JSON.stringify(updatedUser));
        setMyReviews(enrichedReviews);

        await fetch(`${import.meta.env.VITE_API_URL}/users/updateStats`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            email: userData.email,
            likes: totalLikesAll,
            comments: totalCommentsAll,
          }),
        });
      }
    };

    loadReviews();
  }, [userData]);

  const [editingReview, setEditingReview] = useState(null);

  const handleAddReview = async (e) => {
    e.preventDefault();
    const form = e.target;

    const newReview = {
      game: form.game.value,
      text: form.text.value,
      graphics: parseFloat(form.ratingGraphics.value),
      story: parseFloat(form.ratingStory.value),
      gameplay: parseFloat(form.ratingGameplay.value),
      sound: parseFloat(form.ratingSound.value),
      rating: (
        (parseFloat(form.ratingGraphics.value) +
        parseFloat(form.ratingStory.value) +
        parseFloat(form.ratingGameplay.value) +
        parseFloat(form.ratingSound.value)) / 4
      ).toFixed(1),
      image: gameImages[form.game.value] || "/default.jpg",
      date: new Date().toISOString(),
      author: userData.username,
      likes: 0,
      views: 0,
      comments: 0
    };

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews/add`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReview),
      });

      if (!res.ok) throw new Error("Не удалось создать обзор");

      const saved = await res.json();
      setMyReviews((prev) => [...prev, saved]);
      setShowForm(false);
      showMessage("Обзор добавлен!");
    } catch (err) {
      showMessage(err.message, "error");
    }
  };

  const showMessage = (text, type = "success") => {
    setMessage(text);
    setMessageType(type);
    setShowMessageBox(true);
    setTimeout(() => {
      setShowMessageBox(false);
    }, 3000);
  };

  const handleAvatarUpload = (e) => {
    setAvatarFile(e.target.files[0]);
  };

const handleSave = async (e) => {
  e.preventDefault();

  if (!oldPassword && newPassword) {
    showMessage("Введите старый пароль для его изменения", "error");
    return;
  }

  const formData = new FormData();
  formData.append("username", newName);
  formData.append("email", newEmail);
  if (oldPassword) formData.append("oldPassword", oldPassword);
  if (newPassword) formData.append("newPassword", newPassword);
  if (avatarFile) formData.append("avatar", avatarFile);

  try {
    const response = await fetch("http://172.19.0.1:5001/users/update", {
      method: "POST",
      body: formData,
    });

    const responseData = await response.json();
    if (!response.ok) throw new Error(responseData.error || "Ошибка обновления");

    // Проверка достижений (исправленная версия)
    if (responseData.newAchievements?.length) {
      responseData.newAchievements.forEach(name => {
        showMessage(`Достижение получено: ${name}`);
      });
    }

    let changes = [];
    if (newName !== userData.username) changes.push("Ник изменён");
    if (newEmail !== userData.email) changes.push("Почта изменена");
    if (newPassword) changes.push("Пароль изменён");
    if (avatarFile) changes.push("Аватарка изменена");

    setUserData(responseData);
    setIsEditing(false);
    setOldPassword("");
    setNewPassword("");
    setAvatarFile(null);
    showMessage(changes.length ? changes.join(", ") : "Данные обновлены", "success");
  } catch (error) {
    showMessage(error.message, "error");
  }
};

  if (!userData) return <div className="p-10 text-white">Загрузка профиля...</div>;

  return (
    <div className="min-h-screen bg-[#0e1525] text-white font-sans">
      <Header />
      
      <div className="relative flex flex-col md:flex-row px-4 md:px-10 pt-10">
        {showMessageBox && (
          <div
            className={`fixed top-5 right-5 z-50 px-4 py-2 rounded shadow-lg text-white transition-all duration-500 transform ${
              showMessageBox ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"
            } ${messageType === "error" ? "bg-red-600" : "bg-green-600"}`}
          >
            {message}
          </div>
        )}

        <aside className="bg-[#18213A] p-6 rounded-lg w-full md:w-64 text-center">
          <img
            src={userData?.avatar ? `http://172.19.0.1:5001${userData.avatar}` : "/default-avatar.png"}
            alt="Аватар"
            className="object-cover mx-auto mb-4 rounded-full w-28 h-28"
          />
          <h2 className="text-xl font-bold font-play">{userData?.username || "GameMaster"}</h2>
          <p className="text-sm text-[#B4B4B4] font-play">{userData?.email}</p>
          <div className="flex justify-between mt-4 text-[#4A90E2] text-sm font-bold font-play">
            <div>
              <div>{userData?.views ?? 0}</div>
              <div className="text-xs text-[#B4B4B4]">Просмотры</div>
            </div>
            <div>
              <div>{userData?.likes ?? 0}</div>
              <div className="text-xs text-[#B4B4B4]">Лайки</div>
            </div>
            <div>
              <div>{userData?.comments ?? 0}</div>
              <div className="text-xs text-[#B4B4B4]">Комментарии</div>
            </div>
          </div>

          {isEditing ? (
            <form onSubmit={handleSave} className="flex flex-col gap-3 mt-4 text-sm text-left">
              <input
                type="text"
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
                placeholder="Ник"
                className="p-2 rounded bg-[#0e1525] text-white"
              />
              <input
                type="email"
                value={newEmail}
                onChange={(e) => setNewEmail(e.target.value)}
                placeholder="Почта"
                className="p-2 rounded bg-[#0e1525] text-white"
              />
              <input
                type="password"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
                placeholder="Старый пароль"
                className="p-2 rounded bg-[#0e1525] text-white"
              />
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="Новый пароль"
                className="p-2 rounded bg-[#0e1525] text-white"
              />
              <input
                type="file"
                name="avatar"
                onChange={handleAvatarUpload}
                className="p-2 rounded bg-[#0e1525] text-white"
              />
              <button
                type="submit"
                className="bg-[#4A90E2] w-full py-2 rounded font-bold text-sm mt-2"
              >
                Сохранить
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsEditing(false);
                  setNewName(userData.username);
                  setNewEmail(userData.email);
                  setOldPassword("");
                  setNewPassword("");
                  setAvatarFile(null);
                }}
                className="w-full py-2 mt-2 text-sm font-bold bg-gray-600 rounded"
              >
                Отменить
              </button>
            </form>
          ) : (
            <button
              onClick={() => setIsEditing(true)}
              className="bg-[#4A90E2] w-full py-2 mt-6 rounded font-bold text-sm"
            >
              Редактировать профиль
            </button>
          )}
<button
  onClick={() => {
    setIsAuthenticated(false);
    setUserData(null);
    localStorage.removeItem("userData");
    navigate("/"); // Изменено с "/login" на "/"
  }}
  className="w-full py-2 mt-4 text-sm font-bold bg-red-600 rounded"
>
  Выйти
</button>
          <button
            onClick={() => navigate("/")}
            className="text-sm mt-6 text-[#4A90E2] underline"
          >
            ← Назад на главную
          </button>
        </aside>

        <main className="flex-1 md:ml-10 mt-10 md:mt-0">
          <div className="flex gap-4 mb-6">
            <button
              className={`px-4 py-2 font-bold rounded ${activeTab === "achievements" ? "bg-[#4A90E2]" : "bg-[#1B2234]"}`}
              onClick={() => setActiveTab("achievements")}
            >
              Достижения
            </button>
            <button
              className={`px-4 py-2 font-bold rounded ${activeTab === "reviews" ? "bg-[#4A90E2]" : "bg-[#1B2234]"}`}
              onClick={() => setActiveTab("reviews")}
            >
              Мои обзоры
            </button>
          </div>

          {activeTab === "reviews" ? (
            <section className="bg-[#1B2234] p-6 rounded">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold">Мои обзоры</h3>
                <button
                  onClick={() => setShowForm(!showForm)}
                  className="bg-[#4A90E2] text-white px-4 py-2 rounded font-bold text-sm"
                >
                  {showForm ? "Отменить" : "Добавить обзор"}
                </button>
              </div>

              {showForm && (
                <form
                  onSubmit={handleAddReview}
                  className="fixed inset-0 bg-[#0e1525]/90 z-50 flex items-center justify-center p-4"
                >
                  <div className="bg-[#1B2234] p-6 rounded w-full max-w-xl relative">
                    <h3 className="mb-4 text-xl font-bold">Создание обзора</h3>

                    <select
                      name="game"
                      required
                      className="bg-[#0e1525] text-white p-2 rounded w-full mb-3"
                    >
                      <option value="">Выберите игру</option>
                      <option value="Cyberpunk 2077: Phantom Liberty">Cyberpunk 2077: Phantom Liberty</option>
                      <option value="Baldur's Gate 3">Baldur's Gate 3</option>
                      <option value="Starfield">Starfield</option>
                    </select>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <input type="number" name="ratingGraphics" step="0.1" min="0" max="10" placeholder="Графика" required className="bg-[#0e1525] text-white p-2 rounded w-full" />
                      <input type="number" name="ratingStory" step="0.1" min="0" max="10" placeholder="Сюжет" required className="bg-[#0e1525] text-white p-2 rounded w-full" />
                      <input type="number" name="ratingGameplay" step="0.1" min="0" max="10" placeholder="Геймплей" required className="bg-[#0e1525] text-white p-2 rounded w-full" />
                      <input type="number" name="ratingSound" step="0.1" min="0" max="10" placeholder="Звук" required className="bg-[#0e1525] text-white p-2 rounded w-full" />
                    </div>

                    <textarea
                      name="text"
                      required
                      placeholder="Ваш обзор..."
                      className="bg-[#0e1525] text-white p-2 rounded w-full h-32 mb-4 resize-none"
                    />

                    <div className="flex justify-end gap-2">
                      <button
                        type="submit"
                        className="bg-[#4A90E2] text-white px-4 py-2 rounded font-bold text-sm"
                      >
                        Сохранить
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowForm(false)}
                        className="text-sm text-gray-300 underline"
                      >
                        Отмена
                      </button>
                    </div>

                    <button
                      onClick={() => setShowForm(false)}
                      className="absolute text-xl text-white top-3 right-4"
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                </form>
              )}
              {showEditForm && editReviewData && (
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    const form = e.target;

                    const updatedReview = {
                      id: editReviewData.id,
                      game: form.game.value,
                      text: form.text.value,
                      graphics: parseFloat(form.ratingGraphics.value),
                      story: parseFloat(form.ratingStory.value),
                      gameplay: parseFloat(form.ratingGameplay.value),
                      sound: parseFloat(form.ratingSound.value),
                    };

                    try {
                      const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews/update`, {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(updatedReview),
                      });

                      if (!res.ok) throw new Error("Ошибка при обновлении обзора");

                      setMyReviews((prev) =>
                        prev.map((r) => (r.id === updatedReview.id ? { ...r, ...updatedReview } : r))
                      );
                      setShowEditForm(false);
                      showMessage("Обзор обновлён");
                    } catch (err) {
                      showMessage(err.message, "error");
                    }
                  }}
                  className="fixed inset-0 bg-[#0e1525]/90 z-50 flex items-center justify-center p-4"
                >
                  <div className="bg-[#1B2234] p-6 rounded w-full max-w-xl relative">
                    <h3 className="mb-4 text-xl font-bold">Редактирование обзора</h3>

                    <select
                      name="game"
                      defaultValue={editReviewData.game}
                      required
                      className="bg-[#0e1525] text-white p-2 rounded w-full mb-3"
                    >
                      <option value="">Выберите игру</option>
                      <option value="Cyberpunk 2077: Phantom Liberty">Cyberpunk 2077: Phantom Liberty</option>
                      <option value="Baldur's Gate 3">Baldur's Gate 3</option>
                      <option value="Starfield">Starfield</option>
                    </select>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <input type="number" name="ratingGraphics" step="0.1" min="0" max="10" defaultValue={editReviewData.graphics} placeholder="Графика" required className="bg-[#0e1525] text-white p-2 rounded w-full" />
                      <input type="number" name="ratingStory" step="0.1" min="0" max="10" defaultValue={editReviewData.story} placeholder="Сюжет" required className="bg-[#0e1525] text-white p-2 rounded w-full" />
                      <input type="number" name="ratingGameplay" step="0.1" min="0" max="10" defaultValue={editReviewData.gameplay} placeholder="Геймплей" required className="bg-[#0e1525] text-white p-2 rounded w-full" />
                      <input type="number" name="ratingSound" step="0.1" min="0" max="10" defaultValue={editReviewData.sound} placeholder="Звук" required className="bg-[#0e1525] text-white p-2 rounded w-full" />
                    </div>

                    <textarea
                      name="text"
                      defaultValue={editReviewData.text}
                      required
                      placeholder="Ваш обзор..."
                      className="bg-[#0e1525] text-white p-2 rounded w-full h-32 mb-4 resize-none"
                    />

                    <div className="flex items-center justify-between">
                      <div className="flex gap-2">
                        <button type="submit" className="bg-[#4A90E2] text-white px-4 py-2 rounded font-bold text-sm">
                          Сохранить
                        </button>
                        <button
                          type="button"
                          onClick={() => setShowEditForm(false)}
                          className="text-sm text-gray-300 underline"
                        >
                          Отмена
                        </button>
                      </div>
                      <button
                        type="button"
                        onClick={async () => {
                          const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews/delete`, {
                            method: "POST",
                            headers: { "Content-Type": "application/json" },
                            body: JSON.stringify({ id: editReviewData.id }),
                          });

                          if (res.ok) {
                            setMyReviews((prev) => prev.filter((r) => r.id !== editReviewData.id));
                            setShowEditForm(false);
                            showMessage("Обзор удалён");
                          } else {
                            showMessage("Ошибка удаления", "error");
                          }
                        }}
                        className="text-sm text-red-400 underline"
                      >
                        Удалить
                      </button>
                    </div>

                    <button
                      onClick={() => setShowEditForm(false)}
                      className="absolute text-xl text-white top-3 right-4"
                      type="button"
                    >
                      ✕
                    </button>
                  </div>
                </form>
              )}

              <div className="flex flex-col gap-4">
                {myReviews.length === 0 ? (
                  <p className="text-sm text-gray-400">Вы ещё не написали ни одного обзора.</p>
                ) : (
                  myReviews.map((review) => (
                    <div
                      key={review.id}
                      className="bg-[#27304A] rounded-lg p-4 shadow-sm flex gap-4 items-start border border-[#2a3246]"
                    >
                      <img
                        src={review.image}
                        alt={review.game}
                        className="object-cover h-24 bg-gray-300 rounded w-36"
                      />
                      <div className="flex flex-col justify-between flex-1">
                        <div>
                          <div className="text-[#4A90E2] font-bold text-lg mb-1">{review.game}</div>
                  
                          <div className="mb-1 text-sm text-gray-400">{review.date?.slice(0, 10)}</div>
                  
                          {editingReviewId === review.id ? (
                            <>
                              <textarea
                                value={editedText}
                                onChange={(e) => setEditedText(e.target.value)}
                                className="bg-[#1B2234] text-white p-2 rounded w-full mb-2 resize-none"
                              />

                              {["graphics", "story", "gameplay", "sound"].map((field) => (
                                <input
                                  key={field}
                                  type="number"
                                  min="1"
                                  max="10"
                                  step="0.1"
                                  value={editedRatings[field]}
                                  onChange={(e) =>
                                    setEditedRatings({ ...editedRatings, [field]: e.target.value })
                                  }
                                  placeholder={`Оценка за ${field}`}
                                  className="bg-[#1B2234] text-white p-2 rounded w-full mb-2"
                                />
                              ))}

                              <div className="flex gap-2 mt-2">
                                <button
                                  onClick={async () => {
                                    const updatedReview = {
                                      ...review,
                                      text: editedText,
                                      graphics: parseFloat(editedRatings.graphics),
                                      story: parseFloat(editedRatings.story),
                                      gameplay: parseFloat(editedRatings.gameplay),
                                      sound: parseFloat(editedRatings.sound),
                                      rating: (
                                        (parseFloat(editedRatings.graphics) +
                                        parseFloat(editedRatings.story) +
                                        parseFloat(editedRatings.gameplay) +
                                        parseFloat(editedRatings.sound)) / 4
                                      ).toFixed(1)
                                    };

                                    const res = await fetch(`${import.meta.env.VITE_API_URL}/reviews/update`, {
                                      method: "POST",
                                      headers: { "Content-Type": "application/json" },
                                      body: JSON.stringify(updatedReview)
                                    });

                                    if (res.ok) {
                                      setMyReviews((prev) =>
                                        prev.map((r) => (r.id === review.id ? updatedReview : r))
                                      );
                                      setEditingReviewId(null);
                                      showMessage("Обзор обновлён");
                                    } else {
                                      const data = await res.json();
                                      showMessage(data.error || "Ошибка обновления", "error");
                                    }
                                  }}
                                  className="px-3 py-1 text-sm text-white bg-green-600 rounded"
                                >
                                  Сохранить
                                </button>

                                <button
                                  onClick={() => setEditingReviewId(null)}
                                  className="px-3 py-1 text-sm text-white bg-gray-500 rounded"
                                >
                                  Отмена
                                </button>
                              </div>
                            </>
                          ) : (
                            <>
                              <p className="text-sm text-[#B4B4B4] leading-snug">{review.text}</p>
                              <div className="flex items-center gap-6 mt-3 text-sm text-[#B4B4B4]">
                                <div className="flex items-center gap-1">
                                  <span>👍</span>
                                  <span>{review.totalLikes ?? 0}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span>💬</span>
                                  <span>{review.totalComments ?? 0}</span>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => {
                          setEditReviewData(review);
                          setShowEditForm(true);
                        }}
                        className="text-sm bg-[#4A90E2] text-white px-4 py-1 rounded h-fit self-start"
                      >
                        Редактировать
                      </button>
                    </div>
                  ))              
                )}
              </div>
            </section>         
          ) : (
            <section className="bg-[#1B2234] p-6 rounded">
              <h3 className="mb-4 text-xl font-bold">Достижения</h3>
              <div className="grid gap-3 mt-6">
                {[
                  { name: "Первые шаги", desc: "Посетил 5 страниц", emoji: "👣" },
                  { name: "Активный читатель", desc: "Провел 1 час на сайте", emoji: "📖" },
                  { name: "Социальная бабочка", desc: "Оставил 10 комментариев", emoji: "🦋" },
                  { name: "Эксперт контента", desc: "Поставил 50 лайков", emoji: "👍" },
                  { name: "Верный подписчик", desc: "На сайте 30 дней", emoji: "🌟" },
                  { name: "Киберспортсмен", desc: "Посетил все разделы сайта", emoji: "🎮" },
                  { name: "Первооткрыватель", desc: "Нашел пасхалку на сайте", emoji: "⛏️" },
                  { name: "Народный критик", desc: "Написал 5 обзоров", emoji: "📝" }
                ].map(ach => (
                  <div
                    key={ach.name}
                    className="bg-[#2a3246] rounded p-4 flex justify-between items-center"
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 flex items-center justify-center rounded-full bg-[#1e253a] text-2xl">
                        {ach.emoji}
                      </div>
                      <div>
                        <div className="text-sm font-bold text-white">{ach.name}</div>
                        <div className="text-xs text-[#B4B4B4]">{ach.desc}</div>
                      </div>
                    </div>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${userData.achievements?.includes(ach.name) ? "bg-blue-500" : "bg-[#444]"}`}>
                      {userData.achievements?.includes(ach.name) && (
                        <span className="text-sm font-bold text-white">✓</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProfilePage;