import {NextResponse} from "next/server";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";

async function ctx(){
 const session=await getCrmSession(); if(!session)return null;
 const {url,key}=crmSupabaseConfig(); const service=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY||"";
 return {session,url,key,service};
}
function h(c:any,extra:any={}){return {apikey:c.service||c.key,...extra};}

export async function GET(){
 const c=await ctx(); if(!c)return NextResponse.json({error:"Unauthorized"},{status:401});
 if(!c.service)return NextResponse.json({error:"Server key not configured"},{status:503});
 const p=c.session.profile.role==="admin"?"":"&user_id=eq."+encodeURIComponent(c.session.user.id);
 const r=await fetch(c.url+"/rest/v1/crm_lead_saved_views?select=*&order=updated_at.desc"+p,{headers:h(c),cache:"no-store"});
 const d=await r.json().catch(()=>[]);
 return NextResponse.json(Array.isArray(d)?d:[],{status:r.status});
}

export async function POST(req:Request){
 const c=await ctx(); if(!c)return NextResponse.json({error:"Unauthorized"},{status:401});
 if(!c.service)return NextResponse.json({error:"Server key not configured"},{status:503});
 const b=await req.json().catch(()=>({}));
 const name=String(b.name||"").trim(); if(!name)return NextResponse.json({error:"View name is required"},{status:400});
 const payload={name,user_id:c.session.user.id,filters:b.filters&&typeof b.filters==="object"?b.filters:{},displayed_columns:Array.isArray(b.displayed_columns)?b.displayed_columns:[],is_shared:c.session.profile.role==="admin"&&Boolean(b.is_shared)};
 const r=await fetch(c.url+"/rest/v1/crm_lead_saved_views",{method:"POST",headers:h(c,{"Content-Type":"application/json",Prefer:"return=representation"}),body:JSON.stringify(payload)});
 const d=await r.json().catch(()=>null); return NextResponse.json(Array.isArray(d)?d[0]:d,{status:r.status});
}

export async function DELETE(req:Request){
 const c=await ctx(); if(!c)return NextResponse.json({error:"Unauthorized"},{status:401});
 if(!c.service)return NextResponse.json({error:"Server key not configured"},{status:503});
 const id=new URL(req.url).searchParams.get("id"); if(!id)return NextResponse.json({error:"View id is required"},{status:400});
 const filter=c.session.profile.role==="admin"?"id=eq."+encodeURIComponent(id):"id=eq."+encodeURIComponent(id)+"&user_id=eq."+encodeURIComponent(c.session.user.id);
 const r=await fetch(c.url+"/rest/v1/crm_lead_saved_views?"+filter,{method:"DELETE",headers:h(c,{Prefer:"return=minimal"})});
 return NextResponse.json({ok:r.ok},{status:r.ok?200:r.status});
}