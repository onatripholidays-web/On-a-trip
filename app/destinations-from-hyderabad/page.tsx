import type {Metadata} from "next"; import LandingPage from "@/components/LandingPage";
export const metadata:Metadata={title:"Tour Destinations from Hyderabad",description:"Browse the destinations currently offered by On A Trip Holidays."};
export default function Page(){return <LandingPage title="Tour Destinations from Hyderabad" description="Browse the destinations currently offered by On A Trip Holidays." slugs={["manali","kashmir","ladakh","spiti","kerala","thailand","bali","dubai","vietnam","nepal"]}/>}
