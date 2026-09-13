import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";

async function auth(){
 const session=await getCrmSession();
 if(!session)return null;
 const access=(await cookies()).get("oat_crm_access")?.value||"";
 const {url,key}=crmSupabaseConfig();
 const service=process.env.SUPABASE_SERVICE_ROLE_KEY||"";
 return {session,access,url,key:service||key,auth:service||access};
}

async function activity(ctx:any,type:string,subject:string,body:string,enquiryId:string){
 try{await fetch(`${ctx.url}/rest/v1/crm_activities`,{method:"POST",headers:{apikey:ctx.key,Authorization:`Bearer ${ctx.auth}`,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify({enquiry_id:enquiryId,actor_id:ctx.session.user.id,type,subject,body,metadata:{}})})}catch{}
}

function clean(body:any,session:any){
 const salesperson=session.profile.role==="admin"?(body.salesperson||null):(session.profile.salesperson||null);
 return {name:body.name||null,phone:body.phone||null,email:body.email||null,dest:body.dest??body.destination??null,destination:body.destination??body.dest??null,value:body.value===""||body.value===undefined||body.value===null?null:Number(body.value),branch:body.branch||null,source:body.source||null,priority:body.priority||"Normal",notes:body.notes||null,status:body.status||"New",salesperson,travel_date:body.travel_date??body.travelDate??null,travellers:body.travellers===undefined||body.travellers===""?null:Number(body.travellers),follow_up:body.follow_up??body.followUp??null};
}

function errorResponse(status:number,error:string,details?:unknown){return NextResponse.json({error,details:typeof details==="string"?details:details||null},{status});}

export async function POST(req:Request){
 const ctx=await auth(); if(!ctx)return errorResponse(401,"Unauthorized");
 let body:any;try{body=await req.json()}catch{return errorResponse(400,"Invalid request body")}
 const allowed=clean(body,ctx.session);
 if(!allowed.name&&!allowed.phone&&!allowed.email)return errorResponse(400,"Enter at least a name, phone number or email");
 const rpcBody={p_name:allowed.name,p_phone:allowed.phone,p_email:allowed.email,p_dest:allowed.dest,p_destination:allowed.destination,p_value:allowed.value,p_branch:allowed.branch,p_source:allowed.source,p_priority:allowed.priority,p_notes:allowed.notes,p_status:allowed.status,p_salesperson:allowed.salesperson,p_travel_date:allowed.travel_date,p_travellers:allowed.travellers,p_follow_up:allowed.follow_up};
 // IMPORTANT: the RPC uses auth.uid(), so the Authorization header must be the
 // signed-in user's access token. Never send the service-role token here.
 const r=await fetch(`${ctx.url}/rest/v1/rpc/crm_create_lead`,{method:"POST",headers:{apikey:ctx.key,Authorization:`Bearer ${ctx.access}`,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(rpcBody)});
 const text=await r.text();let data:any=null;try{data=text?JSON.parse(text):null}catch{data=text}
 if(!r.ok)return errorResponse(r.status,"Lead could not be saved",data);
 const item=Array.isArray(data)?data[0]:data;
 if(item?.id)await activity(ctx,"system","Lead created",`Lead created for ${String(item.name||allowed.name||"")}`,String(item.id));
 return NextResponse.json(Array.isArray(data)?data:[item],{status:201});
}

export async function PATCH(req:Request){
 const ctx=await auth(); if(!ctx)return errorResponse(401,"Unauthorized");
 let body:any;try{body=await req.json()}catch{return errorResponse(400,"Invalid request body")}
 const id=body.id;if(!id)return errorResponse(400,"Lead id is required");
 const ownerFilter=ctx.session.profile.role==="admin"?"":`&salesperson=eq.${encodeURIComponent(ctx.session.profile.salesperson||"")}`;
 const beforeRes=await fetch(`${ctx.url}/rest/v1/enquiries?select=id,name,status,salesperson&id=eq.${encodeURIComponent(id)}${ownerFilter}`,{headers:{apikey:ctx.key,Authorization:`Bearer ${ctx.auth}`},cache:"no-store"});
 const beforeRows=await beforeRes.json().catch(()=>[]);
 if(!beforeRes.ok||!Array.isArray(beforeRows)||!beforeRows[0])return errorResponse(404,"Lead not found or not assigned to this salesperson",beforeRows);
 const allowedKeys=["name","phone","email","dest","destination","value","branch","source","priority","notes","status","salesperson","travel_date","travellers","follow_up"];
 const patch:any={};for(const key of allowedKeys)if(body[key]!==undefined)patch[key]=body[key];
 if(body.destination!==undefined)patch.destination=body.destination;if(body.dest!==undefined)patch.dest=body.dest;if(body.travelDate!==undefined)patch.travel_date=body.travelDate||null;if(body.followUp!==undefined)patch.follow_up=body.followUp||null;if(body.travellers!==undefined)patch.travellers=Number(body.travellers)||null;if(body.value!==undefined)patch.value=body.value===""||body.value===null?null:Number(body.value);if(ctx.session.profile.role!=="admin")delete patch.salesperson;
 if(!Object.keys(patch).length)return errorResponse(400,"No lead changes supplied");
 const r=await fetch(`${ctx.url}/rest/v1/enquiries?id=eq.${encodeURIComponent(id)}${ownerFilter}`,{method:"PATCH",headers:{apikey:ctx.key,Authorization:`Bearer ${ctx.auth}`,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(patch)});
 const text=await r.text();let data:any=null;try{data=text?JSON.parse(text):null}catch{data=text}
 if(!r.ok)return errorResponse(r.status,"Lead could not be updated",data);
 if(Array.isArray(data)&&data[0]){const before=beforeRows[0],after=data[0],changed=before.status!==after.status;await activity(ctx,changed?"stage_change":"note",changed?"Pipeline stage changed":"Lead updated",changed?`${before.status||"New"} → ${after.status||"New"}`:"Lead information updated",String(id));}
 return NextResponse.json(data,{status:200});
}

export async function DELETE(req:Request){
 const ctx=await auth();if(!ctx)return errorResponse(401,"Unauthorized");
 if(ctx.session.profile.role!=="admin")return errorResponse(403,"Only admins can delete leads");
 let body:any;try{body=await req.json()}catch{return errorResponse(400,"Invalid request body")}
 if(!body.id)return errorResponse(400,"Lead id is required");
 const r=await fetch(`${ctx.url}/rest/v1/enquiries?id=eq.${encodeURIComponent(body.id)}`,{method:"PATCH",headers:{apikey:ctx.key,Authorization:`Bearer ${ctx.auth}`,"Content-Type":"application/json"},body:JSON.stringify({status:"Deleted"})});
 if(!r.ok)return errorResponse(r.status,"Could not move lead to bin",await r.text());
 await activity(ctx,"system","Lead moved to bin","Lead soft-deleted by admin",String(body.id));
 return NextResponse.json({ok:true},{status:200});
}
