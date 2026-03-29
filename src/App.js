import { useState, useEffect, useRef, createContext, useContext } from "react";
import { LineChart, Line, AreaChart, Area, BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";

const DARK = {
  bg:"#111114",bg2:"#18181c",card:"#1e1e24",card2:"#252530",border:"#2a2a35",
  text:"#d4d4dc",text2:"#9898a8",muted:"#6b6b7b",accent:"#7c9aaf",accent2:"#a78baf",
  warm:"#c4956a",success:"#7aac8a",danger:"#b87272",gold:"#c9a96e",surface:"rgba(255,255,255,0.03)",
};
const LIGHT = {
  bg:"#f5f5f0",bg2:"#eeeee8",card:"#ffffff",card2:"#f0f0ea",border:"#ddd8d0",
  text:"#2a2a2e",text2:"#6b6b78",muted:"#9898a5",accent:"#4a7a8f",accent2:"#8a6a9f",
  warm:"#b07848",success:"#5a8f6a",danger:"#a85a5a",gold:"#a08040",surface:"rgba(0,0,0,0.02)",
};

function themeCSS(t) {
  return `:root{--bg:${t.bg};--bg2:${t.bg2};--card:${t.card};--card2:${t.card2};--border:${t.border};--text:${t.text};--text2:${t.text2};--muted:${t.muted};--accent:${t.accent};--accent2:${t.accent2};--warm:${t.warm};--success:${t.success};--danger:${t.danger};--gold:${t.gold};--surface:${t.surface}}`;
}

const BASE_CSS = `
@import url('https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;500;600;700&family=JetBrains+Mono:wght@400;500&family=Fraunces:ital,wght@0,400;0,600;0,700;1,400&display=swap');
*{margin:0;padding:0;box-sizing:border-box}
body{background:var(--bg);color:var(--text);font-family:'Outfit',sans-serif;transition:background .3s,color .3s}
.hd{font-family:'Fraunces',serif}
.mn{font-family:'JetBrains Mono',monospace}
.cd{background:var(--card);border:1px solid var(--border);border-radius:12px;padding:16px;transition:all .3s}
.cd:hover{border-color:var(--accent)}
@keyframes fadeIn{from{opacity:0;transform:translateY(10px)}to{opacity:1;transform:translateY(0)}}
@keyframes slideR{from{opacity:0;transform:translateX(16px)}to{opacity:1;transform:translateX(0)}}
@keyframes breathe{0%,100%{transform:scale(1)}50%{transform:scale(1.04)}}
@keyframes pulse{0%,100%{opacity:.4}50%{opacity:1}}
@keyframes shake{0%,100%{transform:translateX(0)}25%{transform:translateX(-5px)}75%{transform:translateX(5px)}}
@keyframes xpUp{0%{transform:translateY(0);opacity:1}100%{transform:translateY(-30px);opacity:0}}
@keyframes confetti{0%{transform:translateY(-50vh) rotate(0);opacity:1}100%{transform:translateY(100vh) rotate(600deg);opacity:0}}
@keyframes barPulse{0%,100%{transform:scaleY(.3)}50%{transform:scaleY(1)}}
@keyframes ringRot{from{transform:rotate(0)}to{transform:rotate(360deg)}}
.fi{animation:fadeIn .5s ease forwards}
.sr{animation:slideR .4s ease forwards}
input,textarea{font-family:'Outfit',sans-serif;background:var(--bg2);border:1px solid var(--border);border-radius:8px;color:var(--text);padding:10px 14px;font-size:13px;outline:none;width:100%;transition:all .2s}
input:focus{border-color:var(--accent)}
button{font-family:'Outfit',sans-serif;cursor:pointer}
::-webkit-scrollbar{width:4px}::-webkit-scrollbar-track{background:var(--bg)}::-webkit-scrollbar-thumb{background:var(--border);border-radius:2px}
.tw:hover .tp{display:block}.tp{display:none}
`;

const MID_MSGS=["You're building momentum! 🔥","Every question strengthens your brain 💪","Amazing progress — keep going! ✨","Knowledge compounds — each answer matters 📚","Stay curious — you've got this! 🧠","This struggle = your brain growing 🌱","Consistency beats perfection ⭐"];
const END_GOOD=["🎉 You absolutely crushed it!","🏆 Incredible session!","⭐ Outstanding — be proud!","🔥 On fire! Keep going tomorrow.","💪 You proved what you're capable of!"];
const END_OK=["💛 Good effort! Every session counts.","🌱 Showing up matters most.","📈 Tomorrow will be better.","✨ Trying puts you ahead.","🎯 Showing up is 80% of the battle!"];
const STREAMS=[{id:"science",label:"Science",icon:"🔬",desc:"Physics, Chemistry, Biology, Math"},{id:"engineering",label:"Engineering",icon:"⚙️",desc:"CS, Electronics, Mechanical"},{id:"commerce",label:"Commerce",icon:"📊",desc:"Accounts, Economics, Finance"},{id:"arts",label:"Arts",icon:"📖",desc:"History, Literature, Psychology"},{id:"medical",label:"Medical",icon:"🏥",desc:"Anatomy, Physiology, Biochemistry"},{id:"other",label:"Other",icon:"🎯",desc:"Custom topic"}];
const TOPIC_MAP={science:["Physics","Chemistry","Biology","Mathematics"],engineering:["Data Structures","Operating Systems","Digital Electronics","Computer Networks","DBMS"],commerce:["Accountancy","Economics","Business Studies","Statistics"],arts:["English Literature","History","Psychology","Sociology"],medical:["Anatomy","Physiology","Biochemistry","Pharmacology"],other:[]};
const BADGES=[{id:"onFire",name:"On Fire",trig:"5 correct streak",color:"#d4956a",icon:"🔥"},{id:"bigBrain",name:"Big Brain",trig:"100% on hard",color:"#a78baf",icon:"🧠"},{id:"comeback",name:"Comeback Kid",trig:"Improved after fail",color:"#7aac8a",icon:"📈"},{id:"nightOwl",name:"Night Owl",trig:"After 10 PM",color:"#7c9aaf",icon:"🦉"},{id:"earlyBird",name:"Early Bird",trig:"Before 8 AM",color:"#c9a96e",icon:"🌅"},{id:"resilient",name:"Resilient",trig:"Low wellbeing session",color:"#7c9aaf",icon:"🛡️"},{id:"bossSlayer",name:"Boss Slayer",trig:"10 bosses defeated",color:"#b87272",icon:"⚔️"},{id:"focusMaster",name:"Focus Master",trig:"5 Pomodoros/day",color:"#a78baf",icon:"🎯"}];
const MOODS=[{e:"😊",l:"Great",risk:5},{e:"😰",l:"Stressed",risk:80},{e:"😴",l:"Tired",risk:70},{e:"😟",l:"Anxious",risk:75},{e:"🔥",l:"Motivated",risk:10},{e:"😶",l:"Numb",risk:60},{e:"😢",l:"Sad",risk:90},{e:"💪",l:"Confident",risk:5}];

function genQ(topic, diff) {
  const bank = {
    easy:[
      {q:`What is the most fundamental concept in ${topic}?`,opts:["Core principles","Advanced theorem","Complex algorithm","Abstract theory"],c:0},
      {q:`A beginner in ${topic} should focus on?`,opts:["Building strong basics","Skipping to advanced","Memorizing everything","Avoiding practice"],c:0},
      {q:`${topic} primarily helps in understanding?`,opts:["Fundamental principles","Only formulas","Random subjects","Nothing useful"],c:0},
      {q:`Best starting point for learning ${topic}?`,opts:["Conceptual foundations","Final year topics","Research papers","Expert analysis"],c:0},
    ],
    medium:[
      {q:`How does ${topic} apply to real-world problems?`,opts:["Through practical application","It doesn't","Only theory","Only in labs"],c:0},
      {q:`Best study approach for ${topic}?`,opts:["Active recall + spaced repetition","Just reading","Cramming","Videos only"],c:0},
      {q:`What separates intermediate from beginner in ${topic}?`,opts:["Connecting concepts","More memorization","Reading faster","Fancier tools"],c:0},
      {q:`Critical thinking in ${topic} is developed by?`,opts:["Solving diverse problems","Memorizing answers","Copying solutions","Watching tutorials"],c:0},
    ],
    hard:[
      {q:`How to solve a novel problem in ${topic}?`,opts:["Analyze, decompose, apply systematically","Guess and check","Copy solutions","Avoid it"],c:0},
      {q:`Best metacognitive strategy for mastering ${topic}?`,opts:["Self-explanation & elaboration","Re-reading textbooks","Highlighting all","Group study only"],c:0},
      {q:`Biggest pitfall in advanced ${topic}?`,opts:["Weak fundamentals","Too much practice","Over-preparation","Too many books"],c:0},
      {q:`How does expertise change ${topic} problem-solving?`,opts:["Pattern recognition becomes intuitive","You stop thinking","Problems get harder","Forget basics"],c:0},
    ],
  };
  const pool = bank[diff] || bank.easy;
  const item = pool[Math.floor(Math.random() * pool.length)];
  return { question: item.q, options: item.opts, correct: item.c, explanation: `In ${topic}, mastering this builds the foundation for deeper understanding. Fundamentals compound over time.`, topic, difficulty: diff };
}

function makeHeat() {
  const d = [];
  for (let i = 69; i >= 0; i--) {
    const dt = new Date(Date.now() - i * 864e5);
    d.push({ date: dt.toLocaleDateString("en-US", { month: "short", day: "numeric" }), mins: Math.random() > 0.3 ? Math.floor(Math.random() * 80) : 0 });
  }
  return d;
}

function makePlan(topic) {
  return [
    { time: "0:00–0:15", phase: "Warm Up", task: `Review basics of ${topic}`, icon: "📖", color: "var(--accent)" },
    { time: "0:15–0:20", phase: "Break", task: "Stretch, hydrate, breathe", icon: "💧", color: "var(--muted)" },
    { time: "0:20–0:50", phase: "Deep Study", task: `Core ${topic} concepts`, icon: "🧠", color: "var(--accent2)" },
    { time: "0:50–1:00", phase: "Active Break", task: "Walk around, rest eyes", icon: "🚶", color: "var(--muted)" },
    { time: "1:00–1:25", phase: "Practice", task: `Solve ${topic} problems`, icon: "✍️", color: "var(--warm)" },
    { time: "1:25–1:30", phase: "Break", task: "Snack, water", icon: "🍎", color: "var(--muted)" },
    { time: "1:30–1:50", phase: "Quiz", task: `Self-test on ${topic}`, icon: "📝", color: "var(--success)" },
    { time: "1:50–2:00", phase: "Review", task: "Note weak areas, plan tomorrow", icon: "🎯", color: "var(--gold)" },
  ];
}

const Ctx = createContext();

export default function App() {
  const [theme, setTheme] = useState("dark");
  const isDark = theme === "dark";
  const [pg, setPg] = useState("login");
  const [user, setUser] = useState(null);
  const [stream, setStream] = useState(null);
  const [topic, setTopic] = useState("");
  const [customTopic, setCustomTopic] = useState("");
  const at = customTopic || topic;

  const [xp, setXp] = useState(0);
  const [streak] = useState(7);
  const [level, setLevel] = useState("Apprentice");
  const [academic, setAcademic] = useState(50);
  const [wellbeing] = useState(70);
  const [burnout, setBurnout] = useState(18);
  const [mood, setMoodState] = useState(null);
  const [heatmap] = useState(makeHeat);
  const [pulse, setPulse] = useState([{ x: 1, y: 50 }, { x: 2, y: 55 }, { x: 3, y: 52 }, { x: 4, y: 58 }, { x: 5, y: 54 }]);
  const [uiMode, setUiMode] = useState("normal");
  const [layer, setLayer] = useState(1);

  const [quizQ, setQuizQ] = useState(null);
  const [diff, setDiff] = useState("easy");
  const [qNum, setQNum] = useState(0);
  const [qCorrect, setQCorrect] = useState(0);
  const [qTotal, setQTotal] = useState(0);
  const [qStreak, setQStreak] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [last3, setLast3] = useState([]);
  const [ans, setAns] = useState(null);
  const [selA, setSelA] = useState(null);
  const [showExp, setShowExp] = useState(false);
  const [midMsg, setMidMsg] = useState(null);
  const [xpPop, setXpPop] = useState(null);
  const [qStart, setQStart] = useState(null);
  const [rts, setRts] = useState([]);

  const [fog, setFog] = useState(false);
  const [fogT, setFogT] = useState(30);
  const [fogReason, setFogReason] = useState("");
  const [boss, setBoss] = useState(false);
  const [bossHP, setBossHP] = useState(99);
  const [bossT, setBossT] = useState(30);
  const [bossQ, setBossQ] = useState(null);
  const [bossA, setBossA] = useState(null);
  const [confetti, setConfetti] = useState(false);
  const [bossDefeated, setBossDefeated] = useState(0);

  const [pomoOn, setPomoOn] = useState(false);
  const [pomoTime, setPomoTime] = useState(25 * 60);
  const [pomoBreak, setPomoBreak] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [focusHistory] = useState([{ date: "Mon", mins: 25 }, { date: "Tue", mins: 50 }, { date: "Wed", mins: 0 }, { date: "Thu", mins: 75 }, { date: "Fri", mins: 25 }, { date: "Sat", mins: 50 }, { date: "Sun", mins: 0 }]);

  const [chatMsgs, setChatMsgs] = useState([{ role: "ai", text: "Hey! 👋 I'm your MindMap AI assistant. Ask anything about your studies!" }]);
  const [chatIn, setChatIn] = useState("");
  const [chatLoad, setChatLoad] = useState(false);
  const [badges, setBadges] = useState(["nightOwl"]);
  const [newBadge, setNewBadge] = useState(null);
  const [whyCard, setWhyCard] = useState(null);
  const [notif, setNotif] = useState(null);
  const [quests, setQuests] = useState([
    { id: "q1", text: "Answer 10 questions", target: 10, progress: 0, done: false, xp: 50, icon: "✅" },
    { id: "q2", text: "Complete a focus session", target: 1, progress: 0, done: false, xp: 35, icon: "⏱️" },
    { id: "q3", text: "Study for 20 minutes", target: 20, progress: 0, done: false, xp: 40, icon: "📚" },
  ]);
  const [insightIdx, setInsightIdx] = useState(0);
  const insights = [
    { icon: "📊", text: "Peak performance 8–10 PM", stat: "14 sessions", why: "Accuracy 34% higher in evening sessions vs morning over 2 weeks." },
    { icon: "🧠", text: "Focus improved 12% this week", stat: "vs last week", why: "Response time down 8.2s→7.1s. Accuracy up 68%→76%." },
    { icon: "⏰", text: "Breaks boost accuracy 18%", stat: "With vs without", why: "With breaks: 82% accuracy. Without: 64%." },
  ];
  const [decayAlerts] = useState([{ topic: "Binary Search", hrs: 49 }, { topic: "Linked Lists", hrs: 52 }, { topic: "Sorting Algorithms", hrs: 36 }]);
  const [weakTopics, setWeakTopics] = useState([]);
  const [topicFails, setTopicFails] = useState({});

  const lb = [{ name: "You", xp: 0, lvl: "Apprentice" }, { name: "Riya", xp: 320, lvl: "Warrior" }, { name: "Arjun", xp: 210, lvl: "Scholar" }, { name: "Neha", xp: 180, lvl: "Scholar" }, { name: "Vikram", xp: 95, lvl: "Apprentice" }];
  const leaderboard = lb.map(u => u.name === "You" ? { ...u, xp, lvl: level } : u).sort((a, b) => b.xp - a.xp);

  const notify = (m) => { setNotif(m); setTimeout(() => setNotif(null), 3000); };

  useEffect(() => { if (xp >= 1000) setLevel("Grand Master"); else if (xp >= 600) setLevel("Master"); else if (xp >= 300) setLevel("Warrior"); else if (xp >= 100) setLevel("Scholar"); else setLevel("Apprentice"); }, [xp]);
  useEffect(() => { if (layer >= 2) { const t = setInterval(() => setInsightIdx(p => (p + 1) % insights.length), 5000); return () => clearInterval(t); } }, [layer]);

  useEffect(() => {
    if (!pomoOn) return;
    const t = setInterval(() => {
      setPomoTime(p => {
        if (p <= 1) {
          if (!pomoBreak) { setPomoBreak(true); setSessions(s => s + 1); setXp(x => x + 35); notify("+35 XP — Session complete!"); return 5 * 60; }
          else { setPomoOn(false); setPomoBreak(false); return 25 * 60; }
        }
        return p - 1;
      });
    }, 1000);
    return () => clearInterval(t);
  }, [pomoOn, pomoBreak]);

  useEffect(() => { if (!fog) return; const t = setInterval(() => { setFogT(p => { if (p <= 1) { setFog(false); setFogT(30); return 30; } return p - 1; }); }, 1000); return () => clearInterval(t); }, [fog]);
  useEffect(() => { if (!boss || bossA) return; const t = setInterval(() => { setBossT(p => { if (p <= 1) { setBoss(false); notify("Boss escaped!"); return 30; } return p - 1; }); }, 1000); return () => clearInterval(t); }, [boss, bossA]);

  function login(name) { setUser({ name }); setPg("onboard"); }
  function changeTopic() { setPg("onboard"); }

  function startQuiz() {
    if (!at) return;
    setQNum(0); setQCorrect(0); setQTotal(0); setQStreak(0); setConsecutiveWrong(0); setLast3([]); setDiff("easy"); setRts([]); setMidMsg(null);
    setQuizQ(genQ(at, "easy")); setAns(null); setSelA(null); setShowExp(false); setQStart(Date.now()); setPg("quiz");
  }

  function answer(idx) {
    if (ans) return;
    const rt = Date.now() - qStart;
    const newRts = [...rts, rt]; setRts(newRts);
    setSelA(idx); setQTotal(p => p + 1);
    const ok = idx === quizQ.correct;
    setAns(ok ? "correct" : "wrong"); setShowExp(true);
    const nl3 = [...last3.slice(-2), ok]; setLast3(nl3);

    if (ok) {
      const ns = qStreak + 1; setQStreak(ns); setQCorrect(p => p + 1); setConsecutiveWrong(0);
      const earned = diff === "hard" ? 15 : diff === "medium" ? 10 : 5;
      setXp(p => p + earned); setXpPop("+" + earned); setTimeout(() => setXpPop(null), 1500);
      setAcademic(p => Math.min(100, p + 2));
      setPulse(p => [...p.slice(-9), { x: p.length + 1, y: Math.min(100, academic + 2) }]);
      setQuests(prev => prev.map(q => q.id === "q1" && !q.done ? { ...q, progress: Math.min(q.progress + 1, q.target), done: q.progress + 1 >= q.target } : q));
      if (ns >= 5 && !badges.includes("onFire")) { setBadges(p => [...p, "onFire"]); setNewBadge(BADGES.find(b => b.id === "onFire")); setTimeout(() => setNewBadge(null), 3000); }
      if (nl3.length >= 3 && nl3.every(Boolean)) setDiff(d => d === "easy" ? "medium" : "hard");
    } else {
      setQStreak(0); setAcademic(p => Math.max(0, p - 1));
      const cw = consecutiveWrong + 1; setConsecutiveWrong(cw);
      const tp = quizQ.topic;
      setTopicFails(prev => { const nc = (prev[tp] || 0) + 1; if (nc >= 2 && !weakTopics.includes(tp)) { setWeakTopics(w => [...w, tp]); } return { ...prev, [tp]: nc }; });
      if (nl3.length >= 2 && !nl3[nl3.length - 1] && nl3.length > 1 && !nl3[nl3.length - 2]) setDiff("easy");
      if (cw >= 3) { setFog(true); setFogT(30); setFogReason("You got " + cw + " questions wrong in a row. Take a breather — your brain needs a reset."); setConsecutiveWrong(0); setDiff("easy"); }
    }
    if (newRts.length >= 4) { const avg = newRts.reduce((a, b) => a + b, 0) / newRts.length; if (rt > avg * 2.5 && !fog) { setFog(true); setFogT(30); setFogReason("Response time much slower than usual. A quick break helps refocus."); } }
    const nn = qNum + 1;
    if (nn % 3 === 0 && nn > 0 && ok) { setMidMsg(MID_MSGS[Math.floor(Math.random() * MID_MSGS.length)]); setTimeout(() => setMidMsg(null), 3500); }
    if (nn % 5 === 0 && qStreak >= 2) { setTimeout(() => { setBoss(true); setBossHP(99); setBossT(30); setBossA(null); setBossQ(genQ(at, "hard")); setLayer(3); }, 2000); }
    if (nn >= 5 && layer < 2) { setLayer(2); notify("Layer 2 — Intelligent Adaptation"); }
  }

  function nextQ() {
    const nn = qNum + 1; setQNum(nn);
    if (nn >= 15) { setPg("quizEnd"); return; }
    setQuizQ(genQ(at, diff)); setAns(null); setSelA(null); setShowExp(false); setQStart(Date.now());
  }

  function ansBoss(idx) {
    if (bossA) return;
    const ok = idx === bossQ.correct; setBossA(ok ? "correct" : "wrong");
    if (ok) { const nh = Math.max(0, bossHP - 33); setBossHP(nh); if (nh <= 0) { setTimeout(() => { setConfetti(true); setXp(p => p + 50); setBossDefeated(p => p + 1); notify("🎉 Boss Defeated! +50 XP"); setTimeout(() => { setBoss(false); setConfetti(false); }, 3000); }, 800); return; } }
    setTimeout(() => { setBossA(null); setBossT(30); setBossQ(genQ(at, "hard")); }, 1500);
  }

  function sendChat() {
    if (!chatIn.trim()) return;
    const msg = chatIn.trim(); setChatMsgs(p => [...p, { role: "user", text: msg }]); setChatIn(""); setChatLoad(true);
    setTimeout(() => {
      const lo = msg.toLowerCase(); let r = "";
      if (lo.includes("help") || lo.includes("explain")) r = "For " + (at || "your subject") + ", start with core principles. Break concepts into smaller parts, then connect them.\n\nTip: Teach it to someone — best way to learn! 🎯";
      else if (lo.includes("motivat") || lo.includes("tired") || lo.includes("can't")) r = "Everyone has tough days 💛 Keep showing up. Take a break, hydrate. You're stronger than you think! 💪";
      else if (lo.includes("plan") || lo.includes("schedule")) r = "Study plan:\n\n📖 0-15 min: Basics\n☕ 15-20: Break\n🧠 20-50: Deep study\n🚶 50-60: Break\n✍️ 60-85: Practice\n📝 85-100: Quiz\n🎯 100-110: Review\n\nConsistency > Intensity! ✨";
      else if (lo.includes("tip") || lo.includes("study")) r = "Top tips:\n1. Active recall > re-reading\n2. Spaced repetition\n3. 25-min Pomodoro blocks\n4. Teach to learn\n5. Sleep well 😴";
      else r = "Great thought! Stay curious. I can explain concepts, suggest plans, or motivate you 😊";
      setChatMsgs(p => [...p, { role: "ai", text: r }]); setChatLoad(false);
    }, 1200);
  }

  const ctx = {
    pg, setPg, user, stream, setStream, topic, setTopic, customTopic, setCustomTopic, at,
    xp, streak, level, academic, wellbeing, burnout, setBurnout, mood, heatmap, pulse, uiMode, setUiMode, layer,
    quizQ, diff, qNum, qCorrect, qTotal, qStreak, ans, selA, showExp, midMsg, xpPop, consecutiveWrong,
    boss, bossHP, bossT, bossQ, bossA, confetti, bossDefeated,
    fog, fogT, fogReason,
    pomoOn, setPomoOn, pomoTime, pomoBreak, sessions, focusHistory,
    chatMsgs, chatIn, setChatIn, chatLoad,
    badges, newBadge, whyCard, setWhyCard, notif, quests, leaderboard,
    insights, insightIdx, decayAlerts, weakTopics,
    login, startQuiz, answer, nextQ, ansBoss, sendChat, notify, changeTopic,
    theme, setTheme, isDark,
    setMood: (m) => { setMoodState(m); setBurnout(p => Math.round(p * 0.7 + m.risk * 0.3)); notify("Mood recorded"); },
    toggleRecovery: () => { const next = uiMode === "recovery" ? "normal" : "recovery"; setUiMode(next); notify(next === "recovery" ? "🌙 Recovery Mode" : "Recovery off"); },
    endQuiz: () => setPg("quizEnd"),
  };

  return (
    <Ctx.Provider value={ctx}>
      <style>{BASE_CSS}</style>
      <style>{themeCSS(isDark ? DARK : LIGHT)}</style>
      <div style={{ minHeight: "100vh", background: "var(--bg)", transition: "background .3s" }}>
        {notif && <Toast msg={notif} />}
        {boss && <BossOv />}
        {fog && <FogOv />}
        {confetti && <ConfOv />}
        {newBadge && <BadgeOv b={newBadge} />}
        {whyCard && <WhyOv />}
        {pg === "login" && <LoginPg />}
        {pg === "onboard" && <OnboardPg />}
        {pg !== "login" && pg !== "onboard" && <Shell />}
      </div>
    </Ctx.Provider>
  );
}

/* ═══ THEME TOGGLE ═══ */
function ThemeToggle() {
  const { theme, setTheme, isDark } = useContext(Ctx);
  return (
    <button onClick={() => setTheme(isDark ? "light" : "dark")} style={{
      width: 34, height: 18, borderRadius: 9, border: "1px solid var(--border)", background: "var(--bg2)",
      position: "relative", cursor: "pointer", transition: "all .3s", padding: 0,
    }}>
      <div style={{
        width: 14, height: 14, borderRadius: "50%", background: "var(--accent)",
        position: "absolute", top: 1, left: isDark ? 1 : 17,
        transition: "left .3s", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8,
      }}>{isDark ? "🌙" : "☀️"}</div>
    </button>
  );
}

/* ═══ LOGIN ═══ */
function LoginPg() {
  const { login, theme, setTheme, isDark } = useContext(Ctx);
  const [n, setN] = useState("");
  const [e, setE] = useState("");
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24, position: "relative" }}>
      <div style={{ position: "absolute", top: 16, right: 20 }}><ThemeToggle /></div>
      <div style={{ maxWidth: 370, width: "100%", animation: "fadeIn .6s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 32 }}>
          <div style={{ width: 50, height: 50, borderRadius: 14, background: "var(--card)", border: "1px solid var(--border)", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: 12 }}>
            <span className="hd" style={{ fontSize: 20, color: "var(--accent)" }}>M</span>
          </div>
          <h1 className="hd" style={{ fontSize: 24, fontWeight: 700, marginBottom: 4 }}>MindMap</h1>
          <p style={{ color: "var(--text2)", fontSize: 13 }}>Your adaptive learning companion</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          <div><label style={{ fontSize: 11, color: "var(--text2)", marginBottom: 3, display: "block" }}>Name</label><input value={n} onChange={ev => setN(ev.target.value)} placeholder="What should we call you?" /></div>
          <div><label style={{ fontSize: 11, color: "var(--text2)", marginBottom: 3, display: "block" }}>Email</label><input type="email" value={e} onChange={ev => setE(ev.target.value)} placeholder="your@email.com" /></div>
          <button onClick={() => n.trim() && login(n.trim())} disabled={!n.trim()} style={{
            padding: "12px 0", borderRadius: 10, border: "none", fontSize: 14, fontWeight: 600,
            background: n.trim() ? "var(--accent)" : "var(--card2)", color: n.trim() ? (isDark ? "#111" : "#fff") : "var(--muted)", marginTop: 4, transition: "all .2s",
          }}>Continue →</button>
        </div>
      </div>
    </div>
  );
}

