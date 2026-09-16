/* ============================================================
   script.js  —  shared behaviour for every page.
   Reads all data from config.js (the WEDDING object).
   ============================================================ */
"use strict";

// Tiny DOM helpers
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Now = the bride & groom (from config)
const W = window.WEDDING || {};

/* ============================================================
   1. FLOATING DECORATIONS (petals / bokeh / sparkles)
      Each theme has its own kind & colour in themes.css.
   ============================================================ */
const DECO = {
  "warm-yellow": { kind: "petal",   n: 14, colors: ["var(--deco-color-1)", "var(--deco-color-2)", "#f3d27a"] },
  "marigold":    { kind: "petal",   n: 16, colors: ["var(--deco-color-1)", "#ff9e2c", "var(--deco-color-2)", "#ffb347"] },
  "royal-red":   { kind: "petal",   n: 13, colors: ["var(--deco-color-1)", "#e05b5b", "#f3cfcf", "var(--deco-color-2)"] },
  "emerald-gold":{ kind: "bokeh",   n: 20, colors: ["var(--deco-color-1)", "var(--deco-color-2)", "#c9a24a"] },
  // the home page shows rose hearts + petals
  home:          { kind: "mixed",  n: 16, colors: ["var(--deco-color-1)", "#f3cfcf", "var(--deco-color-2)"] }
};

function buildDecoration() {
  const wrap = $(".floating-deco");
  if (!wrap) return;
  const theme = document.body.dataset.theme || "home";
  const conf = DECO[theme] || DECO.home;

  for (let i = 0; i < conf.n; i++) {
    const d = document.createElement("span");
    d.className = "deco-item";
    const color = conf.colors[i % conf.colors.length];
    // random size, position, speed & drift
    const size = conf.kind === "bokeh" ? (10 + Math.random() * 30) + "px" : (14 + Math.random() * 26) + "px";
    const left = Math.random() * 100;
    const dur = (8 + Math.random() * 10).toFixed(1);
    const delay = (-Math.random() * 14).toFixed(1);   // negative = already mid-air
    const sway = (Math.random() * 60 - 30).toFixed(0);
    const rot = (Math.random() * 360).toFixed(0);

    if (conf.kind === "bokeh") {
      d.classList.add("bokeh");
      d.style.width = size; d.style.height = size;
      d.style.left = left + "vw";
      d.style.top = (10 + Math.random() * 70) + "vh";
      d.style.background = color;
      d.style.borderRadius = "50%";
      d.style.animationDuration = (6 + Math.random() * 6).toFixed(1) + "s";
      d.style.animationDelay = delay + "s";
      d.style.boxShadow = "0 0 18px " + color;
      d.style.setProperty("--dx", (Math.random() * 60 - 30).toFixed(0) + "px");
      d.style.setProperty("--op", (0.3 + Math.random() * 0.5).toFixed(2));
    } else {
      // falling petal / heart / sparkle
      const shapes = conf.kind === "mixed"
        ? ["🥀", "🌺", "🌼", "🌸", "✨", "❤"]
        : ["🌸", "🌼", "✨", "🍃"];
      d.textContent = conf.kind === "mixed" ? shapes[i % shapes.length] : shapes[i % shapes.length];
      d.style.fontSize = size;
      d.style.left = left + "vw";
      d.style.animationDuration = dur + "s";
      d.style.animationDelay = delay + "s";
      d.style.setProperty("--sway", sway + "px");
      d.style.setProperty("--rot", rot + "deg");
      d.style.textShadow = "0 2px 8px rgba(0,0,0,.15)";
    }
    wrap.appendChild(d);
  }
}

/* ============================================================
   2. CLICK RIPPLE on buttons & cards
   ============================================================ */
function addRipples() {
  $$(".btn, .event-card").forEach(el => {
    el.addEventListener("click", (e) => {
      const rect = el.getBoundingClientRect();
      const r = document.createElement("span");
      const size = Math.max(rect.width, rect.height);
      r.className = "ripple";
      r.style.width = r.style.height = size + "px";
      r.style.left = (e.clientX - rect.left - size / 2) + "px";
      r.style.top  = (e.clientY - rect.top  - size / 2) + "px";
      el.appendChild(r);
      setTimeout(() => r.remove(), 650);
    });
  });
}

/* ============================================================
   3. FADE-IN ON SCROLL (IntersectionObserver)
   ============================================================ */
