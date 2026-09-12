export default function CrmLoading(){
  return <main className="crm-shell" aria-busy="true" aria-label="Loading CRM">
    <aside className="crm-sidebar" style={{opacity:.92}} />
    <section className="crm-content">
      <header className="crm-top"><div><span className="crm-kicker">ON A TRIP HOLIDAYS</span><strong>Loading CRM…</strong></div></header>
      <div className="crm-page">
        <div className="crm-welcome" style={{minHeight:150}}><div><span className="crm-kicker">EXECUTIVE DASHBOARD</span><h1>Preparing your dashboard…</h1><p>Loading your latest CRM data.</p></div></div>
        <div className="crm-stats crm-stats-five">{[1,2,3,4,5].map(i=><div key={i} style={{minHeight:90}}><strong>—</strong><span>Loading</span></div>)}</div>
      </div>
    </section>
  </main>;
}
