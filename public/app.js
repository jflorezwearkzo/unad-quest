/* UNAD Quest — malla gamificada, agenda y cuadernos con sincronización D1 */
"use strict";

/* ======================= DATOS DE LA MALLA ======================= */
const LINES = {
  mate:{n:"Matemáticas",c:"var(--mate)"}, prog:{n:"Programación",c:"var(--prog)"}, ing:{n:"Ingeniería",c:"var(--ing)"},
  datos:{n:"Datos",c:"var(--datos)"}, ia:{n:"IA / ML",c:"var(--ia)"}, nube:{n:"Nube / MLOps",c:"var(--nube)"},
  gen:{n:"Formación general",c:"var(--gen)"}, elec:{n:"Electivos",c:"var(--elec)"}, ingl:{n:"Inglés",c:"var(--ingl)"}
};
const C = [
 ["ingA1","Inglés A1","900001",3,"ingl",[]],["ingA2","Inglés A2","900002",3,"ingl",["ingA1"]],
 ["ingB1","Inglés B1","900003",3,"ingl",["ingA2"]],["ingB1p","Inglés B1+","900004",3,"ingl",["ingB1"]],
 ["intro","Introducción a la Ingeniería","212014",2,"ing",[]],
 ["fprog","Fundamentos de Programación","213022",3,"prog",[]],
 ["plm","Pensamiento Lógico y Matemático","200611",3,"mate",[]],
 ["hdig","Herramientas Digitales para la Gestión del Conocimiento","200610",3,"gen",[]],
 ["catedra","Cátedra Unadista","80017",3,"gen",[]],
 ["comun","Competencias Comunicativas","40003",3,"gen",[]],
 ["etica","Ética y Ciudadanía","40002",3,"gen",[]],
 ["fc2","Electivo Formación Complementaria II","*",1,"elec",[]],
 ["gint","Fundamentos en Gestión Integral","112001",3,"gen",[]],
 ["ibcS","Electivo IBC · Social Solidario","*",3,"elec",[]],
 ["ibcE","Electivo IBC · Económico Administrativo","*",3,"elec",[]],
 ["cdif","Cálculo Diferencial","100410",3,"mate",["plm"]],
 ["prog","Programación","213023",3,"prog",["fprog"]],
 ["disc","Matemáticas Discretas","204041",3,"mate",["plm"]],
 ["alg","Álgebra Lineal","208046",3,"mate",["plm"]],
 ["estp","Estadística y Probabilidad","211622",3,"mate",["plm"]],
 ["finv","Fundamentos y Generalidades de Investigación","150001",3,"ing",["intro"]],
 ["proy1","Proyecto de Ingeniería I","212020",3,"ing",["intro"]],
 ["cint","Cálculo Integral","100411",3,"mate",["cdif"]],
 ["edat","Estructura de Datos","301305",3,"prog",["prog"]],
 ["bd","Bases de Datos","202016896",3,"datos",["prog"]],
 ["opt","Optimización y Métodos Computacionales","203719309",3,"ia",["plm","alg"]],
 ["esti","Estadística Inferencial","203719805",3,"mate",["estp"]],
 ["fis","Física General","100413",3,"mate",["cdif"]],
 ["proy2","Proyecto de Ingeniería II","212027",3,"ing",["proy1"]],
 ["dc1","Electivo Disciplinar Común I","*",3,"elec",[]],
 ["dc2","Electivo Disciplinar Común II","*",3,"elec",[]],
 ["dc3","Electivo Disciplinar Común III","*",3,"elec",[]],
 ["aa","Aprendizaje Automático","203719806",4,"ia",["opt"]],
 ["pln","Procesamiento de Lenguaje Natural","203719807",3,"ia",["opt"]],
 ["nosql","NoSQL Databases","203719809",3,"datos",["bd"]],
 ["etl","Extracción, Transformación y Carga (ETL)","203719808",3,"datos",["bd"]],
 ["cloud","Cloud Computing","203719813",3,"nube",[]],
 ["min","Minería de Datos","203719812",3,"datos",["bd"]],
 ["gob","Gobernanza, Seguridad y Ética en IA","203719810",2,"ia",[]],
 ["ap","Aprendizaje Profundo","203719811",3,"ia",["aa"]],
 ["big","Big Data","202016911",3,"datos",["bd"]],
 ["semlo","Software Engineering for ML Operations","203719815",2,"nube",["intro","cloud"]],
 ["vis","Visión Computacional","203719814",3,"ia",["aa"]],
 ["mlops","Gestión y despliegue de modelos con MLOps","203719816",3,"nube",["cloud"]],
 ["de1","Electivo Disciplinar Específico I","*",3,"elec",["opt"]],
 ["de2","Electivo Disciplinar Específico II","*",3,"elec",["opt"]],
 ["viz","Visualización en Ciencia de Datos","203719817",3,"datos",["bd"]],
 ["de3","Electivo Disciplinar Específico III","*",3,"elec",["de1"]],
 ["de4","Electivo Disciplinar Específico IV","*",3,"elec",["de1"]],
 ["proy3","Proyecto de Ingeniería III","203719818",3,"ing",["proy2","cloud"]],
 ["prac","Práctica Profesional","212034",2,"ing",["proy2"]],
 ["fc1","Electivo Formación Complementaria I","*",2,"elec",[]]
];
const PERIODS = [
 {id:"H",  n:"Homologación", d:"Antes de iniciar", items:["ingA1","ingA2","ingB1","ingB1p"], homolog:true},
 {id:"P1", n:"16-01 · 2027", d:"feb → jun 2027", s:"2027-02-03", e:"2027-06-08", items:["intro","fprog","plm","hdig","catedra","comun","etica","fc2"]},
 {id:"I1", n:"8-03 · 2027",  d:"jun → ago 2027", s:"2027-06-08", e:"2027-08-16", inten:true, items:["gint","ibcS","ibcE"]},
 {id:"P2", n:"16-04 · 2027", d:"ago → dic 2027", s:"2027-08-16", e:"2027-12-19", items:["cdif","prog","disc","alg","estp","finv","proy1"]},
 {id:"P3", n:"16-01 · 2028", d:"feb → jun 2028", s:"2028-02-02", e:"2028-06-07", items:["cint","edat","bd","opt","esti","fis","proy2"]},
 {id:"I2", n:"8-03 · 2028",  d:"jun → ago 2028", s:"2028-06-07", e:"2028-08-15", inten:true, items:["dc1","dc2","dc3"]},
 {id:"P4", n:"16-04 · 2028", d:"ago → dic 2028", s:"2028-08-15", e:"2028-12-18", items:["aa","pln","nosql","etl","cloud","min","gob"]},
 {id:"P5", n:"16-01 · 2029", d:"feb → jun 2029", s:"2029-02-01", e:"2029-06-06", items:["ap","big","semlo","vis","mlops","de1","de2"]},
 {id:"I3", n:"8-03 · 2029",  d:"jun → ago 2029", s:"2029-06-06", e:"2029-08-14", inten:true, items:["viz","de3","de4"]},
 {id:"P6", n:"16-04 · 2029", d:"ago → dic 2029", s:"2029-08-14", e:"2029-12-18", items:["proy3","prac","fc1"]},
];
const GRAD = new Date("2029-12-18T00:00:00-05:00");
const BY = Object.fromEntries(C.map(([id,n,cod,cr,l,pre])=>[id,{id,n,cod,cr,l,pre}]));
BY.general = {id:"general", n:"General", cod:"*", cr:0, l:"gen", pre:[]};
const POST = {}; C.forEach(([id,,,,,pre])=>pre.forEach(p=>(POST[p]=POST[p]||[]).push(id)));
const PERIOD_OF = {}; PERIODS.forEach(p=>p.items.forEach(i=>PERIOD_OF[i]=p.id));
const LEVELS = ["Novato","Aprendiz de Python","Domador de Cálculo","Arquitecto de Datos","Entrenador de Modelos","Ninja del ML","Maestro MLOps","Ingeniero en IA"];
const colorOf = id => LINES[(BY[id]||BY.general).l].c;
const nameOf = id => (BY[id]||BY.general).n;

