import React, { useState, useEffect } from "react";
import ReviewCard from "../components/ReviewCard";
import "../index.css";

function Reviews() {
  const [reviews, setReviews] = useState([]);
  const [sortBy, setSortBy] = useState("latest");

  useEffect(() => {
    fetch("http://localhost:5001/reviews")
      .then((res) => res.json())
      .then((data) => setReviews(data))
      .catch((err) => console.error("Ошибка загрузки обзоров", err));
  }, []);

  const sortedReviews = [...reviews].sort((a, b) => {
    if (sortBy === "latest") {
      return new Date(b.date) - new Date(a.date);
    } else if (sortBy === "rating") {
      return b.rating - a.rating;
    }
    return 0;
  });

  return (
    <div className="min-h-screen bg-[#0e1525] text-white font-sans px-6 pt-8">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-4xl font-bold font-play mb-6">Обзоры</h2>

        {/* Кнопки сортировки */}
        <div className="flex gap-4 mb-6">
          <button
            className={`px-4 py-2 rounded font-bold ${
              sortBy === "latest" ? "bg-[#4A90E2]" : "bg-[#1B2234]"
            }`}
            onClick={() => setSortBy("latest")}
          >
            Последние
          </button>
          <button
            className={`px-4 py-2 rounded font-bold ${
              sortBy === "rating" ? "bg-[#4A90E2]" : "bg-[#1B2234]"
            }`}
            onClick={() => setSortBy("rating")}
          >
            По рейтингу
          </button>
        </div>

        {/* Список обзоров */}
        <div>
          {sortedReviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Reviews;
