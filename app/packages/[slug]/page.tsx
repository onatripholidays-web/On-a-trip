import type {Metadata} from "next";
import {notFound} from "next/navigation";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import EnquiryForm from "@/components/EnquiryForm";
import PackageCard from "@/components/PackageCard";
import PackageVariants from "@/components/PackageVariants";
import {packages,packageBySlug} from "@/lib/site-data";

type DayPlan={day:string,title:string,details:string};

const seoItineraries:Record<string,DayPlan[]>= {
  thailand:[
    {day:"Day 1",title:"Hyderabad to Bangkok – Thailand Arrival",details:"Arrive in Bangkok, airport pickup and hotel check-in. Evening at leisure to explore nearby markets or enjoy a Chao Phraya dinner cruise. Overnight stay in Bangkok."},
    {day:"Day 2",title:"Bangkok City Tour – Temples and Shopping",details:"Explore Bangkok attractions including Wat Arun, Wat Pho and the city’s vibrant shopping areas. Evening free for local markets and Thai cuisine. Overnight in Bangkok."},
    {day:"Day 3",title:"Bangkok to Pattaya – Coral Island Experience",details:"Transfer to Pattaya and enjoy a Coral Island day trip with optional water activities. Evening explore Pattaya nightlife or relax at the beach. Overnight in Pattaya."},
    {day:"Day 4",title:"Pattaya Sightseeing – Phuket Transfer",details:"Morning Pattaya sightseeing followed by onward travel to Phuket, subject to the selected flight/transport schedule. Hotel check-in and leisure evening. Overnight in Phuket."},
    {day:"Day 5",title:"Phuket Island Tour – Beaches and Sea Views",details:"Enjoy a Phuket island sightseeing experience with beaches, viewpoints and optional boat activities. Evening free for shopping and leisure. Overnight in Phuket."},
    {day:"Day 6",title:"Thailand Holiday – Phuket Departure",details:"Breakfast and hotel check-out. Airport transfer for your return journey, completing your Thailand package from India."}
  ],
  malaysia:[
    {day:"Day 1",title:"Hyderabad to Kuala Lumpur – Malaysia Arrival",details:"Arrive in Kuala Lumpur, airport transfer and hotel check-in. Evening at leisure around Bukit Bintang or nearby shopping areas. Overnight in Kuala Lumpur."},
    {day:"Day 2",title:"Kuala Lumpur City Tour – Petronas Twin Towers",details:"Explore Kuala Lumpur highlights including Petronas Twin Towers, KL Tower, Merdeka Square and city shopping districts. Overnight in Kuala Lumpur."},
    {day:"Day 3",title:"Kuala Lumpur to Genting Highlands",details:"Travel to Genting Highlands and enjoy the mountain resort, cable car views and leisure attractions. Return or stay as per package plan. Overnight in Genting/Kuala Lumpur."},
    {day:"Day 4",title:"Kuala Lumpur to Langkawi – Island Escape",details:"Transfer to Langkawi by the selected flight/transport connection. Check in and relax at the beach. Evening free for Langkawi leisure. Overnight in Langkawi."},
    {day:"Day 5",title:"Langkawi Island Tour – Beaches and Attractions",details:"Enjoy Langkawi sightseeing including island viewpoints, beaches and optional cable car or boat experiences. Evening free for shopping. Overnight in Langkawi."},
    {day:"Day 6",title:"Langkawi to India – Departure",details:"Breakfast and hotel check-out followed by airport transfer for your return journey from Malaysia to India."}
  ],
  bali:[
    {day:"Day 1",title:"India to Bali – Arrival in Denpasar",details:"Arrive at Bali International Airport, private transfer and hotel check-in. Evening free for a relaxed beach walk or local dining. Overnight in Bali."},
    {day:"Day 2",title:"Ubud Bali Tour – Temples, Rice Terraces and Culture",details:"Explore Ubud attractions including scenic rice terraces, traditional Balinese culture and temple surroundings. Evening at leisure. Overnight in Ubud/Bali."},
    {day:"Day 3",title:"Bali South Island – Kuta and Nusa Dua",details:"Visit Bali’s popular southern coast with Kuta Beach and Nusa Dua. Enjoy beach time, shopping and optional water activities. Overnight in Bali."},
    {day:"Day 4",title:"Bali Sightseeing – Temples and Sunset",details:"Enjoy a curated Bali sightseeing day with iconic temple landscapes, local markets and a sunset experience. Overnight in Bali."},
    {day:"Day 5",title:"Bali Leisure Day – Beach and Shopping",details:"Keep the day flexible for beach relaxation, spa treatments, shopping or optional Bali activities based on your interests. Overnight in Bali."},
    {day:"Day 6",title:"Bali to India – Departure",details:"Breakfast, check-out and airport transfer for your return flight, completing your Bali holiday package."}
  ],
  dubai:[
    {day:"Day 1",title:"India to Dubai – Arrival and Downtown Dubai",details:"Arrive in Dubai, airport pickup and hotel check-in. Visit Dubai Mall and enjoy the Burj Khalifa area and evening Dubai Fountain experience, subject to ticket timing. Overnight in Dubai."},
    {day:"Day 2",title:"Dubai City Tour – Palm Jumeirah and Marina",details:"Explore Dubai highlights including Palm Jumeirah, Dubai Marina, Jumeirah and major city landmarks. Evening free for leisure. Overnight in Dubai."},
    {day:"Day 3",title:"Dubai Desert Safari – Dune Bashing and BBQ Dinner",details:"Morning at leisure followed by an afternoon desert safari with 4x4 dune bashing, sunset views, camel experience and traditional camp entertainment with BBQ dinner. Overnight in Dubai."},
    {day:"Day 4",title:"Old Dubai – Souks, Creek and Shopping",details:"Explore Old Dubai, Dubai Creek, Al Fahidi heritage area and traditional Gold and Spice Souks. Evening free for shopping or optional Marina cruise. Overnight in Dubai."},
    {day:"Day 5",title:"Dubai Leisure and Departure",details:"Enjoy breakfast and free time for shopping or optional attractions before hotel check-out and airport transfer for your return journey."}
  ],
  vietnam:[
    {day:"Day 1",title:"India to Hanoi – Vietnam Arrival",details:"Arrive in Hanoi, airport transfer and hotel check-in. Evening explore Hanoi Old Quarter and local Vietnamese cuisine. Overnight in Hanoi."},
    {day:"Day 2",title:"Hanoi City Tour – Culture and Heritage",details:"Visit key Hanoi attractions such as the Old Quarter, Hoan Kiem Lake and cultural landmarks. Evening free for shopping and local food. Overnight in Hanoi."},
    {day:"Day 3",title:"Hanoi to Ha Long Bay – Cruise Experience",details:"Transfer to Ha Long Bay and board the selected cruise. Enjoy limestone karst scenery, cruise activities and sunset views. Overnight on the cruise or as per package plan."},
    {day:"Day 4",title:"Ha Long Bay to Da Nang – Central Vietnam",details:"Complete the morning cruise experience and return to Hanoi for onward travel to Da Nang. Hotel check-in and evening leisure. Overnight in Da Nang."},
    {day:"Day 5",title:"Da Nang and Hoi An – Central Vietnam Sightseeing",details:"Explore Da Nang landmarks and continue to Hoi An for its lantern-lit heritage streets, local markets and riverside atmosphere. Return to Da Nang. Overnight in Da Nang."},
    {day:"Day 6",title:"Vietnam Holiday – Da Nang Departure",details:"Breakfast, check-out and airport transfer for your return journey, completing your Vietnam holiday package."}
  ],
  nepal:[
    {day:"Day 1",title:"Arrival in Kathmandu – Nepal Holiday Begins",details:"Arrive in Kathmandu, airport transfer and hotel check-in. Evening at leisure. Overnight in Kathmandu."},
    {day:"Day 2",title:"Kathmandu Sightseeing – Temples and Heritage",details:"Explore Kathmandu heritage highlights including Pashupatinath, Boudhanath and other major cultural landmarks. Overnight in Kathmandu."},
    {day:"Day 3",title:"Kathmandu to Pokhara – Himalayan Gateway",details:"Travel from Kathmandu to Pokhara by selected road or flight option. Check in and enjoy the peaceful Lakeside area and Phewa Lake views. Overnight in Pokhara."},
    {day:"Day 4",title:"Pokhara to Muktinath – Mustang Journey",details:"Travel towards Muktinath through dramatic Himalayan landscapes and the Kaligandaki region. Check in and prepare for the next morning’s Muktinath Darshan. Overnight near Muktinath."},
    {day:"Day 5",title:"Muktinath Darshan – Sacred Pilgrimage",details:"Early morning Muktinath Temple Darshan and visit to the sacred 108 water spouts and Jwala Mai area, subject to local conditions. Return towards Pokhara. Overnight in Pokhara."},
    {day:"Day 6",title:"Pokhara Sightseeing – Phewa Lake and Mountains",details:"Enjoy Pokhara sightseeing with Phewa Lake, local viewpoints and optional activities. Evening free at Lakeside. Overnight in Pokhara."},
    {day:"Day 7",title:"Pokhara to Kathmandu – Nepal Return Journey",details:"Travel back to Kathmandu by the selected road or flight option. Evening free for shopping and leisure. Overnight in Kathmandu."},
    {day:"Day 8",title:"Kathmandu to India – Departure",details:"Breakfast and hotel check-out followed by airport transfer for your return journey, completing the Nepal & Muktinath package."}
  ]
};

