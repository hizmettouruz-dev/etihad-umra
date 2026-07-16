// Cloudflare Worker — proxies lead-form submissions from the static site to
// Telegram, so the bot token never has to be embedded in client-side code.
//
// Required secrets (set via `wrangler secret put <NAME>`, never committed):
//   BOT_TOKEN     — Telegram bot token from @BotFather
//   TARGET_CHAT_ID — chat_id of the person/group that should receive leads
//
// Required var (can be in wrangler.toml [vars], not secret):
//   ALLOWED_ORIGIN — exact site origin, e.g. https://hizmettouruz-dev.github.io

function corsHeaders(origin) {
  return {
    'Access-Control-Allow-Origin': origin,
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };
}

function escapeHtml(str) {
  return String(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export default {
  async fetch(request, env) {
    const origin = env.ALLOWED_ORIGIN;

    if (request.method === 'OPTIONS') {
      return new Response(null, { headers: corsHeaders(origin) });
    }

    if (request.method !== 'POST') {
      return new Response(JSON.stringify({ ok: false, error: 'method_not_allowed' }), {
        status: 405,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    const url = new URL(request.url);
    if (url.pathname !== '/lead') {
      return new Response(JSON.stringify({ ok: false, error: 'not_found' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    let body;
    try {
      body = await request.json();
    } catch (e) {
      return new Response(JSON.stringify({ ok: false, error: 'invalid_json' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    const { firstName, lastName, phone, travelDates, packageName } = body;

    if (!firstName || !lastName || !phone) {
      return new Response(JSON.stringify({ ok: false, error: 'missing_fields' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    const text = [
      '🕋 <b>Новая заявка — EtiHAD</b>',
      `Имя: ${escapeHtml(firstName)}`,
      `Фамилия: ${escapeHtml(lastName)}`,
      `Телефон: ${escapeHtml(phone)}`,
      travelDates ? `Даты: ${escapeHtml(travelDates)}` : null,
      packageName ? `Пакет: ${escapeHtml(packageName)}` : null,
    ].filter(Boolean).join('\n');

    const tgRes = await fetch(`https://api.telegram.org/bot${env.BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: env.TARGET_CHAT_ID,
        text,
        parse_mode: 'HTML',
      }),
    });

    if (!tgRes.ok) {
      return new Response(JSON.stringify({ ok: false, error: 'telegram_failed' }), {
        status: 502,
        headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
      });
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'Content-Type': 'application/json', ...corsHeaders(origin) },
    });
  },
};
