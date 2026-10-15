/* YANTRIX — shared behaviour: header/footer injection, reveals, transitions */
(function () {
  const D = window.YANTRIX;
  const page = document.body.dataset.page || "home";
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const NAV = [
    ["home", "Home", "index.html"],
    ["journey", "Journey", "journey.html"],
    ["team", "Team", "team.html"],
    ["gallery", "Gallery", "gallery.html"],
    ["events", "Events", "events.html"],
  ];
  const cur = (k) => (k === page ? ' aria-current="page"' : "");

  /* ---------- Header ---------- */
  const hdr = document.createElement("header");
  hdr.className = "hdr";
  hdr.innerHTML = `
    <div class="wrap hdr__in">
      <a class="brand" href="index.html" aria-label="Yantrix — home">
        <img src="assets/img/logo.png" alt="" width="46" height="46">
        <span class="brand__t"><b>Yantrix</b><small>Robotics &amp; Aviation · ${D.university.short}</small></span>
      </a>
      <nav class="nav" aria-label="Primary">
        ${NAV.map((n) => `<a href="${n[2]}"${cur(n[0])}>${n[1]}</a>`).join("")}
        <a class="btn" href="join.html"${cur("join")}>Join us <span class="arr">→</span></a>
      </nav>
      <button class="burger" aria-label="Menu" aria-expanded="false"><i></i><i></i></button>
    </div>`;
  const sheet = document.createElement("div");
  sheet.className = "sheet";
  sheet.innerHTML =
    NAV.concat([["join", "Join us", "join.html"]])
      .map((n, i) => `<a class="big" href="${n[2]}"${cur(n[0])}><span>0${i + 1}</span>${n[1]}</a>`)
      .join("") +
    `<p class="label sheet__foot">${D.university.name}<br>${D.university.coords}</p>`;

  /* ---------- Footer ---------- */
  const c = D.contact;
  const soc = [["Instagram", c.instagram], ["LinkedIn", c.linkedin], ["GitHub", c.github], ["YouTube", c.youtube]].filter((s) => s[1]);
  const ftr = document.createElement("footer");
  ftr.className = "ftr";
  ftr.innerHTML = `
    <div class="wrap">
      <div class="ftr__top">
        <div>
          <a class="brand" href="index.html"><img src="assets/img/logo.png" alt="" width="46" height="46"><span class="brand__t"><b>Yantrix</b><small>Robotics &amp; Aviation Club</small></span></a>
          <p class="ftr__lead">The robotics and aviation club of ${D.university.name}, Pune.</p>
        </div>
        <div><h4>Explore</h4><ul>${NAV.map((n) => `<li><a href="${n[2]}">${n[1]}</a></li>`).join("")}<li><a href="join.html">Join us</a></li></ul></div>
        <div><h4>Find us</h4><address>${D.university.name}<br>${D.university.address.join("<br>")}</address></div>
        <div><h4>Say hello</h4><ul>
          ${c.email ? `<li><a href="mailto:${c.email}">${c.email}</a></li>` : ""}
          ${soc.map((s) => `<li><a href="${s[1]}" target="_blank" rel="noopener">${s[0]} ↗</a></li>`).join("")}
          ${!c.email && !soc.length ? `<li><a href="join.html">Send us a message →</a></li>` : ""}
        </ul></div>
      </div>
    </div>
    <div class="ftr__word" aria-hidden="true">Yantrix</div>
    <div class="wrap"><div class="ftr__bar label"><span>© ${new Date().getFullYear()} Yantrix — ${D.university.short}</span><span>${D.university.coords}</span></div></div>`;

  const veil = document.createElement("div");
  veil.className = "veil";
  veil.innerHTML = '<img src="assets/img/logo.png" alt="">';

  const main = document.querySelector("main");
  const skip = document.createElement("a");
  skip.className = "skip"; skip.href = "#main"; skip.textContent = "Skip to content";
  document.body.prepend(skip, hdr, sheet);
  document.body.append(ftr, veil);
  if (main) main.id = "main";

  /* ---------- Menu ---------- */
  const burger = hdr.querySelector(".burger");
  const setMenu = (open) => {
    document.body.classList.toggle("menu-open", open);
    burger.setAttribute("aria-expanded", open);
  };
  burger.addEventListener("click", () => setMenu(!document.body.classList.contains("menu-open")));
  addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));

  /* ---------- Header state: solid after scroll, hides on scroll-down ---------- */
  let lastY = scrollY;
  const onScroll = () => {
    const y = scrollY;
    hdr.classList.toggle("solid", y > 40);
    const stuck = document.body.classList.contains("menu-open");
    hdr.classList.toggle("hide", !stuck && y > 500 && y > lastY + 6 && !document.body.hasAttribute("data-pinned"));
    if (y < lastY - 6) hdr.classList.remove("hide");
    lastY = y;
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Page transitions ---------- */
  document.addEventListener("click", (e) => {
    const a = e.target.closest("a[href]");
    if (!a || e.defaultPrevented || e.metaKey || e.ctrlKey || e.shiftKey || a.target === "_blank") return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || u.pathname === location.pathname || /^(mailto|tel):/.test(a.getAttribute("href"))) return;
    if (reduce) return;
    e.preventDefault();
    setMenu(false);
    document.body.classList.add("leaving");
    setTimeout(() => (location.href = u.href), 380);
  });
  addEventListener("pageshow", (e) => e.persisted && document.body.classList.remove("leaving"));

  /* ---------- Reveal on view ---------- */
  const io = new IntersectionObserver(
    (es) => es.forEach((en) => { if (en.isIntersecting) { en.target.classList.add("in"); io.unobserve(en.target); } }),
    { threshold: 0.15, rootMargin: "0px 0px -6% 0px" }
  );
  window.YX_observe = (root = document) => root.querySelectorAll(".rv, .ln-group").forEach((el) => io.observe(el));
  // stagger index for line masks
  document.querySelectorAll(".ln-group").forEach((g) => g.querySelectorAll(".ln").forEach((l, i) => l.style.setProperty("--i", i)));
  window.YX_observe();
  // hero reveals immediately
  requestAnimationFrame(() => document.querySelectorAll("[data-now]").forEach((el) => setTimeout(() => el.classList.add("in"), 120)));

  /* ---------- Word-by-word scroll fill ---------- */
  document.querySelectorAll("[data-fill]").forEach((el) => {
    const walk = (node) => {
      [...node.childNodes].forEach((n) => {
        if (n.nodeType === 3) {
          const frag = document.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((t) => {
            if (!t.trim()) frag.append(t);
            else { const s = document.createElement("span"); s.className = "w"; s.textContent = t; frag.append(s); }
          });
          n.replaceWith(frag);
        } else walk(n);
      });
    };
    walk(el);
    const words = el.querySelectorAll(".w");
    const upd = () => {
      const r = el.getBoundingClientRect();
      const vh = innerHeight;
      const p = Math.min(1, Math.max(0, (vh * 0.82 - r.top) / (r.height + vh * 0.3)));
      const n = Math.round(p * words.length * 1.08);
      words.forEach((w, i) => w.classList.toggle("on", i < n));
    };
    addEventListener("scroll", upd, { passive: true });
    addEventListener("resize", upd);
    upd();
  });

  /* ---------- Shared: event rows (home teaser + events page) ---------- */
  window.YX_eventRows = (list) =>
    list.map((e, n) => {
      let date;
      if (e.date) {
        const d = new Date(e.date + "T00:00:00");
        date = `<div class="ev__date">${String(d.getDate()).padStart(2, "0")}<small>${d.toLocaleString("en-IN", { month: "short", year: "numeric" })}</small></div>`;
      } else date = `<div class="ev__date tba">TBA<small>Date to be announced</small></div>`;
      const today = e.date && e.date === new Date().toLocaleDateString("en-CA");
      const act = e.status === "past" ? "" : e.link
        ? `<a class="btn" href="${e.link}" target="_blank" rel="noopener">Register <span class="arr">→</span></a>`
        : `<a class="btn btn--ghost" href="join.html">${today ? "Join the club" : "Get notified"}</a>`;
      return `<article class="ev rv" data-kind="${e.kind}" style="--i:${n}">
        ${date}
        <div><span class="label kind">${e.kind}</span>${today ? '<span class="live label">● Happening today</span>' : ""}<h3>${e.title}</h3><p>${e.summary}</p>
          <div class="ev__meta label"><span>${e.place}</span><span>${e.format}</span></div></div>
        <div class="ev__act">${act}</div></article>`;
    }).join("");

  /* ---------- Parallax (images inside [data-par]) ---------- */
  const pars = [...document.querySelectorAll("[data-par]")];
  if (pars.length && !reduce) {
    const tick = () => {
      pars.forEach((el) => {
        const host = el.parentElement.getBoundingClientRect();
        if (host.bottom < -200 || host.top > innerHeight + 200) return;
        const p = (host.top + host.height / 2 - innerHeight / 2) / innerHeight;
        el.style.transform = `translate3d(0, ${(p * -parseFloat(el.dataset.par || 8)).toFixed(2)}%, 0)`;
      });
    };
    addEventListener("scroll", tick, { passive: true });
    tick();
  }
})();
