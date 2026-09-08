import type {Metadata} from "next"; import LandingPage from "@/components/LandingPage";
export const metadata:Metadata={title:"Kashmir Tour Packages from Hyderabad",description:"Plan Kashmir holidays covering Srinagar, Gulmarg, Pahalgam and Sonamarg."};
export default function Page(){return <LandingPage title="Kashmir Tour Packages from Hyderabad" description="Plan Kashmir holidays covering Srinagar, Gulmarg, Pahalgam and Sonamarg." slugs={["kashmir"]}/>}
