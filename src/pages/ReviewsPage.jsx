import React, { useEffect, useState } from "react";
import { ChevronRight } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../index.css";
import { Link, useNavigate } from "react-router-dom";


function ReviewsPage() {
  const [reviews, setReviews] = useState([]);
  const [sortType, setSortType] = useState("latest");

  useEffect(() => {
    fetch("http://localhost:5001/reviews")
      .then((res) => res.json())
      .then((data) => {
        const sorted = sortReviews(data, sortType);
        setReviews(sorted);
      });
  }, [sortType]);

  const navigate = useNavigate();

  const sortReviews = (data, type) => {
    return [...data].sort((a, b) =>
      type === "rating" ? b.rating - a.rating : new Date(b.date) - new Date(a.date)
    );
  };

  return (
    <div className="min-h-screen bg-[#0e1525] text-white font-sans">
      <div className="flex flex-col items-center px-6 pt-8">
        {/* Header */}
        <Header />

        {/* Title and Sort */}
        <div className="w-full max-w-7xl flex justify-between items-center mt-10 mb-4">
          <h2 className="text-3xl font-bold text-[#4A90E2] font-play">Обзоры игр</h2>
          <div className="flex gap-4 text-sm">
            <button onClick={() => setSortType("latest")} className={`hover:text-[#4A90E2] ${sortType === "latest" ? "text-[#4A90E2] font-bold" : ""}`}>
              Последние
            </button>
            <button onClick={() => setSortType("rating")} className={`hover:text-[#4A90E2] ${sortType === "rating" ? "text-[#4A90E2] font-bold" : ""}`}>
              По рейтингу
            </button>
          </div>
        </div>

        {/* Reviews List */}
        <div className="w-full max-w-7xl flex flex-col gap-4">
          {reviews.map((review, index) => (
            <div key={index} className="bg-[#1B2234] rounded-lg overflow-hidden flex">
                  <img
                    src={review.image}
                    alt={review.game}
                    className="w-[428px] h-[228px] object-cover flex-shrink-0"
                  />

              <div className="p-4 flex-1">
                <h3 className="text-white text-xl font-bold font-play mb-1">{review.game}</h3>
                <p className="text-xs text-[#B4B4B4] font-play mb-4">
                {new Date(review.date).toLocaleDateString("ru-RU", {
                  day: "numeric",
                  month: "long",
                  year: "numeric"
                })}
                &nbsp;&nbsp; {review.author}
                </p>
                <p className="text-sm text-white font-play leading-snug line-clamp-2 mb-6">
                  {review.text}
                </p>
              </div>

              <div className="flex flex-col justify-between items-end p-4">
              <div className="text-right">
                <div className="text-[#4A90E2] text-xl font-bold font-play">
                  {review.rating?.toFixed(1)}
                </div>
                <div className="text-sm text-[#B4B4B4] font-normal font-play">/10</div>
              </div>
                <button className="text-sm bg-[#4A90E2] text-white px-4 py-1 rounded flex items-center gap-1" onClick={() => navigate(`/review/${review.id}`)}>
                  Читать далее <ChevronRight size={16} />
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default ReviewsPage;
