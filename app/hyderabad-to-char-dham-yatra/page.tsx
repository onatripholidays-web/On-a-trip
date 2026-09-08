import type {Metadata} from "next"; import LandingPage from "@/components/LandingPage";
export const metadata:Metadata={title:"Char Dham Yatra from Hyderabad",description:"Plan your Char Dham journey from Hyderabad with Telugu-first travel support."};
export default function Page(){return <LandingPage title="Char Dham Yatra from Hyderabad" description="Plan your Char Dham journey from Hyderabad with Telugu-first travel support." slugs={["char-dham"]}/>}