function initReveal() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(en => {
      if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); }
    });
  }, { threshold: 0.12 });
  $$(".reveal").forEach(el => io.observe(el));
}

/* ============================================================
   4. SMOOTH PAGE TRANSITIONS between pages
   any <a data-nav> fades the page out, then navigates
   ============================================================ */
function initNav() {
  $$("a[data-nav]").forEach(a => {
    a.addEventListener("click", (e) => {
      const href = a.getAttribute("href");
      if (!href || href.startsWith("#")) return;
      e.preventDefault();
      document.body.classList.add("page-leaving");
      setTimeout(() => { location.href = href; }, 420);
    });
  });
}

/* ============================================================
   5. ENVELOPE  (home page only)
   The SAME click that opens the envelope also starts the music.
   ============================================================ */
function initEnvelope() {
  const env = $("#envelope");
  if (!env) return;
  env.addEventListener("click", () => {
    env.classList.add("open");       // open the envelope animation
    startMusicOnEnvelope();          // and begin playback in this gesture
    setTimeout(() => {
      const ov = $(".envelope-overlay");
      if (ov) ov.classList.add("gone");
    }, 1200);
  });
}

/* ============================================================
   6. BACKGROUND MUSIC — plays config.musicSrc continuously
      across page navigation using localStorage state.
   ------------------------------------------------------------
   • NEVER autoplays on a truly fresh visit.
   • index.html envelope click = the first user gesture that
     starts playback (see startMusicOnEnvelope).
   • A plain <audio> element can't survive navigation, so each
     page builds its OWN <audio>, saves its position to
     localStorage every 250 ms, and the next page seeks to that
     saved position → it feels like it never restarted.
   • audio.loop = true → the ~27 s ... repeats seamlessly.
   • Volume ramps up/down for a smooth 0.5 s fade when toggling.
   • If the file is missing or autoplay is blocked, we fail
     silently — no console errors, no broken UI.
   ============================================================ */

/* The localStorage keys (exact names you asked for). */
const MUSIC_STATE = {
  LAST_PLAY: "musicStarted",     // "1" once the envelope was opened
  LAST_MUTE: "musicMuted",       // "1" = user muted the music
  LAST_TIME: "musicCurrentTime"  // playback position in seconds (float)
};

let _musicAudio = null;   // the current page's <audio>
let _musicTimer = null;   // the 250 ms position-save interval
let _musicSizeChecked = false; // (9) only warn about a big file once

/* safe localStorage get/set (never throws, never logs) */
function getLS(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
function setLS(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* ignore */ } }

/* Build (once per page) the PRELOADED, looping <audio> element.
   Creating it at page-load time (not lazily on click) is the key
   mobile fix: the file starts buffering immediately, so an envelope
   click later plays within ~1–2 s instead of minutes. */
function ensureMusicAudio() {
  if (_musicAudio) return _musicAudio;

  const a = new Audio(W.musicSrc || "images/shehnai.mp3");
  a.loop    = true;                  // the ~27 s clip auto-repeats seamlessly
  a.preload = "auto";                // (1) let the browser buffer early
  a.volume  = 1;
  a.muted   = true;                  // (8) silent via .muted, NOT volume 0 → fast on mobile
  a.setAttribute("playsinline", "");        // (5) iOS Safari
  a.setAttribute("webkit-playsinline", ""); // (5) older iOS
  a.load();                          // (3) start buffering immediately

  setMusicLoading(true);             // (7) spinner while it buffers

  // Ready events → stop the spinner (canplaythrough = fully buffered).
  const ready = () => setMusicLoading(false);
  a.addEventListener("canplay", ready);
  a.addEventListener("canplaythrough", ready);   // (4) mobile "ready to play"
  a.addEventListener("playing", ready);
  a.addEventListener("waiting", () => setMusicLoading(true));

  // Save the position every 250 ms — only while it's actually playing.
  _musicTimer = setInterval(() => {
    if (!a.paused && !a.ended) setLS(MUSIC_STATE.LAST_TIME, String(a.currentTime));
  }, 250);

  // Final save the moment we leave, so the next page resumes here.
  window.addEventListener("pagehide", saveMusicTime);

  // Missing / failed file → stop cleanly, no console errors, no broken UI.
  a.addEventListener("error", () => {
    setMusicLoading(false);
    if (_musicTimer) { clearInterval(_musicTimer); _musicTimer = null; }
  });

  _musicAudio = a;

  warnIfLargeFile();                 // (9) console warning only if over 1 MB
  return a;
}

