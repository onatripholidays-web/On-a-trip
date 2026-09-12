import type {Metadata} from "next";
import {notFound} from "next/navigation";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import EnquiryForm from "@/components/EnquiryForm";
import PackageCard from "@/components/PackageCard";
import PackageVariants from "@/components/PackageVariants";
import TourItineraryExperience from "@/components/TourItineraryExperience";
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
    <section className="package-hero tour-hero" style={{backgroundImage:`linear-gradient(90deg,rgba(5,23,42,.88),rgba(5,23,42,.28)),url('${item.image}')`}}>
      <div className="container package-hero-content">
        <span className="eyebrow">{item.category} • ON A TRIP HOLIDAYS</span>
        <h1>{item.name}</h1>
        <p>{item.route}</p>
        <div className="hero-buttons"><Link className="btn primary" href="#enquiry">Get a quote</Link><a className="btn ghost" target="_blank" rel="noreferrer" href={`https://wa.me/919182894146?text=${encodeURIComponent(`Hi On A Trip Holidays, I am interested in ${item.name}.`)}`}>WhatsApp us</a></div>
        {variants.length>0&&<PackageVariants options={variants}/>} 
      </div>
    </section>

    <TourItineraryExperience item={item} plan={plan}/>

    <section className="section tour-booking-section"><div className="container package-layout"><div><span className="eyebrow">START PLANNING</span><h2>Book your <em>{item.name}</em></h2><p className="lead">Tell us your travel date, departure city and group size. Our team will confirm the best available batch, hotel and vehicle combination.</p><div className="highlight-list">{item.highlights.map(h=><div key={h}>✓ <span>{h}</span></div>)}</div></div><aside className="sticky-quote" id="enquiry"><div className="quote-head"><span>ENQUIRE NOW</span><h3>{item.name}</h3><strong>{item.price}</strong></div><EnquiryForm defaultPackage={item.name}/></aside></div></section>

    {related.length>0&&<section className="section soft-section"><div className="container"><div className="section-head"><div><span className="eyebrow">YOU MAY ALSO LIKE</span><h2>More {item.category.toLowerCase()} journeys.</h2></div></div><div className="package-grid">{related.map(x=><PackageCard key={x.slug} item={x}/>)}</div></div></section>}
  </main></SiteShell>
}
