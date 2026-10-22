/* ==========================================================
   Long-distance quiz — game logic
   ========================================================== */

/* ===== ✏️ CONFIG — edit these to personalise! ===== */
const CONFIG = {
  yourName: "Abdul",
  greeting: "Hey Amreen Fathima 💕",
  introText:
    "We're far apart right now, but let's see how well you know us. " +
    "Answer honestly… (or just pick whatever makes me smile 😌)",

  me:  { city: "Muscat",    tz: "Asia/Muscat",  lat: 23.588, lon: 58.3829 },
  her: { city: "Hyderabad", tz: "Asia/Kolkata", lat: 17.385, lon: 78.4867 },

  call: {
    // Call start in MUSCAT time. Keep the +04:00 at the end!
    start: "2026-10-22T22:29:00+04:00", // 8:30 PM Muscat = 10:00 PM Hyderabad
    durationHours: 2,
    platform: "WhatsApp video call",
    dressCode: "Comfiest pyjamas allowed 😴",
    bring: "Chai ☕ and that smile",
    plan: "Dinner together on camera + a movie in sync 🍿",
  },

  message:
    "2,000+ km can't stop a date night. Tonight it's you, me, two screens, " +
    "and absolutely zero network excuses. I'll call you right on time 💖",

  // Your WhatsApp number with country code, digits only (e.g. "968XXXXXXXX").
  // When set, the success screen gets a "Tell me on WhatsApp" button.
  // Leave "" to hide the button.
  whatsappNumber: "",
};

/* ===== ✏️ QUIZ QUESTIONS — edit freely! =====
   correct: index of the right option (0 = first), or "all" if every answer is right.
   type "distance" and "time" are generated live from the cities above. */
const QUESTIONS = [
  {
    emoji: "💘",
    q: "Who fell in love first?",
    options: ["Zafer, obviously", "Amreen, obviously", "We both did at the same time", "The WiFi router"],
    correct: 1,
    right: "Correct! You fell first. Admit it 😌",
    wrong: "Nice try, but it was YOU. You never stood a chance 😌",
  },
  {
    type: "distance",
    emoji: "✈️",
    q: "How far apart are we right now?",
    right: "Correct! But honestly it feels like 0 km 🫶",
    wrong: "It's actually {km} km… but who's counting? (Me. I'm counting.)",
  },
  {
    type: "time",
    emoji: "🕰️",
    q: "Quick! What time is it for me in {myCity} right now?",
    right: "Yes! I'm always 1½ hours behind you… but always ahead in loving you 😏",
    wrong: "It's {myTime} here. I'm 1½ hours behind you, remember? 🙈",
  },
  {
    emoji: "📞",
    q: "Who says \"I'll call you in 5 minutes\" and calls 2 hours later?",
    options: ["Amreen", "Zafer", "Both of us", "Blame the network"],
    correct: 1,
    right: "Guilty as charged 🙋‍♂️ Tonight I'll be on time, promise!",
    wrong: "Let's be honest… it's me 🙋‍♂️ But tonight I'll be on time!",
  },
  {
    emoji: "🍛",
    q: "Which city has the best biryani?",
    options: ["Hyderabad, obviously", "Muscat (I'm being brave)", "Whichever one we eat together", "Both… please don't fight me"],
    correct: "all",
    right: "Trick question! Every answer is right, as long as we eat it together 🥰",
  },
  {
    emoji: "🥺",
    q: "On a scale of 1–10, how much do I miss you?",
    options: ["7", "9", "10", "It broke the scale"],
    correct: 3,
    right: "Correct! The scale is broken and so is my heart without you 💔➡️💖",
    wrong: "Way off! The scale is broken. I miss you THAT much 🥺",
  },
  {
    emoji: "✨",
    q: "What's my favourite thing about you?",
    options: ["Your smile", "Your laugh", "How you put up with me", "All of the above, and more"],
    correct: "all",
    right: "Trick question again! All of it. Every single thing 💞",
  },
];

