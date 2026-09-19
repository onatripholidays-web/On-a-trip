"use client";

import {useMemo,useState} from "react";

type Lead={id?:string|number;name?:string;phone?:string;email?:string;dest?:string;destination?:string;status?:string;salesperson?:string;source?:string;branch?:string;priority?:string;value?:string|number;notes?:string;follow?:string;follow_up?:string;date?:string;travel_date?:string;trav?:number;travellers?:number;created_at?:string;created_by?:string;assigned_to?:string;updated_by?:string;updated_at?:string};

type Props={
  leads:Lead[];
  owners:string[];
  onOpenLead:(lead:Lead)=>void;
  onView:(view:"leads"|"followups"|"bookings")=>void;
};

const stages=["New","Contacted","Qualified","Hot","Quote Sent","Follow-up","Booked","Lost"];

function num(v:unknown){const n=Number(String(v??"").replace(/[^0-9.]/g,""));return Number.isFinite(n)?n:0}
function dateText(v:unknown){if(!v)return "—";const d=new Date(String(v));return Number.isNaN(d.getTime())?String(v):d.toLocaleDateString("en-IN",{day:"2-digit",month:"short",year:"numeric"})}
function initials(v:string){return v.trim().split(/\s+/).slice(0,2).map(x=>x[0]?.toUpperCase()||"").join("")||"L"}
function monthKey(d:Date){return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}`}

export default function CrmOrganizationDashboard({leads,owners,onOpenLead,onView}:Props){
  const [owner,setOwner]=useState("All Users");
  const [period,setPeriod]=useState("This Month");
  const [customFrom,setCustomFrom]=useState("");
  const [customTo,setCustomTo]=useState("");
  const now=new Date();

  const scoped=useMemo(()=>{
    const base=leads.filter(l=>owner==="All Users"||String(l.salesperson||"")===owner);
    if(period==="Custom"){
      const from=customFrom?new Date(customFrom+"T00:00:00"):null;
      const to=customTo?new Date(customTo+"T23:59:59"):null;
      return base.filter(l=>{const d=new Date(String(l.created_at||""));if(Number.isNaN(d.getTime()))return false;return (!from||d>=from)&&(!to||d<=to)});
    }
    if(period==="Today"){
      const start=new Date(now);start.setHours(0,0,0,0);
      return base.filter(l=>new Date(String(l.created_at||""))>=start);
    }
    if(period==="This Week"){
      const start=new Date(now);start.setHours(0,0,0,0);
      const day=start.getDay()||7;start.setDate(start.getDate()-day+1);
      return base.filter(l=>new Date(String(l.created_at||""))>=start);
    }
    if(period==="This Year"){
      const start=new Date(now.getFullYear(),0,1);
      return base.filter(l=>new Date(String(l.created_at||""))>=start);
    }
    const start=new Date(now.getFullYear(),now.getMonth(),1);
    return base.filter(l=>new Date(String(l.created_at||""))>=start);
  },[leads,owner,period,customFrom,customTo]);

  const booked=scoped.filter(l=>String(l.status||"").toLowerCase()==="booked");
  const followups=scoped.filter(l=>l.follow_up||l.follow||String(l.status||"")==="Follow-up");
  const upcoming=scoped.filter(l=>{const d=new Date(String(l.travel_date||""));return String(l.status||"").toLowerCase()==="booked"&&!Number.isNaN(d.getTime())&&d>=new Date(now.getFullYear(),now.getMonth(),now.getDate())});
  const bookedValue=booked.reduce((s,l)=>s+num(l.value),0);
  const overdue=followups.filter(l=>{const d=new Date(String(l.follow_up||l.follow||""));return !Number.isNaN(d.getTime())&&d<new Date(now.getFullYear(),now.getMonth(),now.getDate())}).length;

  const stageCounts=useMemo(()=>Object.fromEntries(stages.map(s=>[s,scoped.filter(l=>String(l.status||"New")===s).length])),[scoped]);
  const sourceCounts=useMemo(()=>{
    const m=new Map<string,number>();
    scoped.forEach(l=>{const key=String(l.source||"Other");m.set(key,(m.get(key)||0)+1)});
    return [...m.entries()].sort((a,b)=>b[1]-a[1]).slice(0,6);
  },[scoped]);
  const recent=useMemo(()=>[...scoped].sort((a,b)=>String(b.created_at||"").localeCompare(String(a.created_at||""))).slice(0,6),[scoped]);
  const months=useMemo(()=>{
    const out=[];for(let i=5;i>=0;i--){const d=new Date(now.getFullYear(),now.getMonth()-i,1);const key=monthKey(d);const items=leads.filter(l=>monthKey(new Date(String(l.created_at||"")))===key);out.push({label:d.toLocaleDateString("en-IN",{month:"short"}),total:items.length,booked:items.filter(l=>String(l.status||"").toLowerCase()==="booked").length})}return out;
  },[leads]);
  const maxMonth=Math.max(1,...months.map(x=>x.total));
  const team=useMemo(()=>owners.map(name=>{const items=leads.filter(l=>String(l.salesperson||"")===name);return {name,leads:items.length,bookings:items.filter(l=>String(l.status||"").toLowerCase()==="booked").length,value:items.filter(l=>String(l.status||"").toLowerCase()==="booked").reduce((s,l)=>s+num(l.value),0)}}).sort((a,b)=>b.value-a.value).slice(0,6),[owners,leads]);

  return <section className="crm-v2-page crm-org-dashboard">
    <div className="org-head">
      <div>
        <span>LIVE TRAVEL CRM OVERVIEW</span>
        <h1>Organization Dashboard</h1>
        <p>Sales, enquiries, follow-ups and bookings in one view.</p>
      </div>
      <div className="org-filters">
        <select value={owner} onChange={e=>setOwner(e.target.value)}><option>All Users</option>{owners.map(x=><option key={x}>{x}</option>)}</select>
        <select value={period} onChange={e=>setPeriod(e.target.value)}><option>Today</option><option>This Week</option><option>This Month</option><option>This Year</option><option>Custom</option></select>
      </div>
    </div>
    {period==="Custom"&&<div className="org-custom-filter"><label>From<input type="date" value={customFrom} onChange={e=>setCustomFrom(e.target.value)}/></label><label>To<input type="date" value={customTo} onChange={e=>setCustomTo(e.target.value)}/></label></div>}

    <div className="org-kpis">
      <button onClick={()=>onView("leads")}><span>💬 Total Queries</span><b>{scoped.length}</b><small>Selected period</small></button>
      <button onClick={()=>onView("bookings")}><span>✓ Confirmed Queries</span><b>{booked.length}</b><small>Booked leads</small></button>
      <button><span>▣ Confirmed Query Value</span><b>₹{Math.round(bookedValue).toLocaleString("en-IN")}</b><small>Recorded booking value</small></button>
      <button onClick={()=>onView("bookings")}><span>✈ Upcoming Departures</span><b>{upcoming.length}</b><small>Booked trips with travel date</small></button>
      <button onClick={()=>onView("followups")}><span>↻ Follow-ups</span><b>{followups.length}</b><small>{overdue} overdue</small></button>
      <button><span>🔥 Hot Leads</span><b>{stageCounts.Hot||0}</b><small>Current hot stage</small></button>
    </div>

    <div className="org-grid org-grid-3">
      <div className="v2-card org-card">
        <div className="v2-card-head"><div><span>TODAY'S WORK</span><h2>Follow-ups</h2></div><button onClick={()=>onView("followups")}>View all</button></div>
        <div className="org-list">{followups.slice(0,5).map(l=><button key={String(l.id)} onClick={()=>onOpenLead(l)}><span className="crm-avatar">{initials(String(l.name||"Lead"))}</span><span><b>{l.name||"Unnamed"}</b><small>{l.dest||l.destination||"No destination"} · {dateText(l.follow_up||l.follow)}</small></span><em>{overdue&&String(l.follow_up||l.follow)?"Follow-up":"Pending"}</em></button>)}{!followups.length&&<div className="v2-empty">No follow-ups in this period.</div>}</div>
      </div>
      <div className="v2-card org-card">
        <div className="v2-card-head"><div><span>QUERY PIPELINE</span><h2>Stage distribution</h2></div><b>{scoped.length}</b></div>
        <div className="org-pipeline">{stages.map(s=><button key={s} onClick={()=>onView("leads")}><span>{s}</span><i><b style={{width:`${scoped.length?Math.max(3,((stageCounts[s]||0)/scoped.length)*100):3}%`}}/></i><strong>{stageCounts[s]||0}</strong></button>)}</div>
      </div>
      <div className="v2-card org-card">
        <div className="v2-card-head"><div><span>ENQUIRY MIX</span><h2>Lead sources</h2></div><b>{scoped.length}</b></div>
        <div className="org-mix">{sourceCounts.map(([name,count])=><div key={name}><span><i/>{name}</span><b>{scoped.length?Math.round(count/scoped.length*100):0}%</b></div>)}{!sourceCounts.length&&<div className="v2-empty">No source data.</div>}</div>
      </div>
    </div>

    <div className="org-grid org-grid-2">
      <div className="v2-card org-card">
        <div className="v2-card-head"><div><span>MONTHLY TREND</span><h2>Queries vs bookings</h2></div></div>
        <div className="org-trend">{months.map(m=><div key={m.label}><div className="org-bars"><i style={{height:`${Math.max(4,(m.total/maxMonth)*100)}%`}}/><b style={{height:`${Math.max(4,(m.booked/maxMonth)*100)}%`}}/></div><span>{m.label}</span><small>{m.total}</small></div>)}</div>
      </div>
      <div className="v2-card org-card">
        <div className="v2-card-head"><div><span>UPCOMING TOURS</span><h2>Confirmed departures</h2></div><button onClick={()=>onView("bookings")}>View bookings</button></div>
        <div className="org-tour-list">{upcoming.slice(0,5).map(l=><button key={String(l.id)} onClick={()=>onOpenLead(l)}><span><b>{l.name||"Unnamed"} — {l.dest||l.destination||"Tour"}</b><small>{dateText(l.travel_date)} · {l.travellers??l.trav??0} travellers · {l.salesperson||"Unassigned"}</small></span><em>Booked</em></button>)}{!upcoming.length&&<div className="v2-empty">No upcoming booked departures.</div>}</div>
      </div>
    </div>

    <div className="org-grid org-grid-2">
      <div className="v2-card org-card">
        <div className="v2-card-head"><div><span>SALES TEAM</span><h2>Team activity</h2></div></div>
        <div className="org-team">{team.map(x=><div key={x.name}><span><b>{x.name}</b><small>{x.leads} leads · {x.bookings} bookings</small></span><strong>₹{Math.round(x.value).toLocaleString("en-IN")}</strong></div>)}{!team.length&&<div className="v2-empty">No salesperson data.</div>}</div>
      </div>
      <div className="v2-card org-card">
        <div className="v2-card-head"><div><span>RECENT QUERIES</span><h2>Latest leads</h2></div><button onClick={()=>onView("leads")}>View all</button></div>
        <div className="org-list">{recent.map(l=><button key={String(l.id)} onClick={()=>onOpenLead(l)}><span className="crm-avatar">{initials(String(l.name||"Lead"))}</span><span><b>{l.name||"Unnamed"}</b><small>{l.dest||l.destination||"No destination"} · {l.salesperson||"Unassigned"}</small></span><em>{l.status||"New"}</em></button>)}</div>
      </div>
    </div>
  </section>
}
