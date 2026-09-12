import {redirect} from "next/navigation";
import {getCrmSession} from "@/lib/crm-auth";
import CrmFinanceCenter from "@/components/CrmFinanceCenter";
import "../crm.css";
import "../v2.css";
export const dynamic="force-dynamic";
export default async function FinancePage(){const session=await getCrmSession();if(!session)redirect("/crm/login");return <CrmFinanceCenter session={session}/>}
