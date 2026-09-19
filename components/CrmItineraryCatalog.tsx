"use client";

import {useEffect,useMemo,useRef,useState} from "react";
import {useRouter} from "next/navigation";
import type {CrmSession} from "@/lib/crm-auth";
import ItineraryBuilderV2 from "@/components/ItineraryBuilderV2";

type PackageItem={
  id:string;slug?:string;name:string;category?:string;destination?:string;duration?:string;
  duration_days?:number;duration_nights?:number;route?:string;from_location?:string;
  price?:string|number;price_per_person?:string|number;description?:string;
  image?:string;image_url?:string;meals?:string;batch?:string;status?:string;
};

const fallbackImages=[
  "https://images.unsplash.com/photo-1544735716-392fe2489ffa?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1518684079-3c830dcef090?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1548013146-72479768bada?auto=format&fit=crop&w=1000&q=85",
  "https://images.unsplash.com/photo-1606210127445-9f3cbe8b5aef?auto=format&fit=crop&w=1000&q=85"
];

function slugify(value:string){return value.toLowerCase().trim().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"").slice(0,70)}
function initials(name:string){return name.trim().split(/\\s+/).slice(0,2).map(x=>x[0]||"").join("").toUpperCase()||"NK"}
function durationParts(p:PackageItem){
  const text=String(p.duration||"");
  const dm=text.match(/(\\d+)\\s*Days?/i);
  const nm=text.match(/(\\d+)\\s*Nights?/i);
  const days=Number(p.duration_days||dm?.[1]||0);
  const nights=Number(p.duration_nights||nm?.[1]||(days>0?Math.max(days-1,0):0));
  return {days,nights};
}
function priceText(p:PackageItem){
  const raw=p.price_per_person??p.price;
  if(raw===null||raw===undefined||raw==="")return "₹ 0.00";
  const n=Number(String(raw).replace(/[^0-9.]/g,""));
  return Number.isFinite(n)?`₹ ${n.toLocaleString("en-IN",{minimumFractionDigits:2,maximumFractionDigits:2})}`:String(raw);
}
function paxText(p:PackageItem){
  const name=String(p.name||"").toLowerCase();
  if(name.includes("couple"))return "2A 0C 0I";
  return "2A 0C 0I";
}

