import {redirect} from "next/navigation";
import {getCrmSession} from "@/lib/crm-auth";
import QuotationMaker from "@/components/QuotationMaker";
import "../crm.css";
export const dynamic="force-dynamic";
export default async function QuotationPage(){const session=await getCrmSession();if(!session)redirect("/crm/login");return <QuotationMaker session={session}/>}
