/* ============================================================
   config.js  —  ALL editable data lives in this ONE file.
   ------------------------------------------------------------
   This is the single source of truth for the wedding site.
   Change names, dates, times, venue, map link and photos here —
   every page reads from this file. No need to touch any other file.
   ============================================================ */

const WEDDING = {

  /* ══ 1. COUPLE NAMES (Bengali + English) ════════════════════ */
  groom:     "রৌনক",          // গৃহি Bengali
  bride:     "কাকলী",         // বধূ Bengali
  groomEn:   "Rounak",        // groom English spelling: R-O-U-N-A-K
  brideEn:   "Kakoli",        // bride English spelling

  /* Short emotional salutation on the landing hero */
  greetingBn: "সানন্দে জানানো যাচ্ছে যে, আমাদের পরম আদরের",

  /* ══ 2. THE VENUE / LOCATION (same for all 4 events) ═══════ */
  /* Google Maps short link, exact coordinates, and the address in
     Bengali + English. Used for the map, QR codes and "view on map". */
  location: {
    address:    "নিজ বাসভবন, কয়েম্বা, বীরভূম - ৭৩১২৪১",   // Bengali address
    addressEn:  "Kayemba, West Bengal 731241",              // English address
    coords:     { lat: 24.173839, lng: 87.906956 },         // map centre point
    mapLink:    "https://maps.app.goo.gl/9DEkysSqcpTWJm2Q6" // short maps link
  },

  /* ══ 3. BACKGROUND MUSIC ══════════════════════════════════ */
  /* Path to the looping satpake-badha tune. */
  musicSrc: "images/satpake-badha.mp3",

  /* ═══════════════════════════════════════════════════════════
     THE FOUR EVENTS
     -----------------------------------------------------------
     Each event carries every piece of text shown on its section.
     Fields that matter across files:
       • dateIso  = full ISO date + time + Asia/Kolkata offset
                    ("2026-11-23T13:00:00+05:30") → used by the
                    countdown timer, so it is correct in any timezone.
       • dateBn   = line 1 of the date card (Bengali calendar date)
       • dateEn   = line 2 (English date + day), e.g. "(ইং- ২৪/১১/২০২৬) মঙ্গলবার"
       • time     = line 3 (Bengali time), e.g. "সকাল ১১টা"
       • venue    = Bengali address · venueDetail = English address
       • mapLink  = the same Google Maps short link for every event
        • coords   = map centre for that event
        • icon     = small themed icon (images/ folder)
     ═══════════════════════════════════════════════════════════ */
  events: {

    /* ── EVENT 1 · আইবুড়ো ভাত · Aiburo Bhat — 23 Nov, Monday ── */
    aiburoBhat: {
      titleBn: "আইবুড়ো ভাত",
      titleEn: "Aiburo Bhat",
      dateIso: "2026-11-23T13:00:00+05:30",   // countdown target (Asia/Kolkata)
      dateBn:  "৬ই অগ্রহায়ণ, ১৪৩৩ বঙ্গাব্দ",
      dateEn:  "(ইং- ২৩/১১/২০২৬) সোমবার",
      time:    "দুপুর ১টা",
      venue:   "নিজ বাসভবন, কয়েম্বা, বীরভূম - ৭৩১২৪১",
      venueDetail: "Kayemba, West Bengal 731241",
      mapLink: "https://maps.app.goo.gl/9DEkysSqcpTWJm2Q6",
      coords:  { lat: 24.173839, lng: 87.906956 },
      theme:   "warm-yellow",
      page:    "aiburo-bhat.html",
      icon:    "images/aiburo-icon.png",
      line:    "মিষ্টি মুখের শুভ উদযাপন"
    },

    /* ── EVENT 2 · গায়ে হলুদ · Gaye Holud — 24 Nov, Tuesday ── */
    gayeHolud: {
      titleBn: "গায়ে হলুদ",
      titleEn: "Gaye Holud",
      dateIso: "2026-11-24T11:00:00+05:30",
      dateBn:  "৭ই অগ্রহায়ণ, ১৪৩৩ বঙ্গাব্দ",
      dateEn:  "(ইং- ২৪/১১/২০২৬) মঙ্গলবার",
      time:    "সকাল ১১টা",
      venue:   "নিজ বাসভবন, কয়েম্বা, বীরভূম - ৭৩১২৪১",
      venueDetail: "Kayemba, West Bengal 731241",
      mapLink: "https://maps.app.goo.gl/9DEkysSqcpTWJm2Q6",
      coords:  { lat: 24.173839, lng: 87.906956 },
      theme:   "marigold",
      page:    "gaye-holud.html",
      icon:    "images/marigold-icon.png",
      line:    "হলুদের আভায় সেজেছে ঘর"
    },

    /* ── EVENT 3 · বিবাহ অনুষ্ঠান · Biye / Shubho Bibaho — 24 Nov, Tue ── */
    biye: {
      titleBn: "বিবাহ অনুষ্ঠান",
      titleEn: "Wedding Ceremony",
      dateIso: "2026-11-24T20:00:00+05:30",
      dateBn:  "৭ই অগ্রহায়ণ, ১৪৩৩ বঙ্গাব্দ",
      dateEn:  "(ইং- ২৪/১১/২০২৬) মঙ্গলবার",
      time:    "রাত ৮টা",
      venue:   "নিজ বাসভবন, কয়েম্বা, বীরভূম - ৭৩১২৪১",
      venueDetail: "Kayemba, West Bengal 731241",
      mapLink: "https://maps.app.goo.gl/9DEkysSqcpTWJm2Q6",
      coords:  { lat: 24.173839, lng: 87.906956 },
      theme:   "royal-red",
      page:    "biye.html",
      icon:    "images/kalash-icon.png",
      line:    "মাঙ্গলিক শুভ বিবাহ"
    },

    /* ── EVENT 4 · প্রীতিভোজ / বৌভাত · Pritibhoj / Boubhat — 25 Nov, Wed ── */
    bojhat: {
      titleBn: "প্রীতিভোজ / বৌভাত",
      titleEn: "Pritibhoj / Boubhat",
      dateIso: "2026-11-25T20:00:00+05:30",
      dateBn:  "৮ই অগ্রহায়ণ, ১৪৩৩ বঙ্গাব্দ",
      dateEn:  "(ইং- ২৫/১১/২০২৬) বুধবার",
      time:    "রাত ৮টা",
      venue:   "নিজ বাসভবন, কয়েম্বা, বীরভূম - ৭৩১২৪১",
      venueDetail: "Kayemba, West Bengal 731241",
      mapLink: "https://maps.app.goo.gl/9DEkysSqcpTWJm2Q6",
      coords:  { lat: 24.173839, lng: 87.906956 },
      theme:   "emerald-gold",
      page:    "bojhat.html",
      icon:    "images/ring-icon.png",
      line:    "মধুর সম্মানে সাদর অভ্যর্থনা"
    }
  },

  /* ═══════════════════════════════════════════════════════════════
     CARD THEMES — colours for the 4 landing event cards.
     Change these to restyle every card in one place.
     Keys match the event keys above (aiburoBhat / gayeHolud / biye / bojhat).
     ═══════════════════════════════════════════════════════════════ */
  cardThemes: {
    aiburoBhat: {
      bg:       "#5a2a1a",   // deep warm brown
      title:    "#f4d47c",   // warm gold
      subtitle: "#e8c98f",   // soft cream-gold
      accent:   "#d4a44a",   // darker gold
      // per-theme glow (text-shadow for title, subtitle; drop-shadow for icon)
      titleGlow:    "0 0 12px rgba(244,212,124,0.9), 0 0 24px rgba(244,212,124,0.5)",
      subtitleGlow: "0 0 8px rgba(232,201,143,0.6)",
      iconGlow:     "drop-shadow(0 0 12px rgba(244,212,124,0.85))"
    },
    gayeHolud: {
      bg:       "#f4a300",   // bright marigold
      title:    "#7a1f0f",   // deep maroon
      subtitle: "#b34700",   // darker orange
      accent:   "#c9a227",
      titleGlow:    "0 0 14px rgba(122,31,15,0.45), 0 0 28px rgba(255,200,60,0.6)",
      subtitleGlow: "0 0 8px rgba(179,71,0,0.4)",
      iconGlow:     "drop-shadow(0 0 12px rgba(255,200,60,0.7))"
    },
    biye: {
      bg:       "#8b1a1a",   // royal wedding red
      title:    "#f4d47c",   // warm gold
      subtitle: "#fde8c8",   // soft cream
      accent:   "#c9a227",
      titleGlow:    "0 0 14px rgba(244,212,124,0.9), 0 0 28px rgba(244,212,124,0.5), 0 0 45px rgba(244,212,124,0.25)",
      subtitleGlow: "0 0 10px rgba(253,232,200,0.7)",
      iconGlow:     "drop-shadow(0 0 14px rgba(244,212,124,0.8))"
    },
    bojhat: {
      bg:       "#0f5132",   // deep emerald green
      title:    "#f4d47c",   // warm gold
      subtitle: "#e8d9a8",   // pale gold
      accent:   "#c9a227",
      // reference look — keep as-is
      titleGlow:    "0 0 12px rgba(244,212,124,0.9), 0 0 24px rgba(244,212,124,0.5)",
      subtitleGlow: "0 0 8px rgba(232,217,168,0.7)",
      iconGlow:     "drop-shadow(0 0 12px rgba(244,212,124,0.8))"
    }
  }
};

