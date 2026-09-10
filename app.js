(() => {
  const config = window.WOT_CONFIG || {};
  const translations = {
    ru: {
      eyebrow: 'THE TANKERS COMMUNITY', heroText: 'Лучшие реплеи, танковые сражения и новые видео из мира World of Tanks.',
      watchYoutube: 'Смотреть YouTube', latestVideos: 'Последние видео', connect: 'CONNECT', stayConnected: 'Будь с нами',
      socialIntro: 'Поддержи канал и следи за новыми публикациями на всех площадках.', support: 'Поддержка канала', supportSub: 'Помочь развитию проекта',
      donate: 'Донат', donateSub: 'Поддержать автора', youtubeSub: 'Последние видео', instagramSub: 'Фото и новости', tiktokSub: 'Короткие видео', facebookSub: 'Сообщество',
      rssEyebrow: 'YOUTUBE RSS', latest: 'Последние видео', openChannel: 'Открыть канал ↗', footerText: 'The Tankers Community', madeFor: 'Сделано для танкистов',
      loading: 'Загружаем последние видео…', noVideos: 'Видео пока не загружены.', feedError: 'Не удалось загрузить RSS-ленту. Проверьте YouTube Channel ID в config.js.',
      watch: 'Смотреть видео ↗', published: 'Опубликовано'
    },
    uk: {
      eyebrow: 'THE TANKERS COMMUNITY', heroText: 'Найкращі реплеї, танкові бої та нові відео зі світу World of Tanks.',
      watchYoutube: 'Дивитися YouTube', latestVideos: 'Останні відео', connect: 'CONNECT', stayConnected: 'Будь з нами',
      socialIntro: 'Підтримуй канал і стеж за новими публікаціями на всіх майданчиках.', support: 'Підтримка каналу', supportSub: 'Допомогти розвитку проєкту',
      donate: 'Донат', donateSub: 'Підтримати автора', youtubeSub: 'Останні відео', instagramSub: 'Фото та новини', tiktokSub: 'Короткі відео', facebookSub: 'Спільнота',
      rssEyebrow: 'YOUTUBE RSS', latest: 'Останні відео', openChannel: 'Відкрити канал ↗', footerText: 'The Tankers Community', madeFor: 'Зроблено для танкістів',
      loading: 'Завантажуємо останні відео…', noVideos: 'Відео ще не завантажені.', feedError: 'Не вдалося завантажити RSS-стрічку. Перевірте YouTube Channel ID у config.js.',
      watch: 'Дивитися відео ↗', published: 'Опубліковано'
    },
    en: {
      eyebrow: 'THE TANKERS COMMUNITY', heroText: 'The best replays, tank battles and new videos from the world of World of Tanks.',
      watchYoutube: 'Watch on YouTube', latestVideos: 'Latest videos', connect: 'CONNECT', stayConnected: 'Stay with us',
      socialIntro: 'Support the channel and follow new posts across all platforms.', support: 'Channel support', supportSub: 'Help the project grow',
      donate: 'Donate', donateSub: 'Support the creator', youtubeSub: 'Latest videos', instagramSub: 'Photos & news', tiktokSub: 'Short videos', facebookSub: 'Community',
      rssEyebrow: 'YOUTUBE RSS', latest: 'Latest videos', openChannel: 'Open channel ↗', footerText: 'The Tankers Community', madeFor: 'Made for tankers',
      loading: 'Loading latest videos…', noVideos: 'No videos have been published yet.', feedError: 'Could not load the RSS feed. Check the YouTube Channel ID in config.js.',
      watch: 'Watch video ↗', published: 'Published'
    }
  };

  let lang = localStorage.getItem('wotclub-lang') || 'ru';
  if (!translations[lang]) lang = 'ru';

  function t(key) { return translations[lang][key] || key; }

  function applyLanguage() {
    document.documentElement.lang = lang === 'uk' ? 'uk' : lang;
    document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
    document.querySelectorAll('.lang-btn').forEach(btn => btn.classList.toggle('active', btn.dataset.lang === lang));
    renderVideos(window.__videos || []);
  }

  document.querySelectorAll('.lang-btn').forEach(btn => btn.addEventListener('click', () => {
    lang = btn.dataset.lang;
    localStorage.setItem('wotclub-lang', lang);
    applyLanguage();
  }));

  document.querySelectorAll('[data-link]').forEach(a => {
    const key = a.dataset.link;
    const url = config.links && config.links[key];
    if (url) a.href = url;
  });

  document.getElementById('year').textContent = new Date().getFullYear();

  function escapeHtml(value) {
    return String(value || '').replace(/[&<>'"]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;',"'":'&#39;','"':'&quot;'}[c]));
  }

  function formatDate(dateString) {
    const date = new Date(dateString);
    if (Number.isNaN(date.getTime())) return '';
    return new Intl.DateTimeFormat(lang === 'en' ? 'en-US' : lang === 'uk' ? 'uk-UA' : 'ru-RU', {day:'2-digit', month:'short', year:'numeric'}).format(date);
  }

  function renderVideos(videos) {
    const grid = document.getElementById('videoGrid');
    const status = document.getElementById('videoStatus');
    const list = videos.slice(0, Number(config.videoCount) || 6);
    if (!list.length) {
      grid.innerHTML = '';
      status.textContent = t('noVideos');
      return;
    }
    status.textContent = '';
    grid.innerHTML = list.map(video => `
      <article class="video-card">
        <a class="thumb" href="${escapeHtml(video.link)}" target="_blank" rel="noopener">
          <img src="${escapeHtml(video.thumbnail || '')}" alt="" loading="lazy">
          <span class="thumb-play">▶</span>
        </a>
        <div class="video-body">
          <div class="video-date">${escapeHtml(t('published'))} · ${escapeHtml(formatDate(video.published))}</div>
          <h3>${escapeHtml(video.title)}</h3>
          <a class="video-watch" href="${escapeHtml(video.link)}" target="_blank" rel="noopener">${escapeHtml(t('watch'))}</a>
        </div>
      </article>
    `).join('');
  }

  async function loadVideos() {
    const status = document.getElementById('videoStatus');
    status.textContent = t('loading');
    try {
      const res = await fetch('data/videos.json', { cache: 'no-store' });
      if (!res.ok) throw new Error('HTTP ' + res.status);
      const data = await res.json();
      window.__videos = Array.isArray(data.videos) ? data.videos : [];
      renderVideos(window.__videos);
    } catch (e) {
      window.__videos = [];
      status.textContent = t('feedError');
    }
  }

  applyLanguage();
  loadVideos();
})();
