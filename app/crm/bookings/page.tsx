import {redirect} from "next/navigation";
import {getCrmSession} from "@/lib/crm-auth";
import CrmBookingOperations from "@/components/CrmBookingOperations";
import "../crm.css";
import "../v2.css";
import "./bookings.css";
export const dynamic="force-dynamic";
export default async function BookingsPage(){const session=await getCrmSession();if(!session)redirect("/crm/login");return <CrmBookingOperations session={session}/>}