/* Expose it globally so script.js can read everything. */
if (typeof window !== "undefined") window.WEDDING = WEDDING;

/* ============================================================
   COUPLE PROFILES — "পাত্র ও পাত্রীর পরিচয়" (Meet the Couple)
   Used by the landing #home meet-couple flip cards.
   ============================================================ */
const COUPLE_PROFILES = {
  groom: {
    nameBn: "রৌনক প্রামাণিক",
    nameEn: "Rounak Pramanik",
    roleBn: "পাত্র",
    roleEn: "Groom",
    fatherBn: "শ্রী সুরেন্দ্রনাথ প্রামাণিক",
    fatherEn: "Sri Surendranath Pramanik",
    motherBn: "শ্রীমতী সমাপ্তি প্রামাণিক",
    motherEn: "Smt. Samapti Pramanik",
    siblingLabelBn: "ভাই",
    siblingLabelEn: "Brother",
    siblingBn: "সৈকত প্রামাণিক",
    siblingEn: "Saikat Pramanik",
    addressBn: "কয়েম্বা, মারগ্রাম, বীরভূম - ৭৩১২৪১",
    addressEn: "Koyemba, Margram, Birbhum - 731241",
    mobileBn: "৯৭৩৩৪ ৩৫০৯৭",
    mobileEn: "+91 97334 35097",
    photo: "images/rounak-1.jpg"
  },
  bride: {
    nameBn: "কাকলী দাস",
    nameEn: "Kakoli Das",
    roleBn: "কনে",
    roleEn: "Bride",
    fatherBn: "শ্রী নারায়ণ চন্দ্র দাস",
    fatherEn: "Sri Narayan Chandra Das",
    motherBn: "শ্রীমতী সোনালী দাস",
    motherEn: "Smt. Sonali Das",
    siblingLabelBn: "",
    siblingLabelEn: "",
    siblingBn: "",
    siblingEn: "",
    addressBn: "নারায়ণপুর, রামপুরহাট, বীরভূম - ৭৩১২২৩",
    addressEn: "Narayanpur, Rampurhat, Birbhum - 731223",
    mobileBn: "",
    mobileEn: "",
    photo: "images/kakoli-1.jpg"
  }
};

if (typeof window !== "undefined") window.COUPLE_PROFILES = COUPLE_PROFILES;