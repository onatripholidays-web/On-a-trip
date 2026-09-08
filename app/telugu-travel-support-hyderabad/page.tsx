import type {Metadata} from "next"; import LandingPage from "@/components/LandingPage";
export const metadata:Metadata={title:"Telugu Travel Support in Hyderabad",description:"Travel with English, Telugu and Hindi support from enquiry to return journey."};
export default function Page(){return <LandingPage title="Telugu Travel Support in Hyderabad" description="Travel with English, Telugu and Hindi support from enquiry to return journey." slugs={["char-dham","manali","kashmir","thailand"]}/>}
