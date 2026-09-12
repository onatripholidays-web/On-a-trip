export default function CrmLayout({children}:{children:React.ReactNode}){
 return <>
  <div className="crm-app">
   {children}
  </div>
  <style>{`
   .crm-app,.crm-app *{font-family:var(--oat-font),"Manrope","Segoe UI",system-ui,-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif !important;font-synthesis:none;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;}
   .crm-app input,.crm-app select,.crm-app textarea,.crm-app button{font-family:var(--oat-font),"Manrope","Segoe UI",system-ui,-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif !important;}
   .crm-app .crm-shell{min-height:100vh;background:#f4f7f9;}
   .crm-app .crm-content{min-width:0;}
   .crm-app .crm-top{min-height:72px;padding:14px 28px;border-bottom:1px solid #e3e9ed;background:rgba(255,255,255,.98);}
   .crm-app .crm-page{width:100%;max-width:1400px;margin:0 auto;padding:28px 32px 40px;}
   .crm-app .crm-welcome{margin-bottom:18px;padding:25px 28px;border-radius:20px;}
   .crm-app .crm-welcome h1{font-size:27px;line-height:1.15;letter-spacing:-.5px;margin:7px 0 7px;font-weight:750;}
   .crm-app .crm-welcome p{font-size:12px;line-height:1.5;margin:0;}
   .crm-app .crm-stats{gap:12px;margin-bottom:16px;}
   .crm-app .crm-stats>div{min-width:0;padding:18px 17px;border-radius:15px;}
   .crm-app .crm-stats>div strong{font-size:25px;line-height:1.05;font-weight:750;}
   .crm-app .crm-stats>div span{font-size:10px;margin-top:8px;}
   .crm-app .crm-stats>div small{font-size:9px;margin-top:4px;}
   .crm-app .crm-grid{gap:16px;margin-bottom:16px;}
   .crm-app .crm-panel{border-radius:17px;}
   .crm-app .panel-head{padding:18px 20px 13px;}
   .crm-app .panel-head h2{font-size:20px;line-height:1.15;margin:5px 0 4px;font-weight:700;letter-spacing:-.25px;}
   .crm-app .panel-head p{font-size:10px;line-height:1.4;margin:0;}
   .crm-app .pipeline{padding:0 20px 20px;gap:9px;}
   .crm-app .pipeline button{min-height:78px;padding:12px;border-radius:12px;}
   .crm-app .pipeline button span{font-size:10px;font-weight:650;}
   .crm-app .pipeline button b{font-size:18px;margin-top:8px;}
   .crm-app .quick-actions{padding:0 20px 20px;gap:9px;}
   .crm-app .quick-actions button{min-height:78px;padding:13px;border-radius:12px;font-size:10px;}
   .crm-app .quick-actions button b{font-size:17px;margin-top:7px;}
   .crm-app .recent-grid{padding:0 20px 20px;gap:9px;}
   .crm-app .recent-card{padding:12px 13px;border-radius:12px;}
   .crm-app .crm-heading{margin-bottom:18px;}
   .crm-app .crm-heading h1{font-size:28px;line-height:1.1;font-weight:750;letter-spacing:-.5px;}
   .crm-app .crm-heading p{font-size:11px;}
   .crm-app .crm-filters{gap:9px;margin-bottom:14px;padding:12px;border-radius:15px;}
   .crm-app .crm-filters input,.crm-app .crm-filters select,.crm-app .crm-filters button{min-height:40px;font-size:11px;}
   .crm-app .crm-table-wrap{overflow:auto;}
   .crm-app table{font-size:11px;}
   .crm-app th{font-size:9px;letter-spacing:.7px;}
   .crm-app td{padding:12px 13px;}
   .crm-app .row-actions{gap:5px;}
   .crm-app .row-actions button{min-height:30px;padding:6px 8px;font-size:9px;border-radius:8px;}
   .crm-app .crm-sidebar{font-family:var(--oat-font),"Manrope","Segoe UI",system-ui,-apple-system,BlinkMacSystemFont,"Helvetica Neue",Arial,sans-serif !important;}
   .crm-app .crm-sidebar nav button{font-size:11px;}
   .crm-app .crm-sidebar nav button span{font-weight:650;}
   .crm-app .crm-brand{align-items:center;}
   .crm-app .crm-brand .crm-mark{display:flex;align-items:center;justify-content:center;overflow:hidden;background:transparent;border-radius:12px;padding:0;font-size:0;width:46px;height:46px;background-image:url('/assets/logo.png');background-repeat:no-repeat;background-position:center;background-size:contain;}
   .crm-app .crm-brand .crm-mark img{display:block;width:100%;height:100%;object-fit:contain;}
   @media (max-width:900px){.crm-app .crm-page{padding:20px 18px 30px;}.crm-app .crm-top{padding:12px 18px;}}
   @media (max-width:700px){.crm-app .crm-page{padding:16px 12px 24px;}.crm-app .crm-welcome{padding:20px;margin-bottom:14px;}.crm-app .crm-stats{gap:8px;}.crm-app .crm-stats>div{padding:14px 12px;}}
  `}</style>
 </>;
}
