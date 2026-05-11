const { useState, useEffect, useRef, useMemo } = React;

// ─────────────────────────────────────────────────────────
// DATA
// ─────────────────────────────────────────────────────────
const DATA = {
  name: "Vishnupriya Dutta",
  handle: "priya",
  host: "rmu",
  role: "Cybersecurity Undergrad · Robert Morris University",
  location: "Carnegie, PA",
  phone: "412-209-9952",
  email: "vishnupriyadutta2006@gmail.com",
  linkedin: "linkedin.com/in/priya-dutta-55b2182b9",
  linkedinUrl: "https://www.linkedin.com/in/priya-dutta-55b2182b9/",
  summary:
    "Cybersecurity undergrad at Robert Morris University (3.6 GPA). Building hands-on offensive and defensive skills through Python tooling, Linux administration, and CTF competition — alongside two-plus years of customer-facing operations.",
  education: [
    {
      school: "Robert Morris University",
      where: "Moon Township, PA",
      degree: "B.S. Cybersecurity",
      date: "Expected May 2028",
      gpa: "3.6",
    },
  ],
  experience: [
    {
      org: "Amazon Warehouse — Pit 2",
      where: "Imperial Westford, PA",
      role: "Fulfillment Associate",
      date: "Mar 2026 — Present",
      bullets: [
        "Process high-volume online orders and returns through internal logistics platforms in a fast-paced fulfillment node.",
        "Triage on-the-floor issues, balancing throughput targets with accuracy and customer recovery.",
      ],
    },
    {
      org: "Walmart",
      where: "Heidelberg, PA",
      role: "ODP Personnel",
      date: "Oct 2023 — Mar 2026",
      bullets: [
        "Owned the online pickup workflow end-to-end: order intake, system reconciliation, and customer handoff across 2.5+ years.",
        "Maintained accuracy and turnaround across thousands of orders in a high-traffic store.",
        "Trained newer associates on the pickup system and dispute resolution.",
      ],
    },
  ],
  skills: {
    "lang/scripting": ["Python", "JavaScript", "HTML5", "Bash"],
    "security/tools": ["Kali Linux", "Wireshark", "Nmap", "Burp Suite", "Metasploit", "Docker"],
    "networking/it": ["TCP/IP", "Subnetting", "Net Config", "Windows Admin", "Linux Admin"],
    "ctf/analysis": ["Cryptography", "Password Cracking", "Log Analysis", "Traffic Analysis", "OSINT"],
    productivity: ["Excel", "Word", "PowerPoint", "Google Workspace"],
  },
  projects: [
    {
      name: "python-security-scanner",
      lang: "py",
      desc: "CLI that walks directories for suspicious byte patterns and flags anomalies for review.",
    },
    {
      name: "network-defense-lab",
      lang: "net",
      desc: "Configured routers/switches with VLANs and subnets; ran defensive checks against a deliberately misconfigured topology.",
    },
    {
      name: "python-log-parser",
      lang: "py",
      desc: "Parser that ingests system logs and surfaces failed auths, repeat IPs, and off-hours activity.",
    },
    {
      name: "ctf-writeups",
      lang: "md",
      desc: "Solved cryptography, web exploitation, and OSINT challenges across NCL Fall '24 and Spring '25.",
    },
  ],
  awards: [
    { y: "2025", k: "Dean's List", v: "Spring 2025" },
    { y: "2024", k: "Dean's List", v: "Fall 2024" },
    { y: "2024", k: "Freshman Fellowship", v: "Selected" },
    { y: "2024", k: "Top Secret Colonials", v: "Active Member" },
    { y: "2024", k: "Women in Cybersecurity", v: "Active Member" },
    { y: "2024", k: "National Honor Society", v: "Active Member" },
    { y: "2024", k: "NHS of Leadership & Success", v: "Active Member" },
  ],
  competitions: [
    {
      name: "National Cyber League (NCL)",
      date: "Fall 2024 · Spring 2025",
      detail:
        "Individual and team challenges in cryptography, network traffic analysis, password cracking, and OSINT.",
      badges: ["Password Cracking", "Log Analysis", "Cryptography", "Traffic Analysis"],
    },
  ],
};

