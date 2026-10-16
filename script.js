/* ===== EDIT THESE DETAILS FOR EACH CLIENT ===== */
const CONFIG = {
  clinicName: "[Clinic Name]",
  city: "[City / Area]",
  vetName: "Dr. [Name]",
  qualifications: "[Verified qualifications]",
  specialty: "[Veterinary specialty]",
  experience: "[Years of experience]",
  address: "[Full clinic address]",
  hours: "[Opening hours]",
  phoneDisplay: "[Phone number]",
  email: "[Email, if supplied]",
  phone: "+91XXXXXXXXXX",      // used for tel: link
  whatsapp: "91XXXXXXXXXX",    // digits only, country code first
  mapsUrl: ""                  // paste the real Google Maps URL
};
/* ============================================= */
const configured = v => v && !/X{4,}/.test(v);
document.querySelectorAll("[data-cfg]").forEach(el => { const v = CONFIG[el.dataset.cfg]; if (v) el.textContent = v; });
document.getElementById("yr").textContent = new Date().getFullYear();
document.querySelectorAll("[data-link]").forEach(a => {
  const t = a.dataset.link;
  if (t === "call" && configured(CONFIG.phone)) a.href = "tel:" + CONFIG.phone;
  if (t === "wa" && configured(CONFIG.whatsapp)) a.href = "https://wa.me/" + CONFIG.whatsapp;
  if (t === "maps") {
    if (CONFIG.mapsUrl) a.href = CONFIG.mapsUrl;
    else a.addEventListener("click", e => { e.preventDefault(); alert("Demo: add the clinic's Google Maps URL in script.js (CONFIG.mapsUrl)."); });
  }
  if (t !== "maps" && !configured(t === "call" ? CONFIG.phone : CONFIG.whatsapp))
    a.addEventListener("click", e => { e.preventDefault(); alert("Demo: add the clinic's real number in script.js (CONFIG) to enable this."); });
});

/* Mobile menu */
const btn = document.getElementById("menuBtn"), menu = document.getElementById("navMenu");
function setMenu(open){ menu.classList.toggle("open", open); btn.setAttribute("aria-expanded", open); btn.setAttribute("aria-label", open ? "Close menu" : "Open menu"); }
btn.addEventListener("click", () => setMenu(btn.getAttribute("aria-expanded") !== "true"));
menu.querySelectorAll("a").forEach(a => a.addEventListener("click", () => setMenu(false)));
document.addEventListener("keydown", e => { if (e.key === "Escape" && menu.classList.contains("open")) { setMenu(false); btn.focus(); } });

/* FAQ accordion (native buttons: Enter/Space work) */
document.querySelectorAll(".faq button").forEach(b => b.addEventListener("click", () => {
  const open = b.getAttribute("aria-expanded") === "true";
  b.setAttribute("aria-expanded", !open);
  document.getElementById(b.getAttribute("aria-controls")).hidden = open;
}));

/* Appointment form */
const form = document.getElementById("apptForm"), review = document.getElementById("review"),
      reviewText = document.getElementById("reviewText"), demoMsg = document.getElementById("demoMsg");
document.getElementById("date").min = new Date().toISOString().split("T")[0];
document.querySelectorAll("[data-service]").forEach(a => a.addEventListener("click", () => {
  document.getElementById("msg").value = "I would like to enquire about: " + a.dataset.service + ".";
}));
form.addEventListener("submit", e => {
  e.preventDefault();
  let ok = true, first = null;
  ["owner","phone","pet","type","date"].forEach(id => {
    const f = document.getElementById(id), err = document.getElementById(id + "-err");
    let m = "";
    if (!f.value.trim()) m = "This field is required.";
    else if (id === "phone" && !/^[+\d][\d\s-]{6,}$/.test(f.value.trim())) m = "Enter a valid phone number.";
    err.textContent = m; f.setAttribute("aria-invalid", !!m);
    if (m) { ok = false; first = first || f; }
  });
  if (!ok) { first.focus(); return; }
  const v = n => document.getElementById(n).value.trim();
  reviewText.value = `Hello, I would like to enquire about a veterinary appointment.\n\nOwner: ${v("owner")}\nPhone: ${v("phone")}\nPet: ${v("pet")} (${v("type")})\nPreferred date: ${v("date")}${v("msg") ? "\nMessage: " + v("msg") : ""}\n\nPlease let me know about availability. Thank you.`;
  review.hidden = false; demoMsg.hidden = true; review.scrollIntoView({ block: "center" }); reviewText.focus();
});
document.getElementById("editBtn").addEventListener("click", () => { review.hidden = true; document.getElementById("owner").focus(); });
document.getElementById("sendWa").addEventListener("click", () => {
  if (!configured(CONFIG.whatsapp)) {
    demoMsg.textContent = "Demo notice: a real clinic WhatsApp number is required before this form can be used. Add it in script.js (CONFIG.whatsapp).";
    demoMsg.hidden = false; return;
  }
  window.open("https://wa.me/" + CONFIG.whatsapp + "?text=" + encodeURIComponent(reviewText.value), "_blank", "noopener");
});
