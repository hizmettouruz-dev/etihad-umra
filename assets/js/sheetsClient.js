import { SHEETS_API_KEY, SPREADSHEET_ID, SHEET_RANGES } from './config.js?v=7';

function rowsToObjects(rows) {
  if (!rows || rows.length < 2) return [];
  const headers = rows[0].map((h) => (h || '').trim());
  return rows.slice(1)
    .filter((row) => row.some((cell) => (cell || '').trim() !== ''))
    .map((row) => {
      const obj = {};
      headers.forEach((h, i) => {
        if (!h) return;
        obj[h] = (row[i] !== undefined ? row[i] : '').trim();
      });
      return obj;
    });
}

// Fetches every configured tab in a single HTTP round-trip and returns
// { faq, contacts } — never cached, always fresh. (Tariffs/hotels/media are
// static now, see tariffsData.js — only FAQ/Contacts still live in Sheets.)
export async function fetchSiteData() {
  const params = new URLSearchParams();
  SHEET_RANGES.forEach((r) => params.append('ranges', r));
  params.set('key', SHEETS_API_KEY);
  params.set('majorDimension', 'ROWS');

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?${params.toString()}`;

  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Sheets API ${res.status}: ${body.slice(0, 200)}`);
  }
  const json = await res.json();
  const [faqRange, contactsRange] = json.valueRanges || [];

  return {
    faq: rowsToObjects(faqRange && faqRange.values),
    contacts: rowsToObjects(contactsRange && contactsRange.values),
  };
}
