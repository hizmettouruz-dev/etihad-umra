// Fixed 2026 departure schedule, shared across all tariffs by departure weekday.
// Source: nematovs700.github.io/Umra (the old site this data was migrated from).
export const THU_DATES_2026 = [
  ['25.06.2026', '04.07.2026'],
  ['02.07.2026', '11.07.2026'],
  ['09.07.2026', '18.07.2026'],
  ['16.07.2026', '25.07.2026'],
  ['23.07.2026', '01.08.2026'],
  ['30.07.2026', '08.08.2026'],
  ['06.08.2026', '15.08.2026'],
  ['13.08.2026', '22.08.2026'],
  ['20.08.2026', '29.08.2026'],
  ['27.08.2026', '05.09.2026'],
  ['03.09.2026', '12.09.2026'],
  ['10.09.2026', '19.09.2026'],
  ['17.09.2026', '26.09.2026'],
  ['24.09.2026', '03.10.2026'],
];

export const SAT_DATES_2026 = [
  ['04.07.2026', '16.07.2026'],
  ['11.07.2026', '23.07.2026'],
  ['18.07.2026', '30.07.2026'],
  ['25.07.2026', '06.08.2026'],
  ['01.08.2026', '13.08.2026'],
  ['08.08.2026', '20.08.2026'],
  ['15.08.2026', '27.08.2026'],
  ['22.08.2026', '03.09.2026'],
  ['29.08.2026', '10.09.2026'],
  ['05.09.2026', '17.09.2026'],
  ['12.09.2026', '24.09.2026'],
  ['19.09.2026', '01.10.2026'],
  ['26.09.2026', '08.10.2026'],
];

export function datesForDepartureDay(departureDayRu) {
  if (departureDayRu === 'Четверг') return THU_DATES_2026;
  if (departureDayRu === 'Суббота') return SAT_DATES_2026;
  return [];
}

// Sheet-overridable departure calendar. Starts out as the static defaults
// above; setDepartureDates() swaps in sheet-sourced dates once fetched
// (see pricesStore.js). Falls back to the static defaults if never called
// or given empty/malformed data — the calendar is never empty.
let currentThuDates = THU_DATES_2026;
let currentSatDates = SAT_DATES_2026;

export function getThuDates() {
  return currentThuDates;
}

export function getSatDates() {
  return currentSatDates;
}

export function setDepartureDates({ thu, sat } = {}) {
  currentThuDates = (thu && thu.length) ? thu : THU_DATES_2026;
  currentSatDates = (sat && sat.length) ? sat : SAT_DATES_2026;
}