/* ===== Fun lines for the runaway "No" ===== */
const NO_TEXTS = ["No", "Are you sure?", "Really?", "Think again!", "Network error 📶", "Nope 🙈", "Can't catch me!", "Pleeease? 🥺", "I flew 2,000 km for this 💔", "Just click YES 😌"];
const HINTS = [
  "Choose wisely… 😇",
  "Whoops! That button has bad signal 📶",
  "It flew away. Must be the long distance ✈️",
  "The YES button is looking extra cute now 👀",
  "'No' is not available in your region 🌏",
  "It's getting smaller… just like the distance between us 🫶",
  "Resistance is futile 💘",
  "Okay you're persistent. I love that about you 🥰",
  "Pssst… the big pink one ➡️ YES!",
];

/* ===== Helpers ===== */
const $ = (id) => document.getElementById(id);
const fmtTime = (date, tz) =>
  new Intl.DateTimeFormat("en-US", { hour: "numeric", minute: "2-digit", timeZone: tz }).format(date);
const shuffle = (a) => { for (let i = a.length - 1; i > 0; i--) { const j = (Math.random() * (i + 1)) | 0; [a[i], a[j]] = [a[j], a[i]]; } return a; };

function distanceKm(a, b) {
  const r = (x) => (x * Math.PI) / 180;
  const h = Math.sin(r(b.lat - a.lat) / 2) ** 2 +
    Math.cos(r(a.lat)) * Math.cos(r(b.lat)) * Math.sin(r(b.lon - a.lon) / 2) ** 2;
  return Math.round(6371 * 2 * Math.asin(Math.sqrt(h)));
}
const KM = distanceKm(CONFIG.me, CONFIG.her);
const kmText = (n) => n.toLocaleString("en-US");

function fill(text) {
  return text
    .replaceAll("{km}", kmText(KM))
    .replaceAll("{myCity}", CONFIG.me.city)
    .replaceAll("{herCity}", CONFIG.her.city)
    .replaceAll("{myTime}", fmtTime(new Date(), CONFIG.me.tz));
}

function showScreen(from, to) {
  from.classList.add("leaving");
  setTimeout(() => {
    from.hidden = true;
    from.classList.remove("leaving");
    to.hidden = false;
    to.scrollTop = 0;
  }, 380);
}

/* ===== Background hearts ===== */
(function makeHearts() {
  const box = $("bgHearts");
  const emojis = ["💗", "💕", "💖", "🌸", "✨", "💞", "✈️"];
  const count = window.innerWidth < 600 ? 12 : 20;
  for (let i = 0; i < count; i++) {
    const s = document.createElement("span");
    s.textContent = emojis[i % emojis.length];
    s.style.left = Math.random() * 100 + "vw";
    s.style.fontSize = 14 + Math.random() * 20 + "px";
    s.style.animationDuration = 10 + Math.random() * 14 + "s";
    s.style.animationDelay = -Math.random() * 20 + "s";
    box.appendChild(s);
  }
})();

/* ==========================================================
   1. INTRO
   ========================================================== */
$("greeting").textContent = CONFIG.greeting;
$("introText").textContent = CONFIG.introText;
$("myCity").textContent = $("tMyCity").textContent = CONFIG.me.city;
$("herCity").textContent = $("tHerCity").textContent = CONFIG.her.city;
$("distance").textContent = kmText(KM) + " km apart";

function tickClocks() {
  const now = new Date();
  $("myClock").textContent = fmtTime(now, CONFIG.me.tz);
  $("herClock").textContent = fmtTime(now, CONFIG.her.tz);
}
tickClocks();
setInterval(tickClocks, 1000);

$("startBtn").addEventListener("click", () => {
  showScreen($("introScreen"), $("quizScreen"));
  renderQuestion();
});

/* ==========================================================
   2. QUIZ
   ========================================================== */
let qIndex = 0;
let score = 0;