/* ======================= ALMACÉN LOCAL (IndexedDB) ======================= */
const idb = {
  _db:null,
  open(){ if(this._db) return Promise.resolve(this._db);
    return new Promise((res,rej)=>{ const r=indexedDB.open("unadquest",1);
      r.onupgradeneeded=()=>r.result.createObjectStore("kv");
      r.onsuccess=()=>{this._db=r.result;res(r.result)}; r.onerror=()=>rej(r.error); }); },
  async get(k){ const d=await this.open(); return new Promise((res,rej)=>{ const q=d.transaction("kv").objectStore("kv").get(k); q.onsuccess=()=>res(q.result); q.onerror=()=>rej(q.error); }); },
  async set(k,v){ const d=await this.open(); return new Promise((res,rej)=>{ const t=d.transaction("kv","readwrite"); t.objectStore("kv").put(v,k); t.oncomplete=()=>res(); t.onerror=()=>rej(t.error); }); }
};

const DEFAULT_PROGRESS = {st:{}, homolog:true, locked:false, focus:false, ach:[]};
let DB = {progress:{data:structuredClone(DEFAULT_PROGRESS), updated_at:0, dirty:false}, tasks:{}, notes:{}, lastSync:0};
let S = DB.progress.data;   // atajo al estado de la malla
let persistT=null;
function persist(){ clearTimeout(persistT); persistT=setTimeout(()=>idb.set("db",DB).catch(e=>console.warn("idb",e)),250); }
function touchProgress(){ DB.progress.updated_at=Date.now(); DB.progress.dirty=true; persist(); scheduleSync(); }
const uid = () => (crypto.randomUUID ? crypto.randomUUID().replace(/-/g,"") : Date.now().toString(36)+Math.random().toString(36).slice(2));

/* ======================= SINCRONIZACIÓN ======================= */
let syncing=false, again=false, syncT=null;
const syncEl = () => document.getElementById("sync");
function setSync(cls, txt){ const el=syncEl(); el.className="sync "+cls; el.textContent=txt; }
function scheduleSync(ms=1500){ clearTimeout(syncT); syncT=setTimeout(sync,ms); }
const strip = o => { const {_dirty, ...r}=o; return r; };

async function sync(){
  if(syncing){ again=true; return; }
  if(!navigator.onLine){ setSync("err","● sin conexión"); return; }
  syncing=true; setSync("busy","⟳ sincronizando");
  const sentT = Object.values(DB.tasks).filter(t=>t._dirty).map(t=>[t.id,t.updated_at]);
  const sentN = Object.values(DB.notes).filter(n=>n._dirty).map(n=>[n.id,n.updated_at]);
  const sentP = DB.progress.dirty ? DB.progress.updated_at : null;
  const body = {
    since: DB.lastSync,
    progress: sentP ? {data:DB.progress.data, updated_at:sentP} : null,
    tasks: sentT.map(([id])=>strip(DB.tasks[id])),
    notes: sentN.map(([id])=>strip(DB.notes[id])),
  };
  try{
    const r = await fetch("/api/sync",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify(body),credentials:"include",redirect:"manual",cache:"no-store"});
    if(r.type==="opaqueredirect" || r.status===401 || r.status===403){ document.getElementById("authBanner").hidden=false; setSync("err","🔐 sesión"); return; }
    if(!r.ok) throw new Error("HTTP "+r.status);
    const d = await r.json();
    document.getElementById("authBanner").hidden=true;
    // limpiar "sucio" solo si no cambió mientras se enviaba
    if(sentP && DB.progress.updated_at===sentP) DB.progress.dirty=false;
    sentT.forEach(([id,u])=>{ if(DB.tasks[id] && DB.tasks[id].updated_at===u) DB.tasks[id]._dirty=false; });
    sentN.forEach(([id,u])=>{ if(DB.notes[id] && DB.notes[id].updated_at===u) DB.notes[id]._dirty=false; });
    let changed=false;
    if(d.progress && d.progress.updated_at > DB.progress.updated_at && !DB.progress.dirty){
      DB.progress = {data:Object.assign(structuredClone(DEFAULT_PROGRESS), d.progress.data), updated_at:d.progress.updated_at, dirty:false};
      S = DB.progress.data; changed=true;
    }
    for(const t of d.tasks){ const l=DB.tasks[t.id]; if(!l || (t.updated_at>l.updated_at && !l._dirty)){ DB.tasks[t.id]=t; changed=true; } }
    for(const n of d.notes){ const l=DB.notes[n.id]; if(!l || (n.updated_at>l.updated_at && !l._dirty)){ DB.notes[n.id]=n; changed=true; } }
    for(const rj of (d.rejected||[])) if(DB.notes[rj.id]){ DB.notes[rj.id]._dirty=false; toast("⚠️ Una nota con mucha tinta superó el límite y no se sincronizó"); }
    DB.lastSync = Math.max(0, d.server_time - 5*60*1000); // 5 min de traslape: el merge es idempotente
    persist();
    const pending = DB.progress.dirty || Object.values(DB.tasks).some(t=>t._dirty) || Object.values(DB.notes).some(n=>n._dirty);
    setSync("ok", pending ? "⟳ pendiente" : "✓ sincronizado");
    if(changed) rerender(true);
  }catch(e){
    console.warn("sync",e); setSync("err","● sin conexión");
  }finally{
    syncing=false;
    if(again){ again=false; scheduleSync(300); }
  }
}
window.addEventListener("online",()=>sync());
document.addEventListener("visibilitychange",()=>{ if(document.visibilityState==="visible") sync(); else if(DB.progress.dirty||Object.values(DB.notes).some(n=>n._dirty)) sync(); });
setInterval(()=>{ if(document.visibilityState==="visible") sync(); },45000);

