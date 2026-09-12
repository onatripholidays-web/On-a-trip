import Script from "next/script";
import {Inter} from "next/font/google";
import CrmHeaderActionsPatch from "@/components/CrmHeaderActionsPatch";

const crmInter=Inter({
  subsets:["latin"],
  display:"swap",
  variable:"--font-crm-inter",
});

export default function CrmLayout({children}:{children:React.ReactNode}){
 return <>
  <div className={`crm-app ${crmInter.className}`}>
   <CrmHeaderActionsPatch/>
   {children}
  </div>
  <style jsx global>{`
   .crm-app,
   .crm-app *{
    font-family:var(--font-crm-inter),Inter,"Segoe UI",Arial,sans-serif !important;
    font-synthesis:none;
    -webkit-font-smoothing:antialiased;
    -moz-osx-font-smoothing:grayscale;
   }
   .crm-app input,
   .crm-app select,
   .crm-app textarea,
   .crm-app button{
    font-family:var(--font-crm-inter),Inter,"Segoe UI",Arial,sans-serif !important;
   }
  `}</style>
  <Script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js" strategy="afterInteractive"/>
 </>;
}
