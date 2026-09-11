import {redirect} from "next/navigation";
import {getAdminSession} from "@/lib/admin-auth";
import AdminPackages from "@/components/AdminPackages";
export const dynamic="force-dynamic";
export default async function AdminPackagesPage(){const s=await getAdminSession();if(!s)redirect('/admin/login');return <AdminPackages role={s.profile.role}/>}
