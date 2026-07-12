"use client";

import { useEffect, useMemo, useState } from "react";

type Level = "A1" | "A2" | "B1" | "B2" | "C1" | "C2";
type View = "home" | "masterclass" | "explorer" | "speak" | "sudoku" | Level;
type Verb = { phrase: string; meaning: string; example: string; level: Level; theme: string };

const LEVELS: Level[] = ["A1", "A2", "B1", "B2", "C1", "C2"];
const levelNames: Record<Level, string> = { A1: "Beginner", A2: "Elementary", B1: "Intermediate", B2: "Upper Intermediate", C1: "Advanced", C2: "Proficient" };
const levelIcons: Record<Level, string> = { A1: "🧩", A2: "⏱️", B1: "🕹️", B2: "❤️", C1: "⚡", C2: "🧠" };

const raw: Record<Level, string[][]> = {
  A1: [
    ["get up","leave your bed","I get up at seven every morning.","Daily life"],["sit down","move into a seated position","Please sit down beside me.","Actions"],["stand up","rise to your feet","Everyone stood up when the teacher entered.","Actions"],["wake up","stop sleeping","I wake up when my alarm rings.","Daily life"],["turn on","start a device","Turn on the light, please.","Home"],["turn off","stop a device","Turn off the television before bed.","Home"],["put on","dress yourself in something","She put on her blue jacket.","Clothes"],["take off","remove clothing","Take off your shoes at the door.","Clothes"],["come in","enter a place","Come in and have a seat.","Movement"],["go out","leave home for an activity","We go out on Friday evenings.","Social life"],["pick up","lift something","Pick up the pencil from the floor.","Actions"],["look at","direct your eyes towards something","Look at the picture on page five.","Learning"],["listen to","pay attention to a sound","Listen to the instructions carefully.","Learning"],["wait for","stay until someone or something arrives","I am waiting for the bus.","Travel"],["look for","try to find","She is looking for her keys.","Daily life"],["come back","return","Please come back before dinner.","Movement"],["go back","return to a place","We went back to the classroom.","Movement"],["write down","record in writing","Write down your new vocabulary.","Learning"],["clean up","make a place tidy","Let us clean up the kitchen.","Home"],["hurry up","do something more quickly","Hurry up or we will miss the bus.","Time"]
  ],
  A2: [
    ["find out","discover information","I found out when the shop closes.","Information"],["give back","return something","Please give back the book tomorrow.","Daily life"],["call back","telephone someone again","I will call you back after class.","Communication"],["fill in","complete a form","Fill in your name and address.","Work"],["try on","test clothes before buying","She tried on three dresses.","Shopping"],["throw away","put something in the rubbish","Do not throw away that receipt.","Home"],["look after","take care of","He looks after his younger brother.","Family"],["grow up","become an adult","She grew up in Kota Bharu.","Life"],["run out of","use all of something","We ran out of milk this morning.","Home"],["get on","enter a bus, train, or plane","We got on the train at noon.","Travel"],["get off","leave a bus, train, or plane","Get off at the next station.","Travel"],["put away","return something to its place","Put away your books after studying.","Home"],["take out","remove something from a place","He took out his phone.","Actions"],["slow down","reduce speed","Slow down near the school.","Travel"],["work out","exercise","I work out twice a week.","Health"],["hang out","spend relaxed time together","We hang out at the café.","Friends"],["check in","register on arrival","We checked in at the hotel.","Travel"],["check out","leave a hotel after paying","Guests must check out by noon.","Travel"],["eat out","eat at a restaurant","My family eats out on Sundays.","Food"],["move in","begin living in a new home","Our neighbours moved in yesterday.","Home"]
  ],
  B1: [
    ["bring up","introduce a topic","She brought up an interesting question.","Communication"],["carry on","continue","Carry on working while I answer the phone.","Work"],["deal with","handle a problem","We need to deal with this complaint.","Work"],["give up","stop trying","Do not give up after one mistake.","Motivation"],["set up","arrange or establish","They set up a new study group.","Work"],["take up","begin a hobby or activity","He took up photography last year.","Leisure"],["get along","have a friendly relationship","I get along well with my classmates.","Relationships"],["look forward to","feel excited about the future","We look forward to meeting you.","Feelings"],["put off","delay","They put off the match because of rain.","Time"],["turn down","refuse an offer","She turned down the job offer.","Decisions"],["work out","find a solution","We worked out the answer together.","Problems"],["come across","find by chance","I came across an old photograph.","Discovery"],["get over","recover from","He got over the flu quickly.","Health"],["point out","draw attention to","The teacher pointed out my error.","Communication"],["take after","resemble a relative","Mina takes after her mother.","Family"],["break down","stop functioning","Our car broke down on the highway.","Problems"],["show up","arrive or appear","Only ten people showed up.","Events"],["sort out","resolve or organise","We sorted out the booking problem.","Problems"],["calm down","become less upset","Take a breath and calm down.","Feelings"],["catch up","reach the same progress","I studied all weekend to catch up.","Learning"]
  ],
  B2: [
    ["back up","support or make a copy","Back up your claim with evidence.","Academic"],["break up","end a relationship or group","The band broke up after ten years.","Relationships"],["bring about","cause something","The policy brought about major changes.","Change"],["come up with","produce an idea","Our team came up with a solution.","Ideas"],["cut down on","reduce consumption","I am cutting down on sugar.","Health"],["get away with","escape punishment","He cannot get away with cheating.","Rules"],["go through","experience or examine","She went through a difficult period.","Life"],["keep up with","stay at the same pace","It is hard to keep up with the news.","Progress"],["look down on","consider someone inferior","Never look down on other people.","Relationships"],["make up for","compensate for","I worked late to make up for lost time.","Work"],["put up with","tolerate","I cannot put up with the noise.","Feelings"],["rule out","eliminate a possibility","The doctor ruled out an infection.","Decisions"],["stand out","be noticeably different","Her creative answer stood out.","Achievement"],["take over","gain control","A new manager took over the department.","Work"],["turn out","have a particular result","The event turned out better than expected.","Results"],["call off","cancel","They called off the outdoor concert.","Events"],["fall behind","fail to keep pace","Ask for help before you fall behind.","Learning"],["follow up","take further action","I will follow up with an email.","Communication"],["leave out","omit","Do not leave out any important details.","Communication"],["settle down","begin a stable life or become calm","They settled down near the coast.","Life"]
  ],
  C1: [
    ["boil down to","have as the main point","The debate boils down to trust.","Ideas"],["brush up on","improve an old skill","I need to brush up on my French.","Learning"],["clamp down on","take strong action against","The council clamped down on illegal parking.","Society"],["crack down on","enforce rules more strictly","Authorities cracked down on online fraud.","Society"],["dwell on","think about for too long","Try not to dwell on past mistakes.","Feelings"],["phase out","gradually stop using","The company is phasing out plastic packaging.","Change"],["play down","make something seem less important","The report played down the risks.","Communication"],["single out","choose one person for attention","She was singled out for praise.","Achievement"],["spell out","explain very clearly","The contract spells out your duties.","Communication"],["step down","leave an important position","The chairperson stepped down in May.","Work"],["step up","increase effort or activity","We must step up our response.","Action"],["take on","accept work or responsibility","She took on a demanding project.","Work"],["touch on","mention briefly","The lecture touched on language policy.","Academic"],["weigh up","consider options carefully","We weighed up the advantages and risks.","Decisions"],["zero in on","focus closely on","The study zeroed in on student motivation.","Academic"],["come down to","depend mainly on","Success comes down to consistent practice.","Ideas"],["iron out","resolve small difficulties","We met to iron out the final details.","Problems"],["map out","plan in detail","They mapped out a five-year strategy.","Planning"],["narrow down","reduce the number of options","We narrowed down the candidates to three.","Decisions"],["opt out of","choose not to participate","Students may opt out of the survey.","Choice"]
  ],
  C2: [
    ["bear out","confirm with evidence","The latest figures bear out her prediction.","Evidence"],["crop up","appear unexpectedly","Technical issues cropped up overnight.","Problems"],["ferret out","discover after careful searching","Journalists ferreted out the hidden facts.","Discovery"],["flesh out","add detail to an idea","We need to flesh out the proposal.","Ideas"],["gloss over","avoid discussing an unpleasant detail","The statement glossed over the failures.","Communication"],["hammer out","reach agreement through discussion","The two sides hammered out a compromise.","Negotiation"],["home in on","move attention towards a target","Researchers homed in on the main cause.","Academic"],["mull over","consider carefully for some time","I need to mull over your suggestion.","Decisions"],["pan out","develop successfully","The investment did not pan out.","Results"],["paper over","hide a disagreement temporarily","A bonus cannot paper over deeper problems.","Problems"],["pare down","reduce carefully","The editor pared down the final chapter.","Writing"],["root out","find and remove completely","The audit aims to root out corruption.","Society"],["shrug off","dismiss or recover easily","She shrugged off the criticism.","Feelings"],["stave off","prevent temporarily","The loan helped stave off bankruptcy.","Problems"],["tease out","discover gradually through analysis","The interview teased out subtle differences.","Academic"],["weed out","remove unwanted elements","The test weeds out unreliable entries.","Selection"],["win over","persuade someone to support you","Her honesty won over the audience.","Persuasion"],["write off","dismiss as worthless or unlikely","Do not write him off too quickly.","Judgement"],["drum up","generate support or business","They launched a campaign to drum up interest.","Promotion"],["live down","make people forget an embarrassing act","He never lived down that famous mistake.","Reputation"]
  ]
};

