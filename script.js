/* ============================================================
   script.js  —  behaviour for the SINGLE-PAGE wedding app.
   ------------------------------------------------------------
   index.html holds all five views as <section class="view">.
   Only ONE view is visible at a time. script.js:
     • switches views by URL hash  (#landing, #aiburo-bhat, …)
     • fills every view from config.js (the WEDDING object)
     • drives the ONE shared <audio> (never recreated → music
       keeps playing across view switches, even on mobile)
   ============================================================ */
"use strict";

// Tiny DOM helpers (scoped: pass a root to query within one view)
const $  = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

// Now = the bride & groom (from config)
const W = window.WEDDING || {};

// The five "pages" as section ids (used for hash routing)
const VIEW_IDS = ["landing", "aiburo-bhat", "gaye-holud", "biye", "bojhat"];
const LANDING_TITLE = "বিয়েয়ের আমন্ত্রণ — Wedding Invitation";

/* ============================================================
   1. FLOATING DECORATIONS (petals / bokeh / sparkles)
      Built once into EACH view, using that view's own theme.
      Hidden views are display:none, so only the active view's
      decorations animate.
   ============================================================ */
const DECO = {
  "warm-yellow": { kind: "petal",   n: 14, colors: ["var(--deco-color-1)", "var(--deco-color-2)", "#f3d27a"] },
  "marigold":    { kind: "petal",   n: 16, colors: ["var(--deco-color-1)", "#ff9e2c", "var(--deco-color-2)", "#ffb347"] },
  "royal-red":   { kind: "petal",   n: 13, colors: ["var(--deco-color-1)", "#e05b5b", "#f3cfcf", "var(--deco-color-2)"] },
  "emerald-gold":{ kind: "bokeh",   n: 20, colors: ["var(--deco-color-1)", "var(--deco-color-2)", "#c9a24a"] },
  // the landing page shows rose hearts + petals
  home:          { kind: "mixed",  n: 16, colors: ["var(--deco-color-1)", "#f3cfcf", "var(--deco-color-2)"] }
};

