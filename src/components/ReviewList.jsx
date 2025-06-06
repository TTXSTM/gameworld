import React from "react";

function ReviewList({ reviews }) {
  return (
    <div className="grid gap-4 mt-6">
      {reviews.map((review, index) => (
        <div key={index} className="bg-[#1B2234] p-4 rounded-lg">
          <h3 className="text-xl font-bold">{review.title}</h3>
          <p className="text-sm text-[#B4B4B4] mt-1">{review.text}</p>
          <div className="text-sm text-[#888] mt-2">Рейтинг: {review.rating} ⭐</div>
          <div className="text-xs text-[#555] mt-1">{new Date(review.date).toLocaleString()}</div>
        </div>
      ))}
    </div>
  );
}

export default ReviewList;