/* ======================= MALLA ======================= */
const $=s=>document.querySelector(s);
const esc = s => String(s??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const status = id => (BY[id]?.l==="ingl" && S.homolog) ? "done" : (S.st[id]||"todo");
const isUnlocked = id => BY[id].pre.every(p=>status(p)==="done");
const doingCourses = () => C.map(c=>c[0]).filter(id=>status(id)==="doing");
function totals(){ let xp=0,doing=0,nDoing=0; C.forEach(([id,,,cr])=>{const s=status(id); if(s==="done")xp+=cr; if(s==="doing"){doing+=cr;nDoing++;}}); return {xp,doing,nDoing}; }
function level(xp){ const lv=Math.min(LEVELS.length,1+Math.floor(xp/20)); const inLv=lv>=LEVELS.length?20:xp%20; return {lv,prog:inLv/20,name:LEVELS[lv-1]}; }
const liveTasks = () => Object.values(DB.tasks).filter(t=>!t.deleted);
const liveNotes = () => Object.values(DB.notes).filter(n=>!n.deleted);

const ACH = [
 {id:"first",i:"🎓",t:"Primer paso",d:"Aprueba tu primer curso",f:()=>C.some(([id,,,,l])=>l!=="ingl"&&status(id)==="done")},
 {id:"english",i:"🇬🇧",t:"Bilingüe",d:"Inglés homologado",f:()=>["ingA1","ingA2","ingB1","ingB1p"].every(i=>status(i)==="done")},
 {id:"p1",i:"🚀",t:"Despegue",d:"Termina el primer periodo",f:()=>PERIODS[1].items.every(i=>status(i)==="done")},
 {id:"inten",i:"⚡",t:"Modo turbo",d:"Completa un intersemestral",f:()=>PERIODS.filter(p=>p.inten).some(p=>p.items.every(i=>status(i)==="done"))},
 {id:"allInten",i:"🔥",t:"Sin vacaciones",d:"Completa los 3 intersemestrales",f:()=>PERIODS.filter(p=>p.inten).every(p=>p.items.every(i=>status(i)==="done"))},
 {id:"calc",i:"∫",t:"Domador de Cálculo",d:"Cálculo Diferencial e Integral",f:()=>["cdif","cint"].every(i=>status(i)==="done")},
 {id:"data",i:"🗄️",t:"Señor de los datos",d:"BD, NoSQL, ETL y Big Data",f:()=>["bd","nosql","etl","big"].every(i=>status(i)==="done")},
 {id:"ml",i:"🤖",t:"Hola, red neuronal",d:"Aprendizaje Automático y Profundo",f:()=>["aa","ap"].every(i=>status(i)==="done")},
 {id:"cloud",i:"☁️",t:"Cabeza en la nube",d:"Cloud + MLOps completos",f:()=>["cloud","semlo","mlops"].every(i=>status(i)==="done")},
 {id:"half",i:"🌗",t:"Mitad del camino",d:"75 créditos",f:()=>totals().xp>=75},
 {id:"full21",i:"🏋️",t:"Carga máxima",d:"Cursa 21 créditos a la vez",f:()=>totals().doing>=21},
 {id:"proy",i:"🛠️",t:"Constructor",d:"Proyectos de Ingeniería I, II y III",f:()=>["proy1","proy2","proy3"].every(i=>status(i)==="done")},
 {id:"tasks10",i:"✅",t:"Productivo",d:"Completa 10 tareas",f:()=>liveTasks().filter(t=>t.done).length>=10},
 {id:"tasks50",i:"🗓️",t:"Máquina de entregas",d:"Completa 50 tareas",f:()=>liveTasks().filter(t=>t.done).length>=50},
 {id:"note1",i:"✍️",t:"Primera página",d:"Crea tu primer cuaderno",f:()=>liveNotes().length>=1},
 {id:"note25",i:"📚",t:"Biblioteca",d:"25 notas escritas",f:()=>liveNotes().length>=25},
 {id:"grad",i:"👑",t:"Ingeniero en IA",d:"150 / 150 créditos",f:()=>totals().xp>=150},
];

function renderLegend(){ $("#legend").innerHTML = Object.values(LINES).map(l=>`<span><b style="background:${l.c}"></b>${l.n}</span>`).join(""); }
function currentPeriod(){ const now=new Date(); return (PERIODS.find(p=>p.s && now>=new Date(p.s) && now<=new Date(p.e))||{}).id; }
function pendingTasksFor(id){ return liveTasks().filter(t=>t.course_id===id && !t.done).length; }

function renderBoard(){
  const cur=currentPeriod();
  $("#board").innerHTML = PERIODS.map(p=>{
    if(p.homolog && !S.homolog) return "";
    const cr=p.items.reduce((a,i)=>a+BY[i].cr,0);
    const done=p.items.filter(i=>status(i)==="done").reduce((a,i)=>a+BY[i].cr,0);
    const cards=p.items.map(i=>{
      const c=BY[i], s=status(i), lk=!isUnlocked(i)&&s==="todo";
      if(S.focus && s==="done") return "";
      const icon=s==="done"?"✅":s==="doing"?"⏳":lk?"🔒":"⬜";
      const tk = s==="doing" ? pendingTasksFor(i) : 0;
      const cls=["course",s==="done"?"done":"",s==="doing"?"doing":"",lk&&S.locked?"locked":"",c.l==="ingl"&&S.homolog?"homolog":""].join(" ");
      return `<div class="${cls}" data-id="${i}" style="--c:${LINES[c.l].c}" tabindex="0" role="button" aria-label="${esc(c.n)}, ${c.cr} créditos, ${s}">
        <span class="st">${icon}</span><div class="n">${esc(c.n)}</div>
        <div class="m"><span>${c.cr} cr</span><span>${c.cod!=="*"?"#"+c.cod:"electivo"}</span>${c.pre.length?`<span>↳ ${c.pre.length} pre</span>`:""}${tk?`<span class="tk">📌 ${tk}</span>`:""}</div></div>`;
    }).join("");
    return `<div class="col ${p.inten?"inten":""} ${p.id===cur?"current":""}">
      <h3>${p.n}${p.inten?'<span class="tag">8 sem</span>':""}${p.homolog?'<span class="tag">HOM</span>':""}</h3>
      <div class="meta"><span>${p.d}</span><span class="done">${done}/${cr} cr</span></div>
      <div class="xpbar" style="height:6px;margin:0"><i style="width:${cr?done/cr*100:0}%"></i></div>
      ${cards||'<div class="muted" style="font-size:12px">✔ Todo aprobado</div>'}</div>`;
  }).join("");
}
function renderHUD(){
  const {xp,doing,nDoing}=totals(); const L=level(xp);
  $("#xp").textContent=`${xp} / 150`; $("#xpbar").style.width=(xp/150*100)+"%";
  $("#xpPct").textContent=`${(xp/150*100).toFixed(1)}% · faltan ${150-xp} cr`;
  $("#lvl").textContent=L.lv; $("#lvlbar").style.width=(L.prog*100)+"%"; $("#lvlName").textContent=L.name;
  $("#doing").textContent=`${doing} cr`;
  $("#doingS").textContent=nDoing?`${nDoing} curso(s)${doing>21?" · ⚠️ supera 21":""}`:"Ningún curso activo";
  const days=Math.ceil((GRAD-new Date())/864e5); $("#countdown").textContent=days>0?`${days} días`:"¡Graduado!";
}
function renderLines(){
  $("#lines").innerHTML=Object.entries(LINES).map(([k,l])=>{
    const ids=C.filter(c=>c[4]===k).map(c=>c[0]); const tot=ids.reduce((a,i)=>a+BY[i].cr,0);
    const d=ids.filter(i=>status(i)==="done").reduce((a,i)=>a+BY[i].cr,0);
    return `<div class="row" style="--c:${l.c}"><span>${l.n}</span><div class="xpbar"><i style="width:${tot?d/tot*100:0}%"></i></div><span class="muted">${d}/${tot}</span></div>`;
  }).join("");
}
function evalAch(){
  const fresh=[]; let changed=false;
  ACH.forEach(a=>{ const ok=a.f(); if(ok && !S.ach.includes(a.id)){S.ach.push(a.id);fresh.push(a);changed=true;} if(!ok && S.ach.includes(a.id)){S.ach=S.ach.filter(x=>x!==a.id);changed=true;} });
  if(changed) persist();   // los logros se derivan del estado: no cuentan como edición
  $("#ach").innerHTML=ACH.map(a=>`<div class="badge ${S.ach.includes(a.id)?"got":""}"><div class="i">${a.i}</div><div class="t">${a.t}</div><div class="d">${a.d}</div></div>`).join("");
  return fresh;
}
function renderDetail(id){
  const c=BY[id], s=status(id);
  const pre=c.pre.map(p=>`<span class="chip ${status(p)==="done"?"ok":"no"}">${status(p)==="done"?"✔":"✖"} ${esc(BY[p].n)}</span>`).join("")||'<span class="muted">Sin prerrequisitos</span>';
  const post=(POST[id]||[]).map(p=>`<span class="chip">${esc(BY[p].n)}</span>`).join("")||'<span class="muted">No desbloquea nada directo</span>';
  const per=PERIODS.find(p=>p.id===PERIOD_OF[id]); const tk=pendingTasksFor(id), nn=liveNotes().filter(n=>n.course_id===id).length;
  $("#detail").innerHTML=`<h4 style="color:${LINES[c.l].c}">${esc(c.n)}</h4>
   <div class="muted">${c.cr} créditos · ${c.cod!=="*"?"Cód. "+c.cod:"Electivo"} · ${LINES[c.l].n} · ${per?per.n:""} · estado: <b>${{done:"aprobado",doing:"cursando",todo:"pendiente"}[s]}</b></div>
   <div style="margin-top:8px;font-size:12px">Necesita:</div><div class="chips">${pre}</div>
   <div style="margin-top:8px;font-size:12px">Desbloquea:</div><div class="chips">${post}</div>
   <div class="chips" style="margin-top:10px"><button data-go="agenda" data-course="${id}">📌 Tareas (${tk})</button><button data-go="notas" data-course="${id}">📓 Cuaderno (${nn})</button></div>`;
}
let inspected=null;
function highlight(id){
  const anc=new Set(), des=new Set();
  if(id){ (function up(i){BY[i].pre.forEach(p=>{anc.add(p);up(p)})})(id); (function dn(i){(POST[i]||[]).forEach(p=>{des.add(p);dn(p)})})(id); }
  document.querySelectorAll(".course").forEach(el=>{ const x=el.dataset.id; el.classList.remove("hl-pre","hl-post","hl-self","dim"); if(!id) return;
    if(x===id) el.classList.add("hl-self"); else if(anc.has(x)) el.classList.add("hl-pre"); else if(des.has(x)) el.classList.add("hl-post"); else el.classList.add("dim"); });
}
function renderMalla(fx){
  renderBoard(); renderHUD(); renderLines();
  const fresh=evalAch();
  if(inspected) highlight(inspected);
  [["#tHomolog",S.homolog],["#tLocked",S.locked],["#tFocus",S.focus]].forEach(([s,v])=>$(s).classList.toggle("on",!!v));
  if(fx && fresh.length){ toast(`🏆 Logro desbloqueado: ${fresh.map(a=>a.t).join(", ")}`); confetti(); }
}
function cycle(id,ev){
  const c=BY[id];
  if(c.l==="ingl" && S.homolog){ toast("Inglés está homologado. Desactiva el botón 🇬🇧 para gestionarlo."); return; }
  const s=status(id);
  if(s==="todo" && !isUnlocked(id)){
    const miss=c.pre.filter(p=>status(p)!=="done").map(p=>BY[p].n).join(", ");
    if(!confirm(`🔒 ${c.n} requiere: ${miss}.\n¿Marcarlo de todos modos?`)) return;
  }
  const before=level(totals().xp).lv;
  const next={todo:"doing",doing:"done",done:"todo"}[s];
  S.st[id]=next; touchProgress();
  if(next==="done" && ev) popXP(ev.clientX,ev.clientY,`+${c.cr} XP`);
  renderMalla(true);
  const after=level(totals().xp).lv;
  if(after>before){ toast(`⬆️ ¡Subiste a nivel ${after}: ${LEVELS[after-1]}!`); confetti(); }
}
function inspect(id){ inspected=inspected===id?null:id; if(inspected) renderDetail(id); highlight(inspected); }
function bindMalla(){
  const board=$("#board"); let pressT=null,longFired=false;
  board.addEventListener("click",e=>{const el=e.target.closest(".course"); if(!el) return; if(longFired){longFired=false;return;} cycle(el.dataset.id,e);});
  board.addEventListener("dblclick",e=>{const el=e.target.closest(".course"); if(!el) return; e.preventDefault(); inspect(el.dataset.id);});
  board.addEventListener("pointerdown",e=>{const el=e.target.closest(".course"); if(!el) return; pressT=setTimeout(()=>{longFired=true;inspect(el.dataset.id);},450);});
  ["pointerup","pointerleave","pointercancel"].forEach(t=>board.addEventListener(t,()=>clearTimeout(pressT)));
  board.addEventListener("scroll",()=>clearTimeout(pressT),{passive:true});
  board.addEventListener("keydown",e=>{const el=e.target.closest(".course"); if(!el) return; if(e.key==="Enter"||e.key===" "){e.preventDefault();cycle(el.dataset.id);} if(e.key==="i") inspect(el.dataset.id);});
  board.addEventListener("mouseover",e=>{const el=e.target.closest(".course"); if(el&&!inspected) renderDetail(el.dataset.id);});
  $("#detail").addEventListener("click",e=>{const b=e.target.closest("[data-go]"); if(!b) return; if(b.dataset.go==="agenda"){taskFilter=b.dataset.course;} else {nbCourse=b.dataset.course; nbNote=null;} go(b.dataset.go);});
  $("#tHomolog").onclick=()=>{S.homolog=!S.homolog;touchProgress();renderMalla(true)};
  $("#tLocked").onclick=()=>{S.locked=!S.locked;touchProgress();renderMalla()};
  $("#tFocus").onclick=()=>{S.focus=!S.focus;touchProgress();renderMalla()};
  $("#resetBtn").onclick=()=>{ if(confirm("¿Borrar el progreso de la malla? (tareas y cuadernos no se tocan)")){ S.st={};S.ach=[];inspected=null;touchProgress();renderMalla();toast("Malla reiniciada"); } };
  $("#exportBtn").onclick=()=>{ const data={exported_at:new Date().toISOString(), progress:DB.progress.data, tasks:liveTasks().map(strip), notes:liveNotes().map(strip)};
    const a=document.createElement("a"); a.href=URL.createObjectURL(new Blob([JSON.stringify(data,null,2)],{type:"application/json"})); a.download=`unad-quest-${new Date().toISOString().slice(0,10)}.json`; a.click(); };
  $("#importBtn").onclick=()=>$("#importFile").click();
  $("#importFile").onchange=e=>{ const f=e.target.files[0]; if(!f) return; f.text().then(t=>{ try{
      const d=JSON.parse(t); const now=Date.now();
      const prog = d.progress || (d.st ? d : null);   // admite el formato viejo
      if(prog){ DB.progress.data=Object.assign(structuredClone(DEFAULT_PROGRESS),prog); S=DB.progress.data; touchProgress(); }
      (d.tasks||[]).forEach(x=>{ DB.tasks[x.id]={...x,updated_at:now,_dirty:true}; });
      (d.notes||[]).forEach(x=>{ DB.notes[x.id]={...x,updated_at:now,_dirty:true}; });
      persist(); scheduleSync(200); rerender(); toast("Importado ✅");
    }catch(err){ toast("Archivo no válido"); } }); e.target.value=""; };
}

/* ======================= AGENDA ======================= */
let taskFilter="doing"; // "doing" | "all" | course_id
let selDay=null;
const todayStr = () => { const d=new Date(); return new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10); };
const addDays = (s,n) => { const d=new Date(s+"T12:00:00"); d.setDate(d.getDate()+n); return new Date(d.getTime()-d.getTimezoneOffset()*6e4).toISOString().slice(0,10); };
const fmtDue = s => { if(!s) return ""; const t=todayStr(); if(s===t) return "hoy"; if(s===addDays(t,1)) return "mañana"; if(s===addDays(t,-1)) return "ayer";
  return new Date(s+"T12:00:00").toLocaleDateString("es-CO",{weekday:"short",day:"numeric",month:"short"}); };

