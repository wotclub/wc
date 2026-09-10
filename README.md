# WOT CLUB — GitHub Pages

Готовый статический сайт в стиле предоставленного логотипа и баннера WOT CLUB.

## Что есть

- адаптивный дизайн для ПК и телефона;
- зелёно-чёрная стилистика в духе логотипа;
- кнопки: Поддержка канала, Донат, YouTube, Instagram, TikTok, Facebook;
- переключатель RU / UA / EN;
- блок последних видео YouTube;
- автоматическое обновление YouTube RSS через GitHub Actions каждые 30 минут;
- без сервера и базы данных — подходит для GitHub Pages.

## Перед публикацией

Открой `config.js` и замени:

- `support` — ссылка на поддержку;
- `donate` — ссылка на донат;
- `youtube` — ссылка на канал;
- `instagram` — Instagram;
- `tiktok` — TikTok;
- `facebook` — Facebook;
- `youtubeChannelId` — ID YouTube-канала (начинается с `UC...`).

После изменения `config.js` GitHub Actions автоматически обновит `data/videos.json`.

## Публикация на GitHub Pages

1. Создай новый GitHub repository.
2. Загрузи все файлы из этой папки.
3. Открой **Settings → Pages**.
4. В **Build and deployment** выбери **Deploy from a branch**.
5. Выбери ветку `main` и папку `/ (root)`.
6. Сохрани настройки.
7. В **Actions** запусти `Update YouTube RSS feed` вручную после добавления Channel ID.

Сайт после публикации будет доступен на адресе вида:
`https://USERNAME.github.io/REPOSITORY/`
