import {redirect} from "next/navigation";
import {getCrmSession} from "@/lib/crm-auth";
import ItineraryBuilderV2 from "@/components/ItineraryBuilderV2";
import "../crm.css";
export const dynamic="force-dynamic";
export default async function ItineraryPage(){const session=await getCrmSession();if(!session)redirect("/crm/login");return <ItineraryBuilderV2 session={session}/>}
