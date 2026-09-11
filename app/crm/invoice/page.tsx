import {redirect} from "next/navigation";
import {getCrmSession} from "@/lib/crm-auth";
import InvoiceMaker from "@/components/InvoiceMaker";
import "../crm.css";
export const dynamic="force-dynamic";
export default async function InvoicePage(){const session=await getCrmSession();if(!session)redirect("/crm/login");return <InvoiceMaker session={session}/>}
