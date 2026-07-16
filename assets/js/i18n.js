const DICT = {
  nav_tariffs: { ru: 'Тарифы', uz: 'Паразитарифлар', tj: 'Нархнома' },
  nav_faq: { ru: 'Вопросы', uz: 'Savollar', tj: 'Саволҳо' },
  nav_contacts: { ru: 'Контакты', uz: 'Kontaktlar', tj: 'Тамос' },

  hero_label: { ru: 'Умра · 2026', uz: 'Умра · 2026', tj: 'Умра · 2026' },
  hero_title: { ru: 'Ваш путь в <span>Мекку и Медину</span>', uz: 'Sizning <span>Makka va Madina</span>ga yo\'lingiz', tj: '<span>Макка ва Мадина</span>-ро зиёрат кунед' },
  hero_sub: { ru: 'Перелёт, отели, питание и полное сопровождение — всё включено в один пакет.', uz: 'Parvoz, mehmonxona, ovqatlanish va to\'liq hamrohlik — barchasi bitta paketda.', tj: 'Парвоз, меҳмонхона, хӯрок ва ҳамроҳии пурра — ҳама дар як бастаи ягона.' },
  hero_cta: { ru: 'Смотреть тарифы', uz: 'Tariflarni ko\'rish', tj: 'Дидани нархнома' },

  tariffs_label: { ru: 'Пакеты туров', uz: 'Tur paketlari', tj: 'Бастаҳои сафар' },
  tariffs_title: { ru: 'Выберите свой тариф', uz: 'O\'z tarifingizni tanlang', tj: 'Нархномаи худро интихоб кунед' },

  price_from: { ru: 'от', uz: 'dan', tj: 'аз' },
  per_person: { ru: 'чел.', uz: 'kishi', tj: 'нафар' },
  coming_soon: { ru: 'Скоро', uz: 'Tez kunda', tj: 'Ба зудӣ' },
  btn_request: { ru: 'Оставить заявку', uz: 'Ariza qoldirish', tj: 'Дархост гузоштан' },
  btn_details: { ru: 'Подробнее', uz: 'Batafsil', tj: 'Дар бораи муфассал' },

  tab_hotels: { ru: 'Отели', uz: 'Mehmonxonalar', tj: 'Меҳмонхонаҳо' },
  tab_flight: { ru: 'Перелёт', uz: 'Parvoz', tj: 'Парвоз' },
  tab_prices: { ru: 'Цены и фото', uz: 'Narxlar va rasm', tj: 'Нарх ва акс' },
  col_gallery_prices: { ru: 'Фото и цены', uz: 'Rasm va narxlar', tj: 'Акс ва нарх' },
  col_hotels: { ru: 'Отели по городам', uz: 'Shaharlar bo\'yicha mehmonxonalar', tj: 'Меҳмонхонаҳо аз рӯи шаҳрҳо' },
  col_flight_info: { ru: 'Перелёт, питание, включено', uz: 'Parvoz, ovqat, narxga kiritilgan', tj: 'Парвоз, хӯрок, дохил' },

  faq_label: { ru: 'FAQ', uz: 'FAQ', tj: 'FAQ' },
  faq_title: { ru: 'Часто задаваемые вопросы', uz: 'Ko\'p beriladigan savollar', tj: 'Саволҳои зуд-зуд додашаванда' },

  contacts_label: { ru: 'Связь с нами', uz: 'Biz bilan aloqa', tj: 'Бо мо тамос гиред' },
  contacts_title: { ru: 'Контакты и адрес', uz: 'Kontakt va manzil', tj: 'Тамос ва суроға' },
  contact_phone: { ru: 'Телефон', uz: 'Telefon', tj: 'Телефон' },
  contact_address: { ru: 'Адрес', uz: 'Manzil', tj: 'Суроға' },
  contact_hours: { ru: 'Часы работы', uz: 'Ish vaqti', tj: 'Соатҳои корӣ' },
  contact_social: { ru: 'Мы в сети', uz: 'Ijtimoiy tarmoqlar', tj: 'Шабакаҳои иҷтимоӣ' },

  form_title: { ru: 'Оставить заявку', uz: 'Ariza qoldirish', tj: 'Дархост гузоштан' },
  form_firstname: { ru: 'Имя', uz: 'Ism', tj: 'Ном' },
  form_lastname: { ru: 'Фамилия', uz: 'Familiya', tj: 'Насаб' },
  form_phone: { ru: 'Номер телефона', uz: 'Telefon raqami', tj: 'Рақами телефон' },
  form_dates: { ru: 'Предпочтительные даты', uz: 'Istalgan sanalar', tj: 'Санаҳои дилхоҳ' },
  form_submit: { ru: 'Отправить заявку', uz: 'Arizani yuborish', tj: 'Дархостро фиристодан' },
  form_sending: { ru: 'Отправка…', uz: 'Yuborilmoqda…', tj: 'Фиристода истодааст…' },
  form_ok: { ru: 'Заявка отправлена! Мы скоро свяжемся с вами.', uz: 'Ariza yuborildi! Tez orada siz bilan bog\'lanamiz.', tj: 'Дархост фиристода шуд! Ба зудӣ бо шумо тамос мегирем.' },
  form_err: { ru: 'Не удалось отправить. Попробуйте ещё раз или позвоните нам.', uz: 'Yuborib bo\'lmadi. Qayta urinib ko\'ring yoki bizga qo\'ng\'iroq qiling.', tj: 'Фиристода нашуд. Дубора кӯшиш кунед ё ба мо занг занед.' },

  loading: { ru: 'Загрузка…', uz: 'Yuklanmoqda…', tj: 'Бор карда истодааст…' },
  load_error: { ru: 'Не удалось загрузить данные.', uz: 'Ma\'lumotlarni yuklab bo\'lmadi.', tj: 'Маълумот бор карда нашуд.' },
  retry: { ru: 'Повторить', uz: 'Qayta urinish', tj: 'Такрор кардан' },

  footer_rights: { ru: 'Все права защищены.', uz: 'Barcha huquqlar himoyalangan.', tj: 'Ҳамаи ҳуқуқҳо ҳифз шудаанд.' },
};

const LANG_KEY = 'lang';
let currentLang = localStorage.getItem(LANG_KEY) || 'ru';

export function t(key) {
  const entry = DICT[key];
  if (!entry) return key;
  return entry[currentLang] || entry.ru || key;
}

export function getLang() {
  return currentLang;
}

export function setLang(lang) {
  currentLang = lang;
  localStorage.setItem(LANG_KEY, lang);
  applyStaticStrings();
  document.documentElement.lang = lang;
  document.dispatchEvent(new CustomEvent('langchange', { detail: { lang } }));
}

export function applyStaticStrings() {
  document.querySelectorAll('[data-i18n]').forEach((el) => {
    el.innerHTML = t(el.dataset.i18n);
  });
  document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
    el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder));
  });
  document.querySelectorAll('.lang-switch button').forEach((btn) => {
    btn.setAttribute('aria-pressed', String(btn.dataset.lang === currentLang));
  });
}

export function initI18n() {
  document.documentElement.lang = currentLang;
  applyStaticStrings();
  document.querySelectorAll('.lang-switch button').forEach((btn) => {
    btn.addEventListener('click', () => setLang(btn.dataset.lang));
  });
}
