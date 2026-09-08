import type {Metadata} from "next"; import LandingPage from "@/components/LandingPage";
export const metadata:Metadata={title:"Spiti Valley Tour from Hyderabad",description:"Plan a Spiti road trip with carefully structured Himalayan routes."};
export default function Page(){return <LandingPage title="Spiti Valley Tour from Hyderabad" description="Plan a Spiti road trip with carefully structured Himalayan routes." slugs={["spiti"]}/>}