function buildDecoration() {
  $$(".floating-deco").forEach(wrap => {
    const sec = wrap.closest("#landing, section[data-theme]");
    const theme = sec ? sec.dataset.theme : (document.body.dataset.theme || "home");
    const conf = DECO[theme] || DECO.home;

    for (let i = 0; i < conf.n; i++) {
      const d = document.createElement("span");
      d.className = "deco-item";
      const color = conf.colors[i % conf.colors.length];
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
        const shapes = conf.kind === "mixed"
          ? ["🥀", "🌺", "🌼", "🌸", "✨", "❤"]
          : ["🌸", "🌼", "✨", "🍃"];
        d.textContent = shapes[i % shapes.length];
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
  });
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
      Works across all views — hidden views are skipped until shown.
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
   4. SPA ROUTER — show one <section class="view"> at a time.
   ------------------------------------------------------------
   • event cards / "মূল পাতা" buttons are <a href="#view-id">.
   • a hashchange shows that view (so the browser back/forward
     buttons work), with a 0.4 s fade transition.
   • other in-page anchors (#events, #details-*) are left for the
     browser to smooth-scroll within the current view.
   • the page never reloads → the single <audio> never restarts.
   ============================================================ */
function initNav() {
  function switchView(id) {
    const target = document.getElementById(id);
    if (!target) return;
    // hide the current view, show the target (fade via .active animation)
    const cur = document.querySelector(".view.active");
    if (cur) cur.classList.remove("active");
    target.classList.add("active");
    // mirror the view's theme onto <body> so the fixed chrome (music
    // toggle, back buttons, royal-red frame) and body bg take its colors
    document.body.dataset.theme = target.dataset.theme || "home";
    // keep the tab title meaningful
    if (id === "landing") {
      document.title = LANDING_TITLE;
    } else {
      const sec = $("[data-event]", target);
      const key = sec && sec.dataset.event;
      const ev = (W.events || {})[key];
      document.title = ev ? `${ev.titleBn} — ${W.groom} ও ${W.bride}` : LANDING_TITLE;
    }
    // jump to the top instantly (don't inherit the CSS smooth-scroll)
    try { window.scrollTo({ top: 0, left: 0, behavior: "instant" }); }
    catch (e) { window.scrollTo(0, 0); }
  }

  // clicking an <a href="#view-id"> — intercept so we control the switch
  document.addEventListener("click", (e) => {
    const a = e.target.closest('a[href^="#"]');
    if (!a) return;
    const id = decodeURIComponent(a.getAttribute("href").slice(1));
    if (VIEW_IDS.indexOf(id) === -1) return;   // #events / #details-* → let it scroll
    e.preventDefault();
    if (location.hash === "#" + id) { switchView(id); }  // already there → just jump
    else location.hash = id;                             // push history → hashchange switches
  });

  // browser back/forward (and deep links) drive the view via the hash
  window.addEventListener("hashchange", () => {
    const id = location.hash.replace("#", "");
    if (VIEW_IDS.indexOf(id) !== -1) switchView(id);
  });

  // on first load, honour a deep-link hash (e.g. an invite sent as /#biye)
  const initial = location.hash.replace("#", "");
  if (VIEW_IDS.indexOf(initial) !== -1) switchView(initial);
}

/* ============================================================
   5. ENVELOPE  (landing view)
   The SAME click that opens the envelope also starts the music.
   ============================================================ */
function initEnvelope() {
  const env = $("#envelope");
  if (!env) return;
  env.addEventListener("click", () => {
    env.classList.add("open");
    startMusicOnEnvelope();
    setTimeout(() => {
      const ov = $(".envelope-overlay");
      if (ov) ov.classList.add("gone");
    }, 1200);
  });
}

/* ============================================================
   6. BACKGROUND MUSIC  (single audio, never recreated)
   ------------------------------------------------------------
   • The <audio id="bgMusic"> lives ONCE in index.html with
     loop, preload="auto" and playsinline.
   • Because the SPA never reloads, the audio keeps playing
     continuously across ALL section switches — and mobile
     browsers never get a second chance to block autoplay.
   • Starts only on the envelope click (a real user gesture).
   • The top-right button toggles mute/unmute (🔇/🔊).
   • localStorage remembers ONLY the mute state across visits
     (no time-tracking needed — the audio never stops).
   ============================================================ */

const MUSIC_STATE = { LAST_MUTE: "musicMuted" };   // "1" = muted

function getLS(key) { try { return localStorage.getItem(key); } catch (e) { return null; } }
function setLS(key, val) { try { localStorage.setItem(key, val); } catch (e) { /* ignore */ } }

function musicAudio() {
  return document.getElementById("bgMusic");
}

/* Show 🔊 when playing, 🔇 when muted. */
function updateMusicToggleIcon() {
  const a = musicAudio();
  const t = $(".music-toggle");
  if (t && a) t.textContent = a.muted ? "🔇" : "🔊";
}

/* show a tiny buffering spinner on the button while the file loads */
function setMusicLoading(on) {
  const t = $(".music-toggle");
  if (t) t.classList.toggle("loading", !!on);
}

/* Toggle mute/unmute (the audio element itself is never torn down,
   so unmuting resumes RIGHT where it was — instantly). */
function toggleMusic() {
  const a = musicAudio();
  if (!a) return;
  if (a.muted) {
    a.muted = false;
    setLS(MUSIC_STATE.LAST_MUTE, "0");
    // if it never actually started, the toggle click is a valid gesture → play
    if (a.paused) { const p = a.play(); if (p && p.catch) p.catch(() => {}); }
  } else {
    a.muted = true;
    setLS(MUSIC_STATE.LAST_MUTE, "1");
  }
  updateMusicToggleIcon();
}

/* The envelope click — first user gesture that starts the music.
   Respects a previously-saved mute state. */
function startMusicOnEnvelope() {
  const a = musicAudio();
  if (!a) return;
  a.muted = getLS(MUSIC_STATE.LAST_MUTE) === "1";   // honor remembered mute
  const p = a.play();                                // begin now, in this gesture
  if (p && p.catch) p.catch(() => { /* blocked / missing file → silent */ });
  updateMusicToggleIcon();
}

/* Wire the toggle, apply saved mute, and attach the buffering spinner. */
function initMusic() {
  const a = musicAudio();
  const toggle = $(".music-toggle");
  if (!a) return;

  a.muted = getLS(MUSIC_STATE.LAST_MUTE) === "1";   // restore mute across visits
  updateMusicToggleIcon();

  if (toggle) toggle.addEventListener("click", toggleMusic);

  // spinner: shown while buffering, hidden once it can play
  a.addEventListener("waiting", () => setMusicLoading(true));
  a.addEventListener("canplay",  () => setMusicLoading(false));
  a.addEventListener("playing",  () => setMusicLoading(false));
  a.addEventListener("error",    () => setMusicLoading(false));
}

/* ============================================================
   7. EVENT VIEW FILLER — pulls EVERYTHING from config.js.
   Fills each <section class="view" data-event="…"> with the
   matching config entry (scoped selectors, so every view is
   filled independently even though all live in one document).
   ============================================================ */
function initEventPages() {
  $$(".view[data-event]").forEach(fillEvent);
}

function fillEvent(root) {
  const key = root.dataset.event;
  const ev = (W.events || {})[key];
  if (!ev) return;

  // hero title (Bengali + English) + tagline + names
  text($(".js-title-bn", root), ev.titleBn);
  text($(".js-title-en", root), ev.titleEn);
  text($(".js-line", root), ev.line);
  text($(".js-groom", root), W.groom);
  text($(".js-bride", root), W.bride);

  // theme icon — swap to an emoji if the PNG is missing
  const icon = $(".js-icon", root);
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
  text($(".js-date", root), ev.dateBn);
  text($(".js-time", root), ev.time);
  text($(".js-venue", root), ev.venue);
  text($(".js-venue2", root), ev.venueDetail);
  const mapBtn = $(".js-map", root); if (mapBtn) mapBtn.href = ev.mapLink;

  // countdown target comes from config's machine date
  startCountdown(root, ev.date);

  // invite card (downloaded as an image) — scoped to this view
  const card = $(".invite-card", root);
  if (card) {
    const icNames = $(".js-ic-names", root);
    if (icNames) icNames.innerHTML = `${esc(W.groom)} <span class="amp">&</span> ${esc(W.bride)}`;
    text($(".js-ic-event", root), ev.titleBn);
    text($(".js-ic-line", root), ev.line);
    text($(".js-ic-date", root), ev.dateBn);
    text($(".js-ic-time", root), ev.time);
    text($(".js-ic-venue", root), ev.venue + (ev.venueDetail ? ", " + ev.venueDetail : ""));
  }

  // QR code → encodes the map link (clickable)
  const qr = $(".js-qr", root);
  const qrLink = $(".js-qr-link", root);
  if (qr) qr.src = `https://api.qrserver.com/v1/create-qr-code/?size=260x260&data=${encodeURIComponent(ev.mapLink)}`;
  if (qrLink) { qrLink.href = ev.mapLink; qrLink.target = "_blank"; }

  // gallery from config.photos
  buildGallery($(".js-gallery", root), ev.photos || []);

  // footer names
  text($(".js-f-groom", root), W.groom);
  text($(".js-f-bride", root), W.bride);

  // download button
  const dl = $(".js-download", root);
  if (dl && card) dl.addEventListener("click", () => downloadCard(card, `${key}-invitation`));
}

/* tiny helper: set textContent only if the element exists */
function text(el, val) { if (el) el.textContent = val; }

/* ============================================================
   7b. LANDING FILLER — names, greeting & the 4 event cards.
       Cards navigate to their view by hash (#aiburo-bhat, …).
   ============================================================ */
function initHomeCards() {
  if (!W.events) return;
  text($(".js-groom-h"), W.groom);
  text($(".js-bride-h"), W.bride);
  text($(".js-greeting"), W.greetingBn);
  text($(".js-f-groom"), W.groom);
  text($(".js-f-bride"), W.bride);

  $$(".event-card").forEach(card => {
    const key = card.dataset.card;
    if (!key) return;
    const ev = W.events[key];
    if (!ev) return;
    text($(".ec-bn", card), ev.titleBn);
    text($(".ec-en", card), ev.titleEn);
    text($(".ec-date", card), ev.dateBn);
    // nav to the matching view: config "page" = "aiburo-bhat.html" → "#aiburo-bhat"
    const pageId = String(ev.page || (key + ".html")).replace(/\.html$/, "");
    card.href = "#" + pageId;
  });
}

/* escape text that goes into HTML (safe names) */
function esc(s) { return String(s || "").replace(/[&<>"']/g, c => ({ "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;" })[c]); }

/* ============================================================
   8. COUNTDOWN (ticks every second, bounces on change)
      Scoped to one view so each event has its own live timer.
   ============================================================ */
function startCountdown(root, isoDate) {
  const wrap = $(".countdown", root);
  if (!wrap) return;
  const boxes = {
    d: $(".js-d", root), h: $(".js-h", root), m: $(".js-m", root), s: $(".js-s", root)
  };
  const pastLabel = $(".js-count-label", root);
  const target = new Date(isoDate + "T00:00:00").getTime();
  if (isNaN(target)) return;

  function tick() {
    const diff = target - Date.now();
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
function buildGallery(gal, photos) {
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
  const key = (e) => { if (e.key === "Escape") { close(); document.removeEventListener("keydown", key); } };
  document.addEventListener("keydown", key);
}

/* ============================================================
   10. DOWNLOAD INVITATION CARD AS AN IMAGE
       Vanilla-only: offscreen live clone → SVG foreignObject →
       canvas → PNG. Works in Chrome / Edge / Firefox.
   ============================================================ */
function downloadCard(el, filename) {
  try {
    const holder = document.createElement("div");
    holder.style.cssText = "position:fixed;left:-999999px;top:0;width:460px;z-index:-1;pointer-events:none;opacity:0;";
    holder.appendChild(el.cloneNode(true));
    document.body.appendChild(holder);

    inlineStyles(holder.firstElementChild);

    const w = 460;
    const h = Math.min(holder.firstElementChild.offsetHeight || 1500, 3000);
    const scale = 2;

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
      // card bg follows the view it belongs to (emerald view = dark card)
      const view = el.closest("#landing, section[data-theme]");
      ctx.fillStyle = (view && view.dataset.theme) === "emerald-gold" ? "#0a3d2e" : "#fffdf6";
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

/* copy the essential computed style so a clone renders without stylesheets */
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
  buildDecoration();     // floating petals/bokeh in every view
  addRipples();          // button ripples
  initReveal();          // fade-in on scroll
  initNav();             // SPA hash routing
  initEnvelope();        // landing envelope (+ first music gesture)
  initMusic();           // single-audio mute toggle
  initEventPages();      // fill each event view from config.js
  initHomeCards();       // fill landing names + event cards from config.js
});