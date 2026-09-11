"use client";
import {useMemo,useState} from "react";
import {useRouter} from "next/navigation";
import type {CrmSession} from "@/lib/crm-auth";

type Lead=Record<string,unknown>&{id?:string|number;name?:string;phone?:string;email?:string;dest?:string;destination?:string;status?:string;salesperson?:string;source?:string;created_at?:string;follow?:string};
const stages=["New","Contacted","Qualified","Hot","Quote Sent","Follow-up","Booked","Lost"];
export default function CrmWorkspace({session,initialLeads}:{session:CrmSession;initialLeads:Lead[]}){
 const router=useRouter(); const [q,setQ]=useState(""); const [stage,setStage]=useState("All");
 const leads=useMemo(()=>initialLeads.filter(l=>{const hay=[l.name,l.phone,l.email,l.dest,l.destination,l.salesperson,l.source,l.status].join(" ").toLowerCase();return hay.includes(q.toLowerCase())&&(stage==="All"||String(l.status||"")===stage);}),[initialLeads,q,stage]);
 const counts=useMemo(()=>Object.fromEntries(stages.map(s=>[s,initialLeads.filter(l=>String(l.status||"")===s).length])),[initialLeads]);
 async function logout(){await fetch("/api/crm/logout",{method:"POST"});router.push("/crm/login");router.refresh();}
 return <main className="crm-shell"><header className="crm-top"><div><b>On A Trip Holidays</b><span>CRM • {session.profile.role}{session.profile.salesperson?` • ${session.profile.salesperson}`:""}</span></div><button onClick={logout}>Logout</button></header>
 <section className="crm-main"><div className="crm-heading"><div><span className="crm-kicker">CRM WORKSPACE</span><h1>{session.profile.role==="admin"?"Admin Dashboard":"My Sales Dashboard"}</h1><p>Manage leads, follow-ups and customer conversations from the same Next.js application.</p></div><a href="/">Back to website</a></div>
 <div className="crm-stats"><div><strong>{initialLeads.length}</strong><span>Total accessible leads</span></div>{stages.slice(0,3).map(s=><div key={s}><strong>{counts[s]}</strong><span>{s}</span></div>)}</div>
 <div className="crm-panel"><div className="crm-toolbar"><input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search name, phone, destination, salesperson…"/><select value={stage} onChange={e=>setStage(e.target.value)}><option>All</option>{stages.map(s=><option key={s}>{s}</option>)}</select><button onClick={()=>router.refresh()}>Refresh</button></div>
 <div className="crm-table-wrap"><table><thead><tr><th>Lead</th><th>Phone</th><th>Destination</th><th>Status</th><th>Salesperson</th><th>Created</th></tr></thead><tbody>{leads.map((l,i)=><tr key={String(l.id??i)}><td><b>{String(l.name||"Unknown")}</b><small>{String(l.email||"")}</small></td><td>{String(l.phone||"—")}</td><td>{String(l.dest||l.destination||"—")}</td><td><span className="crm-pill">{String(l.status||"New")}</span></td><td>{String(l.salesperson||"Unassigned")}</td><td>{l.created_at?new Date(String(l.created_at)).toLocaleDateString("en-IN"):"—"}</td></tr>)}{!leads.length&&<tr><td colSpan={6} className="crm-empty">No matching leads.</td></tr>}</tbody></table></div></div></section></main>;
}
