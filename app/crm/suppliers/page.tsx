import {redirect} from "next/navigation";
import {getCrmSession} from "@/lib/crm-auth";
import CrmSupplierCenter from "@/components/CrmSupplierCenter";
import "../crm.css";
import "../v2.css";
import "../bookings/bookings.css";
import "./suppliers.css";
export const dynamic="force-dynamic";
export default async function SuppliersPage(){const session=await getCrmSession();if(!session)redirect("/crm/login");return <CrmSupplierCenter session={session}/>}
