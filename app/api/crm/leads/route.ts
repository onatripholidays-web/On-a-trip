import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";

async function auth(){
 const session=await getCrmSession();
 if(!session)return null;
 const access=(await cookies()).get("oat_crm_access")?.value||"";
 const {url,key}=crmSupabaseConfig();
 return {session,access,url,key};
}

async function activity(ctx:any,type:string,subject:string,body:string,enquiryId:string){
 try{await fetch(`${ctx.url}/rest/v1/crm_activities`,{method:"POST",headers:{apikey:ctx.key,Authorization:`Bearer ${ctx.access}`,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({enquiry_id:enquiryId,actor_id:ctx.session.user.id,type,subject,body,metadata:{}})})}catch{}
}

export async function POST(req:Request){
 const ctx=await auth(); if(!ctx)return NextResponse.json({error:"Unauthorized"},{status:401});
 const body=await req.json();
 const salesperson=ctx.session.profile.role==="admin"?(body.salesperson||null):(ctx.session.profile.salesperson||null);
 const allowed={name:body.name||null,phone:body.phone||null,email:body.email||null,dest:body.dest??body.destination??null,value:body.value||null,branch:body.branch||null,source:body.source||null,priority:body.priority||"Normal",notes:body.notes||null,status:body.status||"New",salesperson,travel_date:body.travel_date??body.travelDate??null,travellers:body.travellers??null,follow_up:body.follow_up??body.followUp??null,next_action:body.next_action||null};
 const r=await fetch(`${ctx.url}/rest/v1/enquiries`,{method:"POST",headers:{apikey:ctx.key,Authorization:`Bearer ${ctx.access}`,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(allowed)});
 const data=await r.json().catch(()=>null);
 if(r.ok&&Array.isArray(data)&&data[0]?.id)await activity(ctx,"system","Lead created",`Lead created for ${String(data[0].name||allowed.name||"")}`,String(data[0].id));
 return NextResponse.json(data,{status:r.status});
}

export async function PATCH(req:Request){
 const ctx=await auth(); if(!ctx)return NextResponse.json({error:"Unauthorized"},{status:401});
 const body=await req.json(); const id=body.id;
 if(!id)return NextResponse.json({error:"Lead id is required"},{status:400});
 const ownerFilter=ctx.session.profile.role==="admin"?"":`&salesperson=eq.${encodeURIComponent(ctx.session.profile.salesperson||"")}`;
 const beforeRes=await fetch(`${ctx.url}/rest/v1/enquiries?select=id,name,status,salesperson&id=eq.${encodeURIComponent(id)}${ownerFilter}`,{headers:{apikey:ctx.key,Authorization:`Bearer ${ctx.access}`},cache:"no-store"});
 const beforeRows=await beforeRes.json().catch(()=>[]);
 if(!beforeRes.ok||!Array.isArray(beforeRows)||!beforeRows[0])return NextResponse.json({error:"Lead not found or not assigned to this salesperson"},{status:404});
 const allowedKeys=["name","phone","email","dest","value","branch","source","priority","notes","status","salesperson","travel_date","travellers","follow_up","next_action","lost_reason"];
 const patch:any={};
 for(const key of allowedKeys)if(body[key]!==undefined)patch[key]=body[key];
 if(body.destination!==undefined)patch.dest=body.destination;
 if(body.travelDate!==undefined)patch.travel_date=body.travelDate||null;
 if(body.followUp!==undefined)patch.follow_up=body.followUp||null;
 if(body.travellers!==undefined)patch.travellers=Number(body.travellers)||null;
 if(ctx.session.profile.role!=="admin")delete patch.salesperson;
 if(patch.status==="Lost"&&!patch.lost_reason)patch.lost_reason=body.lost_reason||null;
 const r=await fetch(`${ctx.url}/rest/v1/enquiries?id=eq.${encodeURIComponent(id)}${ownerFilter}`,{method:"PATCH",headers:{apikey:ctx.key,Authorization:`Bearer ${ctx.access}`,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(patch)});
 const data=await r.json().catch(()=>null);
 if(r.ok){const before=beforeRows[0];const after=Array.isArray(data)?data[0]:data;const type=before.status!==after?.status?"stage_change":"note";await activity(ctx,type,before.status!==after?.status?"Pipeline stage changed":"Lead updated",before.status!==after?.status?`${before.status||"New"} → ${after?.status||patch.status}`:"Lead information updated",String(id));}
 return NextResponse.json(data,{status:r.status});
}

export async function DELETE(req:Request){
 const ctx=await auth(); if(!ctx)return NextResponse.json({error:"Unauthorized"},{status:401});
 if(ctx.session.profile.role!=="admin")return NextResponse.json({error:"Only admins can delete leads"},{status:403});
 const body=await req.json(); if(!body.id)return NextResponse.json({error:"Lead id is required"},{status:400});
 const r=await fetch(`${ctx.url}/rest/v1/enquiries?id=eq.${encodeURIComponent(body.id)}`,{method:"PATCH",headers:{apikey:ctx.key,Authorization:`Bearer ${ctx.access}`,"Content-Type":"application/json"},body:JSON.stringify({status:"Deleted"})});
 if(r.ok)await activity(ctx,"system","Lead moved to bin","Lead soft-deleted by admin",String(body.id));
 return NextResponse.json({ok:r.ok},{status:r.ok?200:r.status});
}
