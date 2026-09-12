import {redirect} from "next/navigation";
import {getCrmSession} from "@/lib/crm-auth";
import CrmCommercialCenter from "@/components/CrmCommercialCenter";
import "../crm.css";
import "../v2.css";
export const dynamic="force-dynamic";
export default async function CommercialPage(){const session=await getCrmSession();if(!session)redirect("/crm/login");return <CrmCommercialCenter session={session}/>}
