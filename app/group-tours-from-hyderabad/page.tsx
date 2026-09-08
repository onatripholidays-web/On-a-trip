import type {Metadata} from "next"; import LandingPage from "@/components/LandingPage";
export const metadata:Metadata={title:"Group Tours from Hyderabad",description:"Explore group departures and customizable journeys from Hyderabad."};
export default function Page(){return <LandingPage title="Group Tours from Hyderabad" description="Explore group departures and customizable journeys from Hyderabad." slugs={["char-dham","manali","kashmir","ladakh","spiti","thailand"]}/>}
