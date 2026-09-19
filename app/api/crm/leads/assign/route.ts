import {NextResponse} from "next/server";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";

async function rest(url:string,key:string,path:string,init?:RequestInit){
 const headers:Record<string,string>={apikey:key,"Content-Type":"application/json",...(init?.headers as Record<string,string>||{})};
 return fetch(url+"/rest/v1/"+path,{...init,headers,cache:"no-store"});
}
export async function POST(req:Request){
 const session=await getCrmSession();
 if(!session)return NextResponse.json({error:"Login required"},{status:401});
 const {url}=crmSupabaseConfig();const key=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY;
 if(!key)return NextResponse.json({error:"Server key not configured"},{status:503});
 const body=await req.json().catch(()=>({}));const id=String(body.id||"").trim();const userId=String(body.user_id||"").trim();
 if(!id||!userId)return NextResponse.json({error:"Lead and salesperson are required"},{status:400});
 if(session.profile.role!=="admin"&&session.profile.role!=="manager")return NextResponse.json({error:"Only admins and managers can assign leads"},{status:403});
 const user=await rest(url,key,"crm_users?user_id=eq."+encodeURIComponent(userId)+"&role=eq.salesperson&select=user_id,email,salesperson,role&limit=1");
 const rows=await user.json().catch(()=>[]);
 const person=Array.isArray(rows)?rows[0]:null;
 if(!person)return NextResponse.json({error:"Salesperson not found or inactive"},{status:404});
 const team=await rest(url,key,"crm_sales_team?or=(auth_user_id.eq."+encodeURIComponent(userId)+",email.eq."+encodeURIComponent(String(person.email||""))+")&select=id,name,email,is_active&limit=1");
 const teamRows=await team.json().catch(()=>[]);
 const teamPerson=Array.isArray(teamRows)?teamRows[0]:null;
 if(teamPerson?.is_active===false)return NextResponse.json({error:"Salesperson is inactive"},{status:404});
 const personName=String(person.salesperson||teamPerson?.name||person.email||"");
 const lead=await rest(url,key,"enquiries?id=eq."+encodeURIComponent(id),{method:"PATCH",headers:{Prefer:"return=representation"},body:JSON.stringify({assigned_to:userId,salesperson:personName})});
 if(!lead.ok){const detail=await lead.text().catch(()=>"");return NextResponse.json({error:"Could not assign lead",detail},{status:500});}
 return NextResponse.json({ok:true,lead:await lead.json().catch(()=>null)});
}
