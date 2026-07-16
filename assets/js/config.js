// Non-secret, client-safe constants only.
// The Sheets API key below is restricted (API restriction: Sheets API only;
// application restriction: HTTP referrers limited to this site's domain),
// so it is safe to ship in client-side code — see README.md.

export const SHEETS_API_KEY = 'AIzaSyCU32vCINVLU7BI1NIXixsy-gUkuymEfL0';
export const SPREADSHEET_ID = '1A22dRlytShWd24nxfnkGFbDmxjh_8bWZWVPfBy7buuk';

// TODO: update once the GitHub repo + Releases exist (see README.md "Media hosting").
export const GH_VIDEO_BASE = 'https://github.com/hizmettouruz-dev/etihad-umra/releases/download/media-video/';
export const GH_PHOTO_BASE = 'https://github.com/hizmettouruz-dev/etihad-umra/releases/download/media-photo/';
export const GH_HERO_BASE = 'https://github.com/hizmettouruz-dev/etihad-umra/releases/download/media-hero/';

// Lead form posts directly to Telegram's Bot API from the browser — no
// server/proxy. Trade-off (deliberate, client's call): this token is visible
// to anyone who views the page source. Blast radius is small — this bot only
// sends messages into one fixed chat — but if it's ever abused, revoke/replace
// it via @BotFather (/token) and update these two constants.
export const TELEGRAM_BOT_TOKEN = '8916790909:AAFIgc6Ng_8T-oNB11ZOg0fm5G-4iZNEIt0';
export const TELEGRAM_CHAT_ID = '1739109071';

// Ranges include row 1 (headers) — sheetsClient.js maps columns by header
// name, so the client is table-order independent as long as header text matches.
export const SHEET_RANGES = [
  'Tariffs!A1:AZ200',
  'TariffHotels!A1:Z500',
  'Media!A1:Z500',
  'FAQ!A1:Z100',
  'Contacts!A1:E50',
];

// Generic photos/videos (cabin, food, train) shown in every tariff's gallery
// alongside its own hotel media — not tied to one specific tariff_id, so they
// live here instead of the Media sheet tab.
export const GENERIC_MEDIA = [
  { type: 'video', gh_asset_filename: 'cabin-business.mp4', label_ru: 'Салон бизнес-класса', label_uz: 'Biznes-klass saloni', label_tj: 'Салони бизнес-класс' },
  { type: 'video', gh_asset_filename: 'cabin-economy.mp4', label_ru: 'Салон эконом-класса', label_uz: 'Ekonom-klass saloni', label_tj: 'Салони эконом-класс' },
  { type: 'image', gh_asset_filename: 'cabin-1.jpg', label_ru: 'Салон самолёта', label_uz: 'Samolyot saloni', label_tj: 'Салони ҳавопаймо' },
  { type: 'image', gh_asset_filename: 'cabin-2.webp', label_ru: 'Салон самолёта', label_uz: 'Samolyot saloni', label_tj: 'Салони ҳавопаймо' },
  { type: 'image', gh_asset_filename: 'food-1.jpg', label_ru: 'Питание на борту', label_uz: 'Parvoz davomida ovqatlanish', label_tj: 'Хӯрокхӯрӣ дар парвоз' },
  { type: 'image', gh_asset_filename: 'food-2.jpg', label_ru: 'Питание на борту', label_uz: 'Parvoz davomida ovqatlanish', label_tj: 'Хӯрокхӯрӣ дар парвоз' },
  { type: 'image', gh_asset_filename: 'food-3.jpg', label_ru: 'Питание на борту', label_uz: 'Parvoz davomida ovqatlanish', label_tj: 'Хӯрокхӯрӣ дар парвоз' },
  { type: 'image', gh_asset_filename: 'train.png', label_ru: 'Скоростной поезд Медина — Мекка', label_uz: 'Tezyurar poyezd Madina — Makka', label_tj: 'Қатораи тезрафтор Мадина — Макка' },
];

// Real business contacts for the floating contact widget (deliberately not
// sheet-driven — this is fixed brand info, not something the client edits
// often; the Contacts sheet tab still has older/placeholder values and
// should be updated there too whenever convenient).
export const CONTACT_INSTAGRAM_URL = 'https://www.instagram.com/hizmet_premium';
export const CONTACT_TELEGRAM_URL = 'https://t.me/premium_paketlari';
export const CONTACT_PHONES = ['+998 98 700 11 92', '+992 88 448 77 77', '+998 55 055 02 55'];
export const CONTACT_ADDRESS = 'Нурафшон 51';
export const CONTACT_MAPS_URL = 'https://share.google/IugqTlyDZ366RIvW1';
