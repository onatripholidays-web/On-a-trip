"use client";

import {useState} from "react";
import type {Package} from "@/lib/site-data";
import type {ItineraryProfile} from "@/lib/itinerary-library";

type Props={item:Package;plan:ItineraryProfile};

const includes=[
  ["▥","Hotel","Accommodation as per confirmed plan"],
  ["▣","Transport","Vehicle / transfers as booked"],
  ["♨","Meals","Meals as mentioned in itinerary"],
  ["◉","Sightseeing","Listed sightseeing & route experiences"],
];

export default function TourItineraryExperience({item,plan}:Props){
  const[openDay,setOpenDay]=useState(0);
  const[tab,setTab]=useState("itinerary");
  const tabs=[
    ["overview","ⓘ","Overview"],["itinerary","♧","Itinerary"],["prices","₹","Prices"],["dates","▣","Dates"],["inclusions","☑","Inclusions"]
  ];
  const go=(id:string)=>{setTab(id);requestAnimationFrame(()=>document.getElementById(`tour-${id}`)?.scrollIntoView({behavior:"smooth",block:"start"}));};
  return <>
    <section className="tour-summary">
      <div className="tour-summary-top container">
        <div><span className="tour-duration">◌ {item.duration}</span><div className="tour-route">{item.route}</div></div>
        <div className="tour-offer"><span>LIMITED TIME OFFER</span><b>Book early for best availability</b></div>
      </div>
      <div className="tour-includes container"><h2>TOUR INCLUDES</h2><div className="tour-include-grid">{includes.map(([icon,title,text])=><div className="tour-include-card" key={title}><strong>{icon}</strong><b>{title}</b><small>{text}</small></div>)}</div></div>
    </section>

    <nav className="tour-tabs" aria-label="Tour details navigation">{tabs.map(([id,icon,label])=><button key={id} className={tab===id?"active":""} onClick={()=>go(id)} type="button"><span>{icon}</span>{label}</button>)}</nav>

    <div className="tour-experience">
      <section id="tour-overview" className="tour-panel container"><div className="tour-panel-head"><span className="eyebrow">OVERVIEW</span><h2>Everything you need to know before you <em>book.</em></h2></div><p className="tour-lead">{item.description}</p><div className="tour-overview-grid"><div><h3>Trip style</h3><p>{plan.pace}</p></div><div><h3>Best time</h3><p>{plan.bestTime}</p></div><div><h3>Starting point</h3><p>{item.from}</p></div><div><h3>Meals</h3><p>{item.meals||"As selected"}</p></div></div><h3 className="tour-subtitle">Highlights</h3><div className="tour-chip-grid">{item.highlights.map(x=><span key={x}>✓ {x}</span>)}</div></section>

      <section id="tour-itinerary" className="tour-panel tour-itinerary-panel"><div className="container"><div className="tour-panel-head"><span className="eyebrow">DAY-WISE ITINERARY</span><h2>{item.name}</h2><p>Tap each day to view the route, activities, stay and meals.</p></div><div className="tour-timeline">{plan.days.map((x,i)=><article className={`tour-day ${openDay===i?"open":""}`} key={x.day}><div className="tour-day-line"><span>{i+1}</span></div><div className="tour-day-card"><button type="button" className="tour-day-head" onClick={()=>setOpenDay(openDay===i?-1:i)}><div><small>{x.day}</small><h3>{x.title}</h3></div><span className="tour-chevron">⌄</span></button>{openDay===i&&<div className="tour-day-body"><ul>{x.details.split(". ").filter(Boolean).map((part,j)=><li key={`${x.day}-${j}`}>{part}{/[.!?]$/.test(part)?"":"."}</li>)}</ul><div className="tour-facilities"><div><span>♨</span><b>Meals</b><small>{x.meals||item.meals||"As selected"}</small></div><div><span>⌂</span><b>Stay</b><small>{x.stay||"As selected"}</small></div></div></div>}</div></article>)}</div></div></section>

      <section id="tour-prices" className="tour-panel container"><div className="tour-panel-head"><span className="eyebrow">PRICES</span><h2>Package pricing</h2></div><div className="tour-price-card"><div><small>PRICE PER PERSON</small><strong>{item.price}</strong><p>Starting price • Final price depends on travel date, room category, group size and confirmed inclusions.</p></div><a href="#tour-enquiry" className="btn primary">GET BEST PRICE →</a></div></section>

      <section id="tour-dates" className="tour-panel container"><div className="tour-panel-head"><span className="eyebrow">DATES</span><h2>Departure & availability</h2></div><div className="tour-date-card"><div className="tour-date-icon">▣</div><div><b>{item.batch||"Flexible departure dates"}</b><p>{item.batch?"This is the current batch reference shown for this package. Confirm seats and final pricing with our team.":"Choose your travel date and our team will confirm the best available batch, vehicle and hotel option."}</p></div><a href="#tour-enquiry" className="btn secondary">CHECK AVAILABILITY</a></div></section>

      <section id="tour-inclusions" className="tour-panel container"><div className="tour-panel-head"><span className="eyebrow">INCLUSIONS & EXCLUSIONS</span><h2>Know exactly what is covered.</h2></div><div className="tour-inc-columns"><div><h3>✓ Included</h3>{plan.included.map(x=><p key={x}>✓ {x}</p>)}</div><div><h3>× Not included</h3>{plan.excluded.map(x=><p key={x}>• {x}</p>)}</div></div><div className="tour-important"><b>Important notes</b>{plan.tips.map(x=><p key={x}>• {x}</p>)}</div></section>
    </div>

    <div id="tour-enquiry" className="tour-mobile-cta"><div><small>PRICE PER PERSON</small><strong>{item.price}</strong></div><a href="#enquiry">BOOK NOW</a></div>
  </>;
}