/* ═══ ONBOARD ═══ */
function OnboardPg() {
  const { user, stream, setStream, topic, setTopic, customTopic, setCustomTopic, setPg, isDark } = useContext(Ctx);
  const [step, setStep] = useState(1);
  return (
    <div style={{ minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center", padding: 24 }}>
      <div style={{ maxWidth: 480, width: "100%", animation: "fadeIn .5s ease" }}>
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <p style={{ fontSize: 12, color: "var(--text2)", marginBottom: 3 }}>Welcome, <span style={{ color: "var(--accent)" }}>{user?.name}</span></p>
          <h2 className="hd" style={{ fontSize: 20, fontWeight: 700 }}>{step === 1 ? "What's your stream?" : "What to study?"}</h2>
          <p style={{ color: "var(--muted)", fontSize: 11, marginTop: 3 }}>{step === 1 ? "We'll personalize for your field" : "Pick or type your own topic"}</p>
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 5, marginBottom: 20 }}>
          {[1, 2].map(s => <div key={s} style={{ width: s === step ? 24 : 5, height: 5, borderRadius: 3, background: s === step ? "var(--accent)" : "var(--border)", transition: "all .3s" }} />)}
        </div>
        {step === 1 && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            {STREAMS.map(s => (
              <button key={s.id} onClick={() => { setStream(s); setStep(2); }} style={{
                padding: 16, borderRadius: 10, border: "1px solid var(--border)", background: "var(--card)", textAlign: "left", transition: "all .2s",
              }}>
                <div style={{ fontSize: 20, marginBottom: 4 }}>{s.icon}</div>
                <div style={{ fontWeight: 600, fontSize: 12, marginBottom: 2, color: "var(--text)" }}>{s.label}</div>
                <div style={{ fontSize: 10, color: "var(--muted)" }}>{s.desc}</div>
              </button>
            ))}
          </div>
        )}
        {step === 2 && (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {stream && TOPIC_MAP[stream.id] && TOPIC_MAP[stream.id].length > 0 && (
              <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                {TOPIC_MAP[stream.id].map(t => (
                  <button key={t} onClick={() => { setTopic(t); setCustomTopic(""); }} style={{
                    padding: "6px 12px", borderRadius: 16, fontSize: 11,
                    border: "1px solid " + (topic === t ? "var(--accent)" : "var(--border)"),
                    background: topic === t ? "rgba(124,154,175,.1)" : "var(--card)",
                    color: topic === t ? "var(--accent)" : "var(--text2)", transition: "all .2s",
                  }}>{t}</button>
                ))}
              </div>
            )}
            <div>
              <label style={{ fontSize: 11, color: "var(--text2)", marginBottom: 3, display: "block" }}>Or type your own</label>
              <input value={customTopic} onChange={ev => { setCustomTopic(ev.target.value); if (ev.target.value) setTopic(""); }} placeholder="e.g. Organic Chemistry..." />
            </div>
            <div style={{ display: "flex", gap: 8, marginTop: 4 }}>
              <button onClick={() => setStep(1)} style={{ flex: 1, padding: "10px 0", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text2)", fontSize: 12 }}>← Back</button>
              <button onClick={() => { if (topic || customTopic) setPg("dashboard"); }} disabled={!topic && !customTopic} style={{
                flex: 2, padding: "10px 0", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 600,
                background: (topic || customTopic) ? "var(--accent)" : "var(--card2)", color: (topic || customTopic) ? (isDark ? "#111" : "#fff") : "var(--muted)",
              }}>Let's Go →</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* ═══ SHELL ═══ */
function Shell() {
  const { pg } = useContext(Ctx);
  return (
    <div style={{ display: "flex", minHeight: "100vh" }}>
      <SideNav />
      <main style={{ flex: 1, padding: "16px 20px", overflowY: "auto", maxHeight: "100vh", minWidth: 0 }}>
        <TopBar />
        {pg === "dashboard" && <Dash />}
        {pg === "quiz" && <QuizPg />}
        {pg === "quizEnd" && <EndPg />}
        {pg === "focus" && <FocusPg />}
        {pg === "badges" && <BadgePg />}
        {pg === "planner" && <PlanPg />}
        {pg === "chat" && <ChatPg />}
        {pg === "progress" && <ProgressPg />}
      </main>
      <RightPn />
    </div>
  );
}

function SideNav() {
  const { pg, setPg, toggleRecovery, uiMode } = useContext(Ctx);
  const items = [{ i: "🏠", p: "dashboard" }, { i: "📝", p: "quiz" }, { i: "⏱️", p: "focus" }, { i: "📊", p: "progress" }, { i: "📅", p: "planner" }, { i: "💬", p: "chat" }, { i: "🏆", p: "badges" }];
  return (
    <aside style={{ width: 52, background: "var(--card)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 10, gap: 2, flexShrink: 0 }}>
      <div style={{ width: 30, height: 30, borderRadius: 8, background: "var(--bg2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>
        <span className="hd" style={{ fontSize: 14, color: "var(--accent)" }}>M</span>
      </div>
      {items.map(it => (
        <button key={it.p} onClick={() => setPg(it.p)} title={it.p} style={{
          width: 34, height: 34, border: "none", borderRadius: 7,
          background: pg === it.p ? "rgba(124,154,175,.12)" : "transparent",
          fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", transition: "all .2s",
        }}>{it.i}</button>
      ))}
      <div style={{ flex: 1 }} />
      <button onClick={toggleRecovery} style={{ width: 34, height: 34, border: "none", borderRadius: 7, background: uiMode === "recovery" ? "rgba(124,154,175,.15)" : "transparent", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 10 }}>🌙</button>
    </aside>
  );
}

function TopBar() {
  const { xp, streak, level, layer, uiMode, user, changeTopic, at } = useContext(Ctx);
  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14, paddingBottom: 10, borderBottom: "1px solid var(--border)" }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
        <h1 className="hd" style={{ fontSize: 16, fontWeight: 700 }}>MindMap</h1>
        <span className="mn" style={{ fontSize: 8, color: "var(--muted)", background: "var(--card)", padding: "1px 5px", borderRadius: 3 }}>L{layer}</span>
        {uiMode === "recovery" && <span style={{ fontSize: 8, color: "var(--accent)", background: "var(--surface)", padding: "1px 5px", borderRadius: 3 }}>🌙</span>}
        {at && <button onClick={changeTopic} style={{ fontSize: 10, color: "var(--warm)", background: "rgba(196,149,106,.06)", border: "1px solid rgba(196,149,106,.15)", padding: "2px 8px", borderRadius: 12 }}>📎 {at} — change</button>}
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 12 }}>🔥</span><span className="mn" style={{ fontSize: 11 }}>{streak}</span>
        <span className="mn" style={{ fontSize: 11, color: "var(--gold)" }}>⚡{xp}</span>
        <span style={{ fontSize: 10, color: "var(--text2)" }}>{level}</span>
        <ThemeToggle />
        <div style={{ width: 24, height: 24, borderRadius: "50%", background: "var(--card2)", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 10, fontWeight: 600 }}>{user?.name?.[0]}</div>
      </div>
    </div>
  );
}

/* ═══ DASHBOARD ═══ */
function Dash() {
  const { startQuiz, at, uiMode, layer, stream } = useContext(Ctx);
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
      <div className="cd" style={{ background: "var(--surface)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <div>
            <p style={{ fontSize: 11, color: "var(--text2)", marginBottom: 2 }}>Currently studying</p>
            <h2 className="hd" style={{ fontSize: 17, fontWeight: 600 }}>{at}</h2>
            <p style={{ fontSize: 10, color: "var(--muted)", marginTop: 1 }}>{stream?.label}</p>
          </div>
          {uiMode !== "recovery" && <button onClick={startQuiz} style={{ padding: "8px 18px", borderRadius: 8, border: "1px solid var(--accent)", background: "rgba(124,154,175,.06)", color: "var(--accent)", fontSize: 12, fontWeight: 600 }}>Start Quiz →</button>}
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 10 }}>
        <SC label="Focus" val={78} col="var(--accent)" />
        <SC label="Productivity" val={65} col="var(--accent2)" />
        <MoodW />
      </div>
      <HeatmapC />
      {uiMode === "recovery" && <RecPanel />}
      {layer >= 2 && <BehaviorIntel />}
      {layer >= 2 && <WeakTopicsPanel />}
      {layer >= 3 && <MemoryDecayPanel />}
      <QuestC />
      <BurnC />
    </div>
  );
}

function SC({ label, val, col }) {
  return (<div className="cd" style={{ textAlign: "center" }}><div style={{ fontSize: 10, color: "var(--text2)", marginBottom: 5 }}>{label}</div><div className="mn" style={{ fontSize: 22, fontWeight: 500, color: col }}>{val}<span style={{ fontSize: 11, color: "var(--muted)" }}>%</span></div><div style={{ width: "80%", height: 2, background: "var(--border)", borderRadius: 1, margin: "5px auto 0", overflow: "hidden" }}><div style={{ width: val + "%", height: "100%", background: col, transition: "width .5s" }} /></div></div>);
}

function MoodW() {
  const ctx = useContext(Ctx);
  const { mood } = ctx;
  const r = 40;
  return (
    <div className="cd" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: 130 }}>
      <div style={{ fontSize: 9, color: "var(--text2)", marginBottom: 1 }}>How do you feel?</div>
      <div style={{ position: "relative", width: r * 2 + 28, height: r * 2 + 28 }}>
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
          {mood ? <><div style={{ fontSize: 16 }}>{mood.e}</div><div className="mn" style={{ fontSize: 7, color: "var(--text2)" }}>{mood.l}</div></> : <span className="mn" style={{ fontSize: 7, color: "var(--muted)" }}>tap</span>}
        </div>
        {MOODS.map((m, i) => {
          const a = (i * 360) / MOODS.length - 90;
          const rad = a * Math.PI / 180;
          const x = Math.cos(rad) * r;
          const y = Math.sin(rad) * r;
          const sel = mood?.l === m.l;
          const opac = mood && !sel ? 0.3 : 1;
          return (
            <button key={m.l} onClick={() => ctx.setMood(m)} style={{
              position: "absolute", left: "calc(50% + " + x + "px - 11px)", top: "calc(50% + " + y + "px - 11px)",
              width: 22, height: 22, borderRadius: "50%", border: "none",
              background: sel ? "rgba(124,154,175,.15)" : "var(--bg2)", fontSize: 11,
              display: "flex", alignItems: "center", justifyContent: "center",
              transform: sel ? "scale(1.25)" : "scale(1)", opacity: opac,
              transition: "all .3s",
            }} title={m.l}>{m.e}</button>
          );
        })}
      </div>
    </div>
  );
}

function HeatmapC() {
  const { heatmap } = useContext(Ctx);
  const c = (m) => m === 0 ? "var(--bg2)" : m <= 20 ? "rgba(124,154,175,.2)" : m <= 40 ? "rgba(124,154,175,.4)" : "var(--accent)";
  return (
    <div className="cd fi">
      <div className="hd" style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Study Activity — 70 days</div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(14,1fr)", gap: 2 }}>
        {heatmap.map((d, i) => (
          <div key={i} className="tw" style={{ position: "relative" }}>
            <div style={{ width: "100%", paddingBottom: "100%", borderRadius: 2, background: c(d.mins), cursor: "pointer" }} />
            <div className="tp" style={{ position: "absolute", bottom: "calc(100% + 3px)", left: "50%", transform: "translateX(-50%)", background: "var(--card2)", padding: "2px 6px", borderRadius: 3, fontSize: 8, whiteSpace: "nowrap", zIndex: 10, border: "1px solid var(--border)" }}>
              <span className="mn">{d.date} — {d.mins}m</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function BehaviorIntel() {
  const { insights, insightIdx, setWhyCard } = useContext(Ctx);
  const it = insights[insightIdx];
  return (
    <div className="cd sr" style={{ borderColor: "rgba(167,139,175,.15)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: "var(--accent2)", fontWeight: 500 }}>Behavior Intelligence</span>
        <button onClick={() => setWhyCard({ title: it.text, explanation: it.why })} className="mn" style={{ fontSize: 8, color: "var(--accent)", background: "var(--surface)", border: "1px solid var(--border)", padding: "1px 5px", borderRadius: 3 }}>Why?</button>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
        <span style={{ fontSize: 20 }}>{it.icon}</span>
        <div><div className="hd" style={{ fontSize: 13, fontWeight: 600 }}>{it.text}</div><div className="mn" style={{ fontSize: 10, color: "var(--muted)" }}>{it.stat}</div></div>
      </div>
      <div style={{ display: "flex", gap: 3, marginTop: 6, justifyContent: "center" }}>{insights.map((_, i) => <div key={i} style={{ width: 4, height: 4, borderRadius: "50%", background: i === insightIdx ? "var(--accent)" : "var(--border)" }} />)}</div>
    </div>
  );
}

function WeakTopicsPanel() {
  const { weakTopics } = useContext(Ctx);
  if (!weakTopics.length) return null;
  return (
    <div className="cd sr" style={{ borderColor: "rgba(184,114,114,.15)" }}>
      <div style={{ fontSize: 10, color: "var(--danger)", fontWeight: 500, marginBottom: 6 }}>Topics Needing Attention</div>
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {weakTopics.map(t => <span key={t} className="mn" style={{ fontSize: 10, padding: "3px 8px", borderRadius: 12, background: "rgba(184,114,114,.08)", border: "1px solid rgba(184,114,114,.2)", color: "var(--danger)" }}>{t}</span>)}
      </div>
    </div>
  );
}

function MemoryDecayPanel() {
  const { decayAlerts, setWhyCard } = useContext(Ctx);
  return (
    <div className="cd sr" style={{ borderColor: "rgba(201,169,110,.15)" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
        <span style={{ fontSize: 10, color: "var(--gold)", fontWeight: 500 }}>Memory Decay Alerts</span>
        <button onClick={() => setWhyCard({ title: "Memory Decay", explanation: "Ebbinghaus Forgetting Curve:\n\n• Memory drops ~40% after 24hr\n• Drops ~60% after 48hr\n• Without review, most fades in a week\n\nWe alert you before memory fades." })} className="mn" style={{ fontSize: 8, color: "var(--accent)", background: "var(--surface)", border: "1px solid var(--border)", padding: "1px 5px", borderRadius: 3 }}>How?</button>
      </div>
      {decayAlerts.map(a => (
        <div key={a.topic} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "6px 0", borderBottom: "1px solid var(--border)" }}>
          <div><span style={{ fontSize: 12 }}>{a.topic}</span><span className="mn" style={{ fontSize: 9, color: "var(--muted)", marginLeft: 6 }}>fading · {a.hrs}hr</span></div>
          <button className="mn" style={{ fontSize: 9, padding: "3px 8px", background: "rgba(201,169,110,.08)", border: "1px solid rgba(201,169,110,.2)", borderRadius: 12, color: "var(--gold)" }}>Review →</button>
        </div>
      ))}
    </div>
  );
}

function QuestC() {
  const { quests } = useContext(Ctx);
  return (
    <div className="cd">
      <div className="hd" style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Daily Quests</div>
      {quests.map(q => (
        <div key={q.id} style={{ display: "flex", alignItems: "center", gap: 6, padding: "5px 0", borderBottom: "1px solid var(--border)", opacity: q.done ? 0.4 : 1 }}>
          <span style={{ fontSize: 12 }}>{q.icon}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 10 }}>{q.text}</div>
            <div style={{ width: "100%", height: 2, background: "var(--border)", marginTop: 2, overflow: "hidden", borderRadius: 1 }}>
              <div style={{ width: (q.progress / q.target * 100) + "%", height: "100%", background: q.done ? "var(--success)" : "var(--accent)", transition: "width .5s" }} />
            </div>
          </div>
          <span className="mn" style={{ fontSize: 8, color: q.done ? "var(--success)" : "var(--muted)" }}>{q.done ? "✓" : q.progress + "/" + q.target}</span>
        </div>
      ))}
    </div>
  );
}

function BurnC() {
  const { burnout, setWhyCard } = useContext(Ctx);
  const a = -90 + (burnout / 100) * 180;
  const col = burnout <= 30 ? "var(--success)" : burnout <= 60 ? "var(--warm)" : "var(--danger)";
  return (
    <div className="cd" style={{ textAlign: "center" }}>
      <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 4 }}>
        <span className="hd" style={{ fontSize: 11, fontWeight: 600 }}>Burnout Risk</span>
        <button onClick={() => setWhyCard({ title: "Burnout Risk", explanation: "Score: " + burnout + "/100\n\n• Mood (30%)\n• Breaks (25%)\n• Late sessions (25%)\n• Duration (20%)" })} className="mn" style={{ fontSize: 8, color: "var(--accent)", background: "var(--surface)", border: "1px solid var(--border)", padding: "1px 4px", borderRadius: 3 }}>Why?</button>
      </div>
      <svg viewBox="0 0 200 110" style={{ width: "100%", maxWidth: 170 }}>
        <path d="M 25 95 A 75 75 0 0 1 175 95" fill="none" stroke="var(--border)" strokeWidth="6" strokeLinecap="round" />
        <line x1="100" y1="95" x2="100" y2="30" stroke={col} strokeWidth="2" strokeLinecap="round" transform={"rotate(" + a + ",100,95)"} style={{ transition: "transform 1s" }} />
        <circle cx="100" cy="95" r="3" fill={col} />
        <text x="100" y="88" textAnchor="middle" fill={col} fontSize="18" fontFamily="JetBrains Mono">{burnout}</text>
      </svg>
    </div>
  );
}

function RecPanel() {
  const [ph, setPh] = useState("Inhale");
  const [sz, setSz] = useState(60);
  useEffect(() => { const p = [{ l: "Inhale", s: 100 }, { l: "Hold", s: 100 }, { l: "Exhale", s: 60 }]; let i = 0; const go = () => { setPh(p[i].l); setSz(p[i].s); i = (i + 1) % 3; }; go(); const t = setInterval(go, 4000); return () => clearInterval(t); }, []);
  return (
    <div className="cd" style={{ textAlign: "center", padding: 22 }}>
      <div className="hd" style={{ fontSize: 15, fontWeight: 600, color: "var(--accent)", marginBottom: 12 }}>Recovery Mode 🌙</div>
      <div style={{ width: sz, height: sz, borderRadius: "50%", background: "var(--surface)", border: "1px solid var(--border)", margin: "0 auto 10px", display: "flex", alignItems: "center", justifyContent: "center", transition: "all 4s ease-in-out" }}>
        <span style={{ fontSize: 11, color: "var(--accent)" }}>{ph}</span>
      </div>
      <p style={{ color: "var(--text2)", fontSize: 12 }}>Take it easy. Every small step counts.</p>
    </div>
  );
}

/* ═══ QUIZ ═══ */
function QuizPg() {
  const { quizQ, ans, selA, showExp, answer, nextQ, endQuiz, diff, qCorrect, qTotal, qStreak, xpPop, midMsg, qNum, startQuiz, at, consecutiveWrong } = useContext(Ctx);
  if (!quizQ) return (
    <div style={{ textAlign: "center", paddingTop: 40 }}>
      <div className="hd" style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>Adaptive Quiz</div>
      <p style={{ color: "var(--text2)", fontSize: 12, marginBottom: 3 }}>Topic: <span style={{ color: "var(--accent)" }}>{at}</span></p>
      <p style={{ color: "var(--muted)", fontSize: 11, marginBottom: 18 }}>AI adapts difficulty in real-time.</p>
      <button onClick={startQuiz} style={{ padding: "10px 24px", borderRadius: 8, border: "1px solid var(--accent)", background: "rgba(124,154,175,.06)", color: "var(--accent)", fontSize: 12, fontWeight: 600 }}>Start Session →</button>
    </div>
  );

  return (
    <div style={{ maxWidth: 560, margin: "0 auto", position: "relative" }}>
      {midMsg && <div style={{ position: "fixed", top: "50%", left: "50%", transform: "translate(-50%,-50%)", zIndex: 500, background: "var(--card2)", border: "1px solid var(--accent)", borderRadius: 12, padding: "16px 24px", textAlign: "center", animation: "fadeIn .3s", boxShadow: "0 8px 40px rgba(0,0,0,.4)", maxWidth: 340 }}><div className="hd" style={{ fontSize: 14, fontWeight: 600, color: "var(--accent)", lineHeight: 1.5 }}>{midMsg}</div></div>}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 10 }}>
        <div>
          <span className="mn" style={{ fontSize: 9, color: "var(--muted)" }}>Q{qNum + 1}</span>
          <span className="mn" style={{ fontSize: 8, marginLeft: 5, padding: "1px 4px", borderRadius: 3, background: diff === "hard" ? "rgba(184,114,114,.1)" : diff === "medium" ? "rgba(196,149,106,.1)" : "rgba(122,172,138,.1)", color: diff === "hard" ? "var(--danger)" : diff === "medium" ? "var(--warm)" : "var(--success)" }}>{diff}</span>
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span className="mn" style={{ fontSize: 9 }}><span style={{ color: "var(--success)" }}>{qCorrect}✓</span>/{qTotal}</span>
          {qStreak >= 3 && <span className="mn" style={{ fontSize: 9, color: "var(--gold)" }}>🔥{qStreak}x</span>}
          {consecutiveWrong >= 2 && <span className="mn" style={{ fontSize: 8, color: "var(--danger)", background: "rgba(184,114,114,.1)", padding: "1px 5px", borderRadius: 8 }}>⚠ {consecutiveWrong} wrong</span>}
          <button onClick={endQuiz} style={{ fontSize: 9, color: "var(--muted)", background: "none", border: "1px solid var(--border)", borderRadius: 5, padding: "2px 6px" }}>End</button>
        </div>
      </div>
      <div className="cd" style={{ marginBottom: 10, position: "relative" }}>
        <div className="mn" style={{ fontSize: 8, color: "var(--accent)", marginBottom: 5 }}>{quizQ.topic}</div>
        <div className="hd" style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.6 }}>{quizQ.question}</div>
        {xpPop && <div className="hd" style={{ position: "absolute", top: -12, right: 12, color: "var(--gold)", fontSize: 13, fontWeight: 700, animation: "xpUp 1.5s ease forwards" }}>{xpPop} XP</div>}
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 5 }}>
        {quizQ.options.map((o, i) => {
          let bg = "var(--card)";
          let bd = "var(--border)";
          if (ans && i === quizQ.correct) { bg = "rgba(122,172,138,.08)"; bd = "var(--success)"; }
          else if (ans === "wrong" && i === selA) { bg = "rgba(184,114,114,.08)"; bd = "var(--danger)"; }
          return (
            <button key={i} onClick={() => answer(i)} disabled={!!ans} style={{
              width: "100%", padding: "11px 12px", background: bg, border: "1px solid " + bd,
              borderRadius: 8, color: "var(--text)", fontSize: 12, textAlign: "left",
              fontFamily: "'Outfit',sans-serif", transition: "all .2s",
              animation: ans === "wrong" && i === selA ? "shake .4s" : "none",
            }}>
              <span className="mn" style={{ marginRight: 7, color: "var(--muted)", fontSize: 9 }}>{String.fromCharCode(65 + i)}</span>{o}
            </button>
          );
        })}
      </div>
      {showExp && (
        <div className="cd fi" style={{ marginTop: 8, borderColor: ans === "correct" ? "rgba(122,172,138,.2)" : "rgba(184,114,114,.2)" }}>
          <div className="hd" style={{ fontSize: 10, fontWeight: 600, marginBottom: 3, color: ans === "correct" ? "var(--success)" : "var(--danger)" }}>{ans === "correct" ? "✓ Correct!" : "✗ Not quite"}</div>
          <p style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.6 }}>{quizQ.explanation}</p>
          <button onClick={nextQ} style={{ marginTop: 6, padding: "8px 16px", border: "1px solid var(--accent)", borderRadius: 8, background: "rgba(124,154,175,.06)", color: "var(--accent)", fontSize: 11, fontWeight: 600 }}>{qNum >= 14 ? "See Results →" : "Next →"}</button>
        </div>
      )}
    </div>
  );
}