function genericItinerary(item:NonNullable<ReturnType<typeof packageBySlug>>):DayPlan[]{
  const places=item.route.split("•").map(x=>x.trim()).filter(Boolean);
  const durationMatch=item.duration.match(/(\d+)\s*(?:Nights?|Days?)/i);
  const nights=durationMatch?Number(durationMatch[1]):5;
  const days=Math.max(3,Math.min(12,nights+1));
  const first=places[0]||item.from;
  const last=places[places.length-1]||first;
  const plans:DayPlan[]=[];
  for(let i=1;i<=days;i++){
    const place=places[Math.min(i-1,places.length-1)]||first;
    if(i===1) plans.push({day:`Day ${i}`,title:`Arrival and ${first} Travel Experience`,details:`Arrive at ${first} or begin your ${item.name} journey from ${item.from}. Hotel check-in, local orientation and leisure time. Overnight stay as per package plan.`});
    else if(i===days) plans.push({day:`Day ${i}`,title:`${last} Departure`,details:`Breakfast and check-out. Complete the final sightseeing or transfer at ${last}, followed by your onward/return journey. This day-wise plan may be adjusted according to transport schedules and local conditions.`});
    else plans.push({day:`Day ${i}`,title:`${place} Sightseeing and Travel`,details:`Explore the key attractions and experiences around ${place}, then continue to the next destination in the ${item.route} route. Overnight stay as per the selected hotel plan.`});
  }
  return plans;
}