function courseOptions(selected){
  const doing=doingCourses();
  const others=C.map(c=>c[0]).filter(id=>!doing.includes(id) && status(id)!=="done");
  const done=C.map(c=>c[0]).filter(id=>status(id)==="done" && BY[id].l!=="ingl");
  const opt=id=>`<option value="${id}" ${id===selected?"selected":""}>${esc(nameOf(id))}</option>`;
  return (doing.length?`<optgroup label="⏳ Cursando">${doing.map(opt).join("")}</optgroup>`:"")
    + `<optgroup label="General">${opt("general")}</optgroup>`
    + (others.length?`<optgroup label="Pendientes">${others.map(opt).join("")}</optgroup>`:"")
    + (done.length?`<optgroup label="Aprobadas">${done.map(opt).join("")}</optgroup>`:"");
}
function filteredTasks(){
  let ts=liveTasks();
  if(taskFilter==="doing"){ const d=doingCourses(); ts=ts.filter(t=>d.includes(t.course_id)||t.course_id==="general"); }
  else if(taskFilter!=="all") ts=ts.filter(t=>t.course_id===taskFilter);
  if(selDay) ts=ts.filter(t=>t.due===selDay);
  return ts;
}
function renderAgenda(){
  const sel = $("#tCourse").value;
  const def = taskFilter!=="all"&&taskFilter!=="doing" ? taskFilter : (sel || doingCourses()[0] || "general");
  $("#tCourse").innerHTML=courseOptions(def);
  // semana
  const t=todayStr(); const base=liveTasks().filter(x=>!x.done);
  $("#week").innerHTML=[...Array(7)].map((_,i)=>{ const d=addDays(t,i); const n=base.filter(x=>x.due===d).length; const dt=new Date(d+"T12:00:00");
    return `<div class="day ${i===0?"today":""} ${selDay===d?"sel":""}" data-day="${d}"><div class="dn">${dt.toLocaleDateString("es-CO",{weekday:"short"})}</div><div class="dd">${dt.getDate()}</div><div class="dc">${n?"●".repeat(Math.min(n,5)):""}</div></div>`; }).join("");
  // filtros
  const doing=doingCourses(); const used=[...new Set(liveTasks().map(x=>x.course_id))].filter(id=>!doing.includes(id)&&id!=="general");
  const fb=(v,label,c)=>`<button data-f="${v}" class="${taskFilter===v?"on":""}" style="--c:${c||"var(--line)"}">${label}</button>`;
  $("#taskFilters").innerHTML = fb("doing","⏳ Cursando") + fb("all","Todas") + doing.map(id=>fb(id,esc(nameOf(id)),colorOf(id))).join("") + fb("general","General",colorOf("general")) + used.map(id=>fb(id,esc(nameOf(id)),colorOf(id))).join("")
    + (selDay?`<button data-f="clearday">✖ ${fmtDue(selDay)}</button>`:"");
  // grupos
  const ts=filteredTasks(); const open=ts.filter(x=>!x.done); const done=ts.filter(x=>x.done).sort((a,b)=>b.updated_at-a.updated_at);
  const wk=addDays(t,7);
  const groups=[
    ["⚠️ Vencidas", open.filter(x=>x.due && x.due<t)],
    ["📌 Hoy", open.filter(x=>x.due===t)],
    ["🗓️ Próximos 7 días", open.filter(x=>x.due && x.due>t && x.due<=wk)],
    ["🔭 Más adelante", open.filter(x=>x.due && x.due>wk)],
    ["📥 Sin fecha", open.filter(x=>!x.due)],
  ];
  const sortT=(a,b)=>(a.due||"9999").localeCompare(b.due||"9999") || (b.priority||0)-(a.priority||0) || a.created_at-b.created_at;
  let html=groups.filter(g=>g[1].length).map(([h,list])=>`<div class="group"><h4>${h}<span class="cnt">${list.length}</span></h4>${list.sort(sortT).map(taskHTML).join("")}</div>`).join("");
  if(done.length) html+=`<details class="group"><summary class="muted" style="cursor:pointer;margin-top:14px">✅ Completadas (${done.length})</summary>${done.slice(0,40).map(taskHTML).join("")}</details>`;
  if(!open.length && !done.length) html=`<div class="empty">${doing.length||taskFilter!=="doing" ? "Nada por aquí. ¡Agrega tu primera tarea! 🎯" : "Marca materias como <b>cursando</b> en la malla, o mira <b>Todas</b>."}</div>`;
  $("#taskList").innerHTML=html;
}
function taskHTML(x){
  const t=todayStr(); const late=x.due&&x.due<t&&!x.done; const soon=x.due&&x.due>=t&&x.due<=addDays(t,2)&&!x.done;
  return `<div class="task ${x.done?"done":""}" data-tid="${x.id}" style="--c:${colorOf(x.course_id)}">
    <button class="chk" data-act="toggle" aria-label="Completar">${x.done?"✓":""}</button>
    <div><div class="tt" data-act="edit">${esc(x.title)}</div>
      <div class="tm"><span>${esc(nameOf(x.course_id))}</span>${x.due?`<span class="${late?"late":soon?"soon":""}">📅 ${fmtDue(x.due)}</span>`:""}${x.priority?`<span class="prio ${x.priority>1?"p2":""}">${x.priority>1?"Urgente":"Alta"}</span>`:""}</div>
      ${x.details?`<div class="td">${linkify(esc(x.details))}</div>`:""}</div>
    <div class="acts"><button class="ghost" data-act="edit" aria-label="Editar">✏️</button></div></div>`;
}
const linkify = s => s.replace(/(https?:\/\/[^\s<]+)/g,'<a href="$1" target="_blank" rel="noopener" style="color:var(--accent)">$1</a>');
function saveTask(t){ t.updated_at=Date.now(); t._dirty=true; DB.tasks[t.id]=t; persist(); scheduleSync(); }
let editingTask=null;
function bindAgenda(){
  $("#taskForm").addEventListener("submit",e=>{ e.preventDefault();
    const now=Date.now(); const t={id:uid(),course_id:$("#tCourse").value||"general",title:$("#tTitle").value.trim(),details:$("#tDetails").value.trim()||null,due:$("#tDue").value||null,priority:+$("#tPrio").value,done:false,deleted:false,created_at:now};
    if(!t.title) return; saveTask(t); $("#tTitle").value=""; $("#tDetails").value=""; $("#tPrio").value="0";
    renderAgenda(); evalAch(); toast("📌 Tarea agregada"); $("#tTitle").focus(); });
  $("#week").addEventListener("click",e=>{ const d=e.target.closest("[data-day]"); if(!d) return; selDay = selDay===d.dataset.day?null:d.dataset.day; if(selDay) $("#tDue").value=selDay; renderAgenda(); });
  $("#taskFilters").addEventListener("click",e=>{ const b=e.target.closest("[data-f]"); if(!b) return; if(b.dataset.f==="clearday") selDay=null; else taskFilter=b.dataset.f; renderAgenda(); });
  $("#taskList").addEventListener("click",e=>{ const el=e.target.closest("[data-tid]"); const a=e.target.closest("[data-act]"); if(!el||!a) return; const t=DB.tasks[el.dataset.tid];
    if(a.dataset.act==="toggle"){ t.done=!t.done; saveTask(t); if(t.done){ popXP(e.clientX,e.clientY,"✓"); const fresh=evalAch(); if(fresh.length){toast(`🏆 ${fresh.map(a=>a.t).join(", ")}`);confetti();} else toast("💪 ¡Tarea completada!"); } renderAgenda(); if(!$("#view-malla").hidden) renderMalla(); }
    if(a.dataset.act==="edit") openTaskDlg(t); });
  const dlg=$("#taskDlg");
  dlg.addEventListener("close",()=>{ if(dlg.returnValue==="save" && editingTask){ const t=editingTask;
    t.title=$("#eTitle").value.trim()||t.title; t.course_id=$("#eCourse").value; t.due=$("#eDue").value||null; t.priority=+$("#ePrio").value; t.details=$("#eDetails").value.trim()||null;
    saveTask(t); renderAgenda(); } editingTask=null; });
  $("#eDelete").onclick=()=>{ if(editingTask && confirm("¿Borrar esta tarea?")){ editingTask.deleted=true; saveTask(editingTask); editingTask=null; dlg.close("cancel"); renderAgenda(); toast("🗑️ Tarea borrada"); } };
}
function openTaskDlg(t){ editingTask=t; $("#eTitle").value=t.title; $("#eCourse").innerHTML=courseOptions(t.course_id); $("#eDue").value=t.due||""; $("#ePrio").value=String(t.priority||0); $("#eDetails").value=t.details||""; $("#taskDlg").showModal(); }

