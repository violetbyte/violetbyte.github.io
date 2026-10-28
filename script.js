(function () {
  "use strict";
  const $ = (s) => document.querySelector(s);

  const year = $("#year");
  if (year) year.textContent = new Date().getFullYear();

  // Layers menu (mobile)
  const toggle = $("#lt"), layers = $("#layers");
  const links = [...layers.querySelectorAll("a")];
  const close = () => { layers.classList.remove("open"); toggle.setAttribute("aria-expanded", "false"); };
  toggle.addEventListener("click", () => {
    toggle.setAttribute("aria-expanded", layers.classList.toggle("open"));
  });
  links.forEach((a) => a.addEventListener("click", close));
  document.addEventListener("keydown", (e) => { if (e.key === "Escape") close(); });

  // Highlight the layer for the frame in view
  if ("IntersectionObserver" in window) {
    const spy = new IntersectionObserver((entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) links.forEach((a) => a.classList.toggle("on", a.hash === "#" + e.target.id));
      });
    }, { rootMargin: "-35% 0px -60% 0px" });
    document.querySelectorAll(".frame").forEach((f) => spy.observe(f));
  }

  // Contact form: sends through Web3Forms.
  // 1) Get a free access key at https://web3forms.com (enter cswithishika07@gmail.com)
  // 2) Paste it below. Until then the form says it is not connected instead of faking success.
  const ACCESS_KEY = "YOUR_ACCESS_KEY";
  const form = $("#cf"), status = $("#fs");
  const say = (text, ok) => { status.textContent = text; status.className = "fs " + (ok ? "ok" : "err"); };

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = String(data.get("name")).trim();
    const email = String(data.get("email")).trim();
    const message = String(data.get("message")).trim();
    if (!name || !email || !message) return say("Fill in your name, email and message.");
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return say("Enter a valid email address.");
    if (ACCESS_KEY === "YOUR_ACCESS_KEY") return say("This form isn't connected yet. Email me directly instead.");

    data.append("access_key", ACCESS_KEY);
    data.append("subject", "Portfolio message from " + name);
    try {
      const res = await fetch("https://api.web3forms.com/submit", { method: "POST", body: data });
      const json = await res.json();
      if (json.success) { form.reset(); say("Message sent. I'll reply soon.", true); }
      else say("The message didn't send. Email me directly instead.");
    } catch (err) {
      say("Network error. Email me directly instead.");
    }
  });

  // Cover: violet flowers bloom once on load, then shimmer slowly
  const cv = $("#bloom");
  if (cv) {
    const ctx = cv.getContext("2d"), host = cv.parentElement, GL = "x+%S8@t:*o#";
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    let W, H, cs, fl = [], raf = 0, vis = true, last = 0, seed = 7;
    const t0 = performance.now(), rnd = () => (seed = (seed * 16807) % 2147483647) / 2147483647;
    const hash = (i, j) => ((i * 73856093) ^ (j * 19349663)) >>> 0;
    const cell = (i, j, col, a, ch) => {
      ctx.globalAlpha = a; ctx.fillStyle = col; ctx.fillRect(i * cs, j * cs, cs - 1, cs - 1);
      ctx.globalAlpha = .55; ctx.fillStyle = "#1B1740"; ctx.fillText(ch, i * cs + cs / 2, j * cs + cs / 2 + 1);
    };
    const draw = (t) => {
      ctx.clearRect(0, 0, W, H);
      const rows = Math.floor(H / cs), sh = Math.floor(t * 1.2);
      for (const f of fl) {
        const k = Math.max(0, Math.min(1, (t - f.d) / 1)), b = Math.max(0, Math.min(1, (t - f.d - .9) / 1.5)), e = 1 - Math.pow(1 - b, 3);
        const cx = Math.round(f.x / cs), cy = Math.round(f.y / cs), len = Math.floor((rows - cy) * k);
        for (let j = rows - len; j < rows; j++) cell(cx, j, "#6B54D6", .28, "|");
        if (e <= 0) continue;
        const R = Math.ceil(f.r) + 1;
        for (let dj = -R; dj <= R; dj++) for (let di = -R; di <= R; di++) {
          const d = Math.hypot(di, dj), th = Math.atan2(dj, di) + f.a;
          const edge = f.r * e * (.55 + .45 * Math.abs(Math.cos(f.p * th / 2)));
          if (d > edge) continue;
          const q = d / edge, col = q < .28 ? "#F2B33D" : q < .6 ? "#5B3CE0" : q < .85 ? "#8A6BFF" : "#B9A6FF";
          const h = hash(cx + di, cy + dj), ch = GL[(h + (t > 5 && h % 3 === 0 ? sh : 0)) % GL.length];
          cell(cx + di, cy + dj, col, .85, ch);
        }
      }
      ctx.globalAlpha = 1;
    };
    const layout = () => {
      const dpr = Math.min(devicePixelRatio || 1, 2);
      W = host.clientWidth; H = host.clientHeight; cv.width = W * dpr; cv.height = H * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      cs = W < 700 ? 11 : 14; ctx.font = "600 " + (cs - 3) + "px 'Courier New', monospace";
      ctx.textAlign = "center"; ctx.textBaseline = "middle";
      fl = []; seed = 7;
      const n = W < 700 ? 6 : 9, sc = W < 700 ? .8 : 1;
      for (let tries = 0; fl.length < n && tries < 500; tries++) {
        const r = (3 + rnd() * 4) * sc, R = r * cs, x = rnd() * W, y = rnd() * H;
        const ok = (y - R >= H * .6 || (W >= 700 && x - R >= W * .58 && y - R >= H * .1)) && y + R <= H && x + R <= W && x - R >= 0;
        if (ok && !fl.some((f) => Math.hypot(f.x - x, f.y - y) < (f.R + R) * .85))
          fl.push({ x, y, r, R, d: rnd() * 2.2, p: 5 + ((rnd() * 2) | 0), a: rnd() * 6.28 });
      }
      draw(reduce ? 99 : (performance.now() - t0) / 1000);
    };
    const tick = (now) => {
      raf = requestAnimationFrame(tick);
      const t = (now - t0) / 1000;
      if (now - last < (t < 5 ? 33 : 250)) return;
      last = now; draw(t);
    };
    const go = () => { if (!raf && vis && !document.hidden && !reduce) raf = requestAnimationFrame(tick); };
    const halt = () => { cancelAnimationFrame(raf); raf = 0; };
    if ("IntersectionObserver" in window) new IntersectionObserver((es) => { vis = es[0].isIntersecting; vis ? go() : halt(); }).observe(host);
    document.addEventListener("visibilitychange", () => (document.hidden ? halt() : go()));
    let rt; addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(layout, 200); });
    layout(); go();
  }

  // Project videos play while visible and pause when scrolled away
  const vids = [...document.querySelectorAll(".media video")];
  if ("IntersectionObserver" in window && !matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const vo = new IntersectionObserver((es) => es.forEach((e) => {
      if (e.isIntersecting) { e.target.play().catch(() => {}); } else e.target.pause();
    }), { threshold: 0.4 });
    vids.forEach((v) => { vo.observe(v); v.addEventListener("click", () => (v.paused ? v.play() : v.pause())); });
  } else vids.forEach((v) => { v.controls = true; });
})();
