import React, { useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";

const videos = [
  {
    title: "Black Myth: Wukong\nРусификатор",
    url: "https://youtu.be/RppC2hSELjE",
  },
  {
    title: "God of War\nПрохождение",
    url: "https://www.youtube.com/watch?v=7vc9t29Xi9k",
  },
  {
    title: "Hogwarts Legacy\nБаги",
    url: "https://www.youtube.com/watch?v=C9SBNXEQd8o",
  },
];

function extractYouTubeId(url) {
  const match = url.match(/(?:v=|\/)([0-9A-Za-z_-]{11})/);
  return match ? match[1] : null;
}

function VideoPage() {
  const [playingIndex, setPlayingIndex] = useState(null);

  return (
    <div className="bg-[#0e1525] text-white min-h-screen font-sans ">
      <div className="flex flex-col items-center px-6 pt-8">
        <Header />
      </div>
      <main className="p-6 mx-auto max-w-7xl">
        <h1 className="mb-6 text-4xl font-bold text-blue-500 font-play">Видео</h1>
        <div className="grid gap-6 md:grid-cols-3">
          {videos.map((video, i) => {
            const id = extractYouTubeId(video.url);
            return (
              <div key={i} className="bg-[#1B2234] rounded overflow-hidden">
                {playingIndex === i ? (
                  <div className="w-full h-[213px]">
                    <iframe
                      className="w-full h-full"
                      src={`https://www.youtube.com/embed/${id}?autoplay=1`}
                      frameBorder="0"
                      allow="autoplay; encrypted-media"
                      allowFullScreen
                      title={video.title}
                    />
                  </div>
                ) : (
                  <img
                    src={`https://img.youtube.com/vi/${id}/maxresdefault.jpg`}
                    alt={video.title}
                    className="w-full h-[213px] object-cover cursor-pointer"
                    onClick={() => setPlayingIndex(i)}
                  />
                )}
                <div className="p-4 text-xl font-bold text-white whitespace-pre-line font-play">
                  {video.title}
                </div>
              </div>
            );
          })}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default VideoPage;