/* ═══ QUIZ END ═══ */
function EndPg() {
  const { qCorrect, qTotal, xp, at, setPg, startQuiz } = useContext(Ctx);
  const pct = qTotal > 0 ? Math.round(qCorrect / qTotal * 100) : 0;
  const good = pct >= 60;
  const msg = good ? END_GOOD[Math.floor(Math.random() * END_GOOD.length)] : END_OK[Math.floor(Math.random() * END_OK.length)];
  return (
    <div style={{ maxWidth: 440, margin: "0 auto", textAlign: "center", paddingTop: 32, animation: "fadeIn .5s" }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>{good ? "🎉" : "💛"}</div>
      <h2 className="hd" style={{ fontSize: 20, fontWeight: 700, marginBottom: 5 }}>Session Complete!</h2>
      <p style={{ color: "var(--text2)", fontSize: 13, lineHeight: 1.6, maxWidth: 340, margin: "0 auto 18px" }}>{msg}</p>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 8, marginBottom: 20 }}>
        <div className="cd" style={{ textAlign: "center" }}><div className="mn" style={{ fontSize: 20, color: "var(--accent)" }}>{qCorrect}/{qTotal}</div><div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>Correct</div></div>
        <div className="cd" style={{ textAlign: "center" }}><div className="mn" style={{ fontSize: 20, color: pct >= 60 ? "var(--success)" : "var(--warm)" }}>{pct}%</div><div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>Accuracy</div></div>
        <div className="cd" style={{ textAlign: "center" }}><div className="mn" style={{ fontSize: 20, color: "var(--gold)" }}>{xp}</div><div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>Total XP</div></div>
      </div>
      <div className="cd" style={{ textAlign: "left", marginBottom: 16 }}>
        <div className="hd" style={{ fontSize: 11, fontWeight: 600, marginBottom: 4 }}>What's Next?</div>
        <p style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.6 }}>
          {pct >= 80 ? "Mastery! Try harder topics or boss battles. 🚀" : pct >= 50 ? "Good progress! Review what you missed. 📚" : "Focus on fundamentals. Check the Study Planner. 🌱"}
        </p>
      </div>
      <div style={{ display: "flex", gap: 6, justifyContent: "center", flexWrap: "wrap" }}>
        <button onClick={() => setPg("dashboard")} style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid var(--border)", background: "transparent", color: "var(--text2)", fontSize: 11 }}>Dashboard</button>
        <button onClick={startQuiz} style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid var(--accent)", background: "rgba(124,154,175,.06)", color: "var(--accent)", fontSize: 11, fontWeight: 600 }}>Try Again →</button>
        <button onClick={() => setPg("progress")} style={{ padding: "9px 16px", borderRadius: 8, border: "1px solid var(--gold)", background: "rgba(201,169,110,.06)", color: "var(--gold)", fontSize: 11 }}>Progress</button>
      </div>
    </div>
  );
}