/* ======================= CUADERNOS ======================= */
let nbCourse=null, nbNote=null, nbMode="ink", nbFocus=false, showAllSubj=false;
const PAGE_W=1000, PAGE_H=1414;
const INK = {tool:"pen", color:"#1b1f3a", width:3, paper:"lines", penOnly:false, sawPen:false};
try{ Object.assign(INK, JSON.parse(localStorage.getItem("uq.ink")||"{}")); }catch(e){}
const saveInkPrefs = () => { try{ localStorage.setItem("uq.ink", JSON.stringify(INK)); }catch(e){} };
const PEN_COLORS=["#1b1f3a","#2457d6","#d62f4b","#1f8a5b","#8a3fd1","#e07b12"];
const HL_COLORS=["#ffe14d","#7cf6c3","#ff9bd2","#8fd3ff"];

function notesFor(cid){ return liveNotes().filter(n=>n.course_id===cid).sort((a,b)=>b.updated_at-a.updated_at); }
function renderSubjects(){
  const doing=doingCourses(); const withNotes=[...new Set(liveNotes().map(n=>n.course_id))];
  if(!nbCourse) nbCourse = doing[0] || withNotes[0] || "general";
  const btn=id=>`<button class="subj ${id===nbCourse?"on":""}" data-sub="${id}" style="--c:${colorOf(id)}">${esc(nameOf(id))}<span class="k">${notesFor(id).length||""}</span></button>`;
  const rest=C.map(c=>c[0]).filter(id=>!doing.includes(id) && BY[id].l!=="ingl");
  const restShown = showAllSubj ? rest : rest.filter(id=>withNotes.includes(id) || id===nbCourse);
  $("#subjects").innerHTML =
    `<div class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:1px">⏳ Cursando</div>`
    + (doing.length?doing.map(btn).join(""):`<div class="muted" style="font-size:12px">Marca materias como cursando en la malla.</div>`)
    + `<div class="muted" style="font-size:11px;text-transform:uppercase;letter-spacing:1px;margin-top:6px">📁 Otros</div>` + btn("general") + restShown.map(btn).join("")
    + `<button class="ghost" data-sub="__toggle" style="font-size:12px">${showAllSubj?"Ocultar materias sin notas":"Ver todas las materias"}</button>`;
}
function renderNotebook(){
  renderSubjects();
  $("#nb").classList.toggle("focus",nbFocus);
  const list=notesFor(nbCourse);
  if(nbNote && (!DB.notes[nbNote] || DB.notes[nbNote].deleted || DB.notes[nbNote].course_id!==nbCourse)) nbNote=null;
  const n = nbNote ? DB.notes[nbNote] : null;
  const listHTML = `<div class="card" style="padding:10px"><div style="display:flex;gap:8px;align-items:center;margin-bottom:8px">
      <b style="color:${colorOf(nbCourse)}">${esc(nameOf(nbCourse))}</b><span style="flex:1"></span>
      <button class="primary" data-nb="new">＋ Nueva nota</button></div>
      <div class="notes-list">${list.length?list.map(x=>`<div class="nitem ${x.id===nbNote?"on":""}" data-open="${x.id}"><div>${x.ink&&x.ink.pages&&x.ink.pages.some(p=>p.length)?"✍️ ":""}${esc(x.title||"Sin título")}</div><div class="nd">${new Date(x.updated_at).toLocaleString("es-CO",{dateStyle:"medium",timeStyle:"short"})}${x._dirty?" · ⟳":""}</div></div>`).join(""):`<div class="muted" style="font-size:12px">Aún no hay notas en esta materia.</div>`}</div></div>`;
  if(!n){ $("#editor").innerHTML = listHTML; return; }
  $("#editor").innerHTML = (nbFocus?"":listHTML) + `
    <div class="edbar">
      <input class="title" id="nTitle" value="${esc(n.title||"")}" placeholder="Título de la nota" maxlength="300">
      <div class="seg"><button data-mode="ink" class="${nbMode==="ink"?"on":""}">✍️ Tinta</button><button data-mode="text" class="${nbMode==="text"?"on":""}">📝 Texto</button><button data-mode="view" class="${nbMode==="view"?"on":""}">👁️ Vista</button></div>
      <button data-nb="focus" title="Pantalla completa">${nbFocus?"↙️ Salir":"⛶ Enfocar"}</button>
      <button data-nb="del" class="danger" title="Borrar nota">🗑️</button>
    </div>
    <div id="nbBody"></div>`;
  renderNoteBody(n);
}
function renderNoteBody(n){
  const body=$("#nbBody");
  if(nbMode==="text"){
    body.innerHTML=`<textarea class="md" id="nText" placeholder="# Apuntes&#10;&#10;- Escribe en Markdown: **negrita**, *cursiva*, \`código\`, listas, - [ ] pendientes…">${esc(n.body||"")}</textarea>`;
    $("#nText").addEventListener("input",e=>{ n.body=e.target.value; markNote(n); });
  } else if(nbMode==="view"){
    const inkPages=(n.ink?.pages||[]).filter(p=>p.length).length;
    body.innerHTML=`<div class="mdview">${n.body?md(n.body):'<span class="muted">Sin texto todavía. Cambia a 📝 Texto para escribir.</span>'}</div>${inkPages?`<p class="muted" style="font-size:12px">✍️ Esta nota tiene ${inkPages} página(s) con tinta.</p>`:""}`;
  } else {
    if(!n.ink) n.ink={pages:[[]]};
    body.innerHTML=inkToolbar()+`<div class="pages" id="pages"></div><div style="display:flex;gap:8px;justify-content:center;margin-top:12px"><button data-ink="addpage">＋ Página</button><span class="size" id="inkSize"></span></div>`;
    mountInk(n);
  }
}
function inkToolbar(){
  const cols = INK.tool==="hl" ? HL_COLORS : PEN_COLORS;
  if(!cols.includes(INK.color)) INK.color = cols[0];
  return `<div class="inktools" id="inkTools">
    <div class="seg"><button data-tool="pen" class="${INK.tool==="pen"?"on":""}" title="Lápiz">🖊️</button><button data-tool="hl" class="${INK.tool==="hl"?"on":""}" title="Resaltador">🖍️</button><button data-tool="eraser" class="${INK.tool==="eraser"?"on":""}" title="Borrador">🧽</button></div>
    ${cols.map(c=>`<button class="sw ${INK.color===c?"on":""}" data-color="${c}" style="background:${c}" aria-label="Color ${c}"></button>`).join("")}
    <input type="range" min="1" max="12" step="0.5" value="${INK.width}" id="inkW" title="Grosor">
    <button data-ink="undo" title="Deshacer">↶</button><button data-ink="redo" title="Rehacer">↷</button>
    <select id="paper" title="Papel"><option value="lines" ${INK.paper==="lines"?"selected":""}>Rayado</option><option value="grid" ${INK.paper==="grid"?"selected":""}>Cuadrícula</option><option value="dots" ${INK.paper==="dots"?"selected":""}>Puntos</option><option value="blank" ${INK.paper==="blank"?"selected":""}>Blanco</option></select>
    <button data-ink="penonly" class="${INK.penOnly?"on":""}" title="Solo Apple Pencil: el dedo hace scroll">✏️ Solo lápiz</button>
    <button data-ink="png" title="Descargar página como imagen">⬇️ PNG</button>
  </div>`;
}

