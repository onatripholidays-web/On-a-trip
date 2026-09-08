import type {Metadata} from "next"; import LandingPage from "@/components/LandingPage";
export const metadata:Metadata={title:"Uttarakhand Pilgrimage Packages from Hyderabad",description:"Explore our current Uttarakhand pilgrimage collection: Char Dham, Do Dham and Kedarnath."};
export default function Page(){return <LandingPage title="Uttarakhand Pilgrimage Packages from Hyderabad" description="Explore our current Uttarakhand pilgrimage collection: Char Dham, Do Dham and Kedarnath." slugs={["char-dham","do-dham","kedarnath"]}/>}