/* ═══ FOCUS ═══ */
function FocusPg() {
  const { pomoOn, setPomoOn, pomoTime, pomoBreak, sessions, focusHistory, wellbeing } = useContext(Ctx);
  const m = Math.floor(pomoTime / 60);
  const s = pomoTime % 60;
  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <div style={{ textAlign: "center", paddingTop: 16 }}>
        <div className="hd" style={{ fontSize: 18, fontWeight: 700, marginBottom: 3 }}>{pomoBreak ? "Break Time" : "Deep Focus"}</div>
        <p style={{ color: "var(--muted)", fontSize: 11, marginBottom: 20 }}>{pomoBreak ? "Rest. You earned it." : "25-min Pomodoro"}</p>
        <div style={{ position: "relative", width: 150, height: 150, margin: "0 auto 18px" }}>
          <svg viewBox="0 0 150 150" style={{ width: "100%", transform: "rotate(-90deg)" }}>
            <circle cx="75" cy="75" r="66" fill="none" stroke="var(--border)" strokeWidth="3" />
            <circle cx="75" cy="75" r="66" fill="none" stroke={pomoBreak ? "var(--success)" : "var(--accent)"} strokeWidth="3" strokeLinecap="round" strokeDasharray={2 * Math.PI * 66} strokeDashoffset={2 * Math.PI * 66 * (1 - pomoTime / (pomoBreak ? 300 : 1500))} style={{ transition: "stroke-dashoffset 1s linear" }} />
          </svg>
          <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%,-50%)" }}>
            <div className="mn" style={{ fontSize: 26, color: pomoBreak ? "var(--success)" : "var(--accent)" }}>{String(m).padStart(2, "0")}:{String(s).padStart(2, "0")}</div>
          </div>
        </div>
        {pomoOn && !pomoBreak && <div style={{ display: "flex", justifyContent: "center", gap: 3, marginBottom: 14, height: 18 }}>{[0, 1, 2, 3, 4].map(i => <div key={i} style={{ width: 3, background: "var(--accent)", borderRadius: 2, animation: "barPulse 1.2s ease-in-out infinite", animationDelay: i * 0.2 + "s" }} />)}</div>}
        <button onClick={() => setPomoOn(!pomoOn)} style={{ padding: "9px 22px", borderRadius: 8, border: "1px solid " + (pomoOn ? "var(--danger)" : "var(--accent)"), background: pomoOn ? "rgba(184,114,114,.06)" : "rgba(124,154,175,.06)", color: pomoOn ? "var(--danger)" : "var(--accent)", fontSize: 12, fontWeight: 600 }}>{pomoOn ? "⏹ Stop" : "▶ Start"}</button>
        <div className="mn" style={{ fontSize: 10, color: "var(--muted)", marginTop: 10 }}>{sessions} sessions · {sessions * 25} min today</div>
      </div>
      <div className="cd" style={{ marginTop: 16 }}>
        <div className="hd" style={{ fontSize: 11, fontWeight: 600, marginBottom: 8 }}>Focus History — This Week</div>
        <ResponsiveContainer width="100%" height={120}>
          <BarChart data={focusHistory}><XAxis dataKey="date" tick={{ fontSize: 9, fill: "var(--muted)" }} axisLine={false} tickLine={false} /><YAxis hide /><Bar dataKey="mins" fill="var(--accent)" radius={[3, 3, 0, 0]} opacity={0.7} /></BarChart>
        </ResponsiveContainer>
      </div>
      <div className="cd" style={{ marginTop: 10 }}>
        <div className="hd" style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>🧠 Mental Health & Focus</div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
          <div style={{ background: "var(--bg2)", borderRadius: 8, padding: 10, textAlign: "center" }}><div className="mn" style={{ fontSize: 18, color: "var(--accent)" }}>78%</div><div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>Focus Score</div></div>
          <div style={{ background: "var(--bg2)", borderRadius: 8, padding: 10, textAlign: "center" }}><div className="mn" style={{ fontSize: 18, color: "var(--accent2)" }}>{wellbeing}%</div><div style={{ fontSize: 9, color: "var(--muted)", marginTop: 2 }}>Wellbeing</div></div>
        </div>
        <p style={{ fontSize: 10, color: "var(--text2)", marginTop: 8, lineHeight: 1.5 }}>Regular focus sessions improve both concentration and mental wellbeing. Breaks are part of the process.</p>
      </div>
    </div>
  );
}

