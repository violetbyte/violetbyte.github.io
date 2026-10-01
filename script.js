/* ===========================
   Terminal logic (styled cards)
=========================== */
const terminalInput = document.getElementById("commandInput");
const terminalOutput = document.getElementById("output");

const commands = {
  help: "about | whoami | skills | projects | design | constraints | why_noml | resume | contact | clear",
  whoami: "Ishika Singh — CSE Student focused on real-world tech.",
  about: "Focused on systems, logic, and building practical software. Learns by doing.",
  skills: () => {
    return `
<div style="display:flex; gap:8px; flex-wrap:wrap;">
  <div style="background:#1e2533; padding:8px 12px; border-radius:6px; color:#6cffb2;">
    Languages<br>C, Python, JS
  </div>
  <div style="background:#1e2533; padding:8px 12px; border-radius:6px; color:#58a6ff;">
    Web<br>HTML, CSS, DOM
  </div>
  <div style="background:#1e2533; padding:8px 12px; border-radius:6px; color:#ff9c6c;">
    Systems<br>Linux, Shell
  </div>
  <div style="background:#1e2533; padding:8px 12px; border-radius:6px; color:#ffa6ff;">
    Tools<br>Git, VS Code
  </div>
</div>
`;
  },
  projects: () => {
    return `
<div style="display:flex; gap:12px; flex-wrap:wrap;">
  <div style="background:#111827; border:1px solid #487cb7; border-radius:6px; padding:8px; width:180px;">
    <strong>PredictifyME</strong>
    <p>Stress & Productivity Analyzer</p>
    <img src="predictifyme.jpeg" style="width:100%; border-radius:4px;">
  </div>
  <div style="background:#111827; border:1px solid #6cffb2; border-radius:6px; padding:8px; width:180px;">
    <strong>Portfolio</strong>
    <p>System-themed Interactive Site</p>
    <img src="portfolio.png" style="width:100%; border-radius:4px;">
  </div>
</div>
`;
  },
  design: "Rule-based decision system with weighted conditions and thresholds.",
  constraints: "No ML, no external APIs, deterministic output only.",
  why_noml: "Focus on explainability, logic control, and predictable behavior.",
  resume: () => {
    window.open("resume.pdf", "_blank");
    return "Opening CV...";
  },
  contact: "Email: cswithishika07@gmail.com",
  clear: () => (terminalOutput.innerHTML = "")
};

terminalInput.addEventListener("keydown", e => {
  if (e.key !== "Enter") return;

  const cmd = terminalInput.value.trim().toLowerCase();
  terminalOutput.innerHTML += `<div>&gt; ${cmd}</div>`;

  let res = commands[cmd];
  if (typeof res === "function") res = res();
  terminalOutput.innerHTML += `<div>${res || "command not found"}</div>`;

  terminalInput.value = "";
  terminalOutput.scrollTop = terminalOutput.scrollHeight;
});

/* ===========================
   Lightning cursor
=========================== */
const canvas = document.getElementById("lightning");
const ctx = canvas.getContext("2d");

let w, h;
function resize() {
  w = canvas.width = window.innerWidth;
  h = canvas.height = window.innerHeight;
}
resize();
window.addEventListener("resize", resize);

let mouse = { x: w / 2, y: h / 2 };
let lastMoveTime = performance.now();
let points = [];
let bursts = [];

document.addEventListener("mousemove", e => {
  mouse.x = e.clientX;
  mouse.y = e.clientY;
  lastMoveTime = performance.now();
  points.push({ x: mouse.x, y: mouse.y, life: 30 });
  if (points.length > 40) points.shift();
});

document.addEventListener("mousedown", e => {
  for (let i = 0; i < 14; i++) {
    bursts.push({
      x: e.clientX,
      y: e.clientY,
      angle: Math.random() * Math.PI * 2,
      life: 18
    });
  }
});

function drawLightning() {
  ctx.clearRect(0, 0, w, h);

  if (points.length > 1) {
    ctx.beginPath();
    ctx.moveTo(points[0].x, points[0].y);
    points.forEach(p => {
      ctx.lineTo(p.x + (Math.random() - 0.5) * 10, p.y + (Math.random() - 0.5) * 10);
    });
    ctx.strokeStyle = "rgba(88,166,255,0.85)";
    ctx.lineWidth = 2;
    ctx.shadowBlur = 25;
    ctx.shadowColor = "#58a6ff";
    ctx.stroke();
  }

  bursts.forEach(b => {
    const dx = Math.cos(b.angle) * b.life * 1.4;
    const dy = Math.sin(b.angle) * b.life * 1.4;
    ctx.beginPath();
    ctx.moveTo(b.x, b.y);
    ctx.lineTo(b.x + dx, b.y + dy);
    ctx.strokeStyle = "rgba(120,200,255,0.8)";
    ctx.lineWidth = 1;
    ctx.shadowBlur = 18;
    ctx.stroke();
    b.life--;
  });
  bursts = bursts.filter(b => b.life > 0);

  const idle = performance.now() - lastMoveTime > 120;
  const decay = idle ? 2 : 1;
  points.forEach(p => (p.life -= decay));
  points = points.filter(p => p.life > 0);

  requestAnimationFrame(drawLightning);
}
drawLightning();

/* ===========================
   Timeline slider
=========================== */
const timelineSlider = document.getElementById("timelineSlider");
const timelineOutput = document.getElementById("timelineOutput");

const timelineData = [
  `
2024
-----
• Started Computer Science (CSE)
• Built foundations in C and Python
• Strengthened programming logic, problem-solving, and core concepts
`,

  `
Early 2025
----------
• Started building web interfaces with HTML, CSS, and JavaScript
• Worked on frontend projects and interactive user interfaces
• Began exploring databases and software development workflows
`,

  `
Late 2025
---------
• Participated in NASA Space Apps Challenge 2025
• Led a team and contributed to database management and API development
• Created PredictifyME, a product idea, and led its development
• Contributed to the frontend and product direction
`,

  `
2026
----
• Joined as a Project Intern in Product Development
• Contributed to open-source development
• Strengthened database and programming foundations
• Working with JavaScript and currently learning React
• Building collaborative projects with a focus on practical software
`
];

let index = 0;
let autoplay = true;
let timer;

function renderTimeline(i) {
  timelineOutput.textContent = timelineData[i];
  timelineSlider.value = i;
}

function startAutoplay() {
  timer = setInterval(() => {
    if (!autoplay) return;
    index = (index + 1) % timelineData.length;
    renderTimeline(index);
  }, 2800);
}

timelineSlider.addEventListener("input", () => {
  autoplay = false;
  index = Number(timelineSlider.value);
  renderTimeline(index);
  clearTimeout(timer);
  setTimeout(() => autoplay = true, 4000);
});

renderTimeline(0);
startAutoplay();