// ─────────────────────────────────────────────────────────
// HELPERS
// ─────────────────────────────────────────────────────────
function useTypewriter(lines, speed = 18, startDelay = 200, onDone) {
  const [out, setOut] = useState([]);
  const [done, setDone] = useState(false);
  useEffect(() => {
    let cancelled = false;
    let timeouts = [];
    const run = async () => {
      await new Promise((r) => timeouts.push(setTimeout(r, startDelay)));
      for (let i = 0; i < lines.length; i++) {
        const line = lines[i];
        if (line.instant) {
          if (cancelled) return;
          setOut((o) => [...o, line.text]);
          await new Promise((r) => timeouts.push(setTimeout(r, line.pause || 80)));
          continue;
        }
        const text = line.text;
        let cur = "";
        for (let j = 0; j < text.length; j++) {
          if (cancelled) return;
          cur += text[j];
          setOut((o) => {
            const next = [...o];
            next[i] = cur;
            return next;
          });
          await new Promise((r) =>
            timeouts.push(setTimeout(r, speed + (Math.random() * 14 - 7)))
          );
        }
        await new Promise((r) => timeouts.push(setTimeout(r, line.pause || 140)));
      }
      if (!cancelled) {
        setDone(true);
        onDone && onDone();
      }
    };
    run();
    return () => {
      cancelled = true;
      timeouts.forEach(clearTimeout);
    };
  }, []);
  return { out, done };
}

function Prompt({ user = "priya", host = "rmu", path = "~", cmd }) {
  return (
    <span className="prompt-line">
      <span className="p-user">{user}</span>
      <span className="p-at">@</span>
      <span className="p-host">{host}</span>
      <span className="p-colon">:</span>
      <span className="p-path">{path}</span>
      <span className="p-dollar">$ </span>
      <span className="p-cmd">{cmd}</span>
    </span>
  );
}

function Cursor() {
  return <span className="cursor" aria-hidden>▊</span>;
}