/* ═══ PROGRESS ═══ */
function ProgressPg() {
  const { xp, academic, wellbeing, qCorrect, qTotal, streak, sessions, at, pulse, badges, level, weakTopics, bossDefeated } = useContext(Ctx);
  const pct = qTotal > 0 ? Math.round(qCorrect / qTotal * 100) : 0;
  return (
    <div style={{ maxWidth: 560, margin: "0 auto" }}>
      <div className="hd" style={{ fontSize: 20, fontWeight: 700, marginBottom: 3 }}>Your Progress</div>
      <p style={{ color: "var(--text2)", fontSize: 11, marginBottom: 16 }}>Learning journey in <span style={{ color: "var(--accent)" }}>{at}</span></p>
      <div className="cd" style={{ textAlign: "center", marginBottom: 10 }}>
        <div className="hd" style={{ fontSize: 11, fontWeight: 600, marginBottom: 8 }}>Academic & Wellbeing</div>
        <svg viewBox="0 0 140 140" style={{ width: 120, height: 120, margin: "0 auto" }}>
          <circle cx="70" cy="70" r="58" fill="none" stroke="var(--border)" strokeWidth="4" />
          <circle cx="70" cy="70" r="58" fill="none" stroke="var(--accent)" strokeWidth="4" strokeLinecap="round" strokeDasharray={2 * Math.PI * 58} strokeDashoffset={2 * Math.PI * 58 * (1 - academic / 100)} transform="rotate(-90,70,70)" style={{ transition: "stroke-dashoffset .8s" }} />
          <circle cx="70" cy="70" r="46" fill="none" stroke="var(--border)" strokeWidth="4" />
          <circle cx="70" cy="70" r="46" fill="none" stroke="var(--accent2)" strokeWidth="4" strokeLinecap="round" strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - wellbeing / 100)} transform="rotate(-90,70,70)" style={{ transition: "stroke-dashoffset .8s" }} />
          <text x="70" y="66" textAnchor="middle" fill="var(--accent)" fontSize="15" fontFamily="JetBrains Mono">{academic}%</text>
          <text x="70" y="80" textAnchor="middle" fill="var(--accent2)" fontSize="10" fontFamily="JetBrains Mono">{wellbeing}%</text>
        </svg>
        <div style={{ display: "flex", justifyContent: "center", gap: 14, marginTop: 4 }}><span style={{ fontSize: 9, color: "var(--accent)" }}>● Academic</span><span style={{ fontSize: 9, color: "var(--accent2)" }}>● Wellbeing</span></div>
      </div>
      <div className="cd" style={{ marginBottom: 10 }}>
        <div className="hd" style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Learning Pulse</div>
        <ResponsiveContainer width="100%" height={80}><AreaChart data={pulse}><Area type="monotone" dataKey="y" stroke="var(--accent)" fill="rgba(124,154,175,.08)" strokeWidth={1.5} /></AreaChart></ResponsiveContainer>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8, marginBottom: 10 }}>
        {[{ l: "Total XP", v: xp, c: "var(--gold)" }, { l: "Accuracy", v: pct + "%", c: "var(--success)" }, { l: "Streak", v: streak + "d", c: "var(--warm)" }, { l: "Sessions", v: sessions, c: "var(--accent)" }].map(s => (
          <div key={s.l} className="cd" style={{ textAlign: "center", padding: 12 }}><div className="mn" style={{ fontSize: 18, color: s.c }}>{s.v}</div><div style={{ fontSize: 8, color: "var(--muted)", marginTop: 2 }}>{s.l}</div></div>
        ))}
      </div>
      <div className="cd" style={{ marginBottom: 10, borderColor: "rgba(201,169,110,.15)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
          <span className="hd" style={{ fontSize: 12, fontWeight: 600 }}>📋 Weekly Report</span>
          <span className="mn" style={{ fontSize: 8, color: "var(--muted)" }}>This week</span>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 6 }}>
          <div style={{ background: "var(--bg2)", borderRadius: 6, padding: 8, textAlign: "center" }}><div className="mn" style={{ fontSize: 14, color: "var(--gold)" }}>{xp}</div><div style={{ fontSize: 8, color: "var(--muted)" }}>XP</div></div>
          <div style={{ background: "var(--bg2)", borderRadius: 6, padding: 8, textAlign: "center" }}><div className="mn" style={{ fontSize: 14, color: "var(--success)" }}>{pct}%</div><div style={{ fontSize: 8, color: "var(--muted)" }}>Accuracy</div></div>
          <div style={{ background: "var(--bg2)", borderRadius: 6, padding: 8, textAlign: "center" }}><div className="mn" style={{ fontSize: 14, color: "var(--accent)" }}>{sessions * 25}m</div><div style={{ fontSize: 8, color: "var(--muted)" }}>Study</div></div>
        </div>
        <div style={{ marginTop: 8, padding: "8px 10px", background: "rgba(201,169,110,.04)", borderRadius: 6, border: "1px solid rgba(201,169,110,.1)" }}>
          <p style={{ fontSize: 10, color: "var(--text2)" }}>{pct >= 70 ? "Fantastic week! Above average. Keep pushing! 🏆" : "Solid effort. Focus on weak topics to improve. 💪"}</p>
        </div>
      </div>
      {weakTopics.length > 0 && (
        <div className="cd" style={{ marginBottom: 10 }}>
          <div className="hd" style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Areas to Improve</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
            {weakTopics.map(t => <span key={t} className="mn" style={{ fontSize: 9, padding: "3px 8px", borderRadius: 10, background: "rgba(184,114,114,.08)", border: "1px solid rgba(184,114,114,.15)", color: "var(--danger)" }}>{t}</span>)}
          </div>
        </div>
      )}
      <div className="cd">
        <div className="hd" style={{ fontSize: 11, fontWeight: 600, marginBottom: 6 }}>Badges ({badges.length}/{BADGES.length})</div>
        <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
          {BADGES.filter(b => badges.includes(b.id)).map(b => (
            <div key={b.id} style={{ display: "flex", alignItems: "center", gap: 4, padding: "4px 8px", borderRadius: 8, background: b.color + "18", border: "1px solid " + b.color + "30" }}>
              <span style={{ fontSize: 14 }}>{b.icon}</span><span style={{ fontSize: 10, color: b.color }}>{b.name}</span>
            </div>
          ))}
          {badges.length === 0 && <p style={{ fontSize: 10, color: "var(--muted)" }}>Complete challenges to earn badges!</p>}
        </div>
      </div>
    </div>
  );
}

