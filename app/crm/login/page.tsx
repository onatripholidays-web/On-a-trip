"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import "../crm.css";

export default function CrmLogin(){
  const [email,setEmail]=useState("");
  const [password,setPassword]=useState("");
  const [error,setError]=useState("");
  const [loading,setLoading]=useState(false);
  const router=useRouter();
  async function submit(e:React.FormEvent){
    e.preventDefault(); setLoading(true); setError("");
    try{
      const r=await fetch("/api/crm/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});
      const d=await r.json(); if(!r.ok)throw new Error(d.error||"Login failed");
      router.push("/crm"); router.refresh();
    }catch(err){setError(err instanceof Error?err.message:"Login failed");}
    finally{setLoading(false);}
  }
  return <main className="crm-login"><div className="crm-login-card">
    <div className="crm-mark">OAT</div><div className="crm-kicker">ON A TRIP HOLIDAYS</div>
    <h1>CRM Login</h1><p>Sales, leads, follow-ups and customer management.</p>
    <form onSubmit={submit}><label>Email<input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="CRM email"/></label>
    <label>Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Password"/></label>
    {error&&<div className="crm-error">{error}</div>}<button disabled={loading}>{loading?"Signing in…":"Sign in"}</button></form>
    <small>Authorized CRM users only.</small>
  </div></main>;
}
