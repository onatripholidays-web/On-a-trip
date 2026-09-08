import type {Metadata} from "next"; import LandingPage from "@/components/LandingPage";
export const metadata:Metadata={title:"Travel Agency in Hyderabad",description:"On A Trip Holidays provides Telugu-first pilgrimage, domestic and international travel support from Hyderabad."};
export default function Page(){return <LandingPage title="Travel Agency in Hyderabad" description="On A Trip Holidays provides Telugu-first pilgrimage, domestic and international travel support from Hyderabad." slugs={["char-dham","manali","kashmir","thailand"]}/>}