const verbs: Verb[] = LEVELS.flatMap(level => raw[level].map(([phrase, meaning, example, theme]) => ({ phrase, meaning, example, theme, level })));

const gameTitles: Record<Level, string> = { A1: "Picture Match", A2: "Time Bomb", B1: "Wheel of Fortune", B2: "Real or Wrong", C1: "Speed Sort", C2: "Phrasal Hangman" };

const pictureClues: Record<string, { scene: string; caption: string }> = {
  "get up": { scene: "🛏️ ➜ 🧍", caption: "Morning movement" },
  "sit down": { scene: "🧍 ➜ 🪑", caption: "Take a seat" },
  "stand up": { scene: "🪑 ➜ 🧍", caption: "Rise to your feet" },
  "wake up": { scene: "😴 ⏰ 😳", caption: "The alarm rings" },
  "turn on": { scene: "👉 🔘 ➜ 💡", caption: "Make it work" },
  "turn off": { scene: "👉 🔘 ➜ 🌑", caption: "Stop the power" },
  "put on": { scene: "👕 ➜ 🧍", caption: "Getting dressed" },
  "take off": { scene: "🧍 ➜ 👟", caption: "Remove something worn" },
  "come in": { scene: "🚪 👋 ➡️", caption: "Enter through the door" },
  "go out": { scene: "🏠 ➡️ 🌆", caption: "Leave for an activity" },
  "pick up": { scene: "✋ ⬆️ ✏️", caption: "Lift it from below" },
  "look at": { scene: "👀 ➡️ 🖼️", caption: "Direct your eyes" },
  "listen to": { scene: "👂 ➡️ 🎵", caption: "Pay attention to sound" },
  "wait for": { scene: "🧍 ⏳ 🚌", caption: "Stay until it arrives" },
  "look for": { scene: "🔎 🔑 ❓", caption: "Try to find it" },
  "come back": { scene: "🚶 ↩️ 🏠", caption: "Return here" },
  "go back": { scene: "🏫 ↩️ 🚶", caption: "Return there" },
  "write down": { scene: "💭 ➜ ✍️ 📓", caption: "Put it on paper" },
  "clean up": { scene: "🧹 ✨ 🏠", caption: "Make the place tidy" },
  "hurry up": { scene: "⏰ 🏃 💨", caption: "Move more quickly" },
};

