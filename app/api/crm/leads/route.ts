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

export async function POST(req:Request){
 const ctx=await auth(); if(!ctx)return NextResponse.json({error:"Unauthorized"},{status:401});
 const body=await req.json();
 const allowed={
  name:body.name||null,
  phone:body.phone||null,
  email:body.email||null,
  dest:body.dest??body.destination??null,
  value:body.value||null,
  branch:body.branch||null,
  source:body.source||null,
  priority:body.priority||"Normal",
  notes:body.notes||null,
  status:body.status||"New",
  salesperson:body.salesperson||null,
  travel_date:body.travel_date??body.travelDate??null,
  travellers:body.travellers??null,
  follow_up:body.follow_up??body.followUp??null
 };
 const r=await fetch(`${ctx.url}/rest/v1/enquiries`,{method:"POST",headers:{apikey:ctx.key,Authorization:`Bearer ${ctx.access}`,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(allowed)});
 const data=await r.json().catch(()=>null); return NextResponse.json(data,{status:r.status});
}

export async function PATCH(req:Request){
 const ctx=await auth(); if(!ctx)return NextResponse.json({error:"Unauthorized"},{status:401});
 const body=await req.json(); const id=body.id;
 if(!id)return NextResponse.json({error:"Lead id is required"},{status:400});
 const patch={...body}; delete patch.id;
 if(ctx.session.profile.role!=="admin")delete patch.salesperson;
 if(patch.destination!==undefined){patch.dest=patch.destination;delete patch.destination;}
 if(patch.travelDate!==undefined){patch.travel_date=patch.travelDate;delete patch.travelDate;}
 if(patch.travellers!==undefined)patch.travellers=Number(patch.travellers)||null;
 if(patch.followUp!==undefined){patch.follow_up=patch.followUp;delete patch.followUp;}
 const r=await fetch(`${ctx.url}/rest/v1/enquiries?id=eq.${encodeURIComponent(id)}`,{method:"PATCH",headers:{apikey:ctx.key,Authorization:`Bearer ${ctx.access}`,"Content-Type":"application/json",Prefer:"return=representation"},body:JSON.stringify(patch)});
 const data=await r.json().catch(()=>null); return NextResponse.json(data,{status:r.status});
}

export async function DELETE(req:Request){
 const ctx=await auth(); if(!ctx)return NextResponse.json({error:"Unauthorized"},{status:401});
 if(ctx.session.profile.role!=="admin")return NextResponse.json({error:"Only admins can delete leads"},{status:403});
 const body=await req.json(); if(!body.id)return NextResponse.json({error:"Lead id is required"},{status:400});
 const r=await fetch(`${ctx.url}/rest/v1/enquiries?id=eq.${encodeURIComponent(body.id)}`,{method:"PATCH",headers:{apikey:ctx.key,Authorization:`Bearer ${ctx.access}`,"Content-Type":"application/json"},body:JSON.stringify({status:"Deleted"})});
 return NextResponse.json({ok:r.ok},{status:r.ok?200:r.status});
}