/** Build options for the live "distance" and "time" questions. */
function buildDynamic(item) {
  if (item.type === "distance") {
    const right = kmText(KM) + " km";
    const opts = shuffle([right, kmText(Math.round(KM * 0.4 / 10) * 10) + " km", kmText(Math.round(KM * 2.4 / 10) * 10) + " km", "Too far 😢"]);
    return { options: opts, correct: opts.indexOf(right) };
  }
  if (item.type === "time") {
    const now = new Date();
    const right = fmtTime(now, CONFIG.me.tz);
    const offsets = [90, -60, 150]; // minutes away from the right answer
    const wrongs = offsets.map((m) => fmtTime(new Date(now.getTime() + m * 60000), CONFIG.me.tz));
    const opts = shuffle([right, ...wrongs]);
    return { options: opts, correct: opts.indexOf(right) };
  }
  return { options: item.options, correct: item.correct };
}

function renderQuestion() {
  const item = QUESTIONS[qIndex];
  const { options, correct } = buildDynamic(item);
  item._correct = correct;

  $("qCount").textContent = `Question ${qIndex + 1} of ${QUESTIONS.length}`;
  $("qScore").textContent = `💖 ${score}`;
  $("qProgress").style.width = (qIndex / QUESTIONS.length) * 100 + "%";
  $("qEmoji").textContent = item.emoji || "💭";
  $("qText").textContent = fill(item.q);
  $("qFeedback").textContent = "";
  $("qFeedback").classList.remove("show");
  $("nextBtn").hidden = true;

  const box = $("qOptions");
  box.innerHTML = "";
  options.forEach((text, i) => {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "option";
    b.innerHTML = `<span class="option__key">${"ABCD"[i] || i + 1}</span><span></span>`;
    b.lastChild.textContent = text;
    b.addEventListener("click", () => answer(i));
    box.appendChild(b);
  });

  const body = $("qBody");
  body.classList.remove("enter");
  void body.offsetWidth;
  body.classList.add("enter");
}

function answer(i) {
  const item = QUESTIONS[qIndex];
  const buttons = [...$("qOptions").children];
  buttons.forEach((b) => (b.disabled = true));

  const all = item._correct === "all";
  const isRight = all || i === item._correct;

  if (all) {
    buttons.forEach((b) => b.classList.add("correct"));
  } else {
    buttons.forEach((b, k) => {
      if (k === item._correct) b.classList.add("correct");
      else if (k === i) b.classList.add("wrong");
      else b.classList.add("dim");
    });
  }

  if (isRight) {
    score++;
    confetti.burst(window.innerWidth / 2, window.innerHeight * 0.55, 40, -Math.PI / 2, Math.PI / 1.5);
  }

  const fb = $("qFeedback");
  fb.textContent = fill(isRight ? item.right : item.wrong || item.right);
  fb.classList.add("show");
  $("qScore").textContent = `💖 ${score}`;
  $("qProgress").style.width = ((qIndex + 1) / QUESTIONS.length) * 100 + "%";

  const last = qIndex === QUESTIONS.length - 1;
  $("nextBtn").textContent = last ? "See my results →" : "Next →";
  $("nextBtn").hidden = false;
  $("nextBtn").focus({ preventScroll: true });
}

$("nextBtn").addEventListener("click", () => {
  if (qIndex < QUESTIONS.length - 1) {
    qIndex++;
    renderQuestion();
  } else {
    showScreen($("quizScreen"), $("askScreen"));
    setTimeout(showResults, 450);
  }
});

/* ==========================================================
   3. RESULTS + LOVE-O-METER
   ========================================================== */
function showResults() {
  const total = QUESTIONS.length;
  const real = Math.round((score / total) * 100);
  const pct = $("meterPct");
  const note = $("meterNote");
  $("meterFill").style.width = "100%";

  // Count up to 100% no matter what. That's the joke.
  let n = 0;
  const iv = setInterval(() => {
    n = Math.min(100, n + 2);
    pct.textContent = n + "%";
    if (n >= 100) clearInterval(iv);
  }, 34);

  note.textContent =
    score === total
      ? `${score}/${total}: perfect score! Certified soulmate 🏆`
      : `${score}/${total} (${real}%) + ${100 - real}% bonus for being the love of my life = 100% 😌`;
}