/* ═══ PLANNER ═══ */
function PlanPg() {
  const { at } = useContext(Ctx);
  const plan = makePlan(at || "Your Subject");
  return (
    <div style={{ maxWidth: 500, margin: "0 auto" }}>
      <div className="hd" style={{ fontSize: 18, fontWeight: 700, marginBottom: 2 }}>Study Plan</div>
      <p style={{ color: "var(--text2)", fontSize: 11, marginBottom: 14 }}>2-hour session for <span style={{ color: "var(--accent)" }}>{at}</span></p>
      <div style={{ display: "flex", flexDirection: "column" }}>
        {plan.map((b, i) => (
          <div key={i} style={{ display: "flex", gap: 10 }}>
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 16, flexShrink: 0 }}>
              <div style={{ width: 7, height: 7, borderRadius: "50%", background: b.color, border: "2px solid var(--bg)", zIndex: 1, flexShrink: 0 }} />
              {i < plan.length - 1 && <div style={{ width: 1, flex: 1, background: "var(--border)" }} />}
            </div>
            <div className="cd" style={{ flex: 1, marginBottom: 5, padding: 10 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 2 }}>
                <div style={{ display: "flex", alignItems: "center", gap: 5 }}><span style={{ fontSize: 13 }}>{b.icon}</span><span className="hd" style={{ fontSize: 11, fontWeight: 600, color: b.color }}>{b.phase}</span></div>
                <span className="mn" style={{ fontSize: 8, color: "var(--muted)" }}>{b.time}</span>
              </div>
              <p style={{ fontSize: 10, color: "var(--text2)", marginLeft: 22 }}>{b.task}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ═══ CHAT ═══ */
function ChatPg() {
  const { chatMsgs, chatIn, setChatIn, chatLoad, sendChat, at } = useContext(Ctx);
  const endRef = useRef(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatMsgs]);
  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 68px)" }}>
      <div className="hd" style={{ fontSize: 15, fontWeight: 700, marginBottom: 1 }}>AI Study Assistant</div>
      <p style={{ fontSize: 10, color: "var(--muted)", marginBottom: 10 }}>Ask about {at || "anything"}</p>
      <div style={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6, paddingRight: 4 }}>
        {chatMsgs.map((m, i) => (
          <div key={i} style={{ alignSelf: m.role === "user" ? "flex-end" : "flex-start", maxWidth: "78%" }}>
            <div style={{ padding: "8px 12px", borderRadius: 10, background: m.role === "user" ? "rgba(124,154,175,.1)" : "var(--card)", border: "1px solid " + (m.role === "user" ? "rgba(124,154,175,.12)" : "var(--border)") }}>
              <p style={{ fontSize: 11, lineHeight: 1.6, whiteSpace: "pre-line" }}>{m.text}</p>
            </div>
            <div style={{ fontSize: 7, color: "var(--muted)", marginTop: 1, textAlign: m.role === "user" ? "right" : "left" }}>{m.role === "user" ? "You" : "MindMap AI"}</div>
          </div>
        ))}
        {chatLoad && <div style={{ alignSelf: "flex-start" }}><div className="cd" style={{ padding: "6px 12px" }}><span style={{ animation: "pulse 1.5s infinite", color: "var(--muted)", fontSize: 11 }}>Thinking...</span></div></div>}
        <div ref={endRef} />
      </div>
      <div style={{ display: "flex", gap: 4, marginTop: 6, flexWrap: "wrap" }}>
        {["Explain a concept", "Study tips", "Make a schedule", "I'm stuck"].map(q => (
          <button key={q} onClick={() => setChatIn(q)} style={{ padding: "3px 8px", borderRadius: 12, border: "1px solid var(--border)", background: "var(--card)", color: "var(--text2)", fontSize: 9 }}>{q}</button>
        ))}
      </div>
      <div style={{ display: "flex", gap: 5, marginTop: 5 }}>
        <input value={chatIn} onChange={ev => setChatIn(ev.target.value)} onKeyDown={ev => ev.key === "Enter" && sendChat()} placeholder="Ask me anything..." style={{ flex: 1 }} />
        <button onClick={sendChat} disabled={!chatIn.trim()} style={{ padding: "0 14px", borderRadius: 8, border: "none", background: chatIn.trim() ? "var(--accent)" : "var(--card2)", color: chatIn.trim() ? "#fff" : "var(--muted)", fontSize: 12 }}>→</button>
      </div>
    </div>
  );
}