/* Record the current position (used by pagehide and mute). */
function saveMusicTime() {
  const a = _musicAudio;
  if (a && !a.paused && !a.ended && isFinite(a.currentTime)) {
    setLS(MUSIC_STATE.LAST_TIME, String(a.currentTime));
  }
}

/* 0.5 s volume fade (requestAnimationFrame ramp). */
function rampVolume(audio, target, seconds) {
  const from = audio.volume;
  const t0   = performance.now();
  const dur  = (seconds || 0.5) * 1000;
  (function step(now) {
    const p = Math.min(1, (now - t0) / dur);
    audio.volume = from + (target - from) * p;
    if (p < 1) requestAnimationFrame(step);
  })(t0);
}

/* Begin audible playback from the saved position.
   - silence is handled through .muted (NOT volume) → fast on mobile
   - play() is (6) called immediately, never waiting for another event
   - volume only fades in afterwards (a desktop nicety; iOS ignores it) */
function playMusicFromSave() {
  const a = ensureMusicAudio();

  a.muted = false;                     // audible now (was silent via .muted)
  seekToSaved(a);                      // resume from saved time, don't restart
  const p = a.play();                  // (6) immediate play() call
  if (p && p.catch) p.catch(() => { /* blocked / missing file → silent */ });

  fadeIn(a);                           // 0.5 s fade-in after play has started
  updateMusicToggleIcon();
}

/* Seek to the saved playback position so we don't restart from 0. */
function seekToSaved(a) {
  const t = parseFloat(getLS(MUSIC_STATE.LAST_TIME) || "0");
  if (isFinite(t) && t > 0) { try { a.currentTime = t; } catch (e) {} }
}

/* fade helpers built on the 0.5 s volume ramp */
function fadeIn(a)  { a.volume = 0.05; rampVolume(a, 1, 0.5); }
function fadeOut(a) { rampVolume(a, 0.05, 0.5); }

/* The envelope click: this is the first explicit "play" gesture. */
function startMusicOnEnvelope() {
  setLS(MUSIC_STATE.LAST_PLAY, "1");   // remember "the user invited the music"
  updateMusicToggleIcon();
  // Play now, unless the user has muted it.
  if (getLS(MUSIC_STATE.LAST_MUTE) !== "1") playMusicFromSave();
}

/* Fade out, then silence (via .muted) and pause. */
function muteMusic() {
  const a = ensureMusicAudio();
  setLS(MUSIC_STATE.LAST_MUTE, "1");
  updateMusicToggleIcon();
  saveMusicTime();                        // capture the position before pausing
  fadeOut(a);                             // 0.5 s fade
  setTimeout(() => {
    a.muted = true;                       // (8) silence via .muted, not volume
    if (!a.paused) a.pause();
  }, 520);
}

/* Toggle mute/unmute. Un‑muting resumes from the saved time. */
function toggleMusic() {
  if (getLS(MUSIC_STATE.LAST_MUTE) === "1") {
    setLS(MUSIC_STATE.LAST_MUTE, "0");   // unmute...
    playMusicFromSave();                 // ...and resume from the saved time
  } else {
    muteMusic();
  }
}

/* Show 🔊 when playing, 🔇 when muted. */
function updateMusicToggleIcon() {
  const t = $(".music-toggle");
  if (t) t.textContent = getLS(MUSIC_STATE.LAST_MUTE) === "1" ? "🔇" : "🔊";
}

/* Wire up the floating toggle + auto-resume.
   On every page (home included): if the envelope was already opened
   and music isn't muted, resume automatically. A first-time visitor
   never autoplays — they must click the envelope (or the toggle). */
/* (7) Visual buffering indicator on the music button. */
function setMusicLoading(on) {
  const t = $(".music-toggle");
  if (t) t.classList.toggle("loading", !!on);
}

/* (9) Console-only warning if the audio file is over 1 MB.
   Never throws, never breaks anything — a cheap HEAD request. */
