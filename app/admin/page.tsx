import {redirect} from "next/navigation";
import {getAdminSession} from "@/lib/admin-auth";
import AdminDashboard from "@/components/AdminDashboard";

export const dynamic="force-dynamic";

export default async function AdminPage(){
  const session=await getAdminSession();
  if(!session) redirect("/admin/login");
  return <AdminDashboard name={session.profile.full_name||session.user.email||"Admin"} role={session.profile.role}/>;
}
