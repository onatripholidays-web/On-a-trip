"use client";

import {useEffect,useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import type {CrmSession} from "@/lib/crm-auth";

type Lead={id?:string|number;name?:string;phone?:string;email?:string;dest?:string;destination?:string;status?:string;salesperson?:string;source?:string;branch?:string;priority?:string;value?:string|number;notes?:string;follow?:string;follow_up?:string;date?:string;travel_date?:string;trav?:number;travellers?:number;created_at?:string;created_by?:string;assigned_to?:string;updated_by?:string;updated_at?:string};
type Form={name:string;phone:string;email:string;destination:string;status:string;source:string;branch:string;priority:string;value:string;travelDate:string;travellers:string;followUp:string;notes:string};

const stages=["New","Contacted","Qualified","Hot","Quote Sent","Follow-up","Booked","Lost"];
const sources=["Website","Meta Ads","Instagram","Facebook","WhatsApp","Google","Walk-in","Sheet Import"];
const blank:Form={name:"",phone:"",email:"",destination:"",status:"New",source:"Website",branch:"Hyderabad",priority:"Normal",value:"",travelDate:"",travellers:"2",followUp:"",notes:""};

function num(v:unknown){const n=Number(String(v??"").replace(/[^0-9.]/g,""));return Number.isFinite(n)?n:0}
function dateText(v:unknown){if(!v)return "—";const d=new Date(String(v));return Number.isNaN(d.getTime())?String(v):d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
function phone(v:unknown){return String(v||"").replace(/\D/g,"")}
function initials(v:string){return v.trim().split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()||"").join("")||"L"}

export default function CrmWorkspaceV2({session,initialLeads}:{session:CrmSession;initialLeads:Lead[]}){
 const router=useRouter();
 const [leads,setLeads]=useState<Lead[]>(initialLeads||[]);
 const [salespeople,setSalespeople]=useState<string[]>([]);
 const [view,setView]=useState<"dashboard"|"leads"|"followups"|"bookings">("dashboard");
 const [query,setQuery]=useState("");
 const [stage,setStage]=useState("All");
 const [source,setSource]=useState("All");
 const [priority,setPriority]=useState("All");
 const [branch,setBranch]=useState("All");
 const [owner,setOwner]=useState("All");
 const [selected,setSelected]=useState<Lead|null>(null);
 const [showForm,setShowForm]=useState(false);
 const [form,setForm]=useState<Form>(blank);
 const [saving,setSaving]=useState(false);
 const [notice,setNotice]=useState("");
 const [error,setError]=useState("");
 const isAdmin=session.profile.role==="admin";

 useEffect(()=>{
  if(!isAdmin)return;
  fetch("/api/crm/users",{cache:"no-store"})
   .then(r=>r.ok?r.json():null)
   .then((d:unknown)=>{
    const data=d as {users?:unknown[]}|null;
    const names:string[]=Array.isArray(data?.users)
     ?data.users.filter((u:unknown)=>{const x=u as {role?:string;is_active?:boolean};return x.role==="salesperson"&&x.is_active!==false})
      .map((u:unknown)=>{const x=u as {name?:string;salesperson?:string};return String(x.name||x.salesperson||"")})
      .filter((x:string):x is string=>Boolean(x))
     :[];
    setSalespeople(Array.from(new Set<string>(names)).sort());
   })
   .catch(()=>{});
 },[isAdmin]);

 const active=useMemo(()=>leads.filter(l=>String(l.status||"").toLowerCase()!=="deleted"),[leads]);
 const owners=useMemo(()=>Array.from(new Set<string>([...salespeople,...active.map(l=>String(l.salesperson||"")).filter(Boolean)])).sort(),[salespeople,active]);
 const branches=useMemo(()=>Array.from(new Set<string>(active.map(l=>String(l.branch||"")).filter(Boolean))).sort(),[active]);
 const filtered=useMemo(()=>active.filter(l=>{
  const hay=[l.name,l.phone,l.email,l.dest,l.destination,l.salesperson,l.source,l.status,l.branch,l.priority,l.notes].join(" ").toLowerCase();
  return hay.includes(query.toLowerCase())&&(stage==="All"||String(l.status||"New")==stage)&&(source==="All"||String(l.source||"")===source)&&(priority==="All"||String(l.priority||"Normal")===priority)&&(branch==="All"||String(l.branch||"")===branch)&&(owner==="All"||String(l.salesperson||"")===owner);
 }),[active,query,stage,source,priority,branch,owner]);
 const counts=useMemo(()=>Object.fromEntries(stages.map(s=>[s,active.filter(l=>String(l.status||"New")===s).length])),[active]);
 const followups=useMemo(()=>active.filter(l=>l.follow_up||l.follow||String(l.status||"")==="Follow-up"),[active]);
 const overdue=useMemo(()=>{const today=new Date();today.setHours(0,0,0,0);return followups.filter(l=>{const raw=l.follow_up||l.follow;if(!raw)return true;const d=new Date(String(raw));return !Number.isNaN(d.getTime())&&d<today})},[followups]);
 const bookings=useMemo(()=>active.filter(l=>String(l.status||"")==="Booked"),[active]);
 const pipelineValue=useMemo(()=>active.reduce((s,l)=>s+num(l.value),0),[active]);
 const bookedValue=useMemo(()=>bookings.reduce((s,l)=>s+num(l.value),0),[bookings]);
 const conversion=active.length?Math.round(bookings.length/active.length*100):0;
 const hot=useMemo(()=>active.filter(l=>String(l.status||"")==="Hot"||String(l.priority||"")==="Urgent"),[active]);
 const recent=useMemo(()=>[...active].sort((a,b)=>String(b.created_at||"").localeCompare(String(a.created_at||""))).slice(0,8),[active]);
 const setField=(k:keyof Form,v:string)=>setForm(f=>({...f,[k]:v}));
 function closeForm(){setShowForm(false);setSelected(null);setForm({...blank});setError("")}
 function newLead(){closeForm();setShowForm(true)}
 function editLead(l:Lead){setSelected(l);setForm({name:String(l.name||""),phone:String(l.phone||""),email:String(l.email||""),destination:String(l.dest||l.destination||""),status:String(l.status||"New"),source:String(l.source||"Website"),branch:String(l.branch||"Hyderabad"),priority:String(l.priority||"Normal"),value:String(l.value||""),travelDate:String(l.travel_date||l.date||"").slice(0,10),travellers:String(l.travellers??l.trav??"2"),followUp:String(l.follow_up||l.follow||"").slice(0,10),notes:String(l.notes||"")});setShowForm(true)}
 async function saveLead(e:React.FormEvent){
  e.preventDefault();setSaving(true);setError("");
  try{
   const payload={name:form.name,phone:form.phone,email:form.email,destination:form.destination,status:form.status,source:form.source,branch:form.branch,priority:form.priority,value:form.value,travel_date:form.travelDate||null,travellers:Number(form.travellers)||0,follow_up:form.followUp||null,notes:form.notes,salesperson:isAdmin?undefined:session.profile.salesperson};
   const r=await fetch("/api/crm/leads",{method:selected?"PATCH":"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(selected?{id:selected.id,...payload}:payload)});
   const d=await r.json().catch(()=>null);if(!r.ok)throw new Error(d?.error||"Could not save lead");
   const item=(Array.isArray(d)?d[0]:d) as Lead|null;
   if(selected)setLeads(ls=>ls.map(l=>String(l.id)===String(selected.id)?{...l,...item,...payload}:l));
   else setLeads(ls=>[item||{...payload},...ls]);
   closeForm();setNotice(selected?"Lead updated":"New lead created");
  }catch(e){setError(e instanceof Error?e.message:"Could not save lead")}finally{setSaving(false)}
 }
 async function updateStatus(id:string|number,status:string){setError("");const r=await fetch("/api/crm/leads",{method:"PATCH",headers:{"Content-Type":"application/json"},body:JSON.stringify({id,status})});if(!r.ok){setError("Could not update stage");return}setLeads(ls=>ls.map(l=>String(l.id)===String(id)?{...l,status}:l));setSelected(l=>l&&String(l.id)===String(id)?{...l,status}:l);setNotice(`Moved to ${status}`)}
 async function moveToBin(l:Lead){if(!isAdmin||!confirm(`Move ${String(l.name||"this lead")} to CRM Bin?`))return;const r=await fetch("/api/crm/leads",{method:"DELETE",headers:{"Content-Type":"application/json"},body:JSON.stringify({id:l.id})});if(!r.ok){setError("Could not move lead");return}setLeads(ls=>ls.map(x=>String(x.id)===String(l.id)?{...x,status:"Deleted"}:x));setSelected(null);setNotice("Lead moved to Bin")}
 function call(l:Lead){const p=phone(l.phone);if(p)window.location.href=`tel:${p}`}
 function whatsapp(l:Lead){const p=phone(l.phone);if(!p)return;window.open(`https://wa.me/${p.startsWith("91")?p:`91${p}`}?text=${encodeURIComponent(`Hi ${String(l.name||"")}, this is On A Trip Holidays. Following up regarding your ${String(l.dest||l.destination||"trip")} enquiry.`)}`,"_blank","noopener,noreferrer")}
 function itinerary(l?:Lead){const p=new URLSearchParams();if(l){p.set("leadId",String(l.id||""));p.set("name",String(l.name||""));p.set("phone",String(l.phone||""));p.set("destination",String(l.dest||l.destination||""));p.set("travelDate",String(l.travel_date||l.date||""));p.set("travellers",String(l.travellers??l.trav??""))}router.push(`/crm/itinerary${p.toString()?`?${p.toString()}`:""}`)}
 function invoice(){router.push("/crm/finance")}
 function exportCsv(){const head=["Name","Phone","Email","Destination","Status","Source","Branch","Priority","Value","Travel Date","Travellers","Follow-up","Salesperson"];const rows=filtered.map(l=>[l.name,l.phone,l.email,l.dest||l.destination,l.status,l.source,l.branch,l.priority,l.value,l.travel_date||l.date,l.travellers??l.trav,l.follow_up||l.follow,l.salesperson]);const csv=[head,...rows].map(r=>r.map(x=>`"${String(x??"").replace(/"/g,'""')}"`).join(",")).join("\n");const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([csv],{type:"text/csv;charset=utf-8"}));a.download=`on-a-trip-crm-${new Date().toISOString().slice(0,10)}.csv`;a.click();setNotice(`${filtered.length} leads exported`)}

 return <main className="crm-v2-shell">
  <aside className="crm-v2-sidebar"><div className="crm-v2-brand"><div className="crm-mark">OAT</div><div><b>ON A TRIP</b><span>HOLIDAYS CRM</span></div></div><div className="crm-v2-workspace"><span>WORKSPACE</span><b>{isAdmin?"Admin Control Center":"Sales Workspace"}</b></div><nav><button className={view==="dashboard"?"active":""} onClick={()=>setView("dashboard")}>⌂ <span>Overview</span></button><button className={view==="leads"?"active":""} onClick={()=>setView("leads")}>◉ <span>Leads</span><em>{active.length}</em></button><button className={view==="followups"?"active":""} onClick={()=>setView("followups")}>↻ <span>Follow-ups</span><em>{followups.length}</em></button><button className={view==="bookings"?"active":""} onClick={()=>setView("bookings")}>✓ <span>Bookings</span><em>{bookings.length}</em></button></nav><div className="crm-v2-side-foot"><span>Signed in as</span><b>{session.profile.salesperson||session.user.email||"Admin"}</b><button onClick={()=>router.push("/crm/login")}>Logout</button></div></aside>
  <section className="crm-v2-content"><header className="crm-v2-top"><div className="mobile-title"><span>ON A TRIP HOLIDAYS</span><b>{view==="dashboard"?"Sales Overview":view==="followups"?"Follow-ups":view==="bookings"?"Bookings":"Lead Management"}</b></div><div className="v2-top-search"><span>⌕</span><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search leads, phone, destination…"/></div><div className="crm-v2-top-actions"><button onClick={()=>itinerary()}>✨ AI Itinerary</button><button onClick={()=>invoice()}>▣ Invoice</button><button className="primary" onClick={newLead}>＋ New Lead</button></div></header>
   {notice&&<div className="crm-v2-toast" onClick={()=>setNotice("")}>✓ {notice}</div>}{error&&<div className="crm-v2-error">{error}</div>}
   {view==="dashboard"&&<section className="crm-v2-page"><div className="v2-hero"><div><span>SALES COMMAND CENTER</span><h1>Know every lead. Close every opportunity.</h1><p>One workspace for enquiries, follow-ups, bookings and customer actions.</p></div><div className="v2-hero-actions"><button className="primary" onClick={newLead}>＋ Add lead</button><button onClick={()=>setView("leads")}>Open pipeline →</button></div></div><div className="v2-kpis"><button onClick={()=>setView("leads")}><span>Total pipeline</span><b>{active.length}</b><small>Active enquiries</small></button><button onClick={()=>setView("followups")}><span>Follow-ups</span><b>{followups.length}</b><small>{overdue.length} overdue</small></button><button onClick={()=>{setStage("Hot");setView("leads")}}><span>Hot opportunities</span><b>{hot.length}</b><small>Hot + urgent</small></button><button onClick={()=>setView("bookings")}><span>Bookings</span><b>{bookings.length}</b><small>{conversion}% conversion</small></button><button><span>Booked revenue</span><b>₹{Math.round(bookedValue).toLocaleString("en-IN")}</b><small>Recorded lead value</small></button></div><div className="v2-main-grid"><div className="v2-card"><div className="v2-card-head"><div><span>PIPELINE</span><h2>Sales stages</h2></div><b>₹{Math.round(pipelineValue).toLocaleString("en-IN")}</b></div><div className="v2-stage-grid">{stages.map(s=><button key={s} onClick={()=>{setStage(s);setView("leads")}}><span>{s}</span><strong>{counts[s]||0}</strong><i style={{width:`${active.length?Math.max(5,Math.round(((counts[s]||0)/active.length)*100)):5}%`}}/></button>)}</div></div><div className="v2-card"><div className="v2-card-head"><div><span>RECENT</span><h2>Latest enquiries</h2></div><button onClick={()=>setView("leads")}>View all →</button></div><div className="v2-list">{recent.map(l=><button key={String(l.id)} onClick={()=>setSelected(l)}><span className="avatar">{initials(String(l.name||"Lead"))}</span><span><b>{String(l.name||"Unnamed")}</b><small>{String(l.dest||l.destination||"No destination")} · {String(l.status||"New")}</small></span><strong>₹{Math.round(num(l.value)).toLocaleString("en-IN")}</strong></button>)}{!recent.length&&<div className="v2-empty">No active enquiries yet.</div>}</div></div></div></section>}
   {view!=="dashboard"&&<section className="crm-v2-page"><div className="v2-hero compact"><div><span>{view==="followups"?"FOLLOW-UP QUEUE":view==="bookings"?"BOOKED LEADS":"LEAD PIPELINE"}</span><h1>{view==="followups"?"Follow up before the lead goes cold.":view==="bookings"?"Every booked lead in one view.":"Your full sales pipeline."}</h1><p>Search, filter and act without leaving the CRM.</p></div><div className="v2-hero-actions"><button onClick={exportCsv}>⇩ Export CSV</button><button className="primary" onClick={newLead}>＋ New Lead</button></div></div><div className="v2-filters"><input value={query} onChange={e=>setQuery(e.target.value)} placeholder="Search name, phone, destination…"/><select value={stage} onChange={e=>setStage(e.target.value)}><option>All</option>{stages.map(s=><option key={s}>{s}</option>)}</select><select value={source} onChange={e=>setSource(e.target.value)}><option>All</option>{sources.map(s=><option key={s}>{s}</option>)}</select><select value={priority} onChange={e=>setPriority(e.target.value)}><option>All</option><option>Normal</option><option>High</option><option>Urgent</option></select><select value={branch} onChange={e=>setBranch(e.target.value)}><option>All</option>{branches.map(b=><option key={b}>{b}</option>)}</select>{isAdmin&&<select value={owner} onChange={e=>setOwner(e.target.value)}><option>All</option>{owners.map(o=><option key={o}>{o}</option>)}</select>}</div><div className="v2-table-wrap"><table><thead><tr><th>Lead</th><th>Destination</th><th>Stage</th><th>Value</th><th>Travel</th><th>Follow-up</th><th>Owner</th><th></th></tr></thead><tbody>{filtered.filter(l=>view==="followups"?(l.follow_up||l.follow||String(l.status||"")==="Follow-up"):view==="bookings"?String(l.status||"")==="Booked":true).map(l=><tr key={String(l.id)} onClick={()=>setSelected(l)}><td><b>{String(l.name||"Unnamed")}</b><small>{String(l.phone||"")} · {String(l.source||"")}</small></td><td>{String(l.dest||l.destination||"—")}</td><td><span className="crm-status-pill">{String(l.status||"New")}</span></td><td>₹{Math.round(num(l.value)).toLocaleString("en-IN")}</td><td>{dateText(l.travel_date||l.date)}</td><td>{dateText(l.follow_up||l.follow)}</td><td>{String(l.salesperson||"Unassigned")}</td><td><button onClick={e=>{e.stopPropagation();setSelected(l)}}>Open →</button></td></tr>)}</tbody></table>{!filtered.length&&<div className="v2-empty">No leads match these filters.</div>}</div></section>}
  </section>
  {showForm&&<div className="crm-v2-overlay" onMouseDown={closeForm}><form className="crm-v2-form" onSubmit={saveLead} onMouseDown={e=>e.stopPropagation()}><div className="drawer-head"><div><span>{selected?"EDIT LEAD":"NEW LEAD"}</span><h2>{selected?String(selected.name||"Lead"):"Create a new enquiry"}</h2></div><button type="button" onClick={closeForm}>✕</button></div><div className="form-grid"><label>Name *<input required value={form.name} onChange={e=>setField("name",e.target.value)} placeholder="Customer name"/></label><label>Phone *<input required value={form.phone} onChange={e=>setField("phone",e.target.value)} placeholder="10-digit mobile"/></label><label>Email<input type="email" value={form.email} onChange={e=>setField("email",e.target.value)} placeholder="customer@email.com"/></label><label>Destination<input value={form.destination} onChange={e=>setField("destination",e.target.value)} placeholder="e.g. Kashmir"/></label><label>Status<select value={form.status} onChange={e=>setField("status",e.target.value)}>{stages.map(s=><option key={s}>{s}</option>)}</select></label><label>Source<select value={form.source} onChange={e=>setField("source",e.target.value)}>{sources.map(s=><option key={s}>{s}</option>)}</select></label><label>Branch<input value={form.branch} onChange={e=>setField("branch",e.target.value)}/></label><label>Priority<select value={form.priority} onChange={e=>setField("priority",e.target.value)}><option>Normal</option><option>High</option><option>Urgent</option></select></label><label>Travellers<input type="number" min="1" value={form.travellers} onChange={e=>setField("travellers",e.target.value)}/></label><label>Travel Date<input type="date" value={form.travelDate} onChange={e=>setField("travelDate",e.target.value)}/></label><label>Follow-up Date<input type="date" value={form.followUp} onChange={e=>setField("followUp",e.target.value)}/></label><label>Lead Value<input value={form.value} onChange={e=>setField("value",e.target.value)} placeholder="₹ amount"/></label><label className="full">Notes<textarea rows={4} value={form.notes} onChange={e=>setField("notes",e.target.value)} placeholder="Customer requirements, preferences, promises, next action…"/></label></div>{error&&<p className="crm-v2-form-error">{error}</p>}<div className="modal-actions"><button type="button" onClick={closeForm}>Cancel</button><button className="primary" disabled={saving}>{saving?"Saving…":selected?"Save changes":"Create lead"}</button></div></form></div>}
  {selected&&!showForm&&<div className="crm-v2-overlay" onMouseDown={()=>setSelected(null)}><aside className="crm-v2-drawer" onMouseDown={e=>e.stopPropagation()}><div className="drawer-head"><button onClick={()=>setSelected(null)}>✕</button><span>LEAD PROFILE</span></div><div className="drawer-profile"><div className="avatar avatar-xl">{initials(String(selected.name||"Lead"))}</div><div><h2>{String(selected.name||"Unnamed lead")}</h2><p>{String(selected.dest||selected.destination||"Destination not set")}</p></div></div><div className="drawer-actions"><button onClick={()=>call(selected)}>☎ Call</button><button onClick={()=>whatsapp(selected)}>◉ WhatsApp</button><button onClick={()=>editLead(selected)}>✎ Edit</button></div><div className="drawer-stage"><label>Pipeline stage<select value={String(selected.status||"New")} onChange={e=>updateStatus(selected.id||"",e.target.value)}>{stages.map(s=><option key={s}>{s}</option>)}</select></label></div><div className="drawer-grid"><div><span>Lead value</span><b>₹{Math.round(num(selected.value)).toLocaleString("en-IN")}</b></div><div><span>Travellers</span><b>{String(selected.travellers??selected.trav??"—")}</b></div><div><span>Travel date</span><b>{dateText(selected.travel_date||selected.date)}</b></div><div><span>Follow-up</span><b>{dateText(selected.follow_up||selected.follow)}</b></div><div><span>Source</span><b>{String(selected.source||"—")}</b></div><div><span>Salesperson</span><b>{String(selected.salesperson||"Unassigned")}</b></div><div><span>Branch</span><b>{String(selected.branch||"—")}</b></div><div><span>Priority</span><b>{String(selected.priority||"Normal")}</b></div></div><div className="drawer-contact"><h3>Contact</h3><p>{String(selected.phone||"No phone")}</p><p>{String(selected.email||"No email")}</p></div><div className="drawer-notes"><h3>Notes</h3><p>{String(selected.notes||"No notes added yet.")}</p></div><div className="drawer-bottom"><button onClick={()=>itinerary(selected)}>✨ AI Itinerary</button><button onClick={()=>invoice()}>▣ Invoice</button>{isAdmin&&<button className="danger" onClick={()=>moveToBin(selected)}>Move to Bin</button>}</div></aside></div>}
 </main>;
}