/* ---- motor de tinta ---- */
let inkState=null; // {note, canvases:[], undo:[], redo:[]}
function mountInk(n){
  const wrap=$("#pages");
  inkState={note:n, canvases:[], undo:[], redo:[]};
  n.ink.pages.forEach((_,i)=>addPageEl(i));
  updateInkSize();
}
function addPageEl(i){
  const wrap=$("#pages");
  const page=document.createElement("div"); page.className="page"+(INK.penOnly?" penonly":""); page.dataset.page=i;
  const cv=document.createElement("canvas"); page.appendChild(cv);
  const pn=document.createElement("div"); pn.className="pn"; pn.textContent=`${i+1}`; page.appendChild(pn);
  wrap.appendChild(page); inkState.canvases[i]=cv;
  sizeCanvas(cv); redrawPage(i); bindCanvas(cv,i);
}
function sizeCanvas(cv){ const r=cv.getBoundingClientRect(); const dpr=Math.min(window.devicePixelRatio||1,2.5); cv.width=Math.max(1,Math.round(r.width*dpr)); cv.height=Math.max(1,Math.round(r.height*dpr)); cv._scale=cv.width/PAGE_W; }
function drawPaper(ctx,s){
  ctx.fillStyle="#f7f5ef"; ctx.fillRect(0,0,PAGE_W*s,PAGE_H*s);
  ctx.save(); ctx.scale(s,s);
  if(INK.paper==="lines"){ ctx.strokeStyle="#cfd8ea"; ctx.lineWidth=1; for(let y=110;y<PAGE_H-40;y+=38){ctx.beginPath();ctx.moveTo(40,y);ctx.lineTo(PAGE_W-40,y);ctx.stroke();} ctx.strokeStyle="#f0b3b3"; ctx.beginPath(); ctx.moveTo(90,40); ctx.lineTo(90,PAGE_H-40); ctx.stroke(); }
  if(INK.paper==="grid"){ ctx.strokeStyle="#dde3ef"; ctx.lineWidth=1; for(let x=40;x<=PAGE_W-40;x+=32){ctx.beginPath();ctx.moveTo(x,40);ctx.lineTo(x,PAGE_H-40);ctx.stroke();} for(let y=40;y<=PAGE_H-40;y+=32){ctx.beginPath();ctx.moveTo(40,y);ctx.lineTo(PAGE_W-40,y);ctx.stroke();} }
  if(INK.paper==="dots"){ ctx.fillStyle="#c3cbdc"; for(let x=40;x<=PAGE_W-40;x+=32) for(let y=40;y<=PAGE_H-40;y+=32){ctx.beginPath();ctx.arc(x,y,1.4,0,7);ctx.fill();} }
  ctx.restore();
}
function drawStroke(ctx,st,s){
  const pts=st.p; if(!pts.length) return;
  ctx.save(); ctx.scale(s,s); ctx.lineCap="round"; ctx.lineJoin="round"; ctx.strokeStyle=st.c;
  if(st.t==="hl"){ ctx.globalAlpha=.38; ctx.globalCompositeOperation="multiply"; ctx.lineWidth=st.w*5; ctx.beginPath(); ctx.moveTo(pts[0][0],pts[0][1]); for(let i=1;i<pts.length;i++) ctx.lineTo(pts[i][0],pts[i][1]); if(pts.length===1) ctx.lineTo(pts[0][0]+.1,pts[0][1]); ctx.stroke(); ctx.restore(); return; }
  if(pts.length===1){ ctx.fillStyle=st.c; ctx.beginPath(); ctx.arc(pts[0][0],pts[0][1],st.w*(.4+.6*pts[0][2])/2,0,7); ctx.fill(); ctx.restore(); return; }
  for(let i=1;i<pts.length;i++){
    const a=pts[i-1], b=pts[i];
    const m0 = i>1 ? [(pts[i-2][0]+a[0])/2,(pts[i-2][1]+a[1])/2] : a;
    const m1 = [(a[0]+b[0])/2,(a[1]+b[1])/2];
    ctx.lineWidth = st.w*(.35+.65*((a[2]+b[2])/2));
    ctx.beginPath(); ctx.moveTo(m0[0],m0[1]); ctx.quadraticCurveTo(a[0],a[1],m1[0],m1[1]); ctx.stroke();
  }
  const l=pts[pts.length-1], m=[(pts[pts.length-2][0]+l[0])/2,(pts[pts.length-2][1]+l[1])/2];
  ctx.lineWidth=st.w*(.35+.65*l[2]); ctx.beginPath(); ctx.moveTo(m[0],m[1]); ctx.lineTo(l[0],l[1]); ctx.stroke();
  ctx.restore();
}
function redrawPage(i){
  const cv=inkState.canvases[i]; if(!cv) return; const ctx=cv.getContext("2d"); const s=cv._scale;
  ctx.setTransform(1,0,0,1,0,0); ctx.globalAlpha=1; ctx.globalCompositeOperation="source-over";
  drawPaper(ctx,s);
  const strokes=inkState.note.ink.pages[i]||[];
  strokes.filter(x=>x.t==="hl").forEach(st=>drawStroke(ctx,st,s));   // resaltador debajo
  strokes.filter(x=>x.t!=="hl").forEach(st=>drawStroke(ctx,st,s));
}
function bindCanvas(cv,i){
  let cur=null, pid=null;
  const pt = e => { const r=cv.getBoundingClientRect(); const x=(e.clientX-r.left)/r.width*PAGE_W, y=(e.clientY-r.top)/r.height*PAGE_H;
    const p = e.pointerType==="mouse" ? .6 : (e.pressure>0 ? e.pressure : .5);
    return [Math.round(x*2)/2, Math.round(y*2)/2, Math.round(p*100)/100]; };
  const allowed = e => { if(e.pointerType==="pen"){ if(!INK.sawPen){ INK.sawPen=true; INK.penOnly=true; saveInkPrefs(); document.querySelectorAll(".page").forEach(p=>p.classList.add("penonly")); const b=document.querySelector('[data-ink="penonly"]'); if(b) b.classList.add("on"); toast("✏️ Apple Pencil detectado: ahora el dedo hace scroll"); } return true; }
    return !(INK.penOnly && e.pointerType==="touch"); };
  // iOS: el lápiz no debe hacer scroll aunque el dedo sí
  cv.addEventListener("touchstart",e=>{ if([...e.touches].some(t=>t.touchType==="stylus")) e.preventDefault(); },{passive:false});
  cv.addEventListener("touchmove",e=>{ if([...e.touches].some(t=>t.touchType==="stylus") || (!INK.penOnly)) e.preventDefault(); },{passive:false});
  cv.addEventListener("pointerdown",e=>{
    if(!allowed(e) || (e.button && e.button!==0)) return;
    e.preventDefault(); cv.setPointerCapture(e.pointerId); pid=e.pointerId;
    if(INK.tool==="eraser"){ eraseAt(i,pt(e)); cur={erase:true}; return; }
    cur={t:INK.tool, c:INK.color, w:+INK.width, p:[pt(e)]};
  });
  cv.addEventListener("pointermove",e=>{
    if(!cur || e.pointerId!==pid) return; e.preventDefault();
    const evs = e.getCoalescedEvents ? e.getCoalescedEvents() : [e];
    if(cur.erase){ evs.forEach(ev=>eraseAt(i,pt(ev))); return; }
    const ctx=cv.getContext("2d"); const s=cv._scale;
    for(const ev of evs){ const q=pt(ev); const last=cur.p[cur.p.length-1]; if(Math.abs(q[0]-last[0])+Math.abs(q[1]-last[1])<0.8) continue; cur.p.push(q);
      // dibujo incremental del último tramo
      const seg={t:cur.t,c:cur.c,w:cur.w,p:cur.p.slice(-3)}; drawStroke(ctx,seg,s); }
  });
  const end=e=>{
    if(!cur || (e && e.pointerId!==pid)) return;
    if(!cur.erase && cur.p.length){ const page=inkState.note.ink.pages[i]; page.push(cur); inkState.undo.push({op:"add",page:i,stroke:cur}); inkState.redo=[]; redrawPage(i); markNote(inkState.note,1200); }
    cur=null; pid=null;
  };
  cv.addEventListener("pointerup",end); cv.addEventListener("pointercancel",end); cv.addEventListener("lostpointercapture",end);
}
function eraseAt(i,[x,y]){
  const page=inkState.note.ink.pages[i]; const R=14; let hit=false;
  for(let k=page.length-1;k>=0;k--){ const st=page[k]; const rr=R+st.w*(st.t==="hl"?2.5:.5);
    if(st.p.some(p=>Math.abs(p[0]-x)<rr && Math.abs(p[1]-y)<rr)){ inkState.undo.push({op:"del",page:i,stroke:st,idx:k}); page.splice(k,1); hit=true; } }
  if(hit){ inkState.redo=[]; redrawPage(i); markNote(inkState.note,1200); }
}
function inkUndo(){ const a=inkState.undo.pop(); if(!a) return; const page=inkState.note.ink.pages[a.page];
  if(a.op==="add"){ const k=page.lastIndexOf(a.stroke); if(k>=0) page.splice(k,1); } else page.splice(Math.min(a.idx,page.length),0,a.stroke);
  inkState.redo.push(a); redrawPage(a.page); markNote(inkState.note,800); }
