const express = require('express');
const fs = require('fs');
const cors = require('cors');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const NEWS_FILE = './storage/news.json';

const readJSON = (filename) => {
  const data = fs.readFileSync(path.join(__dirname, filename));
  return JSON.parse(data);
};

const writeJSON = (filename, data) => {
  fs.writeFileSync(path.join(__dirname, filename), JSON.stringify(data, null, 2));
};


const app = express();
const PORT = 5001;
const HOST = '0.0.0.0';
const USERS_FILE = './storage/users.json';

app.use(cors());
app.use(bodyParser.json());
app.use('/uploads', express.static(path.resolve(__dirname, '..', 'uploads'))); // отдача аватарок

// 📦 Хранилище Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/');
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const filename = Date.now() + ext;
    cb(null, filename);
  }
});

// 🛡 Фильтр: разрешаем только картинки
const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Можно загружать только изображения'), false);
  }
};

const achievementConditions = {
  "Первые шаги": user => user.views >= 5,
  "Активный читатель": user => user.views >= 60,
  "Социальная бабочка": user => user.comments >= 10,
  "Эксперт контента": user => user.likes >= 50,
  "Верный подписчик": user => user.daysOnSite >= 30,
  "Киберспортсмен": user => Array.isArray(user.visitedSections) && user.visitedSections.length >= 5,
  "Первооткрыватель": user => user.foundEasterEgg,
  "Народный критик": user => user.reviewsCount >= 5
};

// Функция проверки новых достижений
function checkAchievements(user) {
  const current = user.achievements || [];
  const newOnes = [];

  for (const [name, condition] of Object.entries(achievementConditions)) {
    if (!current.includes(name) && condition(user)) {
      current.push(name);
      newOnes.push(name);
    }
  }

  user.achievements = current;
  return newOnes;
}

const upload = multer({ storage, fileFilter });

// 📋 Получение пользователей
app.get('/users', (req, res) => {
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  res.json(users);
});

// 🧾 Регистрация
app.post('/register', (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

  const existingUser = users.find(u => u.email === email);
  if (existingUser) {
    return res.status(409).json({ error: 'Пользователь с таким email уже существует' });
  }

  const newUser = {
    id: Date.now(),
    username,
    email,
    password,
    avatar: null,
    views: 0,
    likes: 0,
    comments: 0
  };

  users.push(newUser);
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.status(201).json({ message: 'Регистрация успешна', user: newUser });
});

// 🔑 Вход
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

  const user = users.find(u => u.email === email && u.password === password);

  if (user) {
    res.json({
      message: 'Вход выполнен',
      username: user.username,
      email: user.email,
      avatar: user.avatar || null,
      views: user.views || 0,
      likes: user.likes || 0,
      comments: user.comments || 0
    });
  } else {
    res.status(401).json({ error: 'Неверный email или пароль' });
  }
});


// 🛠 Обновление профиля
app.post('/users/update', upload.single('avatar'), (req, res) => {
  const { username, email, oldPassword, newPassword } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  const avatarPath = req.file ? `/uploads/${req.file.filename}` : null;

  const userIndex = users.findIndex(u => u.email === email);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const user = users[userIndex];

  if (newPassword && !oldPassword) {
    return res.status(400).json({ error: 'Чтобы изменить пароль, введите старый пароль' });
  }

  if (newPassword && oldPassword && user.password !== oldPassword) {
    return res.status(400).json({ error: 'Старый пароль неверен' });
  }

  // ✅ Обновляем поля
  user.username = username || user.username;
  user.email = email || user.email;
  if (newPassword) user.password = newPassword;
  if (avatarPath) user.avatar = avatarPath;

  // ✅ Проверка достижений — только здесь!
  const newAchievements = checkAchievements(user);

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({
    username: user.username,
    email: user.email,
    avatar: user.avatar || null,
    views: user.views || 0,
    likes: user.likes || 0,
    comments: user.comments || 0,
    achievements: user.achievements || [],
    newAchievements
  });
});

app.post('/users/updateStats', (req, res) => {
  const { email, likes, comments } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

  const userIndex = users.findIndex(u => u.email === email);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  users[userIndex].likes = likes;
  users[userIndex].comments = comments;

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ message: "Статистика обновлена" });
});


