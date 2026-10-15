/* Scroll-scrubbed video stages (.scrub). Video must be all-intra encoded for smooth seeking. */
(function () {
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  document.querySelectorAll(".scrub").forEach((sec) => {
    const v = sec.querySelector("video");
    const beats = [...sec.querySelectorAll(".beat")];
    const bar = sec.querySelector(".scrub__bar i");
    const frameLabel = sec.querySelector("[data-tc]");
    let target = 0, cur = 0, active = false, dur = 0;
    /* optional data-map="p:seconds,p:seconds,…" remaps scroll progress to video time */
    const map = (sec.dataset.map || "").split(",").filter(Boolean).map((k) => k.split(":").map(Number));
    const toTime = (p) => {
      if (map.length < 2) return p * (dur || 0);
      for (let i = 1; i < map.length; i++) {
        if (p <= map[i][0]) { const [p0, t0] = map[i - 1], [p1, t1] = map[i]; return t0 + ((p - p0) / (p1 - p0)) * (t1 - t0); }
      }
      return map[map.length - 1][1];
    };

    const progress = () => {
      const r = sec.getBoundingClientRect();
      return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
    };
    const setBeat = (p) => {
      let idx = beats.findIndex((b) => {
        const [a, z] = b.dataset.at.split("-").map(Number);
        return p >= a && p < z + (z >= 1 ? 1 : 0);
      });
      beats.forEach((b, i) => b.classList.toggle("on", i === idx));
    };
    v.addEventListener("loadedmetadata", () => { dur = v.duration; });
    if (v.readyState >= 1) dur = v.duration;
    v.pause();

    const frame = () => {
      if (!active) return;
      const p = progress();
      target = toTime(p);
      cur += (target - cur) * (reduce ? 1 : 0.14);
      if (dur && Math.abs(v.currentTime - cur) > 0.012) v.currentTime = cur;
      if (bar) bar.style.transform = `scaleX(${p})`;
      if (frameLabel && dur) frameLabel.textContent = `T+${cur.toFixed(2).padStart(5, "0")}s`;
      setBeat(p);
      requestAnimationFrame(frame);
    };
    /* videos are only fetched once the visitor is within ~1.5 screens of them */
    new IntersectionObserver((es, o) => { if (es[0].isIntersecting) { v.preload = "auto"; v.load(); o.disconnect(); } }, { rootMargin: "150% 0px" }).observe(sec);
    new IntersectionObserver(
      (es) => {
        const on = es[0].isIntersecting;
        if (on && !active) { active = true; requestAnimationFrame(frame); }
        else if (!on) active = false;
        document.body.toggleAttribute("data-pinned", on);
      },
      { rootMargin: "100px 0px" }
    ).observe(sec);
    setBeat(0);
  });
})();
