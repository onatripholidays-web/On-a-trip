import {redirect} from "next/navigation";
import {getCrmSession} from "@/lib/crm-auth";
import CrmQuotationBuilder from "@/components/CrmQuotationBuilder";
import "../crm.css";
import "../v2.css";
export const dynamic="force-dynamic";
export default async function QuotationsPage(){const session=await getCrmSession();if(!session)redirect("/crm/login");return <CrmQuotationBuilder session={session}/>}
