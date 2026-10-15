/* Journey: 240-frame Earth → DYPIU sequence drawn to a canvas, driven by scroll. */
(function () {
  const sec = document.querySelector(".seq");
  if (!sec) return;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const canvas = sec.querySelector("canvas");
  const ctx = canvas.getContext("2d", { alpha: false });
  const total = 240;
  /* phones / data-saver get a lighter frame set (~1/4 of the bytes) */
  const small = innerWidth <= 820 || (navigator.connection && navigator.connection.saveData);
  const src = (i) => `assets/${small ? "frames-sm" : "frames"}/f${String(i + 1).padStart(3, "0")}.jpg`;
  const frames = new Array(total);
  let loaded = 0, current = null, want = 0, smooth = 0, dpr = 1, active = false;
  const loadBar = sec.querySelector(".seq__load i b");
  const loadWrap = sec.querySelector(".seq__load");
  const loadTxt = sec.querySelector(".seq__load span");
  const caps = [...sec.querySelectorAll(".cap")];
  const chaps = [...sec.querySelectorAll(".seq__chaps span")];
  const tc = sec.querySelector("[data-frame]");

  /* chapters: [start, end) in scroll progress (0..1) */
  const CH = [[0, 0.3], [0.3, 0.45], [0.45, 0.8], [0.8, 1.01]];

  function resize() {
    dpr = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(canvas.clientWidth * dpr);
    canvas.height = Math.round(canvas.clientHeight * dpr);
    current = null;
    draw(Math.round(smooth));
  }
  function draw(i) {
    const own = frames[i] && frames[i].complete && frames[i].naturalWidth ? frames[i] : null;
    const img = own || nearest(i);
    if (!img || img === current) return;
    current = img;
    ctx.imageSmoothingQuality = "high";
    const cw = canvas.width, ch = canvas.height, s = Math.max(cw / img.naturalWidth, ch / img.naturalHeight);
    const w = img.naturalWidth * s, h = img.naturalHeight * s;
    ctx.drawImage(img, (cw - w) / 2, (ch - h) / 2, w, h);
  }
  function nearest(i) {
    for (let d = 1; d < total; d++) {
      if (frames[i - d] && frames[i - d].complete && frames[i - d].naturalWidth) return frames[i - d];
      if (frames[i + d] && frames[i + d].complete && frames[i + d].naturalWidth) return frames[i + d];
    }
    return null;
  }
  function load(i) {
    return new Promise((res) => {
      if (frames[i]) return res();
      const im = new Image();
      im.decoding = "async";
      im.onload = im.onerror = () => {
        loaded++;
        const p = loaded / total;
        if (loadBar) loadBar.style.transform = `scaleX(${p})`;
        if (loadTxt) loadTxt.textContent = `Loading flight path ${Math.round(p * 100)}%`;
        if (loaded === total && loadWrap) loadWrap.classList.add("done");
        res();
      };
      im.src = src(i);
      frames[i] = im;
    });
  }
  /* load first, last, then every 6th, then the rest — scrubbing works almost immediately */
  async function preload() {
    const order = [0, total - 1];
    for (let s = 6; s > 0; s = s === 6 ? 3 : s === 3 ? 1 : 0) for (let i = 0; i < total; i += s) order.push(i);
    const seen = new Set(), q = order.filter((i) => !seen.has(i) && seen.add(i));
    for (let i = 0; i < q.length; i += 6) await Promise.all(q.slice(i, i + 6).map(load));
  }

  function progress() {
    const r = sec.getBoundingClientRect();
    return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
  }
  function ui(p) {
    sec.style.setProperty("--p", p.toFixed(3));
    const ci = CH.findIndex(([a, z]) => p >= a && p < z);
    caps.forEach((c, i) => c.classList.toggle("on", i === ci));
    chaps.forEach((c, i) => {
      const [a, z] = CH[i];
      c.style.setProperty("--p", Math.min(1, Math.max(0, (p - a) / (z - a))).toFixed(3));
      c.classList.toggle("on", i === ci);
    });
    if (tc) tc.textContent = `FRAME ${String(Math.round(smooth) + 1).padStart(3, "0")} / ${total}`;
  }
  function tick() {
    if (!active) return;
    const p = progress();
    want = p * (total - 1);
    smooth += (want - smooth) * (reduce ? 1 : 0.16);
    if (Math.abs(want - smooth) < 0.02) smooth = want;
    draw(Math.round(smooth));
    ui(p);
    requestAnimationFrame(tick);
  }

  new IntersectionObserver(
    (es) => {
      const on = es[0].isIntersecting;
      if (on && !active) { active = true; requestAnimationFrame(tick); }
      else if (!on) active = false;
      document.body.toggleAttribute("data-pinned", on);
    },
    { rootMargin: "100px 0px" }
  ).observe(sec);

  addEventListener("resize", resize);
  load(0).then(() => { resize(); preload(); });
  ui(0);
})();