/* ==========================================================
   THE RUNAWAY "NO" BUTTON
   ========================================================== */
const yesBtn = $("yesBtn");
const noBtn = $("noBtn");
const hint = $("hint");
let attempts = 0, noScale = 1, yesScale = 1, lastDodge = 0, celebrated = false;
const pointer = { x: -9999, y: -9999 };

function distToRect(x, y, r) {
  const dx = Math.max(r.left - x, 0, x - r.right);
  const dy = Math.max(r.top - y, 0, y - r.bottom);
  return Math.hypot(dx, dy);
}

function dodge(e) {
  if (e) {
    if (e.cancelable) e.preventDefault();
    e.stopPropagation();
    const t = e.touches && e.touches[0];
    if (t) { pointer.x = t.clientX; pointer.y = t.clientY; }
    else if (typeof e.clientX === "number") { pointer.x = e.clientX; pointer.y = e.clientY; }
  }
  if (celebrated || $("askScreen").hidden) return;
  const now = performance.now();
  if (now - lastDodge < 180) return;
  lastDodge = now;

  attempts++;
  noScale = Math.max(0.35, noScale * 0.88);
  yesScale = Math.min(2.1, yesScale + 0.12);
  noBtn.style.setProperty("--no-scale", noScale);
  document.documentElement.style.setProperty("--yes-scale", yesScale);
  noBtn.textContent = NO_TEXTS[Math.min(attempts, NO_TEXTS.length - 1)];
  hint.textContent = HINTS[Math.min(attempts, HINTS.length - 1)];
  hint.classList.remove("flash"); void hint.offsetWidth; hint.classList.add("flash");
  moveNo();
}

function moveNo() {
  if (!noBtn.classList.contains("runaway")) {
    const r = noBtn.getBoundingClientRect();
    document.body.appendChild(noBtn);
    noBtn.classList.add("runaway");
    noBtn.style.left = r.left + "px";
    noBtn.style.top = r.top + "px";
    noBtn.getBoundingClientRect();
  }
  const vw = window.innerWidth, vh = window.innerHeight, pad = 12, margin = 24;
  const bw = noBtn.offsetWidth, bh = noBtn.offsetHeight;
  const w = bw * noScale, h = bh * noScale;
  const yes = yesBtn.getBoundingClientRect();
  let best = null, bestScore = -Infinity;

  for (let i = 0; i < 40; i++) {
    const vx = pad + Math.random() * Math.max(1, vw - w - pad * 2);
    const vy = pad + Math.random() * Math.max(1, vh - h - pad * 2);
    const overlapsYes = !(vx + w < yes.left - margin || vx > yes.right + margin || vy + h < yes.top - margin || vy > yes.bottom + margin);
    if (overlapsYes) continue;
    const s = Math.min(Math.hypot(vx + w / 2 - pointer.x, vy + h / 2 - pointer.y), 450) + Math.random() * 60;
    if (s > bestScore) { bestScore = s; best = { vx, vy }; }
  }
  if (!best) best = { vx: pad, vy: pad };
  noBtn.style.left = best.vx - (bw - w) / 2 + "px";
  noBtn.style.top = best.vy - (bh - h) / 2 + "px";
}

noBtn.addEventListener("mouseenter", dodge);
noBtn.addEventListener("touchstart", dodge, { passive: false });
noBtn.addEventListener("pointerdown", dodge);
noBtn.addEventListener("click", dodge);
document.addEventListener("pointermove", (e) => {
  pointer.x = e.clientX; pointer.y = e.clientY;
  if (celebrated || e.pointerType !== "mouse" || $("askScreen").hidden) return;
  if (distToRect(e.clientX, e.clientY, noBtn.getBoundingClientRect()) < 30) dodge();
});
window.addEventListener("resize", () => {
  if (noBtn.classList.contains("runaway") && !celebrated) moveNo();
});

