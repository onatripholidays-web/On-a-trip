import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {crmSupabaseConfig,getCrmSession} from "@/lib/crm-auth";

export async function POST(req:Request){
 const session=await getCrmSession(); if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
 const body=await req.json(); const rows=Array.isArray(body?.rows)?body.rows:[]; if(!rows.length)return NextResponse.json({error:"No rows supplied"},{status:400});
 const clean=rows.filter((r:any)=>r?.name&&r?.phone).map((r:any)=>({name:String(r.name).trim(),phone:String(r.phone).trim(),destination:String(r.destination||"").trim(),travel_date:r.travel_date||null,travellers:Number(r.travellers||0)||0,branch:String(r.branch||"Hyderabad"),source:String(r.source||"Sheet Import"),priority:String(r.priority||"Normal"),status:String(r.status||"New"),value:String(r.value||""),follow_up:r.follow_up||null,notes:String(r.notes||"")}));
 const {url,key}=crmSupabaseConfig(); const token=(await cookies()).get("oat_crm_access")?.value||"";
 const existing=await fetch(`${url}/rest/v1/enquiries?select=phone&limit=50000`,{headers:{apikey:key,Authorization:`Bearer ${token}`},cache:"no-store"}); const old=await existing.json().catch(()=>[]); const phones=new Set((Array.isArray(old)?old:[]).map((x:any)=>String(x.phone||"").replace(/\D/g,"")).filter(Boolean));
 const unique=clean.filter((r:any)=>{const p=r.phone.replace(/\D/g,"");if(!p||phones.has(p))return false;phones.add(p);return true});
 let imported=0; const errors:string[]=[];
 for(let i=0;i<unique.length;i+=100){const chunk=unique.slice(i,i+100);const r=await fetch(`${url}/rest/v1/enquiries`,{method:"POST",headers:{apikey:key,Authorization:`Bearer ${token}`,"Content-Type":"application/json",Prefer:"return=minimal"},body:JSON.stringify(chunk)});if(!r.ok){errors.push(await r.text());break}imported+=chunk.length;}
 return NextResponse.json({ok:!errors.length,imported,skipped:rows.length-imported,errors});
}
