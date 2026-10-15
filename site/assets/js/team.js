/* Team: name-first roster, rendered from data.js */
(function () {
  const D = window.YANTRIX;
  const esc = (s) => String(s).replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
  const ini = (n) => n.split(/\s+/).map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  const row = (p, i) => {
    const links = [p.linkedin && ["LinkedIn", p.linkedin], p.github && ["GitHub", p.github]].filter(Boolean)
      .map((l) => `<a href="${esc(l[1])}" target="_blank" rel="noopener">${l[0]} ↗</a>`).join("");
    return `<article class="rrow rv" style="--i:${i}" data-ini="${esc(ini(p.name))}">
      <span class="rrow__no label">${String(i + 1).padStart(2, "0")}</span>
      <h3 class="rrow__name display"><span class="ln"><span>${esc(p.name)}</span></span></h3>
      <div class="rrow__meta"><span class="rrow__role label">${esc(p.role)}</span>${links ? `<span class="rrow__links label">${links}</span>` : ""}</div>
      ${p.photo ? `<img class="rrow__ph" src="${esc(p.photo)}" alt="${esc(p.name)}" loading="lazy">` : ""}
      <i class="rrow__bar" aria-hidden="true"></i>
    </article>`;
  };
  document.getElementById("mentors").innerHTML = D.mentors.map(row).join("");
  document.getElementById("team").innerHTML = D.team.map(row).join("");
  document.querySelectorAll(".rrow").forEach((r) => {
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { r.classList.add("in"); r.querySelector(".ln").classList.add("in"); o.disconnect(); } }, { threshold: 0.3 }).observe(r);
    // pointer-follow glow on the row (desktop only)
    r.addEventListener("pointermove", (e) => { const b = r.getBoundingClientRect(); r.style.setProperty("--mx", ((e.clientX - b.left) / b.width * 100).toFixed(1) + "%"); });
  });
  const names = D.mentors.concat(D.team).map((p) => esc(p.name));
  const strip = names.map((n) => `<span>${n}</span><b>✦</b>`).join("");
  document.getElementById("marquee").innerHTML = strip + strip + strip + strip;
  window.YX_observe();
})();