/* ==========================================================
   4. YES! → SUCCESS
   ========================================================== */
const callStart = new Date(CONFIG.call.start);
const callEnd = new Date(callStart.getTime() + CONFIG.call.durationHours * 3600000);

$("message").textContent = CONFIG.message;
$("tMyTime").textContent = fmtTime(callStart, CONFIG.me.tz);
$("tHerTime").textContent = fmtTime(callStart, CONFIG.her.tz);
$("dPlatform").textContent = CONFIG.call.platform;
$("dDress").textContent = CONFIG.call.dressCode;
$("dBring").textContent = CONFIG.call.bring;
$("dPlan").textContent = CONFIG.call.plan;
$("signoff").textContent = `— ${CONFIG.yourName}, from ${CONFIG.me.city} with love 💌`;

if (CONFIG.whatsappNumber) {
  const wa = $("waBtn");
  wa.href = `https://wa.me/${CONFIG.whatsappNumber.replace(/\D/g, "")}?text=${encodeURIComponent("YES! It's a date tonight 💖")}`;
  wa.hidden = false;
}

function tickCountdown() {
  const now = Date.now();
  const pad2 = (n) => String(n).padStart(2, "0");
  let ms = callStart - now;
  if (ms > 0) {
    $("cdLabel").textContent = "Our date starts in";
  } else if (now < callEnd) {
    $("cdLabel").textContent = "We're live! Pick up the phone 📞";
    ms = 0;
  } else {
    $("cdLabel").textContent = "Hope you loved our date 💖";
    ms = 0;
  }
  const s = Math.floor(ms / 1000);
  $("cdH").textContent = pad2(Math.floor(s / 3600));
  $("cdM").textContent = pad2(Math.floor((s % 3600) / 60));
  $("cdS").textContent = pad2(s % 60);
}

yesBtn.addEventListener("click", () => {
  if (celebrated) return;
  celebrated = true;
  noBtn.classList.add("gone");
  $("tries").textContent =
    attempts === 0
      ? "Straight to YES! No hesitation. I'm the luckiest 🥹"
      : `You tried to say "No" ${attempts} time${attempts === 1 ? "" : "s"}… but your heart knew the answer 😏`;

  showScreen($("askScreen"), $("successScreen"));
  setTimeout(() => {
    noBtn.remove();
    confetti.celebrate();
  }, 400);
  tickCountdown();
  setInterval(tickCountdown, 1000);
});

$("againBtn").addEventListener("click", () => confetti.celebrate());
$("calendarBtn").addEventListener("click", () => {
  const fmt = (d) => d.toISOString().replace(/[-:]/g, "").replace(/\.\d{3}/, "");
  const esc = (t) => String(t).replace(/\\/g, "\\\\").replace(/,/g, "\\,").replace(/;/g, "\\;").replace(/\n/g, "\\n");
  const ics = [
    "BEGIN:VCALENDAR", "VERSION:2.0", "PRODID:-//LongDistanceDate//EN", "BEGIN:VEVENT",
    `UID:${Date.now()}@long-distance-date`,
    `DTSTAMP:${fmt(new Date())}`,
    `DTSTART:${fmt(callStart)}`,
    `DTEND:${fmt(callEnd)}`,
    `SUMMARY:${esc("Video-call date with " + CONFIG.yourName + " 💕")}`,
    `LOCATION:${esc(CONFIG.call.platform)}`,
    `DESCRIPTION:${esc(CONFIG.message)}`,
    "BEGIN:VALARM", "TRIGGER:-PT15M", "ACTION:DISPLAY", "DESCRIPTION:Date in 15 minutes 💖", "END:VALARM",
    "END:VEVENT", "END:VCALENDAR",
  ].join("\r\n");
  const url = URL.createObjectURL(new Blob([ics], { type: "text/calendar" }));
  const a = document.createElement("a");
  a.href = url; a.download = "video-date.ics";
  document.body.appendChild(a); a.click(); a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
});