// QR generator using qrcode-generator (global `qrcode`)
function QRSvg({ text, size = 120 }) {
  const svg = useMemo(() => {
    try {
      const qr = window.qrcode(0, "M");
      qr.addData(text);
      qr.make();
      const count = qr.getModuleCount();
      const cell = size / count;
      const cells = [];
      for (let r = 0; r < count; r++) {
        for (let c = 0; c < count; c++) {
          if (qr.isDark(r, c)) {
            cells.push(
              `<rect x="${(c * cell).toFixed(2)}" y="${(r * cell).toFixed(
                2
              )}" width="${cell.toFixed(2)}" height="${cell.toFixed(2)}"/>`
            );
          }
        }
      }
      return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges"><rect width="${size}" height="${size}" fill="transparent"/><g fill="currentColor">${cells.join(
        ""
      )}</g></svg>`;
    } catch (e) {
      return "";
    }
  }, [text, size]);
  return <span className="qr" dangerouslySetInnerHTML={{ __html: svg }} />;
}

// ─────────────────────────────────────────────────────────
// SECTIONS
// ─────────────────────────────────────────────────────────
function Boot({ onDone, onSkip }) {
  const lines = [
    { text: "booting resume.sh — terminal v1.0" },
    { text: "[ ok ] mounting /home/priya", pause: 60 },
    { text: "[ ok ] loading profile.json", pause: 60 },
    { text: "[ ok ] decrypting credentials …", pause: 200 },
    { text: "> auth: vishnupriya.dutta", pause: 160 },
    { text: "> session opened. welcome.", pause: 240 },
  ];
  const { out, done } = useTypewriter(lines, 14, 120, onDone);
  return (
    <div className="boot" onClick={onSkip}>
      <pre className="boot-pre">
        {out.map((l, i) => (
          <div key={i} className="boot-line">
            {l}
          </div>
        ))}
        {!done && <Cursor />}
      </pre>
      <div className="boot-skip">[ click anywhere to skip ]</div>
    </div>
  );
}

function HeaderArt() {
  // small block-style monogram VD
  return (
    <pre className="ascii-art" aria-hidden>
{`██╗   ██╗██████╗     ╔═══════════════════════╗
██║   ██║██╔══██╗    ║  VISHNUPRIYA  DUTTA   ║
██║   ██║██║  ██║    ║  cybersecurity / rmu  ║
╚██╗ ██╔╝██║  ██║    ║  carnegie, pa · 2028  ║
 ╚████╔╝ ██████╔╝    ╚═══════════════════════╝
  ╚═══╝  ╚═════╝`}
    </pre>
  );
}

function Section({ cmd, children, delay = 0 }) {
  const [shown, setShown] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setShown(true), delay);
    return () => clearTimeout(t);
  }, [delay]);
  return (
    <section className={"section " + (shown ? "in" : "")}>
      <div className="section-head">
        <Prompt cmd={cmd} />
      </div>
      <div className="section-body">{children}</div>
    </section>
  );
}

function ContactCard() {
  return (
    <div className="contact-card">
      <div className="contact-grid">
        <div className="photo-wrap">
          <div className="ascii-frame">
            <img
              className="headshot-img"
              src="headshot.jpg"
              alt="Vishnupriya Dutta headshot"
            />
          </div>
          <div className="photo-cap">headshot.jpg</div>
        </div>
        <dl className="contact-dl">
          <div><dt>location</dt><dd>{DATA.location}</dd></div>
          <div><dt>phone</dt><dd>{DATA.phone}</dd></div>
          <div><dt>email</dt><dd><a href={`mailto:${DATA.email}`}>{DATA.email}</a></dd></div>
          <div><dt>linkedin</dt><dd><a href={DATA.linkedinUrl} target="_blank" rel="noreferrer">{DATA.linkedin}</a></dd></div>
          <div><dt>status</dt><dd><span className="blink-dot">●</span> open to internship inquiries</dd></div>
        </dl>
        <div className="qr-wrap">
          <QRSvg text={DATA.linkedinUrl} size={132} />
          <div className="qr-cap">scan → linkedin</div>
        </div>
      </div>
    </div>
  );
}

function SummaryBlock() {
  return (
    <div className="summary">
      <span className="kw">/*</span> {DATA.summary} <span className="kw">*/</span>
    </div>
  );
}

function SkillsBlock() {
  return (
    <div className="skills">
      {Object.entries(DATA.skills).map(([cat, items]) => (
        <div className="skills-row" key={cat}>
          <div className="skills-cat">{cat}/</div>
          <div className="skills-tags">
            {items.map((t) => (
              <span className="tag" key={t}>{t}</span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

function ExperienceBlock() {
  return (
    <div className="xp">
      {DATA.experience.map((x, i) => (
        <article className="xp-item" key={i}>
          <header className="xp-head">
            <span className="xp-role">{x.role}</span>
            <span className="xp-at">@</span>
            <span className="xp-org">{x.org}</span>
            <span className="xp-date">{x.date}</span>
          </header>
          <div className="xp-where">{x.where}</div>
          <ul className="xp-bullets">
            {x.bullets.map((b, j) => (
              <li key={j}>
                <span className="bul">›</span> {b}
              </li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function ProjectsBlock() {
  const colorFor = (l) =>
    l === "py" ? "var(--c-cyan)" : l === "net" ? "var(--c-amber)" : "var(--c-violet)";
  return (
    <div className="proj-grid">
      {DATA.projects.map((p, i) => (
        <article className="proj" key={i}>
          <header className="proj-head">
            <span className="proj-lang" style={{ color: colorFor(p.lang) }}>
              ●
            </span>
            <span className="proj-name">{p.name}</span>
          </header>
          <p className="proj-desc">{p.desc}</p>
        </article>
      ))}
    </div>
  );
}

function EducationBlock() {
  return (
    <div className="edu">
      {DATA.education.map((e, i) => (
        <div className="edu-row" key={i}>
          <div className="edu-line">
            <span className="edu-school">{e.school}</span>
            <span className="sep"> · </span>
            <span className="edu-where">{e.where}</span>
          </div>
          <div className="edu-meta">
            <span>{e.degree}</span>
            <span className="sep"> · </span>
            <span>{e.date}</span>
            <span className="sep"> · </span>
            <span>GPA {e.gpa}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

function AwardsBlock() {
  return (
    <table className="awards-tbl">
      <tbody>
        {DATA.awards.map((a, i) => (
          <tr key={i}>
            <td className="aw-y">{a.y}</td>
            <td className="aw-k">{a.k}</td>
            <td className="aw-v">{a.v}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

function CompetitionsBlock() {
  return (
    <div className="comps">
      {DATA.competitions.map((c, i) => (
        <div className="comp" key={i}>
          <header className="comp-head">
            <span className="comp-name">{c.name}</span>
            <span className="comp-date">{c.date}</span>
          </header>
          <p className="comp-detail">{c.detail}</p>
          <div className="badges">
            {c.badges.map((b) => (
              <span className="badge" key={b}>
                <span className="badge-dot">▣</span> {b}
              </span>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
// MAIN
// ─────────────────────────────────────────────────────────
function App() {
  const [phase, setPhase] = useState(() => {
    return sessionStorage.getItem("booted") === "1" ? "main" : "boot";
  });
  const [time, setTime] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const finishBoot = () => {
    sessionStorage.setItem("booted", "1");
    setPhase("main");
  };

  const tt = time.toTimeString().slice(0, 8);
  const dd = time.toISOString().slice(0, 10);

  return (
    <div className="screen">
      <div className="crt-overlay" aria-hidden />
      <div className="scanlines" aria-hidden />
      <div className="vignette" aria-hidden />

      <div className="window">
        <div className="title-bar">
          <div className="tb-dots">
            <span className="d d1" />
            <span className="d d2" />
            <span className="d d3" />
          </div>
          <div className="tb-title">
            priya@rmu — <span className="tb-file">resume.sh</span> — 80×40
          </div>
          <div className="tb-actions">
            <button
              className="dl-btn"
              onClick={() => window.print()}
              title="Download / print resume"
            >
              ▼ download.pdf
            </button>
          </div>
        </div>

        <div className="content">
          {phase === "boot" ? (
            <Boot onDone={finishBoot} onSkip={finishBoot} />
          ) : (
            <>
              <HeaderArt />

              <Section cmd="cat about.md" delay={50}>
                <SummaryBlock />
              </Section>

              <Section cmd="./contact --show" delay={200}>
                <ContactCard />
              </Section>

              <Section cmd="cat experience.log" delay={400}>
                <ExperienceBlock />
              </Section>

              <Section cmd="ls -la skills/" delay={550}>
                <SkillsBlock />
              </Section>

              <Section cmd="ls projects/" delay={700}>
                <ProjectsBlock />
              </Section>

              <Section cmd="cat education.md" delay={850}>
                <EducationBlock />
              </Section>

              <Section cmd="cat competitions.md" delay={1000}>
                <CompetitionsBlock />
              </Section>

              <Section cmd="cat awards.txt" delay={1150}>
                <AwardsBlock />
              </Section>

              <div className="footer-prompt">
                <Prompt cmd="exit" />
                <div className="bye">
                  connection closed. thanks for reading — let's talk.
                </div>
              </div>
            </>
          )}
        </div>

        <div className="status-bar">
          <span className="sb-left">
            <span className="sb-dot" /> connected · ssh://priya@rmu
          </span>
          <span className="sb-mid">utf-8 · 80×40 · zsh</span>
          <span className="sb-right">
            {dd} {tt}
          </span>
        </div>
      </div>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById("root")).render(<App />);
