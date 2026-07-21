import { PRICE_CACHE_KEY } from './config.js?v=10';
import { setDepartureDates } from './departureDates.js?v=10';

// Groups a multi-mode tariff's existing static date entries by their
// non-price/date fields (hotels/route/duration/etc.) into "variant"
// templates, keyed A, B, C... in first-seen order. Almost every tariff has
// exactly one variant; hyatt09 alternates between two hotel sets, which this
// derives automatically from the static data — no separate hardcoded map.
function buildVariantTemplates(dates) {
  const seen = [];
  dates.forEach((d) => {
    const { date_start, date_end, prices, ...template } = d;
    const key = JSON.stringify(template);
    if (!seen.some((s) => s.key === key)) seen.push({ key, template });
  });
  const letters = ['A', 'B', 'C', 'D', 'E'];
  const templates = {};
  seen.forEach((s, i) => { templates[letters[i] || `V${i}`] = s.template; });
  return templates;
}

function numberOrUndefined(v) {
  if (v === undefined || v === null || v === '') return undefined;
  const n = Number(v);
  return Number.isFinite(n) ? n : undefined;
}

// Mutates `tariffs` in place, replacing each multi-mode tariff's `dates[]`
// with the sheet's rows (matched by tariff_id). A tariff with no matching
// rows is left untouched, so tariffs can be migrated to the sheet one at a
// time without breaking the rest.
export function applyMultiDatesOverride(tariffs, rows) {
  if (!rows || !rows.length) return;

  const byTariff = {};
  rows.forEach((r) => {
    const id = (r.tariff_id || '').trim();
    if (!id) return;
    (byTariff[id] = byTariff[id] || []).push(r);
  });

  Object.keys(byTariff).forEach((id) => {
    const tf = tariffs[id];
    if (!tf || tf.mode !== 'multi' || !tf.dates || !tf.dates.length) return;

    const templates = buildVariantTemplates(tf.dates);
    const newDates = byTariff[id]
      .filter((r) => r.date_start && r.date_end)
      .map((r) => {
        const variantKey = (r.hotel_variant || 'A').trim().toUpperCase();
        const template = templates[variantKey] || templates.A;
        const prices = {};
        const p2 = numberOrUndefined(r.price_2);
        const p3 = numberOrUndefined(r.price_3);
        const p4 = numberOrUndefined(r.price_4);
        if (p2 !== undefined) prices['2'] = p2;
        if (p3 !== undefined) prices['3'] = p3;
        if (p4 !== undefined) prices['4'] = p4;
        return { ...template, date_start: r.date_start, date_end: r.date_end, prices };
      });

    if (newDates.length) tf.dates = newDates;
  });
}

// Mutates `tariffs` in place, replacing the prices for the matching
// tariff+season (jun_sep/oct_dec). A tariff/season with no matching row
// keeps its static defaults.
export function applySeasonalPricesOverride(tariffs, rows) {
  if (!rows || !rows.length) return;

  rows.forEach((r) => {
    const id = (r.tariff_id || '').trim();
    const season = (r.season || '').trim();
    const tf = tariffs[id];
    if (!tf || tf.mode !== 'seasonal' || !tf.seasonal[season]) return;

    const prices = {};
    const sngl = numberOrUndefined(r.price_sngl);
    const dbl = numberOrUndefined(r.price_dbl);
    const trpl = numberOrUndefined(r.price_trpl);
    const quad = numberOrUndefined(r.price_quad);
    if (sngl !== undefined) prices.sngl = sngl;
    if (dbl !== undefined) prices.dbl = dbl;
    if (trpl !== undefined) prices.trpl = trpl;
    if (quad !== undefined) prices.quad = quad;

    if (Object.keys(prices).length) tf.seasonal[season].prices = prices;
  });
}

// Returns { thu, sat } date-pair lists from DepartureDates rows. Empty/
// malformed input yields empty arrays here; setDepartureDates() (called by
// applyOverrides below) falls back to the static calendar in that case.
export function resolveDepartureDates(rows) {
  const thu = [];
  const sat = [];
  (rows || []).forEach((r) => {
    if (!r.date_start || !r.date_end) return;
    const weekday = (r.weekday || '').trim();
    if (weekday === 'Payshanba') thu.push([r.date_start, r.date_end]);
    else if (weekday === 'Shanba') sat.push([r.date_start, r.date_end]);
  });
  return { thu, sat };
}

// Applies every sheet-sourced override onto the live TARIFFS object and the
// shared departure calendar in one call.
export function applyOverrides(tariffs, sheetData) {
  applyMultiDatesOverride(tariffs, sheetData.multiDates);
  applySeasonalPricesOverride(tariffs, sheetData.seasonalPrices);
  setDepartureDates(resolveDepartureDates(sheetData.departureDates));
}

export function loadCache() {
  try {
    const raw = localStorage.getItem(PRICE_CACHE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function saveCache(sheetData) {
  try {
    localStorage.setItem(PRICE_CACHE_KEY, JSON.stringify({
      multiDates: sheetData.multiDates,
      seasonalPrices: sheetData.seasonalPrices,
      departureDates: sheetData.departureDates,
    }));
  } catch {
    // Private-mode/quota-exceeded — non-fatal, just skip caching this round.
  }
}
