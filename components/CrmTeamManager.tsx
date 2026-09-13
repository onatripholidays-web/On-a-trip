"use client";

import {useState} from "react";

type Member={id:string;name:string;email:string;role:string;is_active:boolean;auth_user_id?:string|null};

export default function CrmTeamManager({initialTeam}:{initialTeam:Member[]}){
 const [team,setTeam]=useState(initialTeam);
 const [name,setName]=useState("");
 const [email,setEmail]=useState("");
 const [message,setMessage]=useState("");
 return <main className="teamPage">
  <div className="teamTop"><div><div className="eyebrow">CRM / ADMIN</div><h1>Sales Team</h1><p>Manage sales ownership, login status and lead distribution.</p></div><a className="teamBack" href="/crm">← Back to CRM</a></div>
  <section className="teamGrid">
   {team.map(m=><article className="teamCard" key={m.id}>
    <div className="avatar">{m.name.split(/\s+/).slice(0,2).map(x=>x[0]).join("").toUpperCase()}</div>
    <div className="teamInfo"><h3>{m.name}</h3><div className="mail">{m.email}</div><div className="role">Salesperson</div></div>
    <span className={m.is_active?"status active":"status"}>{m.is_active?"Active":"Inactive"}</span>
    <div className="loginState">{m.auth_user_id?"✓ Login connected":"⚠ Login not connected"}</div>
   </article>)}
  </section>
  <section className="teamSetup">
   <div><h2>Add salesperson</h2><p>Add the team roster here. Passwords are never stored in the CRM database or source code.</p></div>
   <form onSubmit={async e=>{e.preventDefault();setMessage("");if(!name||!email){setMessage("Enter name and email");return;}const r=await fetch("/api/crm/team",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({name,email})});const d=await r.json().catch(()=>({}));if(!r.ok){setMessage(d.error||"Could not add salesperson");return;}setTeam(t=>[...t,d.user]);setName("");setEmail("");setMessage("Salesperson added");}}>
    <input value={name} onChange={e=>setName(e.target.value)} placeholder="Name"/>
    <input value={email} onChange={e=>setEmail(e.target.value)} placeholder="Email address" type="email"/>
    <button type="submit">Add to team</button>
   </form>
   <div className="securityNote">🔐 Passwords should be created/reset through Supabase Authentication, not saved in CRM.</div>
   {message&&<div className="teamMessage">{message}</div>}
  </section>
 </main>;
}
