import {redirect} from "next/navigation";
import {getCrmSession} from "@/lib/crm-auth";
import ItinerarySourcePicker from "@/components/ItinerarySourcePicker";
import "../crm.css";
export const dynamic="force-dynamic";
export default async function ItineraryPage(){const session=await getCrmSession();if(!session)redirect("/crm/login");return <ItinerarySourcePicker session={session}/>}
