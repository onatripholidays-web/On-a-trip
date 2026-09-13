import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";

const fields="id,name,phone,email,dest,destination,status,salesperson,source,branch,priority,value,notes,travel_date,travellers,follow_up,created_at";

function esc(value:string){return value.replace(/,/g,"%2C").replace(/\./g,"%2E");}

export async function GET(req:Request){
 const session=await getCrmSession();
 if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
 const access=(await cookies()).get("oat_crm_access")?.value||"";
 const {url,key}=crmSupabaseConfig();
 const p=new URL(req.url).searchParams;
 const page=Math.max(1,Number(p.get("page")||"1"));
 const size=Math.min(50,Math.max(10,Number(p.get("pageSize")||"25")));
 const from=(page-1)*size;
 const to=from+size-1;
 const filters:string[]=["status=neq.Deleted"];
 const q=p.get("q")?.trim();
 const stage=p.get("stage")?.trim();
 const source=p.get("source")?.trim();
 const priority=p.get("priority")?.trim();
 const branch=p.get("branch")?.trim();
 const owner=p.get("owner")?.trim();
 if(q){
   const term=esc(q);
   filters.push(`or=(name.ilike.*${term}*,phone.ilike.*${term}*,email.ilike.*${term}*,dest.ilike.*${term}*,salesperson.ilike.*${term}*,source.ilike.*${term}*,status.ilike.*${term}*,branch.ilike.*${term}*,notes.ilike.*${term}*)`);
 }
 if(stage&&stage!=="All")filters.push(`status=eq.${encodeURIComponent(stage)}`);
 if(source&&source!=="All")filters.push(`source=eq.${encodeURIComponent(source)}`);
 if(priority&&priority!=="All")filters.push(`priority=eq.${encodeURIComponent(priority)}`);
 if(branch&&branch!=="All")filters.push(`branch=eq.${encodeURIComponent(branch)}`);
 if(owner&&owner!=="All")filters.push(`salesperson=eq.${encodeURIComponent(owner)}`);
 if(session.profile.role!=="admin")filters.push(`salesperson=eq.${encodeURIComponent(session.profile.salesperson||"")}`);
 const query=new URLSearchParams({select:fields,order:"created_at.desc",limit:String(size),offset:String(from)});
 query.set("and",`(${filters.join(",")})`);
 const r=await fetch(`${url}/rest/v1/enquiries?${query.toString()}`,{headers:{apikey:key,Authorization:`Bearer ${access}`,Prefer:"count=exact"},cache:"no-store"});
 const data=r.ok?await r.json():[];
 const range=r.headers.get("content-range")||"";
 const totalMatch=range.match(/\/(\d+|\*)$/);
 const total=totalMatch&&totalMatch[1]!=="*"?Number(totalMatch[1]):Array.isArray(data)?data.length:0;
 return NextResponse.json({leads:Array.isArray(data)?data:[],page,pageSize:size,total,totalPages:Math.max(1,Math.ceil(total/size))},{status:r.status});
}
