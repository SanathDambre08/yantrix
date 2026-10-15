/* Journey: milestones from the events list, oldest first */
(function () {
  const list = window.YANTRIX.events.slice().sort((a, b) => (a.date || "9").localeCompare(b.date || "9"));
  const box = document.getElementById("story");
  box.innerHTML = window.YX_eventRows(list);
  window.YX_observe(box);
})();

/* Horizontal film strip: vertical scroll drives sideways travel */
(function () {
  const sec = document.querySelector(".hs");
  if (!sec || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const track = document.getElementById("hsTrack");
  const bar = sec.querySelector(".hs__bar i");
  const num = document.getElementById("hsn");
  const panels = [...track.children];
  let cur = 0, active = false;
  const prog = () => {
    const r = sec.getBoundingClientRect();
    return Math.min(1, Math.max(0, -r.top / (r.height - innerHeight)));
  };
  const frame = () => {
    if (!active) return;
    const p = prog();
    const max = track.scrollWidth - innerWidth;
    cur += (p * max - cur) * 0.12;
    track.style.transform = `translate3d(${-cur.toFixed(1)}px,0,0)`;
    bar.style.transform = `scaleX(${p})`;
    num.textContent = String(Math.min(panels.length, Math.floor(p * panels.length * 0.999) + 1)).padStart(2, "0");
    requestAnimationFrame(frame);
  };
  new IntersectionObserver((es) => {
    const on = es[0].isIntersecting;
    if (on && !active) { active = true; requestAnimationFrame(frame); } else if (!on) active = false;
  }, { rootMargin: "100px 0px" }).observe(sec);
})();