const REVIEWS_FILE = './storage/reviews.json';

// Получение всех обзоров
app.get("/reviews", (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf-8"));
  res.json(reviews);
});

app.post('/users/updateStats', (req, res) => {
  const { email, likes, comments } = req.body;
  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));

  const userIndex = users.findIndex(u => u.email === email);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  users[userIndex].likes = likes;
  users[userIndex].comments = comments;

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ message: 'Данные обновлены' });
});

app.post('/users/updateViews', (req, res) => {
  const { email, reviewId, newsId, articleId } = req.body;

  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  const user = users.find(u => u.email === email);

  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

  user.viewedReviews = user.viewedReviews || [];
  user.viewedNews = user.viewedNews || [];
  user.viewedArticles = user.viewedArticles || [];

  if (reviewId && !user.viewedReviews.includes(reviewId)) {
    user.viewedReviews.push(reviewId);
  }

  if (newsId && !user.viewedNews.includes(newsId)) {
    user.viewedNews.push(newsId);
  }

  if (articleId && !user.viewedArticles.includes(articleId)) {
    user.viewedArticles.push(articleId);
  }

  // Учитываем просмотры всех типов
  const totalViews =
    user.viewedReviews.length +
    user.viewedNews.length +
    user.viewedArticles.length;

  user.views = totalViews;

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ success: true, views: user.views });
});



// Добавление обзора
app.post('/reviews/add', (req, res) => {
  const { author, game, graphics, story, gameplay, sound, text, image } = req.body;

  if (!author || !game || !text || !graphics || !story || !gameplay || !sound) {
    return res.status(400).json({ error: 'Все поля обязательны' });
  }

  const rating =
    Math.round(((graphics + story + gameplay + sound) / 4) * 10) / 10;

  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, 'utf-8'));

  const newReview = {
    id: Date.now(),
    author,
    game,
    graphics,
    story,
    gameplay,
    sound,
    rating,
    text,
    date: new Date().toISOString(),
    image
  };

  reviews.push(newReview);
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));

  res.json({ message: 'Обзор добавлен' });
});

const reviewsPath = "./reviews.json";

app.get("/reviews", (req, res) => {
  const reviews = JSON.parse(fs.readFileSync(reviewsPath));
  res.json(reviews);
});

// Получение одного обзора по ID
app.get("/reviews/:id", (req, res) => {
  const { id } = req.params;
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf-8"));
  const review = reviews.find(r => r.id == id);

  if (!review) {
    return res.status(404).json({ error: "Обзор не найден" });
  }

  res.json(review);
});

// Обновление количества просмотров
app.post('/users/updateViews', (req, res) => {
  const { email, reviewId, newsId, articleId } = req.body;

  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  const user = users.find(u => u.email === email);

  if (!user) return res.status(404).json({ error: 'Пользователь не найден' });

  user.viewedReviews = user.viewedReviews || [];
  user.viewedNews = user.viewedNews || [];
  user.viewedArticles = user.viewedArticles || [];

  if (reviewId && !user.viewedReviews.includes(reviewId)) {
    user.viewedReviews.push(reviewId);
  }

  if (newsId && !user.viewedNews.includes(newsId)) {
    user.viewedNews.push(newsId);
  }

  if (articleId && !user.viewedArticles.includes(articleId)) {
    user.viewedArticles.push(articleId);
  }

  // Общее количество всех просмотров:
  user.views =
    user.viewedReviews.length +
    user.viewedNews.length +
    user.viewedArticles.length;

  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));
  res.json({ success: true, views: user.views });
});


const ARTICLES_FILE = './storage/articles.json';

app.get('/articles', (req, res) => {
  const articles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
  res.json(articles);
});

app.get('/articles/:id', (req, res) => {
  const { id } = req.params;
  const articles = JSON.parse(fs.readFileSync(ARTICLES_FILE, 'utf-8'));
  const article = articles.find(a => a.id == id);
  if (!article) return res.status(404).json({ error: 'Статья не найдена' });
  res.json(article);
});

