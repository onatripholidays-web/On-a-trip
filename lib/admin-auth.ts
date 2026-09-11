import {cookies} from "next/headers";

const url=process.env.NEXT_PUBLIC_SUPABASE_URL;
const key=process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export async function getAdminSession(){
  if(!url||!key) return null;
  const token=(await cookies()).get("oat_admin_access")?.value;
  if(!token) return null;
  const userRes=await fetch(`${url}/auth/v1/user`,{headers:{apikey:key,Authorization:`Bearer ${token}`},cache:"no-store"});
  if(!userRes.ok) return null;
  const user=await userRes.json();
  const profileRes=await fetch(`${url}/rest/v1/admin_profiles?id=eq.${encodeURIComponent(user.id)}&select=id,full_name,role,active&limit=1`,{headers:{apikey:key,Authorization:`Bearer ${token}`},cache:"no-store"});
  if(!profileRes.ok) return null;
  const profiles=await profileRes.json();
  const profile=profiles?.[0];
  if(!profile?.active) return null;
  return {user,profile,token};
}

export function supabaseConfig(){
  if(!url||!key) throw new Error("Supabase environment variables are not configured.");
  return {url,key};
}
