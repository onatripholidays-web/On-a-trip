import type {Metadata} from "next";
import {notFound} from "next/navigation";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import EnquiryForm from "@/components/EnquiryForm";
import PackageCard from "@/components/PackageCard";
import PackageVariants from "@/components/PackageVariants";
import {packages,packageBySlug} from "@/lib/site-data";
import {getItineraryProfile} from "@/lib/itinerary-library";

export async function generateStaticParams(){return packages.map(x=>({slug:x.slug}))}

export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{
  const item=packageBySlug((await params).slug);
  return item?{title:`${item.name} | Full Day Wise Itinerary | On A Trip Holidays`,description:`Full day-wise ${item.name} itinerary with route, stays, meals, highlights, inclusions and travel notes from On A Trip Holidays.`,alternates:{canonical:`/packages/${item.slug}`}}:{};
}

export default async function PackagePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const item=packageBySlug(slug);
  if(!item)notFound();
  const variants=packages.filter(x=>x.parentSlug===item.slug);
  const related=packages.filter(x=>x.visible!==false&&x.category===item.category&&x.slug!==item.slug&&x.parentSlug===undefined).slice(0,3);
  const plan=getItineraryProfile(item);
  return <SiteShell><main>
    <section className="package-hero" style={{backgroundImage:`linear-gradient(90deg,rgba(5,23,42,.86),rgba(5,23,42,.35)),url('${item.image}')`}}>
      <div className="container package-hero-content">
        <span className="eyebrow">{item.category} • ON A TRIP HOLIDAYS</span>
        <h1>{item.name}</h1>
        <p>{item.route}</p>
        <div className="hero-buttons">
          <Link className="btn primary" href="#enquiry">Get a quote</Link>
          <a className="btn ghost" target="_blank" rel="noreferrer" href={`https://wa.me/919182894146?text=${encodeURIComponent(`Hi On A Trip Holidays, I am interested in ${item.name}.`)}`}>WhatsApp us</a>
        </div>
        {variants.length>0&&<PackageVariants options={variants}/>} 
      </div>
    </section>

    <section className="facts"><div><small>Duration</small><b>{item.duration}</b></div><div><small>Starting point</small><b>{item.from}</b></div><div><small>Starting price</small><b>{item.price}</b></div><div><small>Meals</small><b>{item.meals||"As selected"}</b></div></section>

    <section className="section"><div className="container package-layout"><div>
      <span className="eyebrow">OVERVIEW</span><h2>Plan this journey with <em>confidence.</em></h2>
      <p className="lead">{item.description}</p>
      <h3>Highlights</h3><div className="highlight-list">{item.highlights.map(h=><div key={h}>✓ <span>{h}</span></div>)}</div>
      <div className="travel-note"><b>Trip profile</b><p>{plan.pace}</p><p><strong>Best time:</strong> {plan.bestTime}</p></div>
    </div><aside className="sticky-quote" id="enquiry"><div className="quote-head"><span>START PLANNING</span><h3>{item.name}</h3><strong>{item.price}</strong></div><EnquiryForm defaultPackage={item.name}/></aside></div></section>

    <section className="section soft-section"><div className="container">
      <span className="eyebrow">DAY-WISE ITINERARY</span>
      <h2>{item.name} — Full Day Wise Plan</h2>
      <p className="lead">A complete planning reference built around the route, travel style and practical sequencing of this package. Hotel names, local transport, permits and exact timings are confirmed in the final booking voucher.</p>
      <div className="itinerary-list">{plan.days.map(x=><article className="travel-note" key={x.day}>
        <b>{x.day}: {x.title}</b>
        <p>{x.details}</p>
        <div className="itinerary-meta"><span>🏨 {x.stay||"As selected"}</span><span>🍽️ {x.meals||item.meals||"As selected"}</span></div>
      </article>)}</div>
    </div></section>

    <section className="section"><div className="container">
      <div className="section-head"><div><span className="eyebrow">PACKAGE DETAILS</span><h2>What to expect</h2></div></div>
      <div className="package-layout">
        <div><h3>Inclusions</h3><div className="highlight-list">{plan.included.map(x=><div key={x}>✓ <span>{x}</span></div>)}</div></div>
        <div><h3>Exclusions</h3><div className="highlight-list">{plan.excluded.map(x=><div key={x}>• <span>{x}</span></div>)}</div></div>
      </div>
      <div className="travel-note"><b>Important travel notes</b>{plan.tips.map(x=><p key={x}>• {x}</p>)}</div>
    </div></section>

    {related.length>0&&<section className="section soft-section"><div className="container"><div className="section-head"><div><span className="eyebrow">YOU MAY ALSO LIKE</span><h2>More {item.category.toLowerCase()} journeys.</h2></div></div><div className="package-grid">{related.map(x=><PackageCard key={x.slug} item={x}/>)}</div></div></section>}
  </main></SiteShell>
}
