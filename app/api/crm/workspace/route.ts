import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";

export const dynamic="force-dynamic";
const fields="id,name,phone,email,dest,destination,status,salesperson,source,branch,priority,value,notes,follow,follow_up,date,travel_date,trav,travellers,created_at,updated_at";
const stages=["New","Contacted","Qualified","Hot","Quote Sent","Follow-up","Booked","Lost"];

function n(v:unknown){const x=Number(String(v??"").replace(/[^0-9.]/g,""));return Number.isFinite(x)?x:0}
function daysAgo(v:unknown){if(!v)return false;const d=new Date(String(v));if(Number.isNaN(d.getTime()))return false;const t=new Date();t.setHours(0,0,0,0);return d<t}

export async function GET(){
 const session=await getCrmSession();
 if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
 try{
  const {url,key}=crmSupabaseConfig();
  const access=(await cookies()).get("oat_crm_access")?.value||"";
  const filters=session.profile.role==="admin"?"status=neq.Deleted":`status=neq.Deleted&salesperson=eq.${encodeURIComponent(session.profile.salesperson||"")}`;
  const q=new URLSearchParams({select:fields,order:"created_at.desc",limit:"1000"});
  q.set("and",`(${filters.split("&").map(x=>x.replace("=",":eq:")).join(",")})`);
  // PostgREST's simple query syntax is more reliable here than nested filter construction.
  const urlPath=`${url}/rest/v1/enquiries?select=${fields}&order=created_at.desc&limit=1000&status=neq.Deleted${session.profile.role==="admin"?"":`&salesperson=eq.${encodeURIComponent(session.profile.salesperson||"")}`}`;
  const r=await fetch(urlPath,{headers:{apikey:key,Authorization:`Bearer ${access}`},cache:"no-store"});
  const leads=r.ok?await r.json():[];
  if(!r.ok)return NextResponse.json({error:"Could not load CRM workspace",detail:leads},{status:r.status});
  const rows=Array.isArray(leads)?leads:[];
  const counts=Object.fromEntries(stages.map(s=>[s,rows.filter((l:any)=>String(l.status||"New")==s).length]));
  const followups=rows.filter((l:any)=>l.follow_up||l.follow||String(l.status||"")==="Follow-up");
  const overdue=followups.filter((l:any)=>daysAgo(l.follow_up||l.follow));
  const bookings=rows.filter((l:any)=>String(l.status||"")==="Booked");
  const bookedValue=bookings.reduce((s:number,l:any)=>s+n(l.value),0);
  const pipelineValue=rows.reduce((s:number,l:any)=>s+n(l.value),0);
  const hot=rows.filter((l:any)=>String(l.status||"")==="Hot"||String(l.priority||"")==="Urgent");
  return NextResponse.json({leads:rows,stats:{total:rows.length,counts,followups:followups.length,overdue:overdue.length,hot:hot.length,bookings:bookings.length,conversion:rows.length?Math.round(bookings.length/rows.length*100):0,pipelineValue,bookedValue}});
 }catch(err){return NextResponse.json({error:err instanceof Error?err.message:"Workspace unavailable"},{status:500})}
}
