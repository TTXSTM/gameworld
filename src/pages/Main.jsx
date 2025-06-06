import React, { useState, useContext, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { AuthContext } from "../AuthContext";
import NewsCard from "../components/NewsCard";
import { Link } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";
import "../index.css";

const slides = [
  {
    id: 1001,
    title: "Black Myth: Wukong",
    description: "Black Myth: Wukong — action-RPG по мотивам «Путешествия на Запад». Играйте за Сунь Укуна...",
    image: "/wukong-banner.jpg",
  },
  {
    id: 1002,
    title: "Diablo IV",
    description: "Продолжение культовой серии RPG от Blizzard...",
    image: "/diablo.jpg",
  },
  {
    id: 1003,
    title: "Cyberpunk 2077: Phantom Liberty",
    description: "Дополнение к культовой RPG от CD Projekt Red...",
    image: "/cyberpunk.jpg",
  },
];

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
  {
    title: "KAJ - Eurovision 2025",
    url: "https://www.youtube.com/watch?v=zQSPqZkKzRQ",
  },
];

function extractYouTubeId(url) {
  // Поддержка разных форматов YouTube-ссылок
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

function Main() {
  const navigate = useNavigate();
  const { userData } = useContext(AuthContext);

  const [current, setCurrent] = useState(0);
  const [videoIndex, setVideoIndex] = useState(0);
  const [news, setNews] = useState([]);

  const sliderRef = useRef(null);

  const next = () => setCurrent((prev) => (prev + 1) % slides.length);
  const prev = () => setCurrent((prev) => (prev - 1 + slides.length) % slides.length);

  const nextVideo = () => setVideoIndex((prev) => (prev + 1) % (videos.length - 2));
  const prevVideo = () => setVideoIndex((prev) => (prev - 1 + (videos.length - 2)) % (videos.length - 2));

  const handleBannerClick = () => navigate(`/articles/${slides[current].id}`);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_API_URL}/news`)
      .then((res) => res.json())
      .then(setNews)
      .catch(console.error);
  }, []);

  useEffect(() => {
    const interval = setInterval(next, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-[#0e1525] text-white font-sans">
      <div className="relative flex flex-col items-center px-6 pt-8">
        <Header />

        {/* Banner */}
<section className="pt-4">
  <div className="relative w-[1310px] h-[583px] overflow-hidden rounded-[10px] mx-auto">
    {/* Слайды */}
    <div
      className="flex h-full transition-transform duration-700 ease-in-out"
      style={{ transform: `translateX(-${current * 100}%)` }}
      ref={sliderRef}
    >
      {slides.map((slide) => (
        <div
          key={slide.id}
          className="relative h-full min-w-full cursor-pointer"
          onClick={handleBannerClick}
        >
          <img
            src={slide.image}
            alt={slide.title}
            className="object-cover w-full h-full"
          />

          {/* Подложка с текстом и точками */}
          <div className="absolute bottom-0 z-10 w-full px-6 pt-4 pb-12 text-left bg-black/70">
            <h2 className="text-[36px] font-bold text-white font-play mb-2">
              {slide.title}
            </h2>
            <p className="text-[16px] text-[#EAEAEA] font-play">
              {slide.description}
            </p>
          </div>
        </div>
      ))}
    </div>

    {/* Стрелки */}
    <button
      onClick={prev}
      className="absolute left-4 top-1/2 -translate-y-1/2 w-[58px] h-[56px] bg-white/50 rounded-full flex items-center justify-center hover:bg-white/80 z-20"
    >
      <ChevronLeft className="text-black" />
    </button>
    <button
      onClick={next}
      className="absolute right-4 top-1/2 -translate-y-1/2 w-[58px] h-[56px] bg-white/50 rounded-full flex items-center justify-center hover:bg-white/80 z-20"
    >
      <ChevronRight className="text-black" />
    </button>

    {/* Обёртка точек с фоном */}
    <div className="absolute bottom-0 z-20 w-full py-2 bg-black/70">
      <div className="flex justify-center gap-2">
        {slides.map((_, index) => (
          <span
            key={index}
            onClick={() => setCurrent(index)}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
              index === current ? "bg-white" : "bg-gray-500"
            }`}
          />
        ))}
      </div>
    </div>
  </div>
</section>

        {/* Новости */}
        <section className="w-full mt-20 max-w-7xl">
          <h2 className="mb-6 text-4xl font-bold text-blue-500 font-play">Последние новости</h2>
          <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
            {news.map((item) => (
              <Link to={`/news/${item.id}`} key={item.id}>
                <NewsCard {...item} />
              </Link>
            ))}
          </div>
        </section>

{/* Видео */}
<section className="w-full mt-20 max-w-7xl">
  <h2 className="mb-6 text-4xl font-bold text-blue-500 font-play">Видео</h2>
  <div className="relative">
    <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
      {videos.slice(videoIndex, videoIndex + 3).map((video, index) => {
        const id = extractYouTubeId(video.url);
        return (
          <div key={index} className="bg-[#1B2234] rounded-[10px] overflow-hidden">
            <div className="relative pt-[56.25%]"> {/* 16:9 соотношение сторон */}
              <iframe
                src={`https://www.youtube.com/embed/${id}?rel=0`}
                className="absolute top-0 left-0 w-full h-full"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                title={video.title}
              ></iframe>
            </div>
            <div className="p-4 text-2xl font-bold text-white whitespace-pre-line font-play">
              {video.title}
            </div>
          </div>
        );
      })}
    </div>
    {/* Кнопки навигации остаются без изменений */}
    <button onClick={prevVideo} className="absolute left-[-20px] top-[106px] bg-white/80 rounded-full w-10 h-10 flex items-center justify-center">
      <ChevronLeft className="text-black" />
    </button>
    <button onClick={nextVideo} className="absolute right-[-20px] top-[106px] bg-white/80 rounded-full w-10 h-10 flex items-center justify-center">
      <ChevronRight className="text-black" />
    </button>
  </div>
</section>

        <Footer />
      </div>
    </div>
  );
}

export default Main;
