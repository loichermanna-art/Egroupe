import type { Dictionary } from "./fr";

export const en: Dictionary = {
  meta: {
    title: "Excellence Group — Academic coaching, personal development & entrepreneurship in Abidjan",
    description:
      "Since 2011, Excellence Group has guided students to success: BEPC & BAC reinforcement courses across 23 study centres in Côte d'Ivoire, personal development, career guidance and entrepreneurship. 90.02% BAC pass rate in 2026.",
    ogAlt: "Excellence Group — Excellence at the rhythm of our lives",
  },

  preloader: {
    words: ["Discipline", "Hard work", "Success"],
    since: "Since 2011 · Abidjan",
  },

  nav: {
    home: "Home",
    about: "About",
    programs: "Programmes",
    results: "Results",
    bases: "Our centres",
    events: "Events",
    contact: "Contact",
    cta: "Enrol now",
    learning: "EG Learning",
    menu: "Menu",
    close: "Close",
    langLabel: "Language",
  },

  hero: {
    eyebrow: "Excellence Group · Abidjan · Since 2011",
    titleA: "Revealing the",
    titleEm: "excellence",
    titleB: "within every student.",
    lead:
      "Academic reinforcement for secondary and university students, personal development and entrepreneurship. For 15 years we have guided thousands of students to success — from the BEPC to the BAC, and far beyond.",
    ctaPrimary: "Join the EGROUP family",
    ctaSecondary: "See our 2026 results",
    scroll: "Scroll",
    badges: [
      { value: "90.02%", label: "BAC pass rate 2026" },
      { value: "2,147", label: "New graduates" },
      { value: "23", label: "Study centres" },
    ],
    tagline: "Excellence at the rhythm of our lives.",
  },

  marquee: [
    "15 years of excellence",
    "23 study centres",
    "2,147 new graduates in 2026",
    "90.02% BAC pass rate",
    "93.75% BEPC pass rate",
    "Motivation Day",
    "Éclosion · Gala of excellence",
    "After BAC",
    "EG Learning",
  ],

  about: {
    eyebrow: "01 — Who we are",
    manifesto:
      "We believe every student carries a potential for excellence. Since 2011, Excellence Group has trained, motivated and supported pupils, students and anyone who has lost the desire to succeed — with discipline, hard work and faith in success.",
    title: "A complete structure, not just classes.",
    body1:
      "Founded in 2011, Excellence Group is a training organisation specialised in academic reinforcement for secondary and university students, personal development and an introduction to entrepreneurship.",
    body2:
      "Our courses are delivered in person at our study centres and online through the EG Learning platform. Through the E-Group Foundation, we also provide free training.",
    objectivesTitle: "Our objectives",
    objectives: [
      "Strengthen learners' theoretical and intellectual knowledge.",
      "Develop the techniques and methods essential to competency-based learning.",
      "Connect learners with their elders for sound career guidance.",
      "Pass on the entrepreneurial mindset.",
      "Bring young managers into the world of work.",
    ],
    yearsValue: "15",
    yearsLabel: "years dedicated to success",
    photoCaption: "The Excellence Group tutors — © Romaric Assemien",
    values: ["Discipline", "Hard work", "Success"],
  },

  pillars: {
    eyebrow: "02 — Our programmes",
    title: "Four pillars, one standard.",
    hint: "Keep scrolling",
    items: [
      {
        index: "01",
        title: "Academic reinforcement",
        subtitle: "From lower secondary to final year",
        text:
          "Intensive reinforcement classes across our 23 centres, taught by passionate teachers and tutors. Exam classes — 3ᵉ and Terminale — are at the heart of our method.",
        bullets: ["Group & private lessons", "Assessment tests every 3 months", "A dedicated tutor for every student"],
      },
      {
        index: "02",
        title: "University & guidance",
        subtitle: "Choosing the right path",
        text:
          "University reinforcement, orientation weeks and career days: we help new graduates choose the programmes and schools that truly prepare their future.",
        bullets: ["Orientation week", "Partner schools & stand visits", "Mentoring by alumni"],
      },
      {
        index: "03",
        title: "Personal development",
        subtitle: "A champion's mindset",
        text:
          "Motivation Days, inspiring panels, discipline and self-improvement: we shape minds, not just exam papers.",
        bullets: ["Motivation Day 2 to 3 times a year", "Guest speakers & coaches", "Excellence galas"],
      },
      {
        index: "04",
        title: "Entrepreneurship & Foundation",
        subtitle: "Preparing what comes next",
        text:
          "An introduction to entrepreneurship led by experts, support for young managers entering the workforce, and free training through the E-Group Foundation.",
        bullets: ["Expert-led training", "Professional integration", "E-Group Foundation — free training"],
      },
    ],
  },

  results: {
    eyebrow: "03 — Our results",
    title: "Results that speak for themselves.",
    lead:
      "Every year, our students confirm the Excellence Group method. Here are the figures for the 2026 session and the trend since our beginnings.",
    counters: [
      { value: 90.02, suffix: "%", decimals: 2, label: "BAC pass rate 2026" },
      { value: 93.75, suffix: "%", decimals: 2, label: "BEPC pass rate 2026" },
      { value: 2147, suffix: "", decimals: 0, label: "new graduates in 2026" },
      { value: 15, suffix: "", decimals: 0, label: "years of excellence" },
    ],
    mentions: [
      { value: "4", label: "with highest honours" },
      { value: "+31", label: "with high honours" },
      { value: "+500", label: "with honours" },
    ],
    chartTitle: "Pass rate by session",
    chartBac: "Baccalaureate",
    chartBepc: "BEPC",
    chartNote: "Pass rate of Excellence Group students, by academic year.",
    laureatesTitle: "The 2026 laureates",
    laureatesLead: "The 35 best graduates of the class of 2026, across all centres.",
    rank: "Rank",
    name: "Name",
    series: "Series",
    points: "Points",
    mention: "Honours",
    mentionTB: "Highest honours",
    mentionB: "High honours",
    showAll: "See all 35 laureates",
    showLess: "Collapse the list",
    pts: "pts",
    seriesShort: "Series",
  },

  bases: {
    eyebrow: "04 — Our study centres",
    title: "23 centres, 5 cities, one standard.",
    lead:
      "From Abidjan to Bouaké, our study centres are located in the heart of neighbourhoods, inside partner schools, to stay as close as possible to students.",
    zones: {
      south: "Abidjan South",
      north: "Abidjan North",
      interior: "Rest of the country",
    },
    basesCount: (n: number) => `${n} centre${n > 1 ? "s" : ""}`,
    mapLegend: "Our locations",
    abidjanPin: "Abidjan · 17 centres",
    findBase: "Find my centre",
  },

  events: {
    eyebrow: "05 — Our events",
    title: "A year set to the rhythm of excellence.",
    lead:
      "Beyond the classroom, Excellence Group brings a true community to life: motivation, sport, guidance and the celebration of success.",
    next: "Next event",
    items: [
      {
        key: "motivation",
        title: "Motivation Day",
        kicker: "Personal development",
        text:
          "Two to three times a year, speakers and coaches come to train students, tutors and staff. The founding event of the E-Group spirit.",
        meta: "December & April · Koumassi, Adjamé",
      },
      {
        key: "afterbac",
        title: "After BAC",
        kicker: "Sports gala",
        text:
          "Football, basketball, video games, dance battles… After the BAC exams, we let the pressure out at the Agora in Koumassi.",
        meta: "Late June · Espace Agora, Koumassi",
      },
      {
        key: "orientation",
        title: "Orientation week",
        kicker: "Career day",
        text:
          "School presentations, panels and stand visits to help new graduates choose their programme and institution.",
        meta: "Late July · Koumassi & Cocody",
      },
      {
        key: "brevetes",
        title: "BEPC Graduates Gala",
        kicker: "Celebration",
        text:
          "Celebrating the 3ᵉ students who passed the BEPC after a year of hard work — and rewarding the best of each centre.",
        meta: "August · Abidjan",
      },
      {
        key: "eclosion",
        title: "Éclosion",
        kicker: "Gala of excellence",
        text:
          "The gala dinner of the new graduates. 8th edition: 600+ guests, artists, a guest of honour and the best students of each centre rewarded.",
        meta: "25 July · Espace Crystal, Marcory Zone 4",
      },
    ],
  },

  learning: {
    eyebrow: "06 — EG Learning",
    title: "Learn anywhere, anytime.",
    lead:
      "The EgroupLearning platform and app extend in-person classes: resources, exercises and progress tracking, available on the web and on mobile.",
    features: [
      { title: "Web, Android & iOS", text: "Access your courses from a browser or the EgroupLearning app." },
      { title: "Personal access", text: "Your login details are provided by your tutor as soon as you enrol." },
      { title: "Courses & assessments", text: "Course materials, exercises and tests to keep progressing all year long." },
    ],
    ctaWeb: "Open the platform",
    ctaStores: "Download the app",
    scheduleTitle: "In-person class schedule",
    schedule: [
      { days: "Monday · Tuesday · Thursday · Friday", hours: "6 pm – 9 pm" },
      { days: "Wednesday · Sunday", hours: "3 pm – 7 pm" },
      { days: "Saturday", hours: "8 am – 7 pm", note: "with two breaks" },
    ],
    phone: {
      greeting: "Hello, Eva 👋",
      sub: "Ready for the 2027 BAC?",
      progressLabel: "Term progress",
      courses: ["Mathematics · Functions", "Physics · Electricity", "Philosophy · Consciousness"],
      nextTest: "Next test in 6 days",
    },
  },

  testimonials: {
    eyebrow: "07 — Testimonials",
    title: "They lived the EGROUP experience.",
    items: [
      {
        quote:
          "To any student aiming for excellent BAC results, I recommend one structure only: Excellence Group.",
        name: "Junior Devis Ahi",
        role: "Preparatory class student (ECS), INP-HB",
      },
      {
        quote:
          "Egroup doesn't only focus on academic results, but also on personal development.",
        name: "Nelly Ogah",
        role: "Master's student in Law, UCAO",
      },
      {
        quote:
          "If I had to sum up my experience at Egroup: wow… Excellence Group is something special — a complete structure.",
        name: "Enoc Malan",
        role: "Alumnus",
      },
      {
        quote:
          "Egroup was recommended to me by a friend. I enrolled and it was the start of a wonderful adventure: the Motivation Days, prayer, hard work…",
        name: "A former student",
        role: "Excellence Group alumna",
      },
    ],
    prev: "Previous testimonial",
    next: "Next testimonial",
  },

  cta: {
    eyebrow: "08 — Enrolment",
    title: "Ready to join the EGROUP family?",
    lead:
      "Message us on WhatsApp or give us a call: a tutor will guide you to the centre nearest to you and answer all your questions.",
    whatsapp: "Message us on WhatsApp",
    call: "Call us",
    whatsappMessage:
      "Hello Excellence Group, I would like information about reinforcement courses and enrolment.",
    note: "Quick reply · Every day",
  },

  footer: {
    tagline: "Discipline · Hard work · Success",
    description:
      "Training organisation founded in 2011 in Abidjan: academic reinforcement, personal development, entrepreneurship and the E-Group Foundation.",
    navTitle: "Navigation",
    contactTitle: "Contact",
    followTitle: "Follow us",
    location: "Abidjan, Côte d'Ivoire",
    rights: "All rights reserved.",
    madeWith: "Crafted with a passion for excellence.",
    legal: "Legal notice",
    privacy: "Privacy",
  },

  notFound: {
    title: "Page not found",
    text: "The page you are looking for does not exist or has been moved.",
    back: "Back to home",
  },
};