function inkRedo(){ const a=inkState.redo.pop(); if(!a) return; const page=inkState.note.ink.pages[a.page];
  if(a.op==="add") page.push(a.stroke); else { const k=page.indexOf(a.stroke); if(k>=0) page.splice(k,1); }
  inkState.undo.push(a); redrawPage(a.page); markNote(inkState.note,800); }
function updateInkSize(){ const el=$("#inkSize"); if(!el||!inkState) return; const b=JSON.stringify(inkState.note.ink).length; el.textContent=`${(b/1024).toFixed(0)} KB de tinta`; el.classList.toggle("warn",b>1.5e6); if(b>1.5e6) el.textContent+=" · ⚠️ cerca del límite: crea otra nota"; }
let resizeT=null;
window.addEventListener("resize",()=>{ clearTimeout(resizeT); resizeT=setTimeout(()=>{ if(inkState && $("#pages")) inkState.canvases.forEach((cv,i)=>{ sizeCanvas(cv); redrawPage(i); }); },150); });

let noteT=null;
function markNote(n,delay=600){ n.updated_at=Date.now(); n._dirty=true; DB.notes[n.id]=n; clearTimeout(noteT); noteT=setTimeout(()=>{ persist(); scheduleSync(2500); updateInkSize(); },delay); }