function warnIfLargeFile() {
  if (_musicSizeChecked) return;
  _musicSizeChecked = true;
  try {
    const src = W.musicSrc || "images/shehnai.mp3";
    fetch(src, { method: "HEAD", cache: "no-store" })
      .then(r => {
        const len = parseInt(r.headers.get("content-length") || "0", 10);
        if (len > 1048576) {
          console.warn("[wedding-audio] File is " + (len / 1048576).toFixed(1)
            + " MB — over the 1 MB mobile-friendly limit. Smaller MP3 = faster start.");
        }
      })
      .catch(() => { /* HEAD may be blocked on file:// or some hosts — ignore */ });
  } catch (e) { /* ignore */ }
}

/* Wire up the toggle + auto-resume.
   ensureMusicAudio() runs immediately so the file starts buffering at
   page load (the mobile fix); nothing is audible until a real gesture. */
function initMusic() {
  ensureMusicAudio();                 // create + preload + buffer NOW
  updateMusicToggleIcon();

  const toggle = $(".music-toggle");
  if (toggle) toggle.addEventListener("click", toggleMusic);

  // Auto-resume only if the user already invited the music & hasn't muted it.
  if (getLS(MUSIC_STATE.LAST_PLAY) === "1" &&
      getLS(MUSIC_STATE.LAST_MUTE) !== "1") {
    playMusicFromSave();
  }
}

/* ============================================================
   7. EVENT PAGE FILLER — pulls EVERYTHING from config.js
   Looks at body[data-event] to know which event this page is.
   ============================================================ */