export default function CrmItineraryCatalog({session}:{session:CrmSession}){
  const router=useRouter();
  const searchRef=useRef<HTMLInputElement>(null);
  const [packages,setPackages]=useState<PackageItem[]>([]);
  const [query,setQuery]=useState("");
  const [category,setCategory]=useState("All Packages");
  const [page,setPage]=useState(1);
  const [perPage,setPerPage]=useState(20);
  const [loading,setLoading]=useState(true);
  const [error,setError]=useState("");
  const [notice,setNotice]=useState("");
  const [creating,setCreating]=useState(false);
  const [pdfOpen,setPdfOpen]=useState(false);
  const [addOpen,setAddOpen]=useState(false);
  const [saving,setSaving]=useState(false);
  const [selected,setSelected]=useState<PackageItem|null>(null);
  const [addForm,setAddForm]=useState({name:"",destination:"",category:"Holiday",days:"3",nights:"2",price:"",description:"",image:""});

  const isAdmin=session.profile.role==="admin"||session.profile.role==="manager";

  async function load(){
    setLoading(true);setError("");
    try{
      const r=await fetch("/api/crm/packages",{cache:"no-store"});
      const d=await r.json();
      if(!r.ok)throw new Error(d?.error||"Could not load packages");
      setPackages(Array.isArray(d)?d:[]);
    }catch(e){setError(e instanceof Error?e.message:"Could not load packages")}
    finally{setLoading(false)}
  }
  useEffect(()=>{void load()},[]);
  useEffect(()=>{
    const onKey=(e:KeyboardEvent)=>{
      if((e.metaKey||e.ctrlKey)&&e.key.toLowerCase()==="k"){e.preventDefault();searchRef.current?.focus()}
      if(e.key==="Escape"){setPdfOpen(false);setAddOpen(false);setSelected(null)}
    };
    window.addEventListener("keydown",onKey);return()=>window.removeEventListener("keydown",onKey)
  },[]);

  const categories=useMemo(()=>{
    const values=packages.map(p=>String(p.category||"Holiday").trim()).filter(Boolean);
    return ["All Packages",...Array.from(new Set(values)).sort()];
  },[packages]);

  const filtered=useMemo(()=>{
    const q=query.trim().toLowerCase();
    return packages.filter(p=>{
      const hay=[p.name,p.destination,p.category,p.route,p.from_location,p.description].join(" ").toLowerCase();
      return (!q||hay.includes(q))&&(category==="All Packages"||String(p.category||"Holiday")===category);
    });
  },[packages,query,category]);

  const totalPages=Math.max(1,Math.ceil(filtered.length/perPage));
  const visible=filtered.slice((page-1)*perPage,page*perPage);
  useEffect(()=>{setPage(1)},[query,category,perPage]);

  function openCreate(){setCreating(true);window.scrollTo({top:0,behavior:"smooth"})}
  function usePackage(p:PackageItem){
    const params=new URLSearchParams();
    params.set("destination",p.name);
    if(p.from_location)params.set("start",p.from_location);
    const d=durationParts(p);if(d.days)params.set("days",String(d.days));
    const price=p.price_per_person??p.price;if(price)params.set("budget",String(price));
    setSelected(null);setCreating(true);
    history.replaceState(null,"",`/crm/itinerary?create=1&package=${encodeURIComponent(p.slug||slugify(p.name))}`);
    try{localStorage.setItem("oat_itinerary_selected_package",JSON.stringify(p))}catch{}
  }

  async function addPackage(e:React.FormEvent){
    e.preventDefault();setSaving(true);setError("");
    try{
      const r=await fetch("/api/crm/packages",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({
        package_name:addForm.name,destination:addForm.destination,category:addForm.category,
        duration_days:Number(addForm.days)||null,duration_nights:Number(addForm.nights)||null,
        price_per_person:addForm.price?Number(addForm.price):null,description:addForm.description,
        image_url:addForm.image||null,package_code:slugify(addForm.name),status:"active"
      })});
      const d=await r.json().catch(()=>null);
      if(!r.ok)throw new Error(d?.error||"Could not add package");
      setAddOpen(false);setAddForm({name:"",destination:"",category:"Holiday",days:"3",nights:"2",price:"",description:"",image:""});
      await load();setNotice("Package added successfully");
    }catch(e){setError(e instanceof Error?e.message:"Could not add package")}
    finally{setSaving(false)}
  }

  const profileName=session.profile.salesperson||session.user.email?.split("@")[0]||"Admin";

  if(creating){
    return <div className="oat-itinerary-create-shell">
      <div className="oat-itinerary-create-bar">
        <button type="button" className="oat-back-button" onClick={()=>{setCreating(false);router.replace("/crm/itinerary")}}>← Itineraries</button>
        <div><b>Create Customer Itinerary</b><span>Build a custom itinerary and continue to quotation</span></div>
      </div>
      <ItineraryBuilderV2 session={session}/>
    </div>
  }

  const nav=[
    ["dashboard","⌁","Dashboard","/crm"],
    ["queries","▤","Queries","/crm"],
    ["itineraries","▥","Itineraries","/crm/itinerary"],
    ["clients","♙","Clients","/crm/commercial?tab=customers"],
    ["companies","▦","Companies","/crm/commercial?tab=customers"],
    ["payments","▣","Payments","/crm/commercial?tab=payments"],
    ["bookings","▣","Bookings","/crm/commercial?tab=bookings"],
    ["activities","✓","Activities","/crm/commercial?tab=tasks"],
    ["mail","✉","Mail","/crm/commercial?tab=tasks"],
    ["masters","◫","Travel Masters","/crm/commercial?tab=suppliers"],
    ["reports","▥","Reports","/crm"],
    ["attendance","◷","Attendance","/crm/commercial?tab=tasks"],
    ["marketing","◈","Marketing","/crm/lead-distribution"],
    ["website","◎","Website Settings","/crm/users"]
  ];

  return <main className="oat-itinerary-shell">
    <aside className="oat-itinerary-sidebar">
      <div className="oat-itinerary-brand">
        <div className="oat-brand-mark">✧</div>
        <div><b>On A Trip Holidays</b><span>CRM</span></div>
      </div>
      <nav>{nav.map(([key,icon,label,path])=><button key={key} type="button" className={key==="itineraries"?"active":""} onClick={()=>router.push(path)}><span className="oat-nav-icon">{icon}</span><span>{label}</span></button>)}</nav>
      <div className="oat-help"><div className="oat-help-icon">♧</div><div><b>Need Help?</b><span>Our team is here for you.</span></div><button type="button" onClick={()=>window.location.href="mailto:support@onatripholidays.com?subject=CRM Support"}>Contact Support</button></div>
      <div className="oat-sidebar-footer"><span>v5.0.0</span><button type="button" aria-label="Collapse sidebar">‹</button></div>
    </aside>

    <section className="oat-itinerary-main">
      <header className="oat-itinerary-topbar">
        <div className="oat-top-search"><span>All⌄</span><input placeholder="Search itineraries, destinations, clients… (Ctrl + K)" value={query} onChange={e=>setQuery(e.target.value)} ref={searchRef}/><b>⌕</b></div>
        <div className="oat-top-actions">
          <button type="button">✈ Flight Search</button>
          <button type="button">▦ Hotel Search</button>
          <button type="button" className="oat-time-chip">◷ 00h 15m</button>
          <button type="button" className="oat-icon-btn" onClick={()=>setNotice("Notifications are available from the CRM header.")}>▱</button>
          <button type="button" className="oat-icon-btn">▣</button>
          <button type="button" className="oat-icon-btn">▤</button>
          <button type="button" className="oat-plus-btn" onClick={openCreate}>＋</button>
          <button type="button" className="oat-icon-btn">♧</button>
          <button type="button" className="oat-icon-btn" onClick={()=>router.push("/crm/users")}>⚙</button>
          <div className="oat-profile"><span>{initials(profileName)}</span><div><b>{profileName}</b><small>{session.profile.role}</small></div></div>
        </div>
      </header>

      <div className="oat-itinerary-page">
        <div className="oat-itinerary-titlebar">
          <div><h1>Itineraries</h1><p>Manage your travel packages and itineraries</p></div>
        </div>

        <div className="oat-itinerary-toolbar">
          <div className="oat-catalog-search"><span>⌕</span><input placeholder="Search by package name or destination" value={query} onChange={e=>setQuery(e.target.value)} ref={searchRef}/></div>
          <select value={category} onChange={e=>setCategory(e.target.value)} aria-label="Package category">{categories.map(c=><option key={c}>{c}</option>)}</select>
          <button type="button" className="oat-tool-settings" onClick={()=>setNotice("Itinerary display settings saved automatically.")}>⚙</button>
          <button type="button" className="oat-outline-action" onClick={()=>setPdfOpen(true)}>▧ Add Itinerary via PDF</button>
          <button type="button" className="oat-ai-action" onClick={openCreate}>✦ Create Customer Itinerary</button>
          <button type="button" className="oat-add-action" onClick={()=>isAdmin?setAddOpen(true):setNotice("Only admins and managers can add packages.")}>＋ Add Package</button>
        </div>

        {error&&<div className="oat-catalog-error">{error}</div>}
        {loading?<div className="oat-catalog-state"><div className="oat-spinner"></div><b>Loading itineraries…</b><span>Fetching your published travel packages.</span></div>:
        !visible.length?<div className="oat-catalog-state"><div className="oat-empty-icon">▥</div><b>No itineraries found</b><span>Try another destination or category, or create a customer itinerary.</span><button type="button" className="oat-ai-action" onClick={openCreate}>＋ Create Customer Itinerary</button></div>:
        <div className="oat-itinerary-grid">{visible.map((p,i)=>{const d=durationParts(p);const image=p.image||p.image_url||fallbackImages[i%fallbackImages.length];return <article className="oat-package-card" key={p.id||p.slug||p.name}>
          <button type="button" className="oat-package-image" onClick={()=>setSelected(p)} aria-label={`Open ${p.name}`}><img src={image} alt="" loading={i>3?"lazy":"eager"}/></button>
          <div className="oat-package-body">
            <div className="oat-package-title"><h2>{p.name}</h2><button type="button" onClick={()=>setSelected(p)} aria-label={`More options for ${p.name}`}>⋮</button></div>
            <span className="oat-package-tag">{p.destination||p.category||"India"}</span>
            <div className="oat-package-meta">
              <div><span>DURATION</span><b>{d.nights||0} Nights</b><small>{d.days||0} Days</small></div>
              <div><span>PAX</span><b>{paxText(p)}</b></div>
              <div><span>TOTAL PRICE</span><strong>{priceText(p)}</strong></div>
            </div>
          </div>
        </article>})}</div>}

        <div className="oat-itinerary-pagination">
          <span>Showing {filtered.length?((page-1)*perPage+1):0} to {Math.min(page*perPage,filtered.length)} of {filtered.length} itineraries</span>
          <div><label>Records per page <select value={perPage} onChange={e=>setPerPage(Number(e.target.value))}><option value={20}>20</option><option value={40}>40</option><option value={80}>80</option></select></label><button type="button" disabled={page<=1} onClick={()=>setPage(p=>Math.max(1,p-1))}>‹</button><b>{page}</b><button type="button" disabled={page>=totalPages} onClick={()=>setPage(p=>Math.min(totalPages,p+1))}>›</button></div>
        </div>
      </div>
    </section>

    {notice&&<div className="oat-itinerary-toast" onClick={()=>setNotice("")}>✓ {notice}</div>}

    {selected&&<div className="oat-modal-bg" onMouseDown={()=>setSelected(null)}><section className="oat-package-modal" onMouseDown={e=>e.stopPropagation()}>
      <img src={selected.image||selected.image_url||fallbackImages[0]} alt="" />
      <div className="oat-package-modal-body"><button className="oat-modal-close" type="button" onClick={()=>setSelected(null)}>×</button><span className="oat-package-tag">{selected.destination||selected.category||"Holiday"}</span><h2>{selected.name}</h2><p>{selected.description||selected.route||"Official On A Trip Holidays travel package."}</p><div className="oat-modal-details"><b>{durationParts(selected).nights||0} Nights</b><b>{durationParts(selected).days||0} Days</b><b>{priceText(selected)}</b></div><div className="oat-modal-actions"><button type="button" onClick={()=>usePackage(selected)} className="oat-ai-action">＋ Use in Customer Itinerary</button><button type="button" onClick={()=>setSelected(null)} className="oat-cancel-action">Close</button></div></div>
    </section></div>}

    {pdfOpen&&<div className="oat-modal-bg" onMouseDown={()=>setPdfOpen(false)}><section className="oat-upload-modal" onMouseDown={e=>e.stopPropagation()}><button className="oat-modal-close" type="button" onClick={()=>setPdfOpen(false)}>×</button><div className="oat-upload-icon">▧</div><h2>Add Itinerary via PDF</h2><p>Upload a PDF itinerary to keep the source document with the CRM record. You can then use Create Customer Itinerary to turn its details into a customer-ready plan.</p><label className="oat-file-drop"><input type="file" accept="application/pdf,.pdf" onChange={e=>{const f=e.target.files?.[0];if(f)setNotice(`${f.name} selected. PDF import processing will be connected to the itinerary record.`)}}/><b>Choose PDF file</b><span>PDF only · Max size follows CRM storage limits</span></label><button type="button" className="oat-cancel-action" onClick={()=>setPdfOpen(false)}>Close</button></section></div>}

    {addOpen&&<div className="oat-modal-bg" onMouseDown={()=>setAddOpen(false)}><form className="oat-add-modal" onSubmit={addPackage} onMouseDown={e=>e.stopPropagation()}><div className="oat-add-head"><div><span>TRAVEL MASTER</span><h2>Add Package</h2><p>Create a reusable package for the itinerary catalog.</p></div><button type="button" onClick={()=>setAddOpen(false)}>×</button></div><div className="oat-add-grid"><label>Package name *<input required value={addForm.name} onChange={e=>setAddForm(f=>({...f,name:e.target.value}))}/></label><label>Destination<input value={addForm.destination} onChange={e=>setAddForm(f=>({...f,destination:e.target.value}))}/></label><label>Category<select value={addForm.category} onChange={e=>setAddForm(f=>({...f,category:e.target.value}))}><option>Holiday</option><option>Pilgrimage</option><option>International</option><option>Adventure</option><option>Honeymoon</option><option>Corporate</option></select></label><label>Days<input type="number" min="1" value={addForm.days} onChange={e=>setAddForm(f=>({...f,days:e.target.value}))}/></label><label>Nights<input type="number" min="0" value={addForm.nights} onChange={e=>setAddForm(f=>({...f,nights:e.target.value}))}/></label><label>Price / person<input type="number" min="0" value={addForm.price} onChange={e=>setAddForm(f=>({...f,price:e.target.value}))}/></label><label className="full">Image URL<input value={addForm.image} onChange={e=>setAddForm(f=>({...f,image:e.target.value}))}/></label><label className="full">Description<textarea rows={4} value={addForm.description} onChange={e=>setAddForm(f=>({...f,description:e.target.value}))}/></label></div>{error&&<p className="oat-form-error">{error}</p>}<div className="oat-modal-actions"><button type="button" className="oat-cancel-action" onClick={()=>setAddOpen(false)}>Cancel</button><button className="oat-add-action" disabled={saving}>{saving?"Saving…":"Add Package"}</button></div></form></div>}
  </main>
}
