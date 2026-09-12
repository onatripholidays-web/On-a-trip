import type {Metadata} from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import {packages} from "@/lib/site-data";

export const metadata:Metadata={title:"Travel Itineraries | On A Trip Holidays",description:"Explore full day-wise itineraries for On A Trip Holidays pilgrimage, domestic and international packages."};

export default function Itineraries(){
  const items=packages.filter(x=>x.visible!==false&&x.parentSlug===undefined);
  return <SiteShell><main>
    <section className="page-hero"><div className="container"><span className="eyebrow">FULL ITINERARY LIBRARY</span><h1>Every trip, mapped <em>day by day.</em></h1><p>Explore route-by-route itineraries with stays, meals, highlights, inclusions, exclusions and practical travel notes. Final hotels, timings and local conditions are confirmed before departure.</p></div></section>
    <section className="section"><div className="container batch-list">
      {items.map(x=><Link href={`/packages/${x.slug}`} className="batch-row" key={x.slug}><div><small>{x.category} • {x.duration}</small><h2>{x.name}</h2><p>{x.route}</p></div><strong>{x.price}</strong><span>Full itinerary →</span></Link>)}
    </div></section>
  </main></SiteShell>
}
