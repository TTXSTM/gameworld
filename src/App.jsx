import React from "react";
import "./index.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Main from "./pages/Main";
import RegisterPage from "./pages/RegisterPage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";
import { AuthProvider } from "./AuthContext";
import ReviewsPage from "./pages/ReviewsPage";
import ReviewPage from './pages/ReviewPage'; // путь зависит от твоей структуры
import ArticlePage from './pages/ArticlePage';
import NewsPage from "./pages/NewsPage";
import NewsArticlePage from "./pages/NewsArticlePage";
import VideoPage from "./pages/VideoPage";
import AboutPage from "./pages/AboutPage";



function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Main />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/review/:id" element={<ReviewPage />} />
          <Route path="/articles/:id" element={<ArticlePage />} />
          <Route path="/news" element={<NewsPage />} />
          <Route path="/news/:id" element={<NewsArticlePage />} />
          <Route path="/video" element={<VideoPage />} />
          <Route path="/about" element={<AboutPage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