/* ==========================================================
   CONFETTI (plain canvas, no libraries)
   ========================================================== */
const confetti = (() => {
  const canvas = $("confetti");
  const ctx = canvas.getContext("2d");
  const colors = ["#ff8fab", "#ffc8dd", "#cdb4db", "#a2d2ff", "#bde0fe", "#b9fbc0", "#ffe5a5", "#ffb4a2"];
  const density = window.matchMedia("(prefers-reduced-motion: reduce)").matches ? 0.35 : 1;
  let parts = [], raf = null;

  function resize() {
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  resize();
  window.addEventListener("resize", resize);

  const make = (x, y, vx, vy) => {
    const r = Math.random();
    return {
      x, y, vx, vy, size: 6 + Math.random() * 8,
      color: colors[(Math.random() * colors.length) | 0],
      rot: Math.random() * 6.28, vr: (Math.random() - 0.5) * 0.3, tilt: Math.random() * 6.28,
      shape: r < 0.55 ? "rect" : r < 0.85 ? "circle" : "heart",
    };
  };

  function burst(x, y, count, angle = -Math.PI / 2, spread = Math.PI / 2) {
    const boost = Math.max(1, window.innerHeight / 800);
    for (let i = 0; i < count * density; i++) {
      const a = angle + (Math.random() - 0.5) * spread;
      const sp = (9 + Math.random() * 12) * boost;
      parts.push(make(x, y, Math.cos(a) * sp, Math.sin(a) * sp));
    }
    start();
  }
  function rain(count) {
    for (let i = 0; i < count * density; i++)
      parts.push(make(Math.random() * window.innerWidth, -20 - Math.random() * 120, (Math.random() - 0.5) * 2, 2 + Math.random() * 3));
    start();
  }
  function heart(s) {
    ctx.beginPath();
    ctx.moveTo(0, s * 0.3);
    ctx.bezierCurveTo(0, 0, -s * 0.5, 0, -s * 0.5, s * 0.3);
    ctx.bezierCurveTo(-s * 0.5, s * 0.6, 0, s * 0.8, 0, s);
    ctx.bezierCurveTo(0, s * 0.8, s * 0.5, s * 0.6, s * 0.5, s * 0.3);
    ctx.bezierCurveTo(s * 0.5, 0, 0, 0, 0, s * 0.3);
    ctx.fill();
  }
  function tick() {
    ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    for (const p of parts) {
      p.vy = Math.min(p.vy + 0.22, 7); p.vx *= 0.985; p.tilt += 0.1;
      p.x += p.vx + Math.sin(p.tilt) * 0.6; p.y += p.vy; p.rot += p.vr;
      ctx.save(); ctx.translate(p.x, p.y); ctx.rotate(p.rot); ctx.fillStyle = p.color;
      if (p.shape === "rect") { ctx.scale(1, Math.cos(p.tilt)); ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2); }
      else if (p.shape === "circle") { ctx.beginPath(); ctx.arc(0, 0, p.size / 3, 0, 6.28); ctx.fill(); }
      else { ctx.translate(0, -p.size / 2); heart(p.size * 1.3); }
      ctx.restore();
    }
    parts = parts.filter((p) => p.y < window.innerHeight + 40);
    raf = parts.length ? requestAnimationFrame(tick) : null;
  }
  function start() { if (!raf) raf = requestAnimationFrame(tick); }

  function celebrate() {
    const w = window.innerWidth, h = window.innerHeight;
    burst(0, h, 110, -Math.PI / 3, Math.PI / 4);
    burst(w, h, 110, (-2 * Math.PI) / 3, Math.PI / 4);
    setTimeout(() => burst(w / 2, h * 0.35, 140, 0, Math.PI * 2), 250);
    let n = 0;
    const iv = setInterval(() => { rain(22); if (++n > 16) clearInterval(iv); }, 250);
  }
  return { celebrate, burst };
})();
