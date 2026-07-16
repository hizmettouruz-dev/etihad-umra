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

// TODO: update once the Cloudflare Worker is deployed (see cloudflare-worker/README).
export const LEAD_WORKER_URL = 'https://etihad-lead-proxy.YOUR-SUBDOMAIN.workers.dev/lead';

// Ranges include row 1 (headers) — sheetsClient.js maps columns by header
// name, so the client is table-order independent as long as header text matches.
export const SHEET_RANGES = [
  'Tariffs!A1:Z200',
  'TariffHotels!A1:Z500',
  'Media!A1:Z500',
  'FAQ!A1:Z100',
  'Contacts!A1:E50',
];