function shuffle<T>(items: T[]) { return [...items].sort(() => Math.random() - .5); }
function clueLetters(phrase: string) { return shuffle([...new Set(phrase.replaceAll(" ", "").split(""))]).slice(0,2); }

function playGameSound(kind: "tick" | "correct" | "wrong" | "explode" | "death" | "spin") {
  const AudioCtx = window.AudioContext || (window as typeof window & { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!AudioCtx) return;
  const ctx = new AudioCtx();
  const tone = (frequency: number, start: number, duration: number, type: OscillatorType = "sine", volume = .12) => {
    const oscillator = ctx.createOscillator(); const gain = ctx.createGain();
    oscillator.type = type; oscillator.frequency.setValueAtTime(frequency, ctx.currentTime + start);
    gain.gain.setValueAtTime(volume, ctx.currentTime + start); gain.gain.exponentialRampToValueAtTime(.001, ctx.currentTime + start + duration);
    oscillator.connect(gain).connect(ctx.destination); oscillator.start(ctx.currentTime + start); oscillator.stop(ctx.currentTime + start + duration);
  };
  if (kind === "tick") tone(850, 0, .06, "square", .035);
  if (kind === "correct") { tone(523, 0, .13); tone(659, .12, .13); tone(784, .24, .22); }
  if (kind === "wrong") { tone(220, 0, .18, "sawtooth", .08); tone(150, .13, .3, "sawtooth", .08); }
  if (kind === "explode") { tone(100, 0, .55, "sawtooth", .16); tone(55, .06, .7, "square", .13); }
  if (kind === "death") { tone(330, 0, .18, "triangle", .1); tone(247, .17, .2, "triangle", .1); tone(165, .35, .45, "sawtooth", .11); }
  if (kind === "spin") { for(let i=0;i<9;i++) tone(300+i*45, i*.07, .055, "square", .025); }
  window.setTimeout(() => ctx.close(), 1200);
}

export default function Home() {
  const [view, setView] = useState<View>("home");
  const [progress, setProgress] = useState<Record<string, number>>({});
  useEffect(() => { const saved = localStorage.getItem("pv-progress"); if (saved) setProgress(JSON.parse(saved)); }, []);
  const go = (next: View) => { setView(next); window.scrollTo({ top: 0, behavior: "smooth" }); };
  const saveScore = (level: Level, score: number) => { const next = { ...progress, [level]: Math.max(score, progress[level] || 0) }; setProgress(next); localStorage.setItem("pv-progress", JSON.stringify(next)); };
  return <main>
    {view !== "home" && <button className="floating-home" onClick={() => go("home")}>← Hub</button>}
    {view === "home" && <Hub go={go} progress={progress} />}
    {view === "masterclass" && <Masterclass />}
    {view === "explorer" && <Explorer />}
    {view === "speak" && <SpeakingCoach />}
    {view === "sudoku" && <Sudoku />}
    {LEVELS.includes(view as Level) && <Game level={view as Level} onComplete={saveScore} />}
  </main>;
}

function Hub({ go, progress }: { go: (v: View) => void; progress: Record<string, number> }) {
  const featureCards: { view: View; icon: string; eyebrow: string; title: string; text: string; cta: string }[] = [
    { view:"masterclass",icon:"🎥",eyebrow:"Masterclass",title:"Phrasal Verb Academy",text:"Build strong foundations in 6 bite-sized lessons.",cta:"Start learning" },
    { view:"explorer",icon:"📚",eyebrow:"Reference",title:"Phrasal Verb Explorer",text:"Search 120 verbs by level, theme, meaning and context.",cta:"Explore all" },
    { view:"speak",icon:"🎙️",eyebrow:"Speaking Lab",title:"Pronunciation Coach",text:"Say a sentence and receive instant on-device feedback.",cta:"Try speaking" }
  ];
  return <>
    <header className="hero">
      <nav><div className="brand"><span>PV</span> Phrasal Lab</div><div className="nav-note">Learn · Play · Master</div></nav>
      <div className="hero-copy"><p className="kicker">A complete CEFR learning journey</p><h1>Make phrasal verbs<br/><em>click.</em></h1><p>Master 120 essential phrasal verbs through clear lessons, useful examples and fast-paced games—from A1 to C2.</p><button onClick={() => document.getElementById("levels")?.scrollIntoView({behavior:"smooth"})}>Choose your level ↓</button></div>
      <div className="orbit-card one"><strong>turn</strong><span>on · off · down · out</span></div><div className="orbit-card two"><strong>get</strong><span>up · over · along · away</span></div><div className="orbit-card three"><strong>take</strong><span>off · on · over · after</span></div>
    </header>
    <section className="quick-grid">{featureCards.map(c => <article className="feature-card" key={c.view}><div className="big-icon">{c.icon}</div><small>{c.eyebrow}</small><h2>{c.title}</h2><p>{c.text}</p><button onClick={() => go(c.view)}>{c.cta} →</button></article>)}</section>
    <section id="levels" className="levels-section"><div className="section-heading"><p className="kicker">Your path to fluency</p><h2>Choose your challenge</h2><p>Each level develops a different phrasal-verb skill. Your best score is saved on this device.</p></div>
      <div className="level-grid">{LEVELS.map((l,i)=><article className={`level-card l${i+1}`} key={l}><div className="level-top"><span>{levelIcons[l]}</span><b>{l}</b></div><small>Level {i+1} · {levelNames[l]}</small><h3>{gameTitles[l]}</h3><p>{["Match everyday verbs to their meanings.","Beat the clock and choose the right definition.","Spin the wheel and solve intermediate meanings.","Spot natural phrasal verbs in authentic sentences.","Sort scrambled phrases before the heat reaches red.","Reveal advanced phrasal verbs before the hangman falls."][i]}</p><div className="score-row"><span>{progress[l] !== undefined ? `Best: ${progress[l]}/20` : "Not played yet"}</span><button aria-label={`Play ${l} ${gameTitles[l]}`} onClick={()=>go(l)}>Play →</button></div></article>)}</div>
    </section>
    <section className="sudoku-banner"><div><p className="kicker">Bonus challenge</p><h2>Word Play Sudoku</h2><p>Solve mini logic grids using verb particles instead of numbers.</p></div><button onClick={()=>go("sudoku")}>Open Sudoku →</button></section>
    <footer><div className="brand"><span>PV</span> Phrasal Lab</div><p>Designed for curious English learners · CEFR A1–C2</p><p>Learn a little. Practise often. Use it confidently.</p></footer>
  </>;
}

function Masterclass() {
  const lessons = [
    ["01","What is a phrasal verb?","Learn how a verb and particle work together to create a new meaning.","Verb + particle = one powerful idea"],
    ["02","Literal or idiomatic?","See why sit down is transparent, while give up needs to be learned as a unit.","Meaning lives in the whole phrase"],
    ["03","Separable verbs","Discover when an object can sit between the verb and particle.","Turn the light off · Turn it off"],
    ["04","Inseparable verbs","Learn which combinations must stay together in every sentence.","Look after someone · not look someone after"],
    ["05","Grammar & register","Choose the right tense, pronoun placement and level of formality.","Find out ↔ discover"],
    ["06","Remember and use","Group by theme, notice particles and retrieve phrases in real contexts.","Notice · connect · retrieve · repeat"]
  ];
  const [open,setOpen]=useState(0);
  return <PageShell eyebrow="6 bite-sized lessons" title="Phrasal Verb Academy" intro="Understand the system behind phrasal verbs before you play."><div className="lesson-layout"><div className="lesson-list">{lessons.map((l,i)=><button className={open===i?"active":""} onClick={()=>setOpen(i)} key={l[0]}><b>{l[0]}</b><span>{l[1]}</span></button>)}</div><article className="lesson-stage"><div className="lesson-number">LESSON {lessons[open][0]}</div><h2>{lessons[open][1]}</h2><p>{lessons[open][2]}</p><div className="chalk">{lessons[open][3]}</div><ul>{["Read the example aloud.","Create one personal example.","Return tomorrow and retrieve it from memory."].map(x=><li key={x}>{x}</li>)}</ul><button onClick={()=>setOpen((open+1)%6)}>Next lesson →</button></article></div></PageShell>;
}

function Explorer(){
  const [level,setLevel]=useState<"All"|Level>("All"); const [query,setQuery]=useState("");
  const filtered=verbs.filter(v=>(level==="All"||v.level===level)&&`${v.phrase} ${v.meaning} ${v.theme}`.toLowerCase().includes(query.toLowerCase()));
  return <PageShell eyebrow="120 useful expressions" title="Phrasal Verb Explorer" intro="Search by verb, meaning or theme. Every entry includes a natural example."><div className="explorer-tools"><input aria-label="Search phrasal verbs" value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search: travel, give up, discover…"/><div>{(["All",...LEVELS] as const).map(l=><button className={level===l?"active":""} onClick={()=>setLevel(l)} key={l}>{l}{l!=="All"&&` · ${levelNames[l]}`}</button>)}</div></div><p className="result-count">Showing {filtered.length} phrasal verbs</p><div className="verb-grid">{filtered.map(v=><article key={`${v.level}-${v.phrase}`}><div><span className={`pill ${v.level}`}>{v.level}</span><small>{v.theme}</small></div><h3>{v.phrase}</h3><p>{v.meaning}</p><blockquote>“{v.example}”</blockquote></article>)}</div></PageShell>;
}

function SpeakingCoach(){
  const [level,setLevel]=useState<Level>("A1"); const list=verbs.filter(v=>v.level===level); const [index,setIndex]=useState(0); const [heard,setHeard]=useState(""); const [status,setStatus]=useState("Ready when you are.");
  const target=list[index%list.length];
  const listen=()=>{ const W=(window as unknown as {webkitSpeechRecognition?: new()=>any; SpeechRecognition?:new()=>any}).SpeechRecognition || (window as unknown as {webkitSpeechRecognition?:new()=>any}).webkitSpeechRecognition; if(!W){setStatus("Speech recognition is not supported in this browser. You can still practise with the prompt.");return;} const r=new W();r.lang="en-GB";r.interimResults=false;r.onstart=()=>setStatus("Listening… say one complete sentence.");r.onresult=(e:any)=>{const text=e.results[0][0].transcript;setHeard(text);setStatus(text.toLowerCase().includes(target.phrase)?"Excellent—the target phrasal verb was recognised in context.":"Good attempt. Try again and include the complete target phrase.");};r.onerror=()=>setStatus("I couldn't hear that clearly. Please try again.");r.start(); };
  return <PageShell eyebrow="On-device speaking practice" title="Pronunciation Coach" intro="Use a target phrasal verb in a full sentence. Your audio stays in the browser and is not uploaded by this app."><div className="coach"><div className="coach-controls"><label>CEFR level<select value={level} onChange={e=>{setLevel(e.target.value as Level);setIndex(0);setHeard("")}}>{LEVELS.map(l=><option key={l}>{l}</option>)}</select></label><label>Target phrase<select value={index} onChange={e=>setIndex(+e.target.value)}>{list.map((v,i)=><option value={i} key={v.phrase}>{v.phrase}</option>)}</select></label></div><div className="target"><span>YOUR TARGET</span><h2>{target.phrase}</h2><p>{target.meaning}</p><blockquote>{target.example}</blockquote></div><button className="mic" onClick={listen}>🎙️ Start speaking</button><div className="feedback"><strong>{status}</strong>{heard&&<p>“{heard}”</p>}</div><button className="secondary" onClick={()=>{setIndex((index+1)%list.length);setHeard("");setStatus("Ready when you are.")}}>New prompt →</button></div></PageShell>;
}

function Game({level,onComplete}:{level:Level;onComplete:(l:Level,s:number)=>void}){
  const bank=useMemo(()=>shuffle(verbs.filter(v=>v.level===level)).slice(0,20),[level]);
  const [q,setQ]=useState(0); const [score,setScore]=useState(0); const [chosen,setChosen]=useState<string|null>(null); const [built,setBuilt]=useState<string[]>([]); const [finished,setFinished]=useState(false); const target=bank[q];
  const startTime=level==="C2"?25:10;
  const [timeLeft,setTimeLeft]=useState(startTime); const [exploded,setExploded]=useState(false); const [hanged,setHanged]=useState(false);
  const [guessed,setGuessed]=useState<string[]>(()=>level==="C2"?clueLetters(target.phrase):[]); const [wrongLetters,setWrongLetters]=useState(0); const [wheelReady,setWheelReady]=useState(false); const [spinning,setSpinning]=useState(false);
  const choices=useMemo(()=>shuffle([target,...shuffle(verbs.filter(v=>v.level===level&&v.phrase!==target.phrase)).slice(0,3)]),[target,level]);
  const answer=(correct:boolean)=>{if(chosen!==null)return;setChosen(correct?"correct":"wrong");playGameSound(correct?"correct":"wrong");if(correct)setScore(s=>s+1)};
  useEffect(()=>{
    if(!["A2","C1","C2"].includes(level)||chosen!==null||finished)return;
    const timer=window.setInterval(()=>setTimeLeft(current=>{const next=current-1;if(next>0){playGameSound("tick");return next}window.clearInterval(timer);setChosen("wrong");if(level==="A2"){setExploded(true);playGameSound("explode")}else if(level==="C2"){setHanged(true);playGameSound("death")}else{playGameSound("wrong")}return 0}),1000);
    return()=>window.clearInterval(timer);
  },[level,q,chosen,finished]);
  const guessLetter=(letter:string)=>{if(chosen||guessed.includes(letter))return;const next=[...guessed,letter];setGuessed(next);if(target.phrase.includes(letter)){playGameSound("correct");const solved=[...target.phrase].every(c=>c===" "||next.includes(c));if(solved){setChosen("correct");setScore(s=>s+1)}}else{setWrongLetters(w=>w+1);playGameSound("wrong")}};
  const spinWheel=()=>{if(spinning||wheelReady)return;setSpinning(true);playGameSound("spin");window.setTimeout(()=>{setSpinning(false);setWheelReady(true)},1400)};
  const next=()=>{if(q===19){onComplete(level,score);setFinished(true)}else{const nextQ=q+1;setQ(nextQ);setChosen(null);setBuilt([]);setTimeLeft(startTime);setExploded(false);setHanged(false);setGuessed(level==="C2"?clueLetters(bank[nextQ].phrase):[]);setWrongLetters(0);setWheelReady(false);setSpinning(false)}};
  if(finished)return <PageShell eyebrow={`${level} complete`} title="Challenge finished" intro="Retrieval practice works best when you return after a short break."><div className="finish-card"><div>{score}<small>/20</small></div><h2>{score>=16?"Outstanding control!":score>=11?"Strong progress!":"A useful first round!"}</h2><p>Your best result has been saved on this device.</p><button onClick={()=>location.reload()}>Return to hub</button></div></PageShell>;
  const particles=shuffle(target.phrase.split(" "));
  const alphabet="abcdefghijklmnopqrstuvwxyz".split("");
  return <PageShell eyebrow={`${level} · ${levelNames[level]} · Question ${q+1} of 20`} title={`${levelIcons[level]} ${gameTitles[level]}`} intro={`Score ${score} / 20`}>
    <div className="progress"><span style={{width:`${(q+1)*5}%`}}/></div><article className="game-stage">
      {level==="A1"&&<div className="picture-clue" role="img" aria-label={pictureClues[target.phrase]?.caption||target.meaning}><div>{pictureClues[target.phrase]?.scene||"🖼️ ❓"}</div><span>{pictureClues[target.phrase]?.caption||"Match the picture"}</span></div>}
      {level==="A2"&&<div className={`bomb-zone ${timeLeft<=5?"danger":""} ${exploded?"exploded":""}`}><div className="countdown">{timeLeft}</div><div className="bomb"><span className="spark">✦</span><span className="fuse"/><span className="bomb-body">💣</span></div><p>{exploded?"BOOM! Time ran out.":timeLeft<=5?"Quick—the fuse is nearly gone!":"Choose before the bomb explodes."}</p></div>}
      {(level==="A1"||level==="A2")&&<><p className="question-label">{level==="A1"?"Which phrasal verb matches the picture?":"Choose the phrasal verb that means:"}</p>{level!=="A1"&&<h2>{target.meaning}</h2>}<div className="answers">{choices.map(v=><button disabled={chosen!==null} className={chosen&&v===target?(chosen==="correct"?"correct":"reveal"):""} onClick={()=>answer(v.phrase===target.phrase)} key={v.phrase}>{v.phrase}</button>)}</div></>}
      {level==="C2"&&<div className={`hangman-game ${timeLeft<=5?"danger":""} ${hanged?"dead":""}`}><div className="hangman-top"><div className="hang-timer">{timeLeft}</div><div className="gallows"><span className="beam"/><span className="rope"/><div className="person"><i className="head">{hanged?"× ×":"• •"}</i><i className="body"/><i className="arm left"/><i className="arm right"/><i className="leg left"/><i className="leg right"/></div></div></div><p className="question-label">Guess the phrasal verb: {target.meaning}</p><div className="hang-word">{[...target.phrase].map((c,i)=><span className={c===" "?"space":""} key={i}>{c===" "?" ":guessed.includes(c)||chosen?c:"_"}</span>)}</div><div className="wrong-meter">Two clue letters are already revealed · Wrong letters: {wrongLetters}</div><div className="keyboard">{alphabet.map(l=><button disabled={!!chosen||guessed.includes(l)} onClick={()=>guessLetter(l)} key={l}>{l}</button>)}</div></div>}
      {level==="B2"&&<><p className="question-label">Is the highlighted phrase used naturally?</p><blockquote className="context">{q%2===0?target.example:target.example.replace(target.phrase.split(" ")[1]||"", "about")}</blockquote><div className="answers two"><button onClick={()=>answer(q%2===0)}>Natural ✓</button><button onClick={()=>answer(q%2!==0)}>Not natural ✕</button></div></>}
      {level==="C1"&&<div className={`speed-game heat-${timeLeft}`}><div className="speed-clock">{timeLeft}</div><div className="thermometer"><span style={{height:`${(11-timeLeft)*10}%`}}/></div><p className="heat-label">{timeLeft>6?"Warming up":timeLeft>3?"Getting hot!":"RED HOT!"}</p><p className="question-label">Arrange the words: {target.meaning}</p><div className="built">{built.length?built.join(" "):"Build your answer—fast!"}</div><div className="word-bank">{particles.map((w,i)=><button disabled={!!chosen} key={`${w}-${i}`} onClick={()=>setBuilt(x=>[...x,w])}>{w}</button>)}</div><button className="check" disabled={!!chosen} onClick={()=>answer(built.join(" ")===target.phrase)}>Lock it in</button></div>}
      {level==="B1"&&<div className="wheel-game"><div className="wheel-pointer">▼</div><div className={`fortune-wheel ${spinning?"spinning":""}`}><span>MEANING</span><span>CONTEXT</span><span>PRECISION</span><span>FORTUNE</span></div>{!wheelReady?<><p>Spin to unlock your B1 challenge.</p><button className="spin-button" onClick={spinWheel} disabled={spinning}>{spinning?"Spinning…":"Spin the wheel"}</button></>:<><p className="question-label">The wheel chose: precise meaning</p><h2>{target.meaning}</h2><div className="answers">{choices.map(v=><button disabled={!!chosen} className={chosen&&v===target?(chosen==="correct"?"correct":"reveal"):""} onClick={()=>answer(v.phrase===target.phrase)} key={v.phrase}>{v.phrase}</button>)}</div></>}</div>}
      {chosen&&<div className={`game-feedback ${chosen}`}><strong>{chosen==="correct"?"Correct!":"Not quite."}</strong><p><b>{target.phrase}</b> — {target.meaning}</p><blockquote>{target.example}</blockquote><button onClick={next}>{q===19?"See results":"Next question →"}</button></div>}
    </article></PageShell>;
}

function Sudoku(){
  const words=["up","out","on","off"]; const solution=[["up","out","on","off"],["on","off","up","out"],["out","up","off","on"],["off","on","out","up"]]; const givens=new Set(["0-0","0-3","1-1","2-2","3-0","3-3"]); const [cells,setCells]=useState<Record<string,string>>({}); const [message,setMessage]=useState("Fill each row, column and 2×2 box with every particle once.");
  const check=()=>{const ok=solution.every((row,r)=>row.every((v,c)=>givens.has(`${r}-${c}`)||cells[`${r}-${c}`]===v));setMessage(ok?"Solved! Your particle logic is sharp. 🎉":"Some particles are misplaced. Check each row and column.")};
  return <PageShell eyebrow="Bonus logic game" title="Word Play Sudoku" intro="Numbers become particles. Logic stays the same."><div className="sudoku-wrap"><div className="sudoku-grid">{solution.flatMap((row,r)=>row.map((v,c)=>{const key=`${r}-${c}`;return givens.has(key)?<div className="given" key={key}>{v}</div>:<select aria-label={`Row ${r+1} column ${c+1}`} key={key} value={cells[key]||""} onChange={e=>setCells({...cells,[key]:e.target.value})}><option value="">·</option>{words.map(w=><option key={w}>{w}</option>)}</select>}))}</div><p>{message}</p><button className="check" onClick={check}>Check puzzle</button><div className="sudoku-help"><h3>Why particles?</h3><p>Small words such as <b>up</b>, <b>out</b>, <b>on</b> and <b>off</b> can completely transform a verb’s meaning. This puzzle trains you to notice them.</p></div></div></PageShell>;
}

function PageShell({eyebrow,title,intro,children}:{eyebrow:string;title:string;intro:string;children:React.ReactNode}){return <><header className="page-head"><p className="kicker">{eyebrow}</p><h1>{title}</h1><p>{intro}</p></header><section className="page-body">{children}</section></>}
