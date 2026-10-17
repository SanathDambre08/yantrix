/* Join form: validate → POST to endpoint, else open a pre-filled email, else say it isn't connected. */
(function () {
  const C = window.YANTRIX.contact;
  const form = document.getElementById("joinForm");
  const status = document.getElementById("status");
  const direct = document.getElementById("direct");
  if (C.email) direct.innerHTML = `Prefer email? <a href="mailto:${C.email}" style="border-bottom:1px solid currentColor">${C.email}</a>`;

  const say = (msg, ok) => {
    status.textContent = msg;
    status.className = "form__status show" + (ok ? " ok" : "");
  };
  const fail = (el, bad) => el.closest(".field").classList.toggle("err", bad);

  ["name", "email", "phone", "prog", "year"].forEach((id) => form[id === "prog" ? "prog" : id].addEventListener("input", (e) => fail(e.target, false)));
  form.ints = document.getElementById("ints");
  const otherBox = document.getElementById("otherBox"), otherWrap = document.getElementById("otherWrap"), otherText = document.getElementById("otherText");
  otherBox.addEventListener("change", () => { if (otherBox.checked) otherText.focus(); else otherWrap.classList.remove("err"); });
  /* typing in the box ticks "Other" for you; clearing it unticks it */
  otherText.addEventListener("input", () => { otherBox.checked = !!otherText.value.trim(); otherWrap.classList.remove("err"); form.ints.classList.remove("err"); });
  form.ints.addEventListener("change", () => fail(form.ints, false));

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    if (form.company.value) return; // honeypot
    const d = {
      name: form.name.value.trim(), email: form.email.value.trim(), phone: form.phone.value.trim(), programme: form.prog.value.trim(),
      year: form.year.value, about: form.about.value.trim(),
      interests: [...form.querySelectorAll("[name=interests]:checked")].map((c) => c.value === "Other" ? "Other: " + otherText.value.trim().replace(/[,\n]+/g, " ") : c.value),
    };
    const bad = {
      name: !d.name, phone: !/^\+?[\d\s-]{10,15}$/.test(d.phone), email: !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(d.email), prog: !d.programme, year: !d.year, ints: !d.interests.length, other: otherBox.checked && !otherText.value.trim(),
    };
    fail(form.name, bad.name); fail(form.email, bad.email); fail(form.phone, bad.phone); fail(form.prog, bad.prog); fail(form.year, bad.year); fail(form.ints, bad.ints); otherWrap.classList.toggle("err", !!bad.other);
    const first = Object.keys(bad).find((k) => bad[k]);
    if (first) { say("A few details are missing — check the highlighted fields.", false); (first === "ints" ? form.ints.querySelector("input") : first === "other" ? otherText : form[first]).focus(); return; }

    const btn = form.querySelector("button[type=submit]");
    if (C.formEndpoint) {
      btn.disabled = true;
      try {
        const r = await fetch(C.formEndpoint, { method: "POST", headers: { "Content-Type": "text/plain;charset=utf-8" }, body: JSON.stringify(Object.assign({ company: form.company.value }, d)) });
        if (!r.ok) throw new Error(r.status);
        const j = await r.json().catch(() => ({ ok: true }));
        if (j && j.ok === false) throw new Error(j.error || "rejected");
        form.reset();
        say("Thank you! Your application is in — check your email for a confirmation (look in Spam if you don\u2019t see it). We\u2019ll get in contact soon.", true);
      } catch (err) {
        say("Couldn't send that just now. Please try again in a moment" + (C.email ? ` or email ${C.email}.` : "."), false);
      }
      btn.disabled = false;
    } else if (C.email) {
      const body = `Name: ${d.name}\nEmail: ${d.email}\nPhone: ${d.phone}\nProgramme: ${d.programme}\nYear: ${d.year}\nInterests: ${d.interests.join(", ")}\n\n${d.about}`;
      location.href = `mailto:${C.email}?subject=${encodeURIComponent("Yantrix application — " + d.name)}&body=${encodeURIComponent(body)}`;
      say("Your email app should open with your application ready to send. Hit send there to finish.", true);
    } else {
      say("The application form isn't connected to an inbox yet. Set an email or form endpoint in assets/js/data.js and it will start working.", false);
    }
  });
})();