export async function generateStaticParams(){return packages.map(x=>({slug:x.slug}))}
export async function generateMetadata({params}:{params:Promise<{slug:string}>}):Promise<Metadata>{const{x}=await Promise.resolve(params).then(p=>({x:packageBySlug(p.slug)}));return x?{title:x.name,description:`${x.name} day wise itinerary, places to visit, travel route and holiday package details from On A Trip Holidays.`,alternates:{canonical:`/packages/${x.slug}`}}:{}}

export default async function PackagePage({params}:{params:Promise<{slug:string}>}){
  const {slug}=await params;
  const item=packageBySlug(slug);
  if(!item)notFound();
  const variants=packages.filter(x=>x.parentSlug===item.slug);
  const related=packages.filter(x=>x.visible!==false&&x.category===item.category&&x.slug!==item.slug&&x.parentSlug===undefined).slice(0,3);
  const itinerary=seoItineraries[item.slug]||genericItinerary(item);
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
    <section className="section"><div className="container package-layout"><div><span className="eyebrow">OVERVIEW</span><h2>Plan this journey with <em>confidence.</em></h2><p className="lead">{item.description}</p><h3>Highlights</h3><div className="highlight-list">{item.highlights.map(h=><div key={h}>✓ <span>{h}</span></div>)}</div><div className="travel-note"><b>Good to know</b><p>Routes, hotel names, vehicle category, permits and sightseeing order can vary with weather and availability. Final inclusions are confirmed in your booking voucher.</p></div></div><aside className="sticky-quote" id="enquiry"><div className="quote-head"><span>START PLANNING</span><h3>{item.name}</h3><strong>{item.price}</strong></div><EnquiryForm defaultPackage={item.name}/></aside></div></section>
    <section className="section soft-section"><div className="container"><span className="eyebrow">DAY-WISE ITINERARY</span><h2>{item.name} – Short Day Wise Itinerary</h2><p className="lead">A search-friendly {item.name.toLowerCase()} itinerary covering the main route, sightseeing and travel flow. The final schedule can be customized according to your travel dates, transport and hotel selection.</p><div className="itinerary-list">{itinerary.map(x=><article className="travel-note" key={x.day}><b>{x.day}: {x.title}</b><p>{x.details}</p></article>)}</div></div></section>
    {related.length>0&&<section className="section soft-section"><div className="container"><div className="section-head"><div><span className="eyebrow">YOU MAY ALSO LIKE</span><h2>More {item.category.toLowerCase()} journeys.</h2></div></div><div className="package-grid">{related.map(x=><PackageCard key={x.slug} item={x}/>)}</div></div></section>}
  </main></SiteShell>
}
