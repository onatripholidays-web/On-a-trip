import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {getCrmSession,crmSupabaseConfig} from "@/lib/crm-auth";
import {packages as sitePackages} from "@/lib/site-data";

export const dynamic="force-dynamic";

const emptyList:string[]=[];

function normalizePackage(p:any){
  const days=Number(p.duration_days||0);
  const nights=Number(p.duration_nights||Math.max(days-1,0));
  return {
    id:String(p.id||p.slug||p.package_code||p.package_name),
    slug:p.slug||p.package_code||String(p.package_name||"").toLowerCase().replace(/[^a-z0-9]+/g,"-"),
    name:p.name||p.package_name||"Untitled Package",
    category:p.category||"Holiday",
    duration:p.duration||((days||nights)?`${nights} Nights / ${days} Days`:""),
    duration_days:days||undefined,
    duration_nights:nights||undefined,
    route:p.route||p.destination||"",
    from_location:p.from_location||p.from||"",
    destination:p.destination||"",
    price:p.price??p.price_per_person??"",
    price_per_person:p.price_per_person??p.price??"",
    description:p.description||"",
    image:p.image||p.image_url||"",
    image_url:p.image_url||p.image||"",
    meals:p.meals||"",
    batch:p.batch||"",
    visible:p.visible!==false,
    status:p.status||"active",
    itinerary:Array.isArray(p.itinerary)?p.itinerary:emptyList,
    inclusions:Array.isArray(p.inclusions)?p.inclusions:emptyList,
    exclusions:Array.isArray(p.exclusions)?p.exclusions:emptyList
  };
}

function fallback(){
  return sitePackages.filter(p=>p.visible!==false).map(p=>normalizePackage({
    id:p.slug,slug:p.slug,name:p.name,category:p.category,duration:p.duration,route:p.route,
    from_location:p.from,price:p.price,description:p.description,image:p.image,highlights:p.highlights||[],
    meals:p.meals||null,batch:p.batch||null,status:"active",itinerary:emptyList,inclusions:emptyList,exclusions:emptyList
  }));
}

export async function GET(){
  const session=await getCrmSession();
  if(!session)return NextResponse.json({error:"Unauthorized"},{status:401});
  try{
    const {url,key}=crmSupabaseConfig();
    const token=(await cookies()).get("oat_crm_access")?.value||"";
    const r=await fetch(`${url}/rest/v1/packages?select=*&status=eq.active&order=package_name.asc`,{
      headers:{apikey:key,Authorization:`Bearer ${token}`},cache:"no-store"
    });
    if(r.ok){
      const data=await r.json();
      if(Array.isArray(data)&&data.length)return NextResponse.json(data.map(normalizePackage));
    }
    return NextResponse.json(fallback());
  }catch{
    return NextResponse.json(fallback());
  }
}

export async function POST(req:Request){
  const session=await getCrmSession();
  if(!session||!["admin","manager"].includes(session.profile.role))return NextResponse.json({error:"Only admins and managers can add packages."},{status:403});
  try{
    const body=await req.json();
    const name=String(body?.package_name||"").trim();
    if(!name)return NextResponse.json({error:"Package name is required."},{status:400});
    const {url}=crmSupabaseConfig();
    const serviceKey=process.env.SUPABASE_SECRET_KEY||process.env.SUPABASE_SERVICE_ROLE_KEY||process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if(!serviceKey)return NextResponse.json({error:"Supabase server key is not configured."},{status:500});
    const payload={
      package_code:String(body.package_code||name.toLowerCase().replace(/[^a-z0-9]+/g,"-")).slice(0,120),
      package_name:name,
      destination:String(body.destination||"").trim()||null,
      category:String(body.category||"Holiday").trim(),
      duration_days:body.duration_days?Number(body.duration_days):null,
      duration_nights:body.duration_nights?Number(body.duration_nights):null,
      description:String(body.description||"").trim()||null,
      price_per_person:body.price_per_person!==""&&body.price_per_person!=null?Number(body.price_per_person):null,
      image_url:String(body.image_url||"").trim()||null,
      status:"active",
      created_by:session.user.id
    };
    const r=await fetch(`${url}/rest/v1/packages`,{
      method:"POST",
      headers:{apikey:serviceKey,Authorization:`Bearer ${serviceKey}`,"Content-Type":"application/json",Prefer:"return=representation"},
      body:JSON.stringify(payload),cache:"no-store"
    });
    const text=await r.text();
    if(!r.ok)return NextResponse.json({error:text||"Could not create package."},{status:r.status});
    const data=JSON.parse(text);
    return NextResponse.json(normalizePackage(Array.isArray(data)?data[0]:data),{status:201});
  }catch(e){
    return NextResponse.json({error:e instanceof Error?e.message:"Could not create package."},{status:500});
  }
}