function initEventPage() {
  const key = document.body.dataset.event;
  if (!key) return;
  const ev = (W.events || {})[key];
  if (!ev) return;

  // document tab title
  document.title = `${ev.titleBn} — ${W.groom} ও ${W.bride}`;

  // hero title (Bengali + English) + tagline + names
  const tBn = $(".js-title-bn"); if (tBn) tBn.textContent = ev.titleBn;
  const tEn = $(".js-title-en"); if (tEn) tEn.textContent = ev.titleEn;
  const line = $(".js-line"); if (line) line.textContent = ev.line;
  const g = $(".js-groom"); if (g) g.textContent = W.groom;
  const br = $(".js-bride"); if (br) br.textContent = W.bride;

  // theme icon — swap to an emoji if the PNG is missing
  const icon = $(".js-icon");
  if (icon) {
    const map = { "warm-yellow": "🍚", "marigold": "🌼", "royal-red": "🪔", "emerald-gold": "💍", home: "💐" };
    icon.addEventListener("error", () => {
      const span = document.createElement("span");
      span.className = "emoji";
      span.textContent = map[ev.theme] || "🌸";
      icon.replaceWith(span);
    });
    icon.src = ev.icon;
  }

  // details card (date / time / venue)
  const dDate = $(".js-date");      if (dDate) dDate.textContent = ev.dateBn;
  const dTime = $(".js-time");      if (dTime) dTime.textContent = ev.time;
  const dVenue = $(".js-venue");    if (dVenue) dVenue.textContent = ev.venue;
  const dVenue2 = $(".js-venue2");  if (dVenue2) dVenue2.textContent = ev.venueDetail;
  const mapBtn = $(".js-map");      if (mapBtn) mapBtn.href = ev.mapLink;

  // countdown target comes from config's machine date
  startCountdown(ev.date);

  // invite card (downloaded as an image)
  const icNames = $(".js-ic-names"); if (icNames) icNames.innerHTML = `${esc(W.groom)} <span class="amp">&</span> ${esc(W.bride)}`;
  const icEvent = $(".js-ic-event"); if (icEvent) icEvent.textContent = ev.titleBn;
  const icLine  = $(".js-ic-line");  if (icLine)  icLine.textContent = ev.line;
  const icDate  = $(".js-ic-date");  if (icDate)  icDate.textContent = ev.dateBn;
  const icTime  = $(".js-ic-time");  if (icTime)  icTime.textContent = ev.time;
  const icVenue = $(".js-ic-venue"); if (icVenue) icVenue.textContent = ev.venue + (ev.venueDetail ? ", " + ev.venueDetail : "");

  // QR code → encodes the map link (clickable)
  const qr = $(".js-qr");
  const qrLink = $(".js-qr-link");
  const qdata = encodeURIComponent(ev.mapLink);
  if (qr) qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${qdata}`;
  if (qrLink) { qrLink.href = ev.mapLink; qrLink.target = "_blank"; }

  // gallery from config.photos
  buildGallery((ev.photos || []));

  // footer names
  const fg = $(".js-f-groom"); if (fg) fg.textContent = W.groom;
  const fb = $(".js-f-bride"); if (fb) fb.textContent = W.bride;

  // download button
  const dl = $(".js-download");
  if (dl) dl.addEventListener("click", () => downloadCard(icWrap("inviteCard"), `${key}-invitation`));
}

/* ============================================================
   7b. HOME PAGE FILLER — names, greeting & the 4 event cards
       drive every value from config.js.
   ============================================================ */
function initHomeCards() {
  if (!W.events) return;
  const g = $(".js-groom-h");  if (g) g.textContent = W.groom;
  const b = $(".js-bride-h");  if (b) b.textContent = W.bride;
  const gr = $(".js-greeting"); if (gr) gr.textContent = W.greetingBn;
  const fg = $(".js-f-groom");  if (fg) fg.textContent = W.groom;
  const fb = $(".js-f-bride");  if (fb) fb.textContent = W.bride;

  $$(".event-card").forEach(card => {
    const key = card.dataset.card;
    if (!key) return;
    const ev = W.events[key];
    if (!ev) return;
    const bn = $(".ec-bn", card); if (bn) bn.textContent = ev.titleBn;
    const en = $(".ec-en", card); if (en) en.textContent = ev.titleEn;
    const da = $(".ec-date", card); if (da) da.textContent = ev.dateBn;
    // use the real page file (config key differs from the file name, e.g. "aiburoBhat" → "aiburo-bhat.html")
    card.href = ev.page || (key + ".html");
  });
}

/* escape text that goes into HTML (safe names) */
function esc(s) { return String(s || "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" })[c]); }

/* locate an element by id, then by class fallback */
function icWrap(klass) {
  return $("#inviteCard") || $("." + klass) || $(".invite-card");
}

/* ============================================================
   8. COUNTDOWN (ticks every second, bounces on change)
   ============================================================ */
function startCountdown(isoDate) {
  const wrap = $(".countdown");
  if (!wrap) return;
  const boxes = {
    d: $(".js-d"), h: $(".js-h"), m: $(".js-m"), s: $(".js-s")
  };
  const pastLabel = $(".js-count-label");
  const target = new Date(isoDate + "T00:00:00").getTime();
  if (isNaN(target)) return;

  function tick() {
    const now = Date.now();
    const diff = target - now;

    if (diff <= 0) {
      if (pastLabel) pastLabel.textContent = "শুভ অনুষ্ঠান সম্পন্ন হয়েছে 🎉";
      ["d","h","m","s"].forEach(k => { if (boxes[k]) boxes[k].textContent = "০"; });
      return;
    }
    const d = Math.floor(diff / 86400000);
    const h = Math.floor(diff / 3600000) % 24;
    const m = Math.floor(diff / 60000) % 60;
    const s = Math.floor(diff / 1000) % 60;
    setBox(boxes.d, d); setBox(boxes.h, h); setBox(boxes.m, m); setBox(boxes.s, s);
  }
  const last = {};
  function setBox(el, val) {
    if (!el) return;
    const str = String(val).padStart(2, "0");
    if (last[el] !== str) {
      el.textContent = str;
      el.classList.remove("bounce");
      void el.offsetWidth;                       // restart the animation
      el.classList.add("bounce");
      last[el] = str;
    }
  }
  tick();
  setInterval(tick, 1000);
}

/* ============================================================
   9. GALLERY + LIGHTBOX
   ============================================================ */
function buildGallery(photos) {
  const gal = $(".js-gallery");
  if (!gal) return;
  gal.innerHTML = "";
  photos.forEach((src, i) => {
    const fig = document.createElement("figure");
    const img = document.createElement("img");
    img.loading = "lazy";
    img.alt = `ছবি ${i + 1}`;
    img.src = src;
    fig.appendChild(img);
    fig.addEventListener("click", () => openLightbox(i, photos));
    gal.appendChild(fig);
  });
}

function openLightbox(start, photos) {
  const lb = $(".lightbox"); if (!lb) return;
  const img = $(".lb-img");
  let idx = start;
  const show = (i) => { idx = (i + photos.length) % photos.length; img.src = photos[idx]; };
  show(start);
  lb.classList.add("open");
  const close = () => lb.classList.remove("open");
  $(".lb-close").onclick = close;
  $(".lb-prev").onclick = () => show(idx - 1);
  $(".lb-next").onclick = () => show(idx + 1);
  lb.onclick = (e) => { if (e.target === lb) close(); };
  // esc key closes
  const key = (e) => { if (e.key === "Escape") { close(); document.removeEventListener("keydown", key); } };
  document.addEventListener("keydown", key);
}

/* ============================================================
   10. DOWNLOAD INVITATION CARD AS AN IMAGE
       Vanilla-only: puts a live clone of the card in the DOM
       (offscreen), serializes it to an SVG (foreignObject),
       rasterizes it on a <canvas> and downloads a PNG.
       Works in Chrome / Edge / Firefox.
   ============================================================ */
function downloadCard(el, filename) {
  try {
    // Put a live clone into the DOM (offscreen) so getComputedStyle
    // returns real values and the webfonts are applied.
    const holder = document.createElement("div");
    holder.style.cssText = "position:fixed;left:-999999px;top:0;width:460px;z-index:-1;pointer-events:none;opacity:0;";
    holder.appendChild(el.cloneNode(true));
    document.body.appendChild(holder);

    // copy computed styles onto the inner card so foreignObject can render it
    inlineStyles(holder.firstElementChild);

    const w = 460;
    const h = Math.min(holder.firstElementChild.offsetHeight || 1500, 3000);
    const scale = 2; // crisp output

    const svg =
      `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">` +
        `<foreignObject width="100%" height="100%">` +
          `<div xmlns="http://www.w3.org/1999/xhtml">${serializeHTML(holder)}</div>` +
        `</foreignObject></svg>`;

    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement("canvas");
      canvas.width = w * scale;
      canvas.height = h * scale;
      const ctx = canvas.getContext("2d");
      ctx.scale(scale, scale);
      ctx.fillStyle = document.body.dataset.theme === "emerald-gold" ? "#0a3d2e" : "#fffdf6";
      ctx.fillRect(0, 0, w, h);
      ctx.drawImage(img, 0, 0, w, h);
      try {
        const a = document.createElement("a");
        a.download = filename + ".png";
        a.href = canvas.toDataURL("image/png");
        a.click();
      } catch (e) { alert("ডাউনলোড ব্যর্থ। দয়া করে আবার চেষ্টা করুন।"); }
      document.body.removeChild(holder);
    };
    img.onerror = () => { alert("এই ব্রাউজারে ছবি-ডাউনলোড কাজ করছে না। এর বদলে স্ক্রিনশট নিন।"); document.body.removeChild(holder); };
    img.src = "data:image/svg+xml;charset=utf-8," + encodeURIComponent(svg);
  } catch (err) {
    console.warn("Invite-card download failed:", err);
    alert("এই ব্রাউজারে ছবি-ডাউনলোড কাজ করছে না। এর বদলে স্ক্রিনশট নিন।");
  }
}

