import type {Metadata} from "next"; import LandingPage from "@/components/LandingPage";
export const metadata:Metadata={title:"Pilgrimage Tour Packages from Hyderabad",description:"Explore Char Dham, Do Dham and Kedarnath pilgrimage packages."};
export default function Page(){return <LandingPage title="Pilgrimage Tour Packages from Hyderabad" description="Explore Char Dham, Do Dham and Kedarnath pilgrimage packages." slugs={["char-dham","do-dham","kedarnath"]}/>}
