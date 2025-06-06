import React from "react";
import { Play } from "lucide-react";

const VideoCard = ({ title, image }) => {
  return (
    <div className="w-[416px] h-[384px] bg-[#1B2234] rounded-[10px] overflow-hidden font-play">
      <div className="relative h-[240px] bg-gray-200">
        <img
          src={image}
          alt="video preview"
          className="w-full h-full object-cover"
        />
        <button className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[48px] h-[48px] bg-red-600 rounded-full flex items-center justify-center">
          <Play className="text-white fill-white w-4 h-4" />
        </button>
      </div>
      <div className="p-4 text-white text-[24px] font-bold leading-[30px]">
        {title}
      </div>
    </div>
  );
};

export default VideoCard;
