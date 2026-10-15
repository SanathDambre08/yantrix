/* Home: live reel timecode + upcoming events teaser */
(function () {
  const v = document.querySelector(".hero__video");
  const tc = document.getElementById("tc");
  if (v && tc) {
    const pad = (n) => String(Math.floor(n)).padStart(2, "0");
    v.addEventListener("timeupdate", () => (tc.textContent = `${pad(v.currentTime / 60)}:${pad(v.currentTime % 60)}`));
    // pause the reel when it's off-screen
    new IntersectionObserver((es) => (es[0].isIntersecting ? v.play().catch(() => {}) : v.pause()), { threshold: 0.05 }).observe(v);
  }
  const box = document.getElementById("homeEvents");
  if (box) {
    box.innerHTML = window.YX_eventRows(window.YANTRIX.events.filter((e) => e.status === "upcoming").slice(0, 3));
    window.YX_observe(box);
  }
})();
