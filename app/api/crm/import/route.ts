import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {crmSupabaseConfig,getCrmSession} from "@/lib/crm-auth";

const cleanText=(v:any):string=>String(v??"").trim();
const cleanPhone=(v:any):string=>cleanText(v).replace(/\s+/g," ");
const date=(v:any):string|null=>{const x=cleanText(v);return x||null};

export async function POST(req:Request):Promise<NextResponse>{
 const session=await getCrmSession();
 if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
 let body:any=null;
 try{body=await req.json()}catch{body=null}
 const rows:Array<any>=Array.isArray(body?.rows)?body.rows:[];
 if(!rows.length)return NextResponse.json({error:"No rows supplied"},{status:400});
 if(rows.length>1000)return NextResponse.json({error:"Maximum 1000 rows per import"},{status:400});
 const clean=rows.map((r:any)=>({
   name:cleanText(r.name),phone:cleanPhone(r.phone),email:cleanText(r.email)||null,
   dest:cleanText(r.destination||r.dest)||null,destination:cleanText(r.destination||r.dest)||null,
   travel_date:date(r.travel_date||r.travelDate),travellers:Number(r.travellers||r.trav||0)||0,
   branch:cleanText(r.branch)||"Hyderabad",source:cleanText(r.source)||"Sheet Import",
   priority:cleanText(r.priority)||"Normal",status:cleanText(r.status)||"New",
   value:cleanText(r.value)||null,follow_up:date(r.follow_up||r.followUp),notes:cleanText(r.notes)||null,
   salesperson:session.profile.role==="admin"?(cleanText(r.salesperson)||null):(session.profile.salesperson||null)
 })).filter((r:any)=>r.name&&r.phone);
 if(!clean.length)return NextResponse.json({error:"No valid rows. Name and phone are required."},{status:400});
 const {url,key}=crmSupabaseConfig();
 const token=(await cookies()).get("oat_crm_access")?.value||"";
 const existing=await fetch(`${url}/rest/v1/enquiries?select=phone&limit=50000`,{headers:{apikey:key,Authorization:`Bearer ${token}`},cache:"no-store"});
 const old=await existing.json().catch(()=>[]);
 const phones=new Set((Array.isArray(old)?old:[]).map((x:any)=>String(x.phone||"").replace(/\D/g,"")).filter(Boolean));
 const unique=clean.filter((r:any)=>{const p=r.phone.replace(/\D/g,"");if(!p||phones.has(p))return false;phones.add(p);return true});
 let imported=0;const errors:string[]=[];
 for(let i=0;i<unique.length;i+=100){
   const chunk=unique.slice(i,i+100);
   const r=await fetch(`${url}/rest/v1/enquiries`,{method:"POST",headers:{apikey:key,Authorization:`Bearer ${token}`,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify(chunk)});
   if(!r.ok){errors.push(await r.text());break} imported+=chunk.length;
 }
 return NextResponse.json({ok:!errors.length,imported,skipped:rows.length-imported,errors});
}
