# EtiHAD — сайт Умра-туров

Статический сайт (HTML/CSS/JS, без сборки), хостится на GitHub Pages. Тарифы, отели, FAQ и контакты редактируются в Google Sheets — сайт подтягивает их через Sheets API при каждой загрузке страницы (без кэша, чтобы никогда не показывать устаревшие данные).

## Как изменить тарифы/цены/FAQ

Открыть таблицу и просто отредактировать нужную ячейку — изменения появятся на сайте при следующей загрузке страницы у посетителя (обновление в реальном времени по сети, кэш не используется):

https://docs.google.com/spreadsheets/d/1A22dRlytShWd24nxfnkGFbDmxjh_8bWZWVPfBy7buuk/edit

Вкладки:
- **Tariffs** — тарифы: названия (RU/UZ/TJ), цены по типам заселения, перелёт, питание, что включено, `is_active` (FALSE — скрыть тариф), `is_placeholder` (TRUE — показать как "скоро", пока нет полного контента, сейчас так стоит у Tawhid).
- **TariffHotels** — разбивка по отелям/городам внутри тарифа (`tariff_id` должен совпадать с `id` из Tariffs).
- **Media** — фото/видео тарифа: `gh_asset_filename` — это просто имя файла, загруженного в GitHub Releases (см. ниже), не полный URL.
- **FAQ** — вопросы/ответы.
- **Contacts** — телефон, адрес, часы работы, соцсети.

Важно: строка 1 каждой вкладки — заголовки колонок, их не удалять и не переименовывать (код сопоставляет данные по этим названиям).

## Как добавить/заменить фото или видео

1. Зайти в репозиторий на GitHub → Releases.
2. Найти нужный релиз: `media-video`, `media-photo` или `media-hero`.
3. Загрузить файл как ассет релиза (Edit release → Attach files).
4. В таблице (вкладка Media) указать точное имя загруженного файла в колонке `gh_asset_filename`.

Код трогать не нужно.

## Секреты — где хранятся

Ничего из перечисленного не должно попадать в git-репозиторий:

- **Telegram bot token** и **chat_id получателя заявок** — секреты Cloudflare Worker'а (`wrangler secret put BOT_TOKEN`, `wrangler secret put TARGET_CHAT_ID`), см. `cloudflare-worker/README` ниже.
- **GitHub personal access token** — используется только локально при деплое, не хранится в репозитории.

Google Sheets API-ключ в `assets/js/config.js` — это единственный секрет, который *специально* лежит в открытом клиентском коде: он read-only и ограничен (Application restrictions → HTTP referrers → домен сайта; API restrictions → только Sheets API), поэтому такой ключ безопасен для публикации, если ограничения не снимать.

## Деплой на GitHub Pages

1. Создать репозиторий на GitHub (публичный или приватный — Pages работает с обоих на платных/бесплатных тарифах в зависимости от типа аккаунта).
2. Запушить содержимое этой папки в `main`.
3. Settings → Pages → Source: Deploy from a branch → `main` / `/ (root)`.
4. Сайт появится на `https://<username>.github.io/<repo>/`.
5. Обновить в Google Cloud Console (Credentials → API key → Application restrictions) реальный адрес, если он отличается от заложенного в план.
6. Обновить `assets/js/config.js` — `GH_VIDEO_BASE` / `GH_PHOTO_BASE` / `GH_HERO_BASE` на реальный `owner/repo`, и `LEAD_WORKER_URL` на реальный адрес задеплоенного Worker'а.

## Cloudflare Worker

См. `cloudflare-worker/` — прокси, который принимает заявку с сайта и пересылает в Telegram, чтобы токен бота не был виден в коде сайта.

```
cd cloudflare-worker
wrangler login
wrangler secret put BOT_TOKEN
wrangler secret put TARGET_CHAT_ID
wrangler deploy
```

После деплоя скопировать реальный URL Worker'а (вида `https://etihad-lead-proxy.<subdomain>.workers.dev/lead`) в `assets/js/config.js` → `LEAD_WORKER_URL`.

## Локальная разработка

Файлы — обычный статический сайт, но `type="module"` в скриптах требует HTTP(S), а не `file://`. Проще всего — расширение "Live Server" в VS Code, либо:

```
python -m http.server 8000
```

и открыть `http://localhost:8000`.
