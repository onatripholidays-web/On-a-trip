import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";

async function auth(){
 const session=await getCrmSession();
 if(!session)return null;
 const access=(await cookies()).get("oat_crm_access")?.value||"";
 const {url,key}=crmSupabaseConfig();
 const service=process.env.SUPABASE_SERVICE_ROLE_KEY||"";
 return {session,access,url,anon:key,service};
}

function dbHeaders(ctx:any,write=false){
 const authorization=ctx.service||ctx.access;
 return {apikey:ctx.anon,Authorization:`Bearer ${authorization}`,...(write?{"Content-Type":"application/json",Prefer:"return=representation"}:{})};
}

async function activity(ctx:any,type:string,subject:string,body:string,enquiryId:number){
 try{await fetch(`${ctx.url}/rest/v1/crm_lead_activities`,{method:"POST",headers:dbHeaders(ctx,true),body:JSON.stringify({enquiry_id:enquiryId,activity_type:type,subject,body,created_by:ctx.session.user.id})})}catch{}
}

function clean(body:any,session:any){
 const salesperson=session.profile.role==="admin"?(body.salesperson||null):(session.profile.salesperson||null);
 return {name:body.name||null,phone:body.phone||null,email:body.email||null,dest:body.dest??body.destination??null,destination:body.destination??body.dest??null,value:body.value===""||body.value===undefined||body.value===null?null:Number(body.value),branch:body.branch||null,source:body.source||null,priority:body.priority||"Normal",notes:body.notes||null,status:body.status||"New",salesperson,travel_date:body.travel_date??body.travelDate??null,travellers:body.travellers===undefined||body.travellers===""?null:Number(body.travellers),follow_up:body.follow_up??body.followUp??null};
}
function errorResponse(status:number,error:string,details?:unknown){return NextResponse.json({error,details:typeof details==="string"?details:details||null},{status});}

export async function POST(req:Request){
 const ctx=await auth(); if(!ctx)return errorResponse(401,"Unauthorized");
 let body:any;try{body=await req.json()}catch{return errorResponse(400,"Invalid request body")}
 const a=clean(body,ctx.session);
 if(!a.name&&!a.phone&&!a.email)return errorResponse(400,"Enter at least a name, phone number or email");
 const r=await fetch(`${ctx.url}/rest/v1/enquiries`,{method:"POST",headers:dbHeaders(ctx,true),body:JSON.stringify(a)});
 const text=await r.text();let data:any=null;try{data=text?JSON.parse(text):null}catch{data=text}
 if(!r.ok){
  const detail=typeof data==="object"&&data?`${data.message||data.error||data.hint||""}`.trim():String(data||"");
  return errorResponse(r.status,detail?`Lead could not be saved: ${detail}`:"Lead could not be saved",data);
 }
 const item=Array.isArray(data)?data[0]:data;
 if(item?.id)await activity(ctx,"system","Lead created",`Lead created for ${String(item.name||a.name||"")}`,Number(item.id));
 return NextResponse.json(Array.isArray(data)?data:[item],{status:201});
}

export async function PATCH(req:Request){
 const ctx=await auth(); if(!ctx)return errorResponse(401,"Unauthorized");
 let body:any;try{body=await req.json()}catch{return errorResponse(400,"Invalid request body")}
 const id=body.id;if(!id)return errorResponse(400,"Lead id is required");
 const ownerFilter=ctx.session.profile.role==="admin"?"":`&salesperson=eq.${encodeURIComponent(ctx.session.profile.salesperson||"")}`;
 const beforeRes=await fetch(`${ctx.url}/rest/v1/enquiries?select=id,name,status,salesperson&id=eq.${encodeURIComponent(id)}${ownerFilter}`,{headers:dbHeaders(ctx),cache:"no-store"});
 let beforeRows:any[]=[];
 try{beforeRows=await beforeRes.json()}catch{beforeRows=[]}
 if(!beforeRes.ok||!Array.isArray(beforeRows)||!beforeRows[0])return errorResponse(404,"Lead not found or not assigned to this salesperson",beforeRows);
 const allowedKeys=["name","phone","email","dest","destination","value","branch","source","priority","notes","status","salesperson","travel_date","travellers","follow_up"];
 const patch:any={};for(const key of allowedKeys)if(body[key]!==undefined)patch[key]=body[key];
 if(body.destination!==undefined)patch.destination=body.destination;if(body.dest!==undefined)patch.dest=body.dest;if(body.travelDate!==undefined)patch.travel_date=body.travelDate||null;if(body.followUp!==undefined)patch.follow_up=body.followUp||null;if(body.travellers!==undefined)patch.travellers=Number(body.travellers)||null;if(body.value!==undefined)patch.value=body.value===""||body.value===null?null:Number(body.value);if(ctx.session.profile.role!=="admin")delete patch.salesperson;
 if(!Object.keys(patch).length)return errorResponse(400,"No lead changes supplied");
 const r=await fetch(`${ctx.url}/rest/v1/enquiries?id=eq.${encodeURIComponent(id)}${ownerFilter}`,{method:"PATCH",headers:dbHeaders(ctx,true),body:JSON.stringify(patch)});
 const text=await r.text();let data:any=null;try{data=text?JSON.parse(text):null}catch{data=text}
 if(!r.ok)return errorResponse(r.status,"Lead could not be updated",data);
 if(Array.isArray(data)&&data[0]){const before=beforeRows[0],after=data[0],changed=before.status!==after.status;await activity(ctx,changed?"stage_change":"note",changed?"Pipeline stage changed":"Lead updated",changed?`${before.status||"New"} → ${after.status||"New"}`:"Lead information updated",Number(id));}
 return NextResponse.json(data,{status:200});
}

export async function DELETE(req:Request){
 const ctx=await auth();if(!ctx)return errorResponse(401,"Unauthorized");
 if(ctx.session.profile.role!=="admin")return errorResponse(403,"Only admins can delete leads");
 let body:any;try{body=await req.json()}catch{return errorResponse(400,"Invalid request body")}
 if(!body.id)return errorResponse(400,"Lead id is required");
 const r=await fetch(`${ctx.url}/rest/v1/enquiries?id=eq.${encodeURIComponent(body.id)}`,{method:"PATCH",headers:dbHeaders(ctx,true),body:JSON.stringify({status:"Deleted"})});
 if(!r.ok)return errorResponse(r.status,"Could not move lead to bin",await r.text());
 await activity(ctx,"system","Lead moved to bin","Lead soft-deleted by admin",Number(body.id));
 return NextResponse.json({ok:true},{status:200});
}
