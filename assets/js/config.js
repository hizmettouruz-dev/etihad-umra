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

// Tariffs/hotels/media mostly live in tariffsData.js (real per-package data) —
// only FAQ, Contacts, and now prices/departure dates are sheet-driven.
export const SHEET_RANGES = [
  'FAQ!A1:Z100',
  'Contacts!A1:E50',
  'MultiDates!A1:H200',
  'SeasonalPrices!A1:F100',
  'DepartureDates!A1:C100',
];

// localStorage key for the last successfully fetched price/date overrides —
// used so the very next page load can paint real numbers instantly, before
// the network round-trip to Sheets even starts. See pricesStore.js.
export const PRICE_CACHE_KEY = 'etihad_price_overrides_v1';

// Real business contacts for the floating contact widget (deliberately not
// sheet-driven — this is fixed brand info, not something the client edits
// often; the Contacts sheet tab still has older/placeholder values and
// should be updated there too whenever convenient).
export const CONTACT_INSTAGRAM_URL = 'https://www.instagram.com/hizmet_premium';
export const CONTACT_TELEGRAM_URL = 'https://t.me/premium_paketlari';
export const CONTACT_WHATSAPP_URL = 'https://wa.me/998987001192';
export const CONTACT_PHONES = ['+998 98 700 11 92', '+992 88 448 77 77', '+998 55 055 02 55'];
export const CONTACT_ADDRESS = 'Нурафшон 51';
export const CONTACT_MAPS_URL = 'https://share.google/IugqTlyDZ366RIvW1';
