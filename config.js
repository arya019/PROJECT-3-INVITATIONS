/* ============================================================
   config.js  —  ALL editable data lives in this ONE file.
   ------------------------------------------------------------
   Change names, dates, times, venues, and photos here.
   No need to touch any other file.
   ============================================================ */

const WEDDING = {

  /* ── 1. COUPLE NAMES ───────────────────────────────────── */
  groom: "রৌনক",
  bride: "কাকলি",

  /* Short emotional line shown under the names on the home page */
  greetingBn: "সানন্দে জানানো যাচ্ছে যে, আমাদের পরম আদরের",

  /* ── 2. BACKGROUND MUSIC ──────────────────────────────── */
  /* Path to the audio file (a ~27-second shehnai tune that loops). */
  musicSrc: "images/shehnai.mp3",

  /* ============================================================
     THE FOUR EVENTS
     --------------------------------------------------------
     • date    = machine date (YYYY-MM-DD)  → used by the countdown
     • dateBn  = Bengali date shown on the card
     • photos  = list of image files / URLs shown in the gallery
     • icon    = small themed icon (see images/ folder)
     ============================================================ */
  events: {

    /* ── EVENT 1: আইবুড়ো ভাত ────────────────────────────── */
    aiburoBhat: {
      titleBn: "আইবুড়ো ভাত",
      titleEn: "Aiburo Bhat",
      date: "2026-11-20",                     // countdown target (edit)
      dateBn: "২০ নভেম্বর ২০২৬",              // displayed date (edit)
      time: "সন্ধ্যা ৭:০০",                   // edit
      venue: "হল অ্যাড্রেস এখানে লিখুন",        // edit
      venueDetail: "রোড, এলাকা, পিন",          // edit
      mapLink: "https://maps.google.com/?q=Kolkata",  // edit
      theme: "warm-yellow",
      page: "aiburo-bhat.html",
      icon: "images/aiburo-icon.png",
      line: "মিষ্টি মুখের শুভ উদযাপন",
      photos: [
        "https://picsum.photos/seed/aiburo1/800/600",
        "https://picsum.photos/seed/aiburo2/800/600",
        "https://picsum.photos/seed/aiburo3/800/600",
        "https://picsum.photos/seed/aiburo4/800/600"
      ]
    },

    /* ── EVENT 2: গায়ে হলুদ ─────────────────────────────── */
    gayeHolud: {
      titleBn: "গায়ে হলুদ",
      titleEn: "Gaye Holud",
      date: "2026-11-21",
      dateBn: "২১ নভেম্বর ২০২৬",
      time: "বিকাল ৪:০০",
      venue: "হল অ্যাড্রেস এখানে লিখুন",
      venueDetail: "রোড, এলাকা, পিন",
      mapLink: "https://maps.google.com/?q=Kolkata",
      theme: "marigold",
      page: "gaye-holud.html",
      icon: "images/marigold-icon.png",
      line: "হলুদের আভায় সেজেছে ঘর",
      photos: [
        "https://picsum.photos/seed/holud1/800/600",
        "https://picsum.photos/seed/holud2/800/600",
        "https://picsum.photos/seed/holud3/800/600",
        "https://picsum.photos/seed/holud4/800/600"
      ]
    },

    /* ── EVENT 3: বিবাহ অনুষ্ঠান ─────────────────────────── */
    biye: {
      titleBn: "বিবাহ অনুষ্ঠান",
      titleEn: "Wedding Ceremony",
      date: "2026-11-22",
      dateBn: "২২ নভেম্বর ২০২৬",
      time: "সকাল ১০:০০",
      venue: "হল অ্যাড্রেস এখানে লিখুন",
      venueDetail: "রোড, এলাকা, পিন",
      mapLink: "https://maps.google.com/?q=Kolkata",
      theme: "royal-red",
      page: "biye.html",
      icon: "images/kalash-icon.png",
      line: "মাঙ্গলিক শুভ বিবাহ",
      photos: [
        "https://picsum.photos/seed/biye1/800/600",
        "https://picsum.photos/seed/biye2/800/600",
        "https://picsum.photos/seed/biye3/800/600",
        "https://picsum.photos/seed/biye4/800/600"
      ]
    },

    /* ── EVENT 4: বৌভাত / রিসেপশন ───────────────────────── */
    bojhat: {
      titleBn: "বৌভাত / রিসেপশন",
      titleEn: "Boubhat & Reception",
      date: "2026-11-23",
      dateBn: "২৩ নভেম্বর ২০২৬",
      time: "রাত ৮:০০",
      venue: "হল অ্যাড্রেস এখানে লিখুন",
      venueDetail: "রোড, এলাকা, পিন",
      mapLink: "https://maps.google.com/?q=Kolkata",
      theme: "emerald-gold",
      page: "bojhat.html",
      icon: "images/ring-icon.png",
      line: "মধুর সম্মানে সাদর অভ্যর্থনা",
      photos: [
        "https://picsum.photos/seed/bojhat1/800/600",
        "https://picsum.photos/seed/bojhat2/800/600",
        "https://picsum.photos/seed/bojhat3/800/600",
        "https://picsum.photos/seed/bojhat4/800/600"
      ]
    }
  }
};

/* Expose it globally so script.js can read everything. */
if (typeof window !== "undefined") window.WEDDING = WEDDING;