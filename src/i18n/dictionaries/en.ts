import type { Dictionary } from "./fr";

export const en: Dictionary = {
  meta: {
    title: "Excellence Group — Academic coaching, personal development & entrepreneurship in Abidjan",
    description:
      "Since 2011, Excellence Group has guided students to success: BEPC & BAC reinforcement courses across 23 study centres in Côte d'Ivoire, personal development, career guidance and entrepreneurship. 90.02% BAC pass rate in 2026.",
    ogAlt: "Excellence Group — Excellence at the rhythm of our lives",
  },

  nav: {
    home: "Home",
    about: "About us",
    programs: "Programmes",
    results: "Results",
    bases: "Our centres",
    events: "Events",
    learning: "EG Learning",
    contact: "Contact",
    cta: "Enrol",
    phoneLabel: "Call us",
    whatsapp: "WhatsApp",
    menu: "Open menu",
    close: "Close menu",
    langLabel: "Change language",
    skip: "Skip to content",
  },

  hero: {
    title: "Academic reinforcement courses for school and university students in Côte d'Ivoire",
    lead:
      "Since 2011, Excellence Group has supported pupils and students across 23 study centres — in Abidjan, Grand-Bassam, Yamoussoukro, Bouaké and Arrah — and online through EG Learning. Personal development and an introduction to entrepreneurship complete the courses.",
    ctaPrimary: "Enrol via WhatsApp",
    ctaSecondary: "Find a centre",
    noticeLabel: "2026 session",
    notice: "90.02% of our students passed the BAC and 93.75% passed the BEPC.",
    noticeLink: "See the detailed results",
    photoCaption: "The Excellence Group tutors in Koumassi, Abidjan — photo Romaric Assemien",
  },

  facts: [
    { value: "2011", label: "founded in Abidjan", count: null },
    { value: "23", label: "study centres", count: 23 },
    { value: "5", label: "cities in Côte d'Ivoire", count: 5 },
    { value: "2,147", label: "new BAC graduates in 2026", count: 2147 },
  ],

  about: {
    title: "A training organisation founded in 2011 in Abidjan",
    body1:
      "Excellence Group is a training organisation specialised in academic reinforcement for secondary and university students, personal development and an introduction to entrepreneurship.",
    body2:
      "Courses are delivered in person at our study centres and online through the EG Learning platform. Through the E-Group Foundation, we also provide free training.",
    missionTitle: "Our mission",
    manifesto:
      "To raise the academic and moral standards of pupils, students and anyone who has lost the desire to succeed — with discipline, hard work and faith in success.",
    slogan: "Excellence at the rhythm of our lives.",
    objectivesTitle: "Our objectives",
    objectives: [
      "Strengthen learners' theoretical and intellectual knowledge.",
      "Develop the techniques and methods essential to competency-based learning.",
      "Connect learners with their elders for sound career guidance.",
      "Pass on the entrepreneurial mindset.",
      "Bring young managers into the world of work.",
    ],
    factsTitle: "At a glance",
    facts: [
      { label: "Founded", value: "2011, Abidjan" },
      { label: "Activities", value: "Academic reinforcement, personal development, entrepreneurship" },
      { label: "Audience", value: "Lower and upper secondary pupils, university students" },
      { label: "Study centres", value: "23, in 5 cities" },
      { label: "Formats", value: "In person and online (EG Learning)" },
      { label: "Foundation", value: "E-Group Foundation — free training" },
    ],
    valuesTitle: "Our values",
    values: ["Discipline", "Hard work", "Success"],
  },

  pillars: {
    title: "Our programmes",
    lead:
      "From lower secondary to university, four complementary areas of training. Reinforcement courses are the foundation; guidance, personal development and entrepreneurship prepare what comes next.",
    bulletsTitle: "What is included",
    items: [
      {
        key: "school",
        title: "Academic reinforcement",
        subtitle: "From lower secondary to final year",
        text:
          "Intensive reinforcement classes across our 23 centres, taught by experienced teachers and tutors. Exam classes — 3ᵉ and Terminale — are at the heart of the method: group lessons, one-to-one sessions and regular assessment tests.",
        bullets: ["Group and private lessons", "Assessment tests every 3 months", "A dedicated tutor for every student"],
      },
      {
        key: "university",
        title: "University and guidance",
        subtitle: "Choosing the right path",
        text:
          "University reinforcement, orientation weeks and career days: we help new graduates choose the programmes and schools that truly prepare their future.",
        bullets: ["Orientation week", "Partner schools and stand visits", "Mentoring by alumni"],
      },
      {
        key: "personal",
        title: "Personal development",
        subtitle: "Method, discipline and motivation",
        text:
          "Motivation Days, panels and sessions led by coaches: we work on mindset as much as on knowledge, with students and tutors alike.",
        bullets: ["Motivation Day 2 to 3 times a year", "Guest speakers and coaches", "Excellence galas"],
      },
      {
        key: "entrepreneurship",
        title: "Entrepreneurship and Foundation",
        subtitle: "Preparing what comes next",
        text:
          "An introduction to entrepreneurship led by experts, support for young managers entering the workforce, and free training through the E-Group Foundation.",
        bullets: ["Expert-led training", "Professional integration", "E-Group Foundation — free training"],
      },
    ],
  },

  results: {
    title: "Exam results",
    lead:
      "Pass rates of Excellence Group students in the national exams: the 2026 session and the trend since the first cohort, in 2012.",
    sessionLabel: "2026 session",
    previousLabel: "2025 session:",
    figures: {
      bac: "Baccalaureate pass rate",
      bepc: "BEPC pass rate",
      graduates: "new BAC graduates",
    },
    mentionsTitle: "BAC 2026 honours",
    mentions: [
      { value: "4", label: "with highest honours" },
      { value: "+31", label: "with high honours" },
      { value: "+500", label: "with honours" },
    ],
    chartTitle: "Pass rate by session",
    chartBac: "Baccalaureate",
    chartBepc: "BEPC",
    chartNote: "Hover or select a point to display the pass rate for that session.",
    source: "Source: Excellence Group internal report, 2026 session.",
    laureatesTitle: "The 35 best BAC graduates of 2026",
    laureatesLead: "Ranking across all centres, based on the total number of points obtained in the Baccalaureate.",
    rank: "Rank",
    name: "Name",
    series: "Series",
    points: "Points",
    mention: "Honours",
    mentionTB: "Highest honours",
    mentionB: "High honours",
    showAll: "Show all 35 laureates",
    showLess: "Collapse the list",
    shownOf: "Showing {shown} of {total} laureates",
    pts: "pts",
  },

  bases: {
    title: "Our study centres",
    lead:
      "23 centres in 5 cities, hosted by partner schools in the heart of the neighbourhoods. Pick an area, then a centre: the map takes you there.",
    zones: {
      south: "Abidjan South",
      north: "Abidjan North",
      interior: "Rest of the country",
    },
    basesCount: (n: number) => `${n} centre${n > 1 ? "s" : ""}`,
    legendBases: "Cities where we operate",
    legendCities: "Reference cities",
    findBase: "Ask for the nearest centre",
    findBaseHint: "Tell us your neighbourhood on WhatsApp and a tutor will guide you.",
    zoomIn: "Zoom in",
    zoomOut: "Zoom out",
    resetView: "Whole country",
    abidjan: "Abidjan",
    lagoon: "Ébrié Lagoon",
    ocean: "Atlantic Ocean",
    approx: "Select a centre and the map flies to it. Locations are shown at neighbourhood level; double-click to zoom.",
  },

  events: {
    title: "Events of the year",
    lead:
      "Alongside the courses, five events punctuate the school year: motivation, sport, guidance and the celebration of success.",
    next: "Next event",
    datesNote: "Dates for the coming season are announced on our social channels:",
    pastEditions: "Previous editions",
    items: [
      {
        key: "motivation",
        title: "Motivation Day",
        kicker: "Personal development",
        text:
          "Two to three times a year, speakers and coaches come to train students, tutors and staff. The founding event of the E-Group spirit.",
        meta: "December and April · Koumassi, Adjamé",
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
        meta: "Late July · Koumassi and Cocody",
      },
      {
        key: "brevetes",
        title: "BEPC Graduates Gala",
        kicker: "Celebration",
        text:
          "Celebrating the 3ᵉ students who passed the BEPC after a year of work — and rewarding the best of each centre.",
        meta: "August · Abidjan",
      },
      {
        key: "eclosion",
        title: "Éclosion",
        kicker: "Gala of excellence",
        text:
          "The gala dinner of the new graduates. 8th edition: 600+ guests, artists, a guest of honour and the best students of each centre rewarded.",
        meta: "25 July 2026, 7 pm · Espace Crystal, Marcory Zone 4",
      },
    ],
  },

  learning: {
    title: "EG Learning, the online platform",
    lead:
      "The EgroupLearning platform and app extend in-person classes: course materials, exercises and progress tracking, available on the web and on mobile.",
    features: [
      { title: "Web, Android and iOS", text: "Access your courses from a browser or the EgroupLearning app." },
      { title: "Personal access", text: "Your login details are provided by your tutor as soon as you enrol." },
      { title: "Courses and assessments", text: "Course materials, exercises and tests to keep progressing all year long." },
    ],
    ctaWeb: "Go to the platform",
    ctaStores: "Download the app",
    accessTitle: "Platform access",
    accessUrlLabel: "Address",
    scheduleTitle: "In-person class schedule",
    scheduleDays: "Days",
    scheduleHours: "Hours",
    schedule: [
      { days: "Monday, Tuesday, Thursday, Friday", hours: "6 pm – 9 pm" },
      { days: "Wednesday, Sunday", hours: "3 pm – 7 pm" },
      { days: "Saturday", hours: "8 am – 7 pm", note: "with two breaks" },
    ],
  },

  testimonials: {
    title: "Testimonials",
    lead: "In the words of pupils and students who went through Excellence Group.",
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
  },

  cta: {
    title: "Enrolment and enquiries",
    lead:
      "To join the EGROUP family, message us on WhatsApp or give us a call: a tutor will direct you to the centre nearest to you and answer your questions.",
    whatsapp: "Message us on WhatsApp",
    call: "Call us",
    whatsappMessage:
      "Hello Excellence Group, I would like information about reinforcement courses and enrolment.",
    note: "Quick reply, every day.",
    contactTitle: "Get in touch",
    whatsappLabel: "WhatsApp",
    phoneLabel: "Phone",
    locationLabel: "Location",
    hoursLabel: "Class schedule",
    hoursLink: "See the schedule",
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
    backToTop: "Back to top",
  },

  notFound: {
    code: "Error 404",
    title: "Page not found",
    text: "The page you are looking for does not exist or has been moved.",
    back: "Back to home",
  },
};
