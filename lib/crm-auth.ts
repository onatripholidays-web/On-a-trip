import {cookies} from "next/headers";

export type CrmRole="admin"|"salesperson";
export type CrmSession={user:{id:string;email?:string};profile:{role:CrmRole;salesperson?:string;email:string}};

const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getCrmSession():Promise<CrmSession|null>{
  if(!url||!key)return null;
  const token=(await cookies()).get("oat_crm_access")?.value;
  if(!token)return null;
  const userRes=await fetch(`${url}/auth/v1/user`,{headers:{apikey:key,Authorization:`Bearer ${token}`},cache:"no-store"});
  if(!userRes.ok)return null;
  const user=await userRes.json();
  const profileRes=await fetch(`${url}/rest/v1/crm_users?user_id=eq.${encodeURIComponent(user.id)}&select=email,role,salesperson&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${token}`},cache:"no-store"});
  if(!profileRes.ok)return null;
  const profiles=await profileRes.json();
  const profile=profiles?.[0];
  if(!profile)return null;
  return {user,profile:{...profile,salesperson:profile.salesperson??undefined}};
}

export function crmSupabaseConfig(){
  if(!url||!key)throw new Error("Supabase environment variables are not configured.");
  return {url,key};
}