app.post("/news/updateViews", (req, res) => {
  const { id } = req.body;
  const newsList = JSON.parse(fs.readFileSync("./storage/news.json", "utf-8"));
  const index = newsList.findIndex(n => n.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Новость не найдена" });
  }

  newsList[index].views = (newsList[index].views || 0) + 1;
  fs.writeFileSync("./storage/news.json", JSON.stringify(newsList, null, 2));
  res.json({ message: "Просмотр добавлен", views: newsList[index].views });
});

app.get('/news', (req, res) => {
  const news = JSON.parse(fs.readFileSync(NEWS_FILE, 'utf-8'));
  res.json(news);
});

app.get('/news/:id', (req, res) => {
  const newsList = JSON.parse(fs.readFileSync('./storage/news.json', 'utf-8'));
  const newsItem = newsList.find(n => n.id == req.params.id);

  if (!newsItem) {
    return res.status(404).json({ error: "Новость не найдена" });
  }

  res.json(newsItem);
});


app.post('/comments/updateLike', (req, res) => {
  const { id, user } = req.body;
  const comments = readJSON('../storage/comments.json');
  const index = comments.findIndex(c => c.id === id);

  if (index === -1) {
    return res.status(404).json({ error: 'Комментарий не найден' });
  }

  const comment = comments[index];
  comment.likedBy = comment.likedBy || [];

  if (comment.likedBy.includes(user)) {
    return res.status(400).json({ error: 'Вы уже ставили лайк' });
  }

  comment.likes = (comment.likes || 0) + 1;
  comment.likedBy.push(user);

  writeJSON('../storage/comments.json', comments);
  res.json({ success: true, updated: comment });
});

app.post("/reviews/delete", (req, res) => {
  const { id } = req.body;

  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf-8"));
  const index = reviews.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Обзор не найден" });
  }

  reviews.splice(index, 1);
  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));

  res.json({ message: "Обзор удалён" });
});




const COMMENTS_FILE = './storage/comments.json';

// Получение комментариев по reviewId
app.get("/comments", (req, res) => {
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf-8'));
  const { reviewId } = req.query;

  if (reviewId) {
    const filtered = comments.filter(c => c.reviewId == reviewId);
    return res.json(filtered);
  }

  res.json(comments);
});


// Добавление комментария
app.post("/comments/add", (req, res) => {
  const comment = req.body;
  const comments = JSON.parse(fs.readFileSync(COMMENTS_FILE, 'utf-8'));
  comment.id = Date.now();
  comments.push(comment);
  fs.writeFileSync(COMMENTS_FILE, JSON.stringify(comments, null, 2));
  res.json({ message: "Комментарий добавлен" });
});

app.post('/users/updateAchievements', (req, res) => {
  const { email } = req.body;

  const users = JSON.parse(fs.readFileSync(USERS_FILE, 'utf-8'));
  const userIndex = users.findIndex(u => u.email === email);
  if (userIndex === -1) {
    return res.status(404).json({ error: 'Пользователь не найден' });
  }

  const user = users[userIndex];
  const newAchievements = checkAchievements(user);

  users[userIndex] = user;
  fs.writeFileSync(USERS_FILE, JSON.stringify(users, null, 2));

  res.json({
    achievements: user.achievements || [],
    newAchievements
  });
});



app.post("/reviews/update", (req, res) => {
  const { id, text, graphics, story, gameplay, sound } = req.body;
  const reviews = JSON.parse(fs.readFileSync(REVIEWS_FILE, "utf-8"));
  const index = reviews.findIndex((r) => r.id === id);

  if (index === -1) {
    return res.status(404).json({ error: "Обзор не найден" });
  }

  reviews[index] = {
    ...reviews[index],
    text,
    graphics,
    story,
    gameplay,
    sound,
    rating: Math.round(((graphics + story + gameplay + sound) / 4) * 10) / 10
  };

  fs.writeFileSync(REVIEWS_FILE, JSON.stringify(reviews, null, 2));
  res.json(reviews[index]);
});


// 🚀 Запуск сервера
app.listen(PORT, HOST, () => {
  console.log(`Server is running on http://${HOST}:${PORT}`);
}).on('error', (err) => {
  console.error('Ошибка запуска сервера:', err);
});

