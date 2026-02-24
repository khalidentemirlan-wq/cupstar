// ====== ДАННЫЕ (позже можно заменить на API/базу) ======
const SHOWS = [
  {
    id: "arcane",
    title: "Arcane",
    year: 2021,
    genre: "Animation • Action",
    posterUrl: "https://picsum.photos/seed/arcane/600/900",
    description: "История двух сестёр, разделённых войной и судьбой.",
    episodes: [
      { number: 1, title: "Добро пожаловать в Пилтовер", videoUrl: "https://www.youtube.com/embed/fXmAurh012s" },
      { number: 2, title: "Новые правила", videoUrl: "https://www.youtube.com/embed/fXmAurh012s" },
    ],
  },
  {
    id: "sherlock",
    title: "Sherlock",
    year: 2010,
    genre: "Detective • Drama",
    posterUrl: "https://picsum.photos/seed/sherlock/600/900",
    description: "Современная интерпретация Шерлока Холмса в Лондоне.",
    episodes: [
      { number: 1, title: "A Study in Pink", videoUrl: "https://www.youtube.com/embed/IrBKwzL3K7s" },
      { number: 2, title: "The Blind Banker", videoUrl: "https://www.youtube.com/embed/IrBKwzL3K7s" },
    ],
  },
];

// ====== УТИЛИТЫ ======
function qs(sel) { return document.querySelector(sel); }
function getParam(name) {
  const url = new URL(location.href);
  return url.searchParams.get(name);
}
function findShow(id) { return SHOWS.find(s => s.id === id); }

// ====== РЕНДЕР: ГЛАВНАЯ ======
function renderIndex() {
  const q = (getParam("q") || "").trim().toLowerCase();
  if (qs("#searchInput")) qs("#searchInput").value = q;

  const list = q
    ? SHOWS.filter(s => s.title.toLowerCase().includes(q))
    : SHOWS;

  const grid = qs("#grid");
  grid.innerHTML = list.map(s => `
    <a class="card" href="show.html?id=${encodeURIComponent(s.id)}">
      <div class="card__poster" style="background-image:url('${s.posterUrl}')"></div>
      <div class="card__body">
        <div class="card__name">${escapeHtml(s.title)}</div>
        <div class="card__meta">${s.year} • ${escapeHtml(s.genre)}</div>
      </div>
    </a>
  `).join("");

  qs("#count").textContent = list.length;
}

// ====== РЕНДЕР: СТРАНИЦА СЕРИАЛА ======
function renderShow() {
  const id = getParam("id");
  const show = findShow(id);
  if (!show) return renderNotFound("Сериал не найден");

  qs("#poster").style.backgroundImage = `url('${show.posterUrl}')`;
  qs("#title").textContent = show.title;
  qs("#year").textContent = show.year;
  qs("#genre").textContent = show.genre;
  qs("#desc").textContent = show.description;

  const eps = qs("#episodes");
  eps.innerHTML = show.episodes.map(e => `
    <a class="episode" href="watch.html?id=${encodeURIComponent(show.id)}&ep=${e.number}">
      <div class="episode__num">Серия ${e.number}</div>
      <div class="episode__name">${escapeHtml(e.title)}</div>
    </a>
  `).join("");
}

// ====== РЕНДЕР: ПРОСМОТР ======
function renderWatch() {
  const id = getParam("id");
  const epNum = Number(getParam("ep"));
  const show = findShow(id);
  if (!show) return renderNotFound("Сериал не найден");

  const ep = show.episodes.find(e => e.number === epNum);
  if (!ep) return renderNotFound("Серия не найдена");

  qs("#backLink").href = `show.html?id=${encodeURIComponent(show.id)}`;
  qs("#h1").textContent = `${show.title} — Серия ${ep.number}`;
  qs("#epTitle").textContent = ep.title;

  // ВАЖНО: videoUrl должен быть легальным источником (YouTube embed / ваш плеер / ваш хостинг)
  qs("#player").src = ep.videoUrl;
}

// ====== NOT FOUND ======
function renderNotFound(text) {
  const main = qs("main");
  main.innerHTML = `
    <div class="container">
      <a class="back" href="index.html">← на главную</a>
      <h1 class="title">${escapeHtml(text)}</h1>
      <p class="notice">Проверь ссылку.</p>
    </div>
  `;
}

// ====== БЕЗОПАСНЫЙ ТЕКСТ ======
function escapeHtml(str) {
  return String(str).replace(/[&<>"']/g, s => ({
    "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;","'":"&#39;"
  }[s]));
}

// ====== ЗАПУСК ======
document.addEventListener("DOMContentLoaded", () => {
  const page = document.body.dataset.page;
  if (page === "index") renderIndex();
  if (page === "show") renderShow();
  if (page === "watch") renderWatch();
});