/* Gallery: filters + lightbox */
(function () {
  const items = window.YANTRIX.gallery;
  const grid = document.getElementById("grid");
  const filters = document.getElementById("filters");
  const lb = document.getElementById("lb");
  const lbm = document.getElementById("lbm");
  const lbc = document.getElementById("lbc");
  const cats = ["All", ...new Set(items.map((i) => i.cat))];
  let active = "All", visible = [], idx = 0, lastFocus = null;

  grid.innerHTML = items
    .map((it, n) => {
      const media = it.type === "vid"
        ? `<img src="${it.poster}" alt="${it.title}" loading="lazy"><span class="play" aria-hidden="true"></span>`
        : `<img src="${it.src}" alt="Yantrix photo ${n + 1}" loading="lazy">`;
      return `<button class="gi rv" data-n="${n}" data-cat="${it.cat}" style="--i:${n % 3}" aria-label="Open photo ${n + 1}">${media}</button>`;
    })
    .join("");
  filters.innerHTML = cats
    .map((c) => `<button class="chip" aria-pressed="${c === "All"}" data-c="${c}">${c}<sup>${c === "All" ? items.length : items.filter((i) => i.cat === c).length}</sup></button>`)
    .join("");
  const tiles = [...grid.children];
  const count = document.getElementById("gcount");
  function apply() {
    visible = [];
    tiles.forEach((t, n) => {
      const show = active === "All" || t.dataset.cat === active;
      t.classList.toggle("hide", !show);
      if (show) { visible.push(n); t.classList.add("in"); }
    });
    if (count) count.textContent = `${visible.length} items`;
  }
  filters.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    active = b.dataset.c;
    filters.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
    apply();
  });
  window.YX_observe(grid);
  apply();

  function show(i) {
    idx = (i + visible.length) % visible.length;
    const it = items[visible[idx]];
    lbm.innerHTML = it.type === "vid"
      ? `<video src="${it.src}" poster="${it.poster}" controls autoplay loop playsinline></video>`
      : `<img src="${it.src}" alt="${it.title}">`;
    lbc.textContent = `${idx + 1} / ${visible.length}`;
  }
  function open(n) {
    lastFocus = document.activeElement;
    lb.classList.add("open");
    document.body.style.overflow = "hidden";
    show(visible.indexOf(n));
    lb.querySelector(".x").focus();
  }
  function close() {
    lb.classList.remove("open");
    lbm.innerHTML = "";
    document.body.style.overflow = "";
    lastFocus && lastFocus.focus();
  }
  grid.addEventListener("click", (e) => { const t = e.target.closest(".gi"); if (t) open(+t.dataset.n); });
  lb.querySelector(".x").onclick = close;
  lb.querySelector(".pv").onclick = () => show(idx - 1);
  lb.querySelector(".nx").onclick = () => show(idx + 1);
  lb.addEventListener("click", (e) => { if (e.target === lb) close(); });
  addEventListener("keydown", (e) => {
    if (!lb.classList.contains("open")) return;
    if (e.key === "Escape") close();
    if (e.key === "ArrowLeft") show(idx - 1);
    if (e.key === "ArrowRight") show(idx + 1);
  });
})();
