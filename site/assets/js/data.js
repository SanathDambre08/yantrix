/* ==========================================================================
   YANTRIX — everything you will want to edit lives in this file.
   Nothing below is invented club history: where a fact isn't known yet it is
   left empty (null / "") and the site shows a tidy "to be announced" state.
   ========================================================================== */
window.YANTRIX = {
  /* ---- Contact & links. Leave a value "" and that link simply isn't shown. ---- */
  contact: {
    email: "",          // e.g. "yantrix@dypiu.ac.in"  → also used by the Join form (mailto fallback)
    instagram: "https://www.instagram.com/yantrixdypiu/",      // full URL
    linkedin: "",       // full URL
    github: "",         // full URL
    youtube: "",        // full URL
    formEndpoint: "https://script.google.com/macros/s/AKfycbzg6dD51nvi0RzUuTT1MFwORFtpTFfiZi0R5TujSvW_suLrWJVT9XrNNOwPRL6DMnl0/exec",   // paste your Google Apps Script web-app URL here (see backend/SETUP.md) → saves to Google Sheet + sends auto-reply
  },

  university: {
    name: "DY Patil International University",
    short: "DYPIU",
    address: ["Sector 29, Nigdi Pradhikaran", "Akurdi, Pune", "Maharashtra 411044"],
    coords: "18.6508° N · 73.7686° E",
  },

  /* ---- Team. Add more people any time. Optional per person: photo: "assets/team/x.jpg", linkedin, github ---- */
  mentors: [
    { name: "Asha Ayakar", role: "Mentor" },
    { name: "Shraddha Jadhav", role: "Mentor" },
  ],
  team: [
    { name: "Aryan Shakya", role: "Convener" },
    { name: "Suyash Karande", role: "Co-Convener" },
    { name: "Viren Nagpal", role: "Technical Lead" },
    { name: "Sanath Dambre", role: "Co-Technical Lead" },
  ],

  /* ---- Events. date: "2026-11-14" (ISO) or null for "date TBA". status: "upcoming" | "past" ---- */
  events: [
    {
      kind: "Fresher event", status: "upcoming", date: "2026-10-15",
      title: "Yantrix Fresher Event",
      summary: "Yantrix welcomes the new batch. Meet the club, see what we build and find where you fit.",
      place: "Room 533, DYPIU", format: "Open to freshers",
    },
    {
      kind: "Inauguration", status: "past", date: "2026-09-03",
      title: "Yantrix Inauguration",
      summary: "The official launch of Yantrix, the robotics and aviation club of DY Patil International University.",
      place: "DYPIU, Akurdi", format: "Club launch",
    },
  ],

  /* ---- Gallery. type: "img" | "vid". cat: "Campus" | "Flight & Space" | "Machines" ---- */
  gallery: [
    { type: "img", cat: "Events", title: "Hackathon", sub: "Second prize", src: "assets/gallery/yx-8.jpg" },
    { type: "img", cat: "Team", title: "The team", sub: "Yantrix", src: "assets/gallery/yx-2.jpg" },
    { type: "img", cat: "Team", title: "Six builders", sub: "One robot", src: "assets/gallery/yx-4.jpg", portrait: true },
    { type: "img", cat: "Machines", title: "Badge & robot", sub: "Our build", src: "assets/gallery/yx-7.jpg", portrait: true },
    { type: "img", cat: "Team", title: "Show & tell", sub: "In the lab", src: "assets/gallery/yx-3.jpg", portrait: true },
    { type: "img", cat: "Events", title: "On stage", sub: "Yantrix event", src: "assets/gallery/yx-6.jpg", portrait: true },
    { type: "img", cat: "Team", title: "Hands on", sub: "With the robot", src: "assets/gallery/yx-5.jpg", portrait: true },
  ],

};
