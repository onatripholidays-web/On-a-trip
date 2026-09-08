import type {Metadata} from "next"; import LandingPage from "@/components/LandingPage";
export const metadata:Metadata={title:"Himachal Tour Packages from Hyderabad",description:"Explore our current Himachal collection centred on Manali and Himalayan holidays."};
export default function Page(){return <LandingPage title="Himachal Tour Packages from Hyderabad" description="Explore our current Himachal collection centred on Manali and Himalayan holidays." slugs={["manali"]}/>}
