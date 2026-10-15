/* Events: filterable list from data.js */
(function () {
  const all = window.YANTRIX.events;
  const up = all.filter((e) => e.status === "upcoming");
  const past = all.filter((e) => e.status === "past");
  const list = document.getElementById("upcoming");
  const tabs = document.getElementById("tabs");
  const kinds = ["All", ...new Set(up.map((e) => e.kind))];

  if (kinds.length < 3) tabs.style.display = "none";
  tabs.innerHTML = kinds.map((k) => `<button class="chip" aria-pressed="${k === "All"}" data-k="${k}">${k}</button>`).join("");
  function render(k) {
    const rows = up.filter((e) => k === "All" || e.kind === k);
    list.innerHTML = rows.length ? window.YX_eventRows(rows) : `<p class="lede" style="padding:40px 0">Nothing listed here yet.</p>`;
    window.YX_observe(list);
  }
  tabs.addEventListener("click", (e) => {
    const b = e.target.closest(".chip");
    if (!b) return;
    tabs.querySelectorAll(".chip").forEach((c) => c.setAttribute("aria-pressed", c === b));
    render(b.dataset.k);
  });
  render("All");

  if (past.length) {
    const box = document.getElementById("past");
    box.outerHTML = `<div class="evl" style="margin-top:30px" id="past">${window.YX_eventRows(past)}</div>`;
    window.YX_observe(document.getElementById("past"));
  }
})();
