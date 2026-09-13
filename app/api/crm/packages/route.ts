import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";
import {packages as sitePackages} from "@/lib/site-data";

export const dynamic="force-dynamic";

const emptyList:string[]=[];

export async function GET(){
  const session=await getCrmSession();
  if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
  try{
    const {url,key}=crmSupabaseConfig();
    const token=(await cookies()).get("oat_crm_access")?.value||"";
    const r=await fetch(`${url}/rest/v1/packages?select=*&visible=eq.true&status=eq.published&order=name.asc`,{
      headers:{apikey:key,Authorization:`Bearer ${token}`},cache:"no-store"
    });
    if(r.ok){
      const data=await r.json();
      if(Array.isArray(data)&&data.length)return NextResponse.json(data);
    }
    return NextResponse.json(sitePackages.filter(p=>p.visible!==false).map(p=>({
      id:p.slug,slug:p.slug,name:p.name,category:p.category,duration:p.duration,route:p.route,
      from_location:p.from,price:p.price,description:p.description,image:p.image,highlights:p.highlights||[],
      meals:p.meals||null,batch:p.batch||null,visible:true,status:"published",itinerary:emptyList,inclusions:emptyList,exclusions:emptyList
    })));
  }catch{
    return NextResponse.json(sitePackages.filter(p=>p.visible!==false).map(p=>({
      id:p.slug,slug:p.slug,name:p.name,category:p.category,duration:p.duration,route:p.route,
      from_location:p.from,price:p.price,description:p.description,image:p.image,highlights:p.highlights||[],
      meals:p.meals||null,batch:p.batch||null,visible:true,status:"published",itinerary:emptyList,inclusions:emptyList,exclusions:emptyList
    })));
  }
}
