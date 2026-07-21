import { SHEETS_API_KEY, SPREADSHEET_ID, CORE_SHEET_RANGES, PRICE_SHEET_RANGES } from './config.js?v=11';

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

async function batchGet(ranges) {
  const params = new URLSearchParams();
  ranges.forEach((r) => params.append('ranges', r));
  params.set('key', SHEETS_API_KEY);
  params.set('majorDimension', 'ROWS');

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${SPREADSHEET_ID}/values:batchGet?${params.toString()}`;
  const res = await fetch(url, { cache: 'no-store' });
  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`Sheets API ${res.status}: ${body.slice(0, 200)}`);
  }
  const json = await res.json();
  return json.valueRanges || [];
}

// FAQ/Contacts — the long-standing, must-not-break tabs. Kept in their own
// request so a problem with the newer price/date tabs (e.g. not created yet)
// can never take these down too.
export async function fetchSiteData() {
  const [faqRange, contactsRange] = await batchGet(CORE_SHEET_RANGES);
  return {
    faq: rowsToObjects(faqRange && faqRange.values),
    contacts: rowsToObjects(contactsRange && contactsRange.values),
  };
}

// Prices/dates — deliberately a separate request from fetchSiteData() above,
// so that a malformed/missing tab here (e.g. the client hasn't created it
// yet) fails independently without affecting FAQ/Contacts.
export async function fetchPriceSheetData() {
  const [multiDatesRange, seasonalPricesRange, departureDatesRange] = await batchGet(PRICE_SHEET_RANGES);
  return {
    multiDates: rowsToObjects(multiDatesRange && multiDatesRange.values),
    seasonalPrices: rowsToObjects(seasonalPricesRange && seasonalPricesRange.values),
    departureDates: rowsToObjects(departureDatesRange && departureDatesRange.values),
  };
}