/* ═══ BADGES ═══ */
function BadgePg() {
  const { badges } = useContext(Ctx);
  return (
    <div>
      <div className="hd" style={{ fontSize: 18, fontWeight: 700, marginBottom: 3 }}>Achievement Badges</div>
      <p style={{ color: "var(--muted)", fontSize: 10, marginBottom: 12 }}>{badges.length}/{BADGES.length} earned</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 8 }}>
        {BADGES.map(b => {
          const earned = badges.includes(b.id);
          return (
            <div key={b.id} style={{
              textAlign: "center", padding: 14, borderRadius: 12, position: "relative", overflow: "hidden",
              background: earned ? "var(--card)" : "var(--card)",
              border: "1px solid " + (earned ? b.color + "60" : "var(--border)"),
              transition: "all .3s",
            }}>
              {!earned && (
                <div style={{
                  position: "absolute", inset: 0, borderRadius: 12, zIndex: 1,
                  background: "rgba(128,128,128,.08)",
                  backdropFilter: "blur(1px)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <span className="mn" style={{ fontSize: 8, color: "var(--text2)", background: "var(--card2)", padding: "2px 8px", borderRadius: 10, border: "1px solid var(--border)" }}>🔒 Locked</span>
                </div>
              )}
              <div style={{ fontSize: 26, marginBottom: 4, filter: earned ? "none" : "grayscale(.8) opacity(.4)" }}>{b.icon}</div>
              <div className="hd" style={{ fontSize: 10, fontWeight: 600, color: earned ? b.color : "var(--muted)" }}>{b.name}</div>
              <div className="mn" style={{ fontSize: 7, color: "var(--muted)", marginTop: 2 }}>{b.trig}</div>
              {earned && <div style={{ marginTop: 4, fontSize: 7, color: "var(--success)" }}>✓ Earned</div>}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ═══ RIGHT PANEL ═══ */
function RightPn() {
  const { user, level, xp, academic, wellbeing, pulse, leaderboard, uiMode } = useContext(Ctx);
  const heroSpeed = xp >= 1000 ? "2s" : xp >= 600 ? "3s" : xp >= 300 ? "4s" : xp >= 100 ? "6s" : "8s";
  const heroColor = xp >= 600 ? "var(--gold)" : xp >= 300 ? "var(--accent2)" : xp >= 100 ? "var(--accent)" : "var(--muted)";
  return (
    <aside style={{ width: 230, background: "var(--card)", borderLeft: "1px solid var(--border)", padding: 12, overflowY: "auto", maxHeight: "100vh", display: "flex", flexDirection: "column", gap: 10, flexShrink: 0 }}>
      <div style={{ textAlign: "center", padding: "6px 0" }}>
        <div style={{ position: "relative", width: 52, height: 52, margin: "0 auto 5px" }}>
          <svg viewBox="0 0 52 52" style={{ position: "absolute", inset: 0, animation: "ringRot " + heroSpeed + " linear infinite" }}>
            <circle cx="26" cy="26" r="23" fill="none" stroke={heroColor} strokeWidth="1.5" strokeDasharray="5 3" opacity=".5" />
          </svg>
          <div style={{ width: 36, height: 36, borderRadius: "50%", background: "var(--card2)", border: "1px solid var(--border)", position: "absolute", top: 8, left: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, fontWeight: 600 }}>{user?.name?.[0]}</div>
        </div>
        <div className="hd" style={{ fontSize: 12, fontWeight: 600 }}>{user?.name}</div>
        <div style={{ fontSize: 9, color: heroColor, fontStyle: "italic" }}>{level}</div>
        <div className="mn" style={{ fontSize: 9, color: "var(--gold)" }}>⚡{xp}</div>
      </div>
      <div style={{ textAlign: "center" }}>
        <svg viewBox="0 0 110 110" style={{ width: 95, height: 95, margin: "0 auto" }}>
          <circle cx="55" cy="55" r="46" fill="none" stroke="var(--border)" strokeWidth="3" />
          <circle cx="55" cy="55" r="46" fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round" strokeDasharray={2 * Math.PI * 46} strokeDashoffset={2 * Math.PI * 46 * (1 - academic / 100)} transform="rotate(-90,55,55)" style={{ transition: "stroke-dashoffset .8s" }} />
          <circle cx="55" cy="55" r="36" fill="none" stroke="var(--border)" strokeWidth="3" />
          <circle cx="55" cy="55" r="36" fill="none" stroke="var(--accent2)" strokeWidth="3" strokeLinecap="round" strokeDasharray={2 * Math.PI * 36} strokeDashoffset={2 * Math.PI * 36 * (1 - wellbeing / 100)} transform="rotate(-90,55,55)" style={{ transition: "stroke-dashoffset .8s" }} />
          <text x="55" y="52" textAnchor="middle" fill="var(--accent)" fontSize="13" fontFamily="JetBrains Mono">{academic}%</text>
          <text x="55" y="65" textAnchor="middle" fill="var(--accent2)" fontSize="9" fontFamily="JetBrains Mono">{wellbeing}%</text>
        </svg>
        <div style={{ display: "flex", justifyContent: "center", gap: 10, marginTop: 2 }}>
          <span style={{ fontSize: 8, color: "var(--accent)" }}>● Academic</span>
          <span style={{ fontSize: 8, color: "var(--accent2)" }}>● Wellbeing</span>
        </div>
      </div>
      <div className="cd" style={{ padding: 7 }}>
        <div style={{ fontSize: 9, fontWeight: 500, marginBottom: 2, color: "var(--text2)" }}>Learning Pulse</div>
        <ResponsiveContainer width="100%" height={40}><LineChart data={pulse}><Line type="monotone" dataKey="y" stroke="var(--accent)" strokeWidth={1.5} dot={false} /></LineChart></ResponsiveContainer>
      </div>
      {uiMode !== "recovery" && (
        <div>
          <div style={{ fontSize: 10, fontWeight: 600, marginBottom: 4, color: "var(--text2)" }}>Leaderboard</div>
          {leaderboard.map((u, i) => (
            <div key={u.name} style={{ display: "flex", alignItems: "center", gap: 5, padding: "3px 5px", borderRadius: 4, marginBottom: 2, background: u.name === "You" ? "rgba(124,154,175,.04)" : "transparent", borderLeft: u.name === "You" ? "2px solid var(--accent)" : "2px solid transparent" }}>
              <span className="mn" style={{ fontSize: 7, color: "var(--muted)", width: 12 }}>#{i + 1}</span>
              <div style={{ width: 18, height: 18, borderRadius: "50%", background: "var(--bg2)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 8 }}>{u.name[0]}</div>
              <div style={{ flex: 1 }}><div style={{ fontSize: 9 }}>{u.name}</div><div className="mn" style={{ fontSize: 7, color: "var(--muted)" }}>{u.lvl}</div></div>
              <span className="mn" style={{ fontSize: 8, color: "var(--gold)" }}>{u.xp}</span>
            </div>
          ))}
        </div>
      )}
    </aside>
  );
}

/* ═══ OVERLAYS ═══ */
function BossOv() {
  const { bossHP, bossT, bossQ, bossA, ansBoss } = useContext(Ctx);
  if (!bossQ) return null;
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, background: "radial-gradient(ellipse,#1a0808,#0a0505 70%,#000)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: 20 }}>
      <div style={{ fontSize: 48, marginBottom: 6, filter: "drop-shadow(0 0 10px rgba(184,114,114,.3))", animation: bossHP < 30 ? "shake .3s infinite" : "breathe 2s infinite" }}>👹</div>
      <div className="hd" style={{ fontSize: 15, fontWeight: 700, color: "var(--danger)", marginBottom: 10 }}>BOSS BATTLE</div>
      <div style={{ display: "flex", gap: 3, width: 200, marginBottom: 12 }}>
        {[0, 1, 2].map(s => <div key={s} style={{ flex: 1, height: 6, background: "#333", borderRadius: 2, overflow: "hidden" }}><div style={{ width: Math.max(0, Math.min(100, (bossHP - s * 33) / 33 * 100)) + "%", height: "100%", background: "#b87272", transition: "width .5s" }} /></div>)}
      </div>
      <div className="mn" style={{ fontSize: 20, color: bossT < 10 ? "#b87272" : "#d4d4dc", marginBottom: 14 }}>{bossT}s</div>
      <div style={{ maxWidth: 420, width: "100%", marginBottom: 10, background: "rgba(26,8,8,.4)", border: "1px solid rgba(184,114,114,.12)", borderRadius: 12, padding: 16 }}>
        <div className="hd" style={{ fontSize: 13, fontWeight: 600, textAlign: "center", lineHeight: 1.5, color: "#d4d4dc" }}>{bossQ.question}</div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 5, maxWidth: 420, width: "100%" }}>
        {bossQ.options.map((o, i) => {
          let bg = "rgba(26,8,8,.4)";
          let bd = "rgba(184,114,114,.12)";
          if (bossA && i === bossQ.correct) { bg = "rgba(122,172,138,.1)"; bd = "#7aac8a"; }
          return <button key={i} onClick={() => ansBoss(i)} disabled={!!bossA} style={{ padding: 9, background: bg, border: "1px solid " + bd, borderRadius: 8, color: "#d4d4dc", fontSize: 11, fontFamily: "'Outfit',sans-serif" }}>{o}</button>;
        })}
      </div>
    </div>
  );
}

function FogOv() {
  const { fogT, fogReason } = useContext(Ctx);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 900, background: "rgba(17,17,20,.96)", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", backdropFilter: "blur(8px)" }}>
      <div style={{ width: 80, height: 80, borderRadius: "50%", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.1)", animation: "breathe 4s infinite", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <div className="mn" style={{ fontSize: 20, color: "#7c9aaf" }}>{fogT}s</div>
      </div>
      <div className="hd" style={{ fontSize: 16, fontWeight: 600, marginBottom: 4, color: "#d4d4dc" }}>Take a Quick Break</div>
      <p style={{ color: "#9898a8", fontSize: 12, maxWidth: 320, textAlign: "center", lineHeight: 1.5, marginBottom: 8 }}>{fogReason}</p>
      <p style={{ color: "#6b6b7b", fontSize: 11 }}>Quiz resumes with easier questions.</p>
    </div>
  );
}

function ConfOv() {
  const cols = ["#7c9aaf", "#a78baf", "#c4956a", "#c9a96e", "#7aac8a"];
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1100, pointerEvents: "none" }}>
      {Array.from({ length: 35 }).map((_, i) => <div key={i} style={{ position: "absolute", left: Math.random() * 100 + "%", top: -10, width: 5 + Math.random() * 5, height: 5 + Math.random() * 5, background: cols[i % cols.length], borderRadius: Math.random() > 0.5 ? "50%" : "1px", animation: "confetti " + (2 + Math.random() * 2) + "s ease-in forwards", animationDelay: Math.random() * 0.5 + "s" }} />)}
      <div style={{ position: "absolute", top: "40%", left: "50%", transform: "translate(-50%,-50%)", textAlign: "center" }}>
        <div className="hd" style={{ fontSize: 22, fontWeight: 700, color: "#c9a96e" }}>🎉 Boss Defeated!</div>
        <div className="mn" style={{ fontSize: 13, color: "#c9a96e", marginTop: 4 }}>+50 XP</div>
      </div>
    </div>
  );
}

function BadgeOv({ b }) {
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1050, background: "rgba(17,17,20,.9)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center", animation: "fadeIn .4s" }}>
        <div style={{ fontSize: 46, marginBottom: 8 }}>{b.icon}</div>
        <div className="hd" style={{ fontSize: 16, fontWeight: 700, color: "#c9a96e" }}>{b.name}</div>
        <div style={{ fontSize: 10, color: "#9898a8", marginTop: 3 }}>Badge Unlocked!</div>
      </div>
    </div>
  );
}

