"use client";
import {useState} from "react";
import {useRouter} from "next/navigation";
import "../admin.css";

export default function AdminLogin(){
 const [email,setEmail]=useState("");const [password,setPassword]=useState("");const [error,setError]=useState("");const [loading,setLoading]=useState(false);const router=useRouter();
 async function submit(e:React.FormEvent){e.preventDefault();setLoading(true);setError("");try{const r=await fetch("/api/admin/login",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({email,password})});const d=await r.json();if(!r.ok)throw new Error(d.error||"Login failed");router.push("/admin");router.refresh();}catch(err){setError(err instanceof Error?err.message:"Login failed");}finally{setLoading(false)}}
 return <main className="admin-login"><div className="login-card"><div className="admin-mark">OAT</div><span className="admin-kicker">ON A TRIP HOLIDAYS</span><h1>Admin Control Center</h1><p>Manage packages, itineraries, batches, offers and website content.</p><form onSubmit={submit}><label>Email<input type="email" autoComplete="username" value={email} onChange={e=>setEmail(e.target.value)} required placeholder="Admin email"/></label><label>Password<input type="password" autoComplete="current-password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="Password"/></label>{error&&<div className="admin-error">{error}</div>}<button disabled={loading}>{loading?"Signing in…":"Sign in"}</button></form><small>Authorized administrators only.</small></div></main>;
}
