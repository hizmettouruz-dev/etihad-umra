const DICT = {
  nav_tariffs: { ru: 'Тарифы', uz: 'Тарифлар', tj: 'Нархнома' },
  nav_faq: { ru: 'Вопросы', uz: 'Саволлар', tj: 'Саволҳо' },
  nav_contacts: { ru: 'Контакты', uz: 'Контактлар', tj: 'Тамос' },

  hero_label: { ru: 'Умра · 2026', uz: 'Умра · 2026', tj: 'Умра · 2026' },
  hero_title: { ru: 'Ваш путь в <span>Мекку и Медину</span>', uz: 'Сизнинг <span>Макка ва Мадина</span>га йўлингиз', tj: '<span>Макка ва Мадина</span>-ро зиёрат кунед' },
  hero_sub: { ru: 'Перелёт, отели, питание и полное сопровождение — всё включено в один пакет.', uz: 'Парвоз, меҳмонхона, овқатланиш ва тўлиқ ҳамроҳлик — барчаси битта пакетда.', tj: 'Парвоз, меҳмонхона, хӯрок ва ҳамроҳии пурра — ҳама дар як бастаи ягона.' },
  hero_cta: { ru: 'Смотреть тарифы', uz: 'Тарифларни кўриш', tj: 'Дидани нархнома' },

  tariffs_label: { ru: 'Пакеты туров', uz: 'Тур пакетлари', tj: 'Бастаҳои сафар' },
  tariffs_title: { ru: 'Выберите свой тариф', uz: 'Ўз тарифингизни танланг', tj: 'Нархномаи худро интихоб кунед' },

  price_from: { ru: 'от', uz: 'дан', tj: 'аз' },
  per_person: { ru: 'чел.', uz: 'киши', tj: 'нафар' },
  coming_soon: { ru: 'Скоро', uz: 'Тез кунда', tj: 'Ба зудӣ' },
  btn_request: { ru: 'Оставить заявку', uz: 'Ариза қолдириш', tj: 'Дархост гузоштан' },
  btn_details: { ru: 'Подробнее', uz: 'Батафсил', tj: 'Дар бораи муфассал' },

  tab_hotels: { ru: 'Отели', uz: 'Меҳмонхоналар', tj: 'Меҳмонхонаҳо' },
  tab_flight: { ru: 'Перелёт', uz: 'Парвоз', tj: 'Парвоз' },
  tab_prices: { ru: 'Цены и фото', uz: 'Нархлар ва расм', tj: 'Нарх ва акс' },
  col_gallery_prices: { ru: 'Фото и цены', uz: 'Расм ва нархлар', tj: 'Акс ва нарх' },
  col_hotels: { ru: 'Отели по городам', uz: 'Шаҳарлар бўйича меҳмонхоналар', tj: 'Меҳмонхонаҳо аз рӯи шаҳрҳо' },
  col_flight_info: { ru: 'Перелёт, питание, включено', uz: 'Парвоз, овқат, нархга киритилган', tj: 'Парвоз, хӯрок, дохил' },

  faq_label: { ru: 'FAQ', uz: 'Савол-жавоб', tj: 'Саволу ҷавоб' },
  faq_title: { ru: 'Часто задаваемые вопросы', uz: 'Кўп бериладиган саволлар', tj: 'Саволҳои зуд-зуд додашаванда' },

  contacts_label: { ru: 'Связь с нами', uz: 'Биз билан алоқа', tj: 'Бо мо тамос гиред' },
  contacts_title: { ru: 'Контакты и адрес', uz: 'Контакт ва манзил', tj: 'Тамос ва суроға' },
  contact_phone: { ru: 'Телефон', uz: 'Телефон', tj: 'Телефон' },
  contact_address: { ru: 'Адрес', uz: 'Манзил', tj: 'Суроға' },
  contact_hours: { ru: 'Часы работы', uz: 'Иш вақти', tj: 'Соатҳои корӣ' },
  contact_social: { ru: 'Мы в сети', uz: 'Ижтимоий тармоқлар', tj: 'Шабакаҳои иҷтимоӣ' },

  form_title: { ru: 'Оставить заявку', uz: 'Ариза қолдириш', tj: 'Дархост гузоштан' },
  form_firstname: { ru: 'Имя', uz: 'Исм', tj: 'Ном' },
  form_lastname: { ru: 'Фамилия', uz: 'Фамилия', tj: 'Насаб' },
  form_phone: { ru: 'Номер телефона', uz: 'Телефон рақами', tj: 'Рақами телефон' },
  form_dates: { ru: 'Предпочтительные даты', uz: 'Исталган саналар', tj: 'Санаҳои дилхоҳ' },
  form_submit: { ru: 'Отправить заявку', uz: 'Аризани юбориш', tj: 'Дархостро фиристодан' },
  form_sending: { ru: 'Отправка…', uz: 'Юборилмоқда…', tj: 'Фиристода истодааст…' },
  form_ok: { ru: 'Заявка отправлена! Мы скоро свяжемся с вами.', uz: 'Ариза юборилди! Тез орада сиз билан боғланамиз.', tj: 'Дархост фиристода шуд! Ба зудӣ бо шумо тамос мегирем.' },
  form_err: { ru: 'Не удалось отправить. Попробуйте ещё раз или позвоните нам.', uz: 'Юбориб бўлмади. Қайта уриниб кўринг ёки бизга қўнғироқ қилинг.', tj: 'Фиристода нашуд. Дубора кӯшиш кунед ё ба мо занг занед.' },

  loading: { ru: 'Загрузка…', uz: 'Юкланмоқда…', tj: 'Бор карда истодааст…' },
  load_error: { ru: 'Не удалось загрузить данные.', uz: 'Маълумотларни юклаб бўлмади.', tj: 'Маълумот бор карда нашуд.' },
  retry: { ru: 'Повторить', uz: 'Қайта уриниш', tj: 'Такрор кардан' },

  footer_rights: { ru: 'Все права защищены.', uz: 'Барча ҳуқуқлар ҳимояланган.', tj: 'Ҳамаи ҳуқуқҳо ҳифз шудаанд.' },
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
