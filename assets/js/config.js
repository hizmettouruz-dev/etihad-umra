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
