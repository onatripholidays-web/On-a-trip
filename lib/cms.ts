import type {Package} from "@/lib/site-data";

export async function getCmsPackages():Promise<Package[]|null>{
 const url=process.env.NEXT_PUBLIC_SUPABASE_URL;const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
 if(!url||!key)return null;
 try{const r=await fetch(`${url}/rest/v1/packages?select=slug,name,category,duration,route,from_location,price,description,image,highlights,meals,batch,visible,parent_slug,status&status=eq.published&visible=eq.true&order=updated_at.desc`,{headers:{apikey:key,Authorization:`Bearer ${key}`},next:{revalidate:60}});if(!r.ok)return null;const rows=await r.json();if(!Array.isArray(rows)||rows.length===0)return null;return rows.map((p:any)=>({slug:p.slug,name:p.name,category:p.category,duration:p.duration||"",route:p.route||"",from:p.from_location||"",price:p.price||"",description:p.description||"",image:p.image||"",highlights:Array.isArray(p.highlights)?p.highlights:[],meals:p.meals||undefined,batch:p.batch||undefined,visible:p.visible!==false,parentSlug:p.parent_slug||undefined}));}catch{return null}
}

export async function getPackageForSlug(slug:string){const cms=await getCmsPackages();return cms?.find(x=>x.slug===slug)||null}
