import { useEffect, useState } from "react";
import VisualEditor from "./VisualEditor";
const API=import.meta.env.PROD?"":(import.meta.env.VITE_API_URL||"http://localhost:5000").replace(/\/$/,"");
const seed={
 profile:{name:"Soham Gaikwad",role:"Fresher · Frontend Developer",location:"India",tagline:"B.Sc. IT graduate seeking an entry-level frontend development opportunity.",bio:"I'm a fresher and B.Sc. Information Technology graduate focused on building responsive web experiences with React and JavaScript. I'm also developing foundational knowledge in application support, SQL, Linux, networking and ITIL concepts.",email:"sohamgaikwad06@gmail.com",github:"https://github.com/Demongs06",linkedin:"https://www.linkedin.com/in/sohamgaikwad",resumeUrl:"/Soham-Gaikwad-resume.pdf",availability:"Open to full-time opportunities"},
 skills:[
  {category:"Frontend",items:["JavaScript (ES6+)","React","HTML5","CSS3","Tailwind CSS","Responsive Design"]},
  {category:"React & APIs",items:["React Hooks","React Router","Context API","Reusable Components","REST APIs","Axios","JWT"]},
  {category:"Tools & Platforms",items:["Git","GitHub","WordPress","AOS.js","Rellax.js","Expo Router"]},
  {category:"Application Support · Foundational",items:["SQL: SELECT, JOIN, UPDATE, DELETE","Linux: commands, permissions, logs, processes","DNS, DHCP, IP, ports, HTTP","ITIL: Incident, Problem, Change","Ticketing workflows"]}
 ],
 experience:[],
 projects:[
  {title:"LearnHub – Educational Platform",category:"Full-stack web application",description:"Learning management system with student and admin accounts, course publishing, enrollment, lesson progress tracking and admin analytics. Paid-course checkout is simulated for demonstration; no real payments are processed.",stack:["React","Vite","Express","MongoDB","Mongoose","JWT"],github:"https://github.com/Demongs06/Educational-platform",live:"https://education-platform-portfolio.netlify.app",liveLabel:"Live demo",imageUrl:"https://res.cloudinary.com/thkhatih/image/upload/v1795531851/soham-portfolio/file_qq5te0.jpg",featured:true},
  {title:"HRMS Employee Management",category:"Full-stack web application",description:"Employee and administrator workflows for attendance, leave applications, payslips and employee records, backed by an Express API, MongoDB and Cloudinary file storage.",stack:["React 19","Vite","Tailwind CSS","Express","MongoDB","Cloudinary","JWT"],github:"https://github.com/Demongs06/hrms-employee-management",live:"https://hrms-portfolio.netlify.app",liveLabel:"Live demo",imageUrl:"https://res.cloudinary.com/thkhatih/image/upload/v1795531258/soham-portfolio/file_rth8o3.png",featured:true},
  {title:"Hospital Management System",category:"Mobile application",description:"Role-based hospital management app for patients, doctors and administrators, with appointment workflows, patient admissions, room and doctor management, diagnosis updates and discharge handling.",stack:["React Native","Expo Router","MongoDB","JWT"],github:"https://github.com/Soham-Gaikwad-GTasterix/Tasks/tree/main/Day40",live:"https://drive.google.com/file/d/1cNalyZHgOlAjnDcB9CBuUwSJ0cXY7TmZ/view?usp=sharing",liveLabel:"Download APK",imageUrl:"https://res.cloudinary.com/thkhatih/image/upload/v1795529863/soham-portfolio/file_i4xt4o.jpg",featured:true}
 ],certificates:[]
};
function Title({n,title,note}){return <div className="heading"><span className="eyebrow">{n}</span><h2>{title}</h2>{note&&<p>{note}</p>}</div>}
function Icon({children}){return <span className="icon">{children}</span>}
function externalUrl(value){const raw=String(value||"").trim();if(!raw)return "";try{const url=new URL(/^[a-z][a-z\d+.-]*:/i.test(raw)?raw:"https://"+raw);return url.protocol==="https:"||url.protocol==="http:"?url.href:"";}catch{return "";}}
function resumeDownloadName(value){const href=externalUrl(value);let extension="pdf";try{const match=new URL(href).pathname.match(/\.([a-z0-9]{1,8})$/i);if(match)extension=match[1].toLowerCase();}catch{}return "Soham-Gaikwad-Resume."+extension;}
function resumeDownloadUrl(value){return externalUrl(value)?API+"/api/public/resume":"";}
function PublicSite(){
 const [data,setData]=useState(seed),[menu,setMenu]=useState(false),[form,setForm]=useState({name:"",email:"",message:""}),[status,setStatus]=useState(""),[sending,setSending]=useState(false);
 useEffect(()=>{fetch(API+"/api/public/portfolio",{cache:"no-store"}).then(r=>r.ok?r.json():Promise.reject()).then(remote=>setData(old=>({...old,...remote,profile:{...old.profile,...remote.profile}}))).catch(()=>{});},[]);
 const p=data.profile||seed.profile;
 const experience=(Array.isArray(data.experience)?data.experience:[]).filter(x=>x&&[x.title,x.company].some(v=>typeof v==="string"&&v.trim()));
 const projects=(data.projects||[]).filter(x=>!["weather app","stopwatch","tic-tac-toe","tic tac toe"].includes(String(x.title||"").trim().toLowerCase())).sort((a,b)=>Number(Boolean(b.featured))-Number(Boolean(a.featured)));
 async function send(e){e.preventDefault();setSending(true);setStatus("");try{const r=await fetch(API+"/api/public/contact",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(form)});const b=await r.json();if(!r.ok)throw Error(b.message);setStatus("Thanks — your message has been sent.");setForm({name:"",email:"",message:""});}catch(e){setStatus(e.message||"Unable to send. Please email me directly.");}finally{setSending(false);}}
 return <div className="shell">
  <header className="nav"><a className="brand" href="#home"><b>S</b> soham<span>.</span></a><button className="menu" onClick={()=>setMenu(!menu)} aria-label="Toggle navigation">{menu?"×":"☰"}</button><nav className={menu?"open":""}>{["About",...(experience.length?["Experience"]:[]),"Skills","Projects","Contact"].map(x=><a key={x} href={"#"+x.toLowerCase()} onClick={()=>setMenu(false)}>{x}</a>)}<a className="admin-link" href="/admin">Admin ↗</a></nav></header>
  <main>
   <section className="hero wrap" id="home"><div><div className="availability"><i/> {p.availability}</div><span className="eyebrow">HELLO, I'M SOHAM GAIKWAD</span><h1>Building digital<br/><em>experiences</em><br/>that work.</h1><p className="intro">{p.tagline} {p.bio}</p><div className="actions"><a className="btn primary" href="#projects">Explore my work ↗</a><a className="btn" href={resumeDownloadUrl(p.resumeUrl)||"#contact"} download="Soham-Gaikwad-Resume.pdf">View resume ↗</a></div><div className="social"><a href={externalUrl(p.github)} target="_blank" rel="noreferrer">GitHub ↗</a><a href={externalUrl(p.linkedin)} target="_blank" rel="noreferrer">LinkedIn ↗</a><a href={"mailto:"+p.email}>Email ↗</a></div></div><div className="art"><div className="ring r1"/><div className="ring r2"/><div className="profile-card"><small>PROFILE / 01</small><div className="avatar">{p.imageUrl?<img src={p.imageUrl} alt={p.name+" profile"} />:"SG"}</div><h3>{p.name}</h3><p>{p.role}</p><hr/><label>BASED IN <b>{p.location}</b></label><label>FOCUS <b>React · JavaScript</b></label></div><span className="float f1">{"</>"} React</span><span className="float f2">API · UI · UX</span></div><a className="scroll" href="#about">— SCROLL TO EXPLORE</a></section>
   <section className="section wrap" id="about"><Title n="01 / A LITTLE INTRO" title="About me" note="A developer who enjoys turning ideas into practical, polished interfaces."/><div className="two-col"><h3>I care about the details — from responsive layouts to the small interactions that make an interface feel intuitive.</h3><div><p>{p.bio}</p><p>As a fresher, I'm building practical frontend projects while strengthening my application support fundamentals: SQL, Linux, networking, ITIL concepts and ticket handling.</p><div className="education"><small>EDUCATION</small><b>B.Sc. Information Technology</b><span>C.K.T. Arts, Commerce and Science College · 2023</span></div></div></div></section>
   {experience.length>0&&<section className="section wrap" id="experience"><Title n="02 / EXPERIENCE" title="Experience" note="Professional experience and responsibilities."/><div className="timeline">{experience.map((x,i)=><article key={x._id||x.title||x.company||i}><small>{String(i+1).padStart(2,"0")}</small><div><div className="job"><h3>{x.title||x.company}</h3>{x.period&&<time>{x.period}</time>}</div>{x.title&&x.company&&<b>{x.company}</b>}{x.description&&<p>{x.description}</p>}</div></article>)}</div></section>}
   <section className="section wrap" id="skills"><Title n={experience.length?"03 / TOOLKIT":"02 / TOOLKIT"} title="Skills & technologies" note="Tools I use and concepts I'm actively developing."/><div className="skills">{(data.skills||[]).map((x,i)=><article key={x.category}><small>0{i+1}</small><h3>{x.category}</h3><div>{(x.items||[]).map(t=><span key={t}>{t}</span>)}</div></article>)}</div></section>
   <section className="section wrap" id="projects"><Title n={experience.length?"04 / SELECTED WORK":"03 / SELECTED WORK"} title="Projects" note="A mix of practical applications, learning projects and interface work."/><div className="projects">{projects.map((x,i)=><article key={x._id||x.title}><div className="project-meta"><small>PROJECT / {String(i+1).padStart(2,"0")}</small><small>{x.featured?"FEATURED · ":""}{x.category||"Development"}</small></div><div className="project-art">{x.imageUrl?<img src={x.imageUrl} alt={x.title+" screenshot"} loading="lazy"/>:<span>{String(x.title).slice(0,2).toUpperCase()}</span>}</div><div className="project-body"><h3>{x.title}</h3><p>{x.description}</p><div className="tags">{(x.stack||[]).map(t=><span key={t}>{t}</span>)}</div><div className="project-links">{x.github&&<a href={externalUrl(x.github)} target="_blank" rel="noreferrer">GitHub ↗</a>}{x.live&&<a href={externalUrl(x.live)} target="_blank" rel="noreferrer">{x.liveLabel||"Live demo"} ↗</a>}</div></div></article>)}</div></section>
   {(data.certificates||[]).length>0&&<section className="section wrap"><Title n="05 / LEARNING" title="Certificates"/><div className="certs">{data.certificates.map((x,i)=><a key={i} href={externalUrl(x.url)} target="_blank" rel="noreferrer">{x.title}<span>{x.issuer}</span> ↗</a>)}</div></section>}
   <section className="contact wrap" id="contact"><div><span className="eyebrow">05 / LET'S CONNECT</span><h2>Have a role or project<br/>in mind? <em>Let's talk.</em></h2><p>I'm interested in frontend development and entry-level application support opportunities.</p><a className="email" href={"mailto:"+p.email}>{p.email} ↗</a></div><form onSubmit={send}><label>Your name<input required maxLength="80" value={form.name} onChange={e=>setForm({...form,name:e.target.value})}/></label><label>Email address<input required type="email" maxLength="160" value={form.email} onChange={e=>setForm({...form,email:e.target.value})}/></label><label>Message<textarea required minLength="10" maxLength="3000" rows="4" value={form.message} onChange={e=>setForm({...form,message:e.target.value})}/></label><button className="btn primary" disabled={sending}>{sending?"Sending...":"Send message ↗"}</button>{status&&<p role="status" className="status">{status}</p>}</form></section>
  </main><footer className="footer wrap"><a className="brand" href="#home"><b>S</b> soham<span>.</span></a><span>Designed & built by Soham Gaikwad</span><span>© {new Date().getFullYear()}</span></footer>
 </div>;
}
function Admin(){
 const [signedIn,setSignedIn]=useState(false),[checking,setChecking]=useState(true),[expiresAt,setExpiresAt]=useState(null),[email,setEmail]=useState(""),[password,setPassword]=useState(""),[section,setSection]=useState("profile"),[view,setView]=useState("content"),[json,setJson]=useState(""),[messages,setMessages]=useState([]),[status,setStatus]=useState(""),[busy,setBusy]=useState(false),[asset,setAsset]=useState(""),[assets,setAssets]=useState([]),[assetProjects,setAssetProjects]=useState([]),[selectedProject,setSelectedProject]=useState("");
 const sections=["profile","skills","experience","projects","certificates"];
 async function api(path,opts={}){
  const r=await fetch(API+path,{...opts,credentials:"include",headers:{...(opts.headers||{})}});
  const b=await r.json().catch(()=>({message:"Unexpected server response."}));
  if(r.status===401){
   setSignedIn(false);setExpiresAt(null);setJson("");setMessages([]);setView("content");
   throw Error(b.message||"Session expired. Please sign in again.");
  }
  if(!r.ok)throw Error(b.message||"Request failed");
  return b;
 }
 async function load(s="profile"){
  setBusy(true);setStatus("");
  try{const b=await api("/api/admin/content/"+s);const data=b.initialized?b.data:(s==="profile"?{...seed.profile,...(b.data||{})}:seed[s]);setSection(s);setView("content");setJson(JSON.stringify(data,null,2));setSignedIn(true);}
  catch(e){if(e.message.includes("Authentication")||e.message.includes("Session")){setSignedIn(false);setStatus("");}else setStatus(e.message);}
  finally{setBusy(false);setChecking(false);}
 }
 async function loadMessages(){
  setBusy(true);setStatus("");
  try{const b=await api("/api/admin/messages");setMessages(b.messages||[]);setView("messages");setSignedIn(true);}
  catch(e){setStatus(e.message);if(e.message.includes("Authentication")||e.message.includes("Session"))setSignedIn(false);}
  finally{setBusy(false);}
 }
 async function loadAssets(){
  setBusy(true);setStatus("");
  try{const [b,p]=await Promise.all([api("/api/admin/assets"),api("/api/admin/content/projects")]);setAssets(b.assets||[]);const projects=p.initialized?p.data:seed.projects;setAssetProjects(projects);setSelectedProject(projects.length?"0":"");setView("assets");setSignedIn(true);}
  catch(e){setStatus(e.message);if(e.message.includes("Authentication")||e.message.includes("Session"))setSignedIn(false);}
  finally{setBusy(false);setChecking(false);}
 }
 async function assignAsset(item,target){
  setBusy(true);setStatus("");
  try{
   if(target==="profile"){const current=await api("/api/admin/content/profile");const data={...(current.data||{}),imageUrl:item.url};await api("/api/admin/content/profile",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({data})});setStatus("Profile photo applied. Refresh the public website to see it.");}
   else{const index=Number(selectedProject);if(!Number.isInteger(index)||!assetProjects[index])throw Error("Select a project first.");const projects=assetProjects.map((project,i)=>i===index?{...project,imageUrl:item.url}:project);await api("/api/admin/content/projects",{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({data:projects})});setAssetProjects(projects);setStatus("Project image applied to "+projects[index].title+". Refresh the public website to see it.");}
  }catch(e){setStatus(e.message);}
  finally{setBusy(false);}
 }
 async function deleteAsset(item){
  if(!window.confirm("Delete this uploaded file permanently? Remove its URL from portfolio content first if it is in use."))return;
  setBusy(true);setStatus("");
  try{
   await api("/api/admin/assets",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({publicId:item.publicId,resourceType:item.resourceType})});
   setAssets(old=>old.filter(x=>x.publicId!==item.publicId));
   setStatus("File deleted.");
  }catch(e){setStatus(e.message);}
  finally{setBusy(false);}
 }
 useEffect(()=>{
  let active=true;
  api("/api/auth/session").then(session=>{
   if(!active)return;
   setExpiresAt(session.expiresAt);
   return load("profile");
  }).catch(()=>{
   if(active){setSignedIn(false);setExpiresAt(null);setChecking(false);}
  });
  return ()=>{active=false;};
 },[]);
 useEffect(()=>{
  if(!signedIn||!expiresAt)return;
  const expire=()=>{
   setSignedIn(false);setExpiresAt(null);setJson("");setMessages([]);setView("content");
   setStatus("Your 5-minute session has expired. Please sign in again.");
  };
  const remaining=expiresAt-Date.now();
  if(remaining<=0){expire();return;}
  const timer=setTimeout(expire,remaining);
  const checkOnReturn=()=>{
   if(Date.now()>=expiresAt)expire();
   else api("/api/auth/session").catch(()=>{});
  };
  window.addEventListener("focus",checkOnReturn);
  return ()=>{clearTimeout(timer);window.removeEventListener("focus",checkOnReturn);};
 },[signedIn,expiresAt]);
 async function login(e){
  e.preventDefault();setBusy(true);setStatus("");
  try{const session=await api("/api/auth/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});setExpiresAt(session.expiresAt);setSignedIn(true);setPassword("");await load("profile");}
  catch(e){setStatus(e.message);}
  finally{setBusy(false);setChecking(false);}
 }
 async function logout(){
  setBusy(true);setStatus("");
  try{
   await api("/api/auth/logout",{method:"POST"});
   setSignedIn(false);setExpiresAt(null);setJson("");setMessages([]);setView("content");setStatus("");
  }catch(e){setStatus("Sign out failed: "+e.message);}
  finally{setBusy(false);}
 }
 async function save(){
  setBusy(true);setStatus("");
  try{const data=JSON.parse(json);await api("/api/admin/content/"+section,{method:"PUT",headers:{"Content-Type":"application/json"},body:JSON.stringify({data})});setStatus("Changes saved.");}
  catch(e){setStatus(e instanceof SyntaxError?"Invalid JSON. Check commas and quotation marks.":e.message);}
  finally{setBusy(false);}
 }
 async function upload(e){
  const file=e.target.files?.[0];if(!file)return;
  const fd=new FormData();fd.append("file",file);setBusy(true);setStatus("");
  try{const b=await api("/api/admin/upload",{method:"POST",body:fd});setAsset(b.url);setStatus("Upload complete. Copy the URL into your content JSON.");if(view==="assets"){const list=await api("/api/admin/assets");setAssets(list.assets||[]);}}
  catch(e){setStatus(e.message);}
  finally{setBusy(false);e.target.value="";}
 }
 async function toggleRead(message){
  try{const b=await api("/api/admin/messages/"+message._id+"/read",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({read:!message.read})});setMessages(old=>old.map(x=>x._id===message._id?b.message:x));}
  catch(e){setStatus(e.message);}
 }
 async function deleteMessage(message){
  if(!window.confirm("Delete this message permanently?"))return;
  try{await api("/api/admin/messages/"+message._id,{method:"DELETE"});setMessages(old=>old.filter(x=>x._id!==message._id));}
  catch(e){setStatus(e.message);}
 }
 if(checking&&!signedIn)return <div className="admin-page"><p className="status" style={{padding:32}}>Checking admin session…</p></div>;
 if(!signedIn)return <div className="admin-page"><form className="login" onSubmit={login}><a className="brand" href="/">S soham<span>.</span></a><small>PRIVATE WORKSPACE</small><h1>Admin sign in</h1><p>Use the administrator credentials configured for this portfolio.</p><label>Email<input type="email" autoComplete="username" required value={email} onChange={e=>setEmail(e.target.value)}/></label><label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e=>setPassword(e.target.value)}/></label><button className="btn primary" disabled={busy}>{busy?"Signing in...":"Sign in ↗"}</button>{status&&<p role="status" className="status">{status}</p>}<a href="/">← Back to portfolio</a></form></div>;
 return <div className="admin-page"><aside className="sidebar"><a className="brand" href="/">S soham<span>.</span></a><small>CONTENT MANAGER</small>{sections.map(s=><button className={view==="content"&&section===s?"selected":""} key={s} onClick={()=>load(s)}>{s[0].toUpperCase()+s.slice(1)}</button>)}<button className={view==="assets"?"selected":""} onClick={loadAssets}>Images & files</button><button className={view==="messages"?"selected":""} onClick={loadMessages}>Messages</button><button className="logout" onClick={logout} disabled={busy}>{busy?"Signing out...":"Sign out"}</button></aside><main className="editor"><header><div><small>PORTFOLIO CMS</small><h1>{view==="messages"?"Contact messages":view==="assets"?"Images & files":"Manage "+section}</h1><p>{view==="messages"?"Messages sent through the public contact form.":view==="assets"?"Uploaded portfolio images, resume and certificates.":"Edit the content displayed on your public website."}</p></div><a className="btn" href="/" target="_blank" rel="noreferrer">View website ↗</a></header>
 {view==="content"?<><div className="toolbar"><label className="upload">Upload file<input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={upload}/></label><button className="btn primary" onClick={save} disabled={busy}>Save changes</button></div>{asset&&<div className="asset"><code>{asset}</code><button onClick={()=>navigator.clipboard.writeText(asset)}>Copy URL</button></div>}<VisualEditor section={section} value={json} onChange={setJson}/><p className="help">Use the fields above to manage your portfolio. For profile and project photos, upload an image in Images & files, then apply it there. Resume and certificate URLs can be pasted into their fields. Uploads accept JPG, PNG, WEBP and PDF (max 8 MB).</p></>:view==="messages"?<div className="messages">{messages.length?messages.map(m=><article className={"message-row"+(m.read?" read":"")} key={m._id}><div className="message-head"><div><b>{m.name}</b><a href={"mailto:"+m.email}>{m.email}</a></div><time>{new Date(m.createdAt).toLocaleString()}</time></div><p>{m.message}</p><div className="message-actions"><button onClick={()=>toggleRead(m)}>{m.read?"Mark unread":"Mark read"}</button><button onClick={()=>deleteMessage(m)}>Delete</button></div></article>):<p className="help">No contact messages yet.</p>}</div>:<><div className="toolbar"><label className="upload">Upload image or file<input type="file" accept="image/png,image/jpeg,image/webp,application/pdf" onChange={upload}/></label></div><section className="project-picker"><h2>Choose a project</h2><p>Select the exact project that should receive the thumbnail.</p><div className="project-picker-grid">{assetProjects.map((project,i)=><button type="button" key={project._id||project.title||i} className={"project-choice"+(selectedProject===String(i)?" selected":"")} onClick={()=>setSelectedProject(String(i))} aria-pressed={selectedProject===String(i)}><span className="project-choice-image">{project.imageUrl?<img src={project.imageUrl} alt="" loading="lazy"/>:<span>{String(project.title||"P").slice(0,2).toUpperCase()}</span>}</span><span className="project-choice-copy"><b>{project.title||"Untitled project"}</b><small>{selectedProject===String(i)?"Selected":"Select project"}</small></span></button>)}</div></section><div className="asset-grid">{assets.length?assets.map(item=><article className="asset-card" key={item.publicId}><div className="asset-preview">{item.resourceType==="image"?<img src={item.url} alt={item.publicId} loading="lazy"/>:<span>PDF</span>}</div><div className="asset-details"><b>{item.publicId.split("/").pop()}</b><small>{item.format?.toUpperCase()||item.resourceType} · {Math.max(1,Math.round(item.bytes/1024))} KB</small><a href={item.url} target="_blank" rel="noreferrer">Open file ↗</a></div><div className="asset-actions">{item.resourceType==="image"&&<><button disabled={busy} onClick={()=>assignAsset(item,"profile")}>Use as profile photo</button><select aria-label={"Choose project for "+item.publicId} value={selectedProject} onChange={e=>setSelectedProject(e.target.value)}><option value="">Select project</option>{assetProjects.map((project,i)=><option key={project._id||project.title||i} value={i}>{project.title||"Project "+(i+1)}</option>)}</select><button disabled={busy||selectedProject===""} onClick={()=>assignAsset(item,"project")}>Apply to {selectedProject!==""?(assetProjects[Number(selectedProject)]?.title||"selected project"):"selected project"}</button></>}<button onClick={()=>navigator.clipboard.writeText(item.url)}>Copy URL</button><button className="delete-upload" disabled={busy} onClick={()=>deleteAsset(item)}>Delete upload</button></div></article>):<p className="help">No uploaded files found. Upload a profile photo, project screenshot, resume or certificate.</p>}</div></>}
 {status&&<p role="status" className="status">{status}</p>}
 </main></div>;
}
export default function App(){return location.pathname.startsWith("/admin")?<Admin/>:<PublicSite/>;}