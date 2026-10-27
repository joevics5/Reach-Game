/* Reach AI client. Runs in the browser:
 *  - Gemini: calls the Gemini API directly with the key the player saved in Settings (stored only in this browser).
 *  - Server: falls back to /api/ai (demo replies, or Anthropic if the server has a key).
 * Later, a Supabase edge function can replace the direct call so no key lives in the browser. */
(function () {
  var KEY = 'reach-settings-v1';
  var MODELS = ['gemini-3.5-flash-lite', 'gemini-3.8-flash', 'gemini-3.6-flash', 'gemini-3.1-flash-lite', 'gemini-4-argon'];
  var DEFAULTS = { key: '', quick: 'gemini-3.5-flash-lite', review: 'gemini-3.8-flash' };

  function load() {
    var s = {}; try { s = JSON.parse(localStorage.getItem(KEY) || '{}') || {}; } catch (e) { /* storage blocked */ }
    return { key: String(s.key || ''), quick: String(s.quick || DEFAULTS.quick), review: String(s.review || DEFAULTS.review) };
  }
  function save(s) { try { localStorage.setItem(KEY, JSON.stringify(s)); return true; } catch (e) { return false; } }
  function active() { return !!load().key; }
  function label() { return active() ? 'Gemini (' + load().quick + ')' : 'demo replies'; }

  /* The first turn is the character's rules: it becomes the system instruction. Same-role turns are merged. */
  function toGemini(turns) {
    var sys = null, contents = [];
    turns.forEach(function (t, i) {
      if (i === 0 && t.role === 'user' && turns.length > 1) { sys = t.content; return; }
      var role = t.role === 'assistant' ? 'model' : 'user', last = contents[contents.length - 1];
      if (last && last.role === role) last.parts.push({ text: t.content }); else contents.push({ role: role, parts: [{ text: t.content }] });
    });
    return { sys: sys, contents: contents };
  }
  function pickJson(text) {
    var t = String(text || '').replace(/```json|```/g, '');
    var a = t.indexOf('{'), b = t.lastIndexOf('}');
    if (a < 0 || b <= a) throw { code: 'invalid_json', detail: 'no JSON in the reply' };
    try { return JSON.parse(t.slice(a, b + 1)); } catch (e) { throw { code: 'invalid_json', detail: 'the reply was cut off or malformed' }; }
  }

  async function gemini(turns, model, review, key) {
    var g = toGemini(turns);
    var body = { contents: g.contents, generationConfig: { responseMimeType: 'application/json', maxOutputTokens: review ? 8192 : 2048 } };
    if (g.sys) body.systemInstruction = { parts: [{ text: g.sys }] };
    var res;
    try {
      res = await fetch('https://generativelanguage.googleapis.com/v1beta/models/' + encodeURIComponent(model) + ':generateContent', {
        method: 'POST', headers: { 'content-type': 'application/json', 'x-goog-api-key': key }, body: JSON.stringify(body)
      });
    } catch (e) { throw { code: 'network' }; }
    if (!res.ok) {
      var msg = ''; try { msg = (await res.json()).error.message; } catch (e) { /* no body */ }
      var code = res.status === 429 ? 'rate_limited' : (res.status === 400 || res.status === 401 || res.status === 403) ? 'bad_key' : res.status === 404 ? 'bad_model' : 'server_' + res.status;
      throw { code: code, detail: msg };
    }
    var data = await res.json();
    var c = data.candidates && data.candidates[0];
    var text = c && c.content && c.content.parts ? c.content.parts.map(function (p) { return p.text || ''; }).join('') : '';
    if (!text) throw { code: 'empty', detail: (c && c.finishReason) || (data.promptFeedback && data.promptFeedback.blockReason) };
    return pickJson(text);
  }

  async function server(turns, tier) {
    var res;
    try { res = await fetch('/api/ai', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ turns: turns, tier: tier }) }); } catch (e) { throw { code: 'network' }; }
    if (res.status === 429) throw { code: 'rate_limited' };
    if (!res.ok) throw { code: 'server_' + res.status };
    return res.json();
  }

  /** tier: 'quick' for a character's reply, 'default' for the end-of-challenge review. */
  function call(input, tier) {
    var turns = typeof input === 'string' ? [{ role: 'user', content: input }] : input;
    var s = load();
    if (!s.key) return server(turns, tier);
    return gemini(turns, tier === 'default' ? s.review : s.quick, tier === 'default', s.key);
  }

  /** Settings page: check that the key and model work. */
  async function test(key, model) {
    var r = await gemini([{ role: 'user', content: 'Reply with exactly this JSON and nothing else: {"ok":true}' }], model, false, key);
    return r && r.ok === true;
  }

  window.ReachAI = { load: load, save: save, active: active, label: label, call: call, test: test, MODELS: MODELS };
})();
