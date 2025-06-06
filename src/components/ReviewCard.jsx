// src/components/ReviewCard.jsx
import React from "react";

function ReviewCard({ review }) {
  return (
    <div className="flex flex-col md:flex-row bg-[#1B2234] rounded-[8px] overflow-hidden mb-6">
      <img
        src={review.image}
        alt={review.title}
        className="w-full md:w-[240px] h-[160px] object-cover"
      />
      <div className="flex-1 p-4 relative">
        <h3 className="text-white text-xl font-bold font-play mb-1">{review.title}</h3>
        <p className="text-[#B4B4B4] text-sm mb-2">
          {review.date} &nbsp; &nbsp; {review.author}
        </p>
        <p className="text-[#EAEAEA] text-sm font-play mb-6 line-clamp-2">{review.text}</p>
        <div className="absolute bottom-4 right-4 flex items-center gap-4">
          <div className="text-blue-400 font-bold text-lg">{review.rating}</div>
          <button className="bg-[#4A90E2] hover:bg-blue-700 text-white text-sm px-4 py-1 rounded-full flex items-center gap-1">
            Читать далее <span className="text-lg">›</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewCard;
