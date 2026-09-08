import type {Metadata} from "next"; import LandingPage from "@/components/LandingPage";
export const metadata:Metadata={title:"Kedarnath Yatra from Hyderabad",description:"Plan your Kedarnath journey with clear route and support."};
export default function Page(){return <LandingPage title="Kedarnath Yatra from Hyderabad" description="Plan your Kedarnath journey with clear route and support." slugs={["kedarnath"]}/>}
