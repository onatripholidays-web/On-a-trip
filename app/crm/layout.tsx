import Script from "next/script";
import CrmHeaderActionsPatch from "@/components/CrmHeaderActionsPatch";

export default function CrmLayout({children}:{children:React.ReactNode}){
 return <><CrmHeaderActionsPatch/>{children}<Script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js" strategy="afterInteractive"/></>;
}

// Production redeploy trigger: CRM fixes are now on main.
