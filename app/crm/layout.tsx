import Script from "next/script";

export default function CrmLayout({children}:{children:React.ReactNode}){
 return <>{children}<Script src="https://cdn.jsdelivr.net/npm/xlsx@0.18.5/dist/xlsx.full.min.js" strategy="afterInteractive"/></>;
}
