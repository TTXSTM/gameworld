import React from "react";

function NewsCard({ title, image, description, views }) {
  return (
    <div className="w-[420px] h-[435px] bg-[#1B2234] rounded-[10px] overflow-hidden text-white font-['Play'] flex flex-col">
      <img
        src={image}
        alt={title}
        className="w-full h-[220px] object-cover rounded-[10px] "
      />
      <div className="p-4 flex flex-col justify-between h-full">
        <div className="text-2xl font-bold leading-9 mb-2">{title}</div>
        <div className="text-base font-normal text-gray-200 leading-normal mb-4">
          {description}
        </div>
        <div className="text-right text-sm text-gray-400">{views} •</div>
      </div>
    </div>
  );
}

export default NewsCard;