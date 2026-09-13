import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";

async function ctx(){
 const session=await getCrmSession();
 if(!session)return null;
 const access=(await cookies()).get("oat_crm_access")?.value||"";
 const {url,key}=crmSupabaseConfig();
 return {session,access,url,key};
}
function headers(c:any,write=false){return {apikey:c.key,Authorization:`Bearer ${c.access}`,...(write?{"Content-Type":"application/json",Prefer:"return=representation"}:{})};}
function fail(status:number,message:string){return NextResponse.json({error:message},{status});}
const fields=["name","phone","whatsapp","email","destination","travel_date","adults","children","budget","source","status","priority","branch","notes","next_follow_up","stage","lead_score","score_band","intent","requirement","duration_days","last_contacted_at","next_action","next_action_at","loss_reason"];

export async function GET(){
 const c=await ctx(); if(!c)return fail(401,"Unauthorized");
 const q=new URLSearchParams({select:"*",order:"created_at.desc",limit:"200"});
 const r=await fetch(`${c.url}/rest/v1/crm_v3_leads?${q}`,{headers:headers(c),cache:"no-store"});
 if(!r.ok)return fail(r.status,"Could not load leads");
 return NextResponse.json(await r.json());
}

export async function POST(req:Request){
 const c=await ctx(); if(!c)return fail(401,"Unauthorized");
 let b:any; try{b=await req.json()}catch{return fail(400,"Invalid request body")}
 const name=String(b.name||"").trim(); if(!name)return fail(400,"Lead name is required");
 const payload:any={
  name,phone:b.phone||null,whatsapp:b.whatsapp||null,email:b.email||null,
  destination:b.destination||null,travel_date:b.travel_date||null,
  adults:Math.max(0,Number(b.adults)||1),children:Math.max(0,Number(b.children)||0),
  budget:b.budget===""||b.budget==null?null:Number(b.budget),
  source:b.source||"Other",status:b.status||"New",priority:b.priority||"Normal",branch:b.branch||null,
  assigned_to:c.session.profile.role==="admin"&&b.assigned_to?b.assigned_to:c.session.user.id,
  notes:b.notes||null,next_follow_up:b.next_follow_up||null,created_by:c.session.user.id,
  stage:b.stage||"new",lead_score:Math.min(100,Math.max(0,Number(b.lead_score)||0)),score_band:b.score_band||"cold",
  intent:b.intent||null,requirement:b.requirement||null,duration_days:b.duration_days==null?null:Number(b.duration_days),
  next_action:b.next_action||null,next_action_at:b.next_action_at||b.next_follow_up||null
 };
 const r=await fetch(`${c.url}/rest/v1/crm_v3_leads`,{method:"POST",headers:headers(c,true),body:JSON.stringify(payload)});
 if(!r.ok)return fail(r.status,"Could not create lead");
 return NextResponse.json((await r.json())[0],{status:201});
}

export async function PATCH(req:Request){
 const c=await ctx(); if(!c)return fail(401,"Unauthorized");
 let b:any; try{b=await req.json()}catch{return fail(400,"Invalid request body")}
 if(!b.id)return fail(400,"Lead id is required");
 const payload:any={};
 for(const k of fields){if(b[k]!==undefined)payload[k]=b[k];}
 if(b.adults!==undefined)payload.adults=Math.max(0,Number(b.adults)||0);
 if(b.children!==undefined)payload.children=Math.max(0,Number(b.children)||0);
 if(b.budget!==undefined)payload.budget=b.budget===""||b.budget==null?null:Number(b.budget);
 if(b.lead_score!==undefined)payload.lead_score=Math.min(100,Math.max(0,Number(b.lead_score)||0));
 if(c.session.profile.role==="admin"&&b.assigned_to!==undefined)payload.assigned_to=b.assigned_to||null;
 if(b.status!==undefined&&!b.stage)payload.stage=String(b.status).toLowerCase().replace(/\s+/g,"_");
 if(b.stage!==undefined&&!b.status)payload.status=String(b.stage).replace(/_/g," ").replace(/\b\w/g,m=>m.toUpperCase());
 const owner=c.session.profile.role==="admin"?"":`&or=(assigned_to.eq.${c.session.user.id},created_by.eq.${c.session.user.id})`;
 const r=await fetch(`${c.url}/rest/v1/crm_v3_leads?id=eq.${encodeURIComponent(b.id)}${owner}`,{method:"PATCH",headers:headers(c,true),body:JSON.stringify(payload)});
 if(!r.ok)return fail(r.status,"Could not update lead");
 const rows=await r.json(); if(!rows[0])return fail(404,"Lead not found");
 return NextResponse.json(rows[0]);
}

export async function DELETE(req:Request){
 const c=await ctx(); if(!c)return fail(401,"Unauthorized");
 if(c.session.profile.role!=="admin")return fail(403,"Only admins can delete leads");
 let b:any;try{b=await req.json()}catch{return fail(400,"Invalid request body")}
 if(!b.id)return fail(400,"Lead id is required");
 const r=await fetch(`${c.url}/rest/v1/crm_v3_leads?id=eq.${encodeURIComponent(b.id)}`,{method:"DELETE",headers:headers(c,true)});
 if(!r.ok)return fail(r.status,"Could not delete lead");
 return NextResponse.json({ok:true});
}