/* copy the essential computed style onto the element and its
   descendants, so a foreignObject clone renders without stylesheets */
function inlineStyles(root) {
  const props = [
    "font-style", "font-weight", "font-family", "font-size", "line-height",
    "color", "text-align", "background-color", "background", "border",
    "border-radius", "padding", "margin", "display", "letter-spacing",
    "text-transform"
  ];
  const walk = (el) => {
    const cs = getComputedStyle(el);
    props.forEach(p => {
      const v = cs.getPropertyValue(p);
      if (v) { try { el.style.setProperty(p, v); } catch (e) {} }
    });
    el.querySelectorAll("*").forEach(walk);
  };
  walk(root);
  root.style.width = "460px";
}

/* serialize the offscreen clone to clean HTML (drop links & scripts) */
function serializeHTML(holder) {
  const inner = holder.firstElementChild;
  inner.querySelectorAll("a,script,style").forEach(n => n.remove());
  return inner.outerHTML;
}

/* ============================================================
   BOOT
   ============================================================ */
document.addEventListener("DOMContentLoaded", () => {
  buildDecoration();     // floating petals/bokeh
  addRipples();          // button ripples
  initReveal();          // fade-in on scroll
  initNav();             // page transitions
  initEnvelope();        // home envelope
  initMusic();           // music toggle
  initEventPage();       // fill this event page from config.js
  initHomeCards();       // fill home names + event cards from config.js
});