function bindNotebook(){
  $("#subjects").addEventListener("click",e=>{ const b=e.target.closest("[data-sub]"); if(!b) return; if(b.dataset.sub==="__toggle"){ showAllSubj=!showAllSubj; renderSubjects(); return; } nbCourse=b.dataset.sub; nbNote=null; renderNotebook(); });
  $("#editor").addEventListener("click",e=>{
    const o=e.target.closest("[data-open]"); if(o){ nbNote=o.dataset.open; renderNotebook(); return; }
    const b=e.target.closest("[data-nb],[data-mode],[data-tool],[data-color],[data-ink]"); if(!b) return;
    const n=nbNote?DB.notes[nbNote]:null;
    if(b.dataset.nb==="new"){ const now=Date.now(); const nn={id:uid(),course_id:nbCourse,title:`Clase ${new Date().toLocaleDateString("es-CO",{day:"numeric",month:"short"})}`,body:"",ink:{pages:[[]]},deleted:false,created_at:now,updated_at:now,_dirty:true};
      DB.notes[nn.id]=nn; persist(); scheduleSync(); nbNote=nn.id; nbMode="ink"; renderNotebook(); const f=evalAch(); if(f.length){toast(`🏆 ${f.map(a=>a.t).join(", ")}`);confetti();} return; }
    if(b.dataset.nb==="del" && n){ if(confirm("¿Borrar esta nota?")){ n.deleted=true; markNote(n,0); nbNote=null; renderNotebook(); toast("🗑️ Nota borrada"); } return; }
    if(b.dataset.nb==="focus"){ nbFocus=!nbFocus; renderNotebook(); window.scrollTo({top:0}); return; }
    if(b.dataset.mode){ nbMode=b.dataset.mode; renderNotebook(); return; }
    if(b.dataset.tool){ INK.tool=b.dataset.tool; saveInkPrefs(); const tb=$("#inkTools"); tb.outerHTML=inkToolbar(); return; }
    if(b.dataset.color){ INK.color=b.dataset.color; saveInkPrefs(); document.querySelectorAll(".sw").forEach(s=>s.classList.toggle("on",s.dataset.color===INK.color)); return; }
    if(b.dataset.ink==="undo") return inkUndo();
    if(b.dataset.ink==="redo") return inkRedo();
    if(b.dataset.ink==="addpage" && n){ n.ink.pages.push([]); addPageEl(n.ink.pages.length-1); markNote(n); $("#pages").lastElementChild.scrollIntoView({behavior:"smooth"}); return; }
    if(b.dataset.ink==="penonly"){ INK.penOnly=!INK.penOnly; saveInkPrefs(); b.classList.toggle("on",INK.penOnly); document.querySelectorAll(".page").forEach(p=>p.classList.toggle("penonly",INK.penOnly)); toast(INK.penOnly?"✏️ Solo lápiz: el dedo hace scroll":"👆 El dedo también dibuja"); return; }
    if(b.dataset.ink==="png" && inkState){ const idx=visiblePage(); const cv=inkState.canvases[idx]; const a=document.createElement("a"); a.href=cv.toDataURL("image/png"); a.download=`${(n.title||"nota").replace(/[^\w\-áéíóúñ ]/gi,"")}-p${idx+1}.png`; a.click(); return; }
  });
  $("#editor").addEventListener("input",e=>{
    if(e.target.id==="nTitle" && nbNote){ const n=DB.notes[nbNote]; n.title=e.target.value; markNote(n,800); }
    if(e.target.id==="inkW"){ INK.width=+e.target.value; saveInkPrefs(); }
  });
  $("#editor").addEventListener("change",e=>{ if(e.target.id==="paper"){ INK.paper=e.target.value; saveInkPrefs(); inkState?.canvases.forEach((_,i)=>redrawPage(i)); } });
  document.addEventListener("keydown",e=>{ if($("#view-notas").hidden || nbMode!=="ink" || !inkState) return; if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="z"){ e.preventDefault(); e.shiftKey?inkRedo():inkUndo(); } });
}
function visiblePage(){ let best=0,bd=1e9; inkState.canvases.forEach((cv,i)=>{ const r=cv.getBoundingClientRect(); const d=Math.abs(r.top+r.height/2-innerHeight/2); if(d<bd){bd=d;best=i;} }); return best; }

/* Markdown mínimo y seguro (escapa primero) */
function md(src){
  const lines=esc(src).split("\n"); let out="", inList=false, inCode=false, code="";
  const inline=s=>s.replace(/`([^`]+)`/g,"<code>$1</code>").replace(/\*\*([^*]+)\*\*/g,"<b>$1</b>").replace(/(^|[^*])\*([^*]+)\*/g,"$1<i>$2</i>")
    .replace(/\[([^\]]+)\]\((https?:\/\/[^)\s]+)\)/g,'<a href="$2" target="_blank" rel="noopener">$1</a>');
  const closeList=()=>{ if(inList){ out+="</ul>"; inList=false; } };
  for(const l of lines){
    if(l.startsWith("```")){ if(inCode){ out+=`<pre><code>${code}</code></pre>`; code=""; inCode=false; } else { closeList(); inCode=true; } continue; }
    if(inCode){ code+=l+"\n"; continue; }
    let m;
    if((m=l.match(/^(#{1,3})\s+(.*)/))){ closeList(); out+=`<h${m[1].length}>${inline(m[2])}</h${m[1].length}>`; continue; }
    if((m=l.match(/^\s*[-*]\s+\[( |x)\]\s+(.*)/i))){ if(!inList){out+='<ul style="list-style:none;padding-left:4px">';inList=true;} out+=`<li>${m[1].trim()?"☑️":"⬜"} ${inline(m[2])}</li>`; continue; }
    if((m=l.match(/^\s*[-*]\s+(.*)/))){ if(!inList){out+="<ul>";inList=true;} out+=`<li>${inline(m[1])}</li>`; continue; }
    if((m=l.match(/^&gt;\s?(.*)/))){ closeList(); out+=`<blockquote>${inline(m[1])}</blockquote>`; continue; }
    closeList(); out+= l.trim()? `<p>${inline(l)}</p>` : "";
  }
  closeList(); if(inCode) out+=`<pre><code>${code}</code></pre>`;
  return out;
}

/* ======================= NAVEGACIÓN / FX ======================= */
let view="malla";
function go(v){
  view=v; ["malla","agenda","notas"].forEach(x=>$("#view-"+x).hidden = x!==v);
  document.querySelectorAll("[data-view]").forEach(b=>b.classList.toggle("on",b.dataset.view===v));
  try{ localStorage.setItem("uq.view",v); }catch(e){}
  if(v==="malla") renderMalla(); if(v==="agenda") renderAgenda(); if(v==="notas") renderNotebook();
  window.scrollTo({top:0});
}
function rerender(fromSync){
  if(view==="malla") renderMalla(!fromSync);
  if(view==="agenda") renderAgenda();
  if(view==="notas"){
    // no interrumpir mientras se escribe o dibuja
    const typing = document.activeElement && ["nText","nTitle"].includes(document.activeElement.id);
    if(!(fromSync && (typing || (nbMode==="ink" && nbNote)))) renderNotebook(); else renderSubjects();
  }
}
function toast(msg){ const t=$("#toast"); t.textContent=msg; t.classList.add("show"); clearTimeout(t._h); t._h=setTimeout(()=>t.classList.remove("show"),2600); }
function popXP(x,y,txt){ const p=document.createElement("div"); p.className="pop"; p.textContent=txt; p.style.left=x+"px"; p.style.top=y+"px"; document.body.appendChild(p); setTimeout(()=>p.remove(),1000); }
function confetti(){ const cols=["#7cf6c3","#ffcc4d","#b388ff","#4dd6e8","#ff7a59"];
  for(let i=0;i<60;i++){ const d=document.createElement("div");
    Object.assign(d.style,{position:"fixed",left:Math.random()*100+"vw",top:"-10px",width:"8px",height:"12px",background:cols[i%5],zIndex:70,borderRadius:"2px",transition:`transform ${1.2+Math.random()}s ease-in, opacity 1.6s`});
    document.body.appendChild(d); requestAnimationFrame(()=>{d.style.transform=`translate(${(Math.random()-.5)*200}px,${innerHeight+40}px) rotate(${Math.random()*720}deg)`;d.style.opacity=0;}); setTimeout(()=>d.remove(),2600); } }

/* ======================= ARRANQUE ======================= */
(async function boot(){
  try{
    const saved=await idb.get("db");
    if(saved){ DB=saved; DB.progress.data=Object.assign(structuredClone(DEFAULT_PROGRESS),DB.progress.data); }
    else { // migrar el progreso de la versión 1 (localStorage)
      const old=localStorage.getItem("unadquest.v1");
      if(old){ DB.progress.data=Object.assign(structuredClone(DEFAULT_PROGRESS),JSON.parse(old)); DB.progress.updated_at=Date.now(); DB.progress.dirty=true; }
    }
  }catch(e){ console.warn("boot",e); }
  S=DB.progress.data;
  renderLegend(); bindMalla(); bindAgenda(); bindNotebook();
  document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>go(b.dataset.view)));
  $("#sync").addEventListener("click",()=>sync());
  let v="malla"; try{ v=new URLSearchParams(location.search).get("v")||localStorage.getItem("uq.view")||"malla"; }catch(e){}
  go(["malla","agenda","notas"].includes(v)?v:"malla");
  setInterval(renderHUD,60000);
  sync();
  if("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(e=>console.warn("sw",e));
})();