function WhyOv() {
  const { whyCard, setWhyCard } = useContext(Ctx);
  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1200, background: "rgba(17,17,20,.85)", display: "flex", alignItems: "center", justifyContent: "center", backdropFilter: "blur(4px)" }} onClick={() => setWhyCard(null)}>
      <div className="cd fi" style={{ maxWidth: 360, width: "90%", padding: 20, borderColor: "rgba(124,154,175,.15)" }} onClick={e => e.stopPropagation()}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
          <span className="hd" style={{ fontSize: 12, fontWeight: 600, color: "var(--accent)" }}>Why this?</span>
          <button onClick={() => setWhyCard(null)} style={{ background: "none", border: "none", color: "var(--muted)", fontSize: 14 }}>×</button>
        </div>
        <div className="hd" style={{ fontSize: 13, fontWeight: 600, marginBottom: 5 }}>{whyCard.title}</div>
        <p style={{ fontSize: 11, color: "var(--text2)", lineHeight: 1.7, whiteSpace: "pre-line" }}>{whyCard.explanation}</p>
      </div>
    </div>
  );
}

function Toast({ msg }) {
  return (
    <div style={{ position: "fixed", top: 10, left: "50%", transform: "translateX(-50%)", zIndex: 1300, background: "var(--card)", border: "1px solid var(--border)", padding: "7px 14px", borderRadius: 8, boxShadow: "0 4px 20px rgba(0,0,0,.3)", animation: "fadeIn .3s" }}>
      <span style={{ fontSize: 11, color: "var(--accent)" }}>{msg}</span>
    </div>
  );
}