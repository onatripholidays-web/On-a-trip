import {redirect} from "next/navigation";
import {getCrmSession} from "@/lib/crm-auth";
import ItineraryBuilder from "@/components/ItineraryBuilder";
import "../crm.css";

export const dynamic="force-dynamic";

type SearchParams=Record<string,string|string[]|undefined>;

export default async function ItineraryPage({searchParams}:{searchParams:Promise<SearchParams>}){
 const session=await getCrmSession();
 if(!session)redirect("/crm/login");
 const params=await searchParams;
 const value=(key:string)=>{const v=params[key];return Array.isArray(v)?v[0]||"":v||""};
 return <ItineraryBuilder session={session} initialData={{guest:value("name"),dest:value("destination"),pax:value("travellers")||"2",dates:value("travelDate")}}/>;
}
