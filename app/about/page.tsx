import type {Metadata} from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import {ceoImage} from "@/components/ceoImage";

export const metadata:Metadata={title:"About On A Trip Holidays | Founder & CEO",description:"Meet Kadamanchi Nikhil, Founder & CEO of On A Trip Holidays, and discover the story, mission and vision behind the travel brand."};

export default function About(){
 return <SiteShell><main className="aboutV2">
  <section className="hero">
   <div className="container heroTop">
    <div><div className="aboutKicker">OUR PEOPLE</div><h1 className="heroTitle">Meet the Team Behind <em>On A Trip Holidays</em></h1></div>
    <p className="heroIntro">A passionate team of travel experts, creators, and problem-solvers committed to making your travel dreams a reality. We believe in people, places and unforgettable experiences.</p>
   </div>
   <div className="heroVisual"><div className="heroVisualInner" aria-hidden="true"><span className="sil"/><span className="sil"/><span className="sil"/><span className="sil"/><span className="sil"/></div></div>
  </section>

  <section className="story"><div className="container storyGrid">
   <article className="storyCard storyCardStory"><div className="cardIcon">▱</div><div><h2>Our <span>Story</span></h2><p>On A Trip Holidays was created with a simple vision — to make travel easier, more accessible, and more memorable for everyone. What started as a passion for exploring new places has grown into a trusted travel brand, offering carefully planned group tours, pilgrimage journeys, and customized holidays across India and beyond.</p></div><div className="storyQuote">“Every journey has a story. We are here to help create yours.”</div></article>
   <article className="storyCard storyCardMission"><div className="cardIcon">↗</div><div><h2>Our <span>Mission</span></h2><p>Our mission is to make travel simple, memorable, and accessible by creating thoughtfully designed journeys that connect people with new places, cultures, and experiences. We aim to provide affordable pricing, transparent service, well-planned itineraries, and customer satisfaction — so every traveler can focus on what truly matters: enjoying the journey.</p></div><div className="storyQuote missionQuote">“To create meaningful travel experiences for every Indian traveler.”</div></article>
  </div></section>

  <section className="ceo"><div className="container ceoGrid">
   <div className="ceoIdentity"><div className="ceoKicker">FOUNDER &amp; CEO</div><h2>Kadamanchi<br/>Nikhil</h2><p className="role">Founder &amp; CEO — On A Trip Holidays</p><p className="ceoStoryLead">Turning a passion for travel into journeys worth remembering.</p></div>
   <div className="portrait" aria-label="Kadamanchi Nikhil, Founder & CEO"><img src={ceoImage} alt="Kadamanchi Nikhil, Founder & CEO" style={{width:"100%",height:"100%",objectFit:"contain",objectPosition:"center bottom",display:"block",position:"relative",zIndex:2}}/></div>
   <div className="ceoCopy"><p>My journey began in <strong>2017</strong> with a passion to learn, grow, and explore the world. In <strong>2021</strong>, I turned that passion into a vision and founded <strong>On A Trip Holidays</strong> — with a simple belief: travel should be more than a trip; it should be an experience to remember.</p><p>Today, I’m focused on building a trusted, customer-first travel brand that combines <strong>personalized service, technology, and a genuine passion for travel</strong> to create seamless and memorable journeys.</p><div className="quote">“I believe the best journeys don't just take you to new places — they create stories you carry with you.”</div><div className="socials"><a href="https://www.instagram.com/kadamanchi_nikhil/" target="_blank" rel="noreferrer">Instagram <span>@KADAMANCHI_NIKHIL ↗</span></a><a href="https://www.linkedin.com/in/nikhil-kadamanchi/" target="_blank" rel="noreferrer">LinkedIn <span>Nikhil Kadamanchi ↗</span></a><a href="mailto:kadamanchinikhil1@gmail.com">Email <span>kadamanchinikhil1@gmail.com ↗</span></a></div></div>
  </div></section>

  <section className="stats"><div className="container statsGrid"><div className="stat"><strong>1 Lakh+</strong><span>Successful Travelers</span></div><div className="stat"><strong>5,000+</strong><span>Successful Trips</span></div><div className="stat"><strong>5+</strong><span>Years in the travel industry</span></div><div className="stat"><strong>2021</strong><span>On A Trip Holidays founded</span></div></div></section>

  <section className="vision"><div className="container visionGrid"><div className="visionCard"><h3>Founder’s Vision</h3><p>To be No 1 in the Travel Industry by building a travel brand defined by trust, thoughtful planning, personalized service and memorable experiences.</p></div><div className="visionCard"><h3>What We Believe</h3><p>Our goal is not simply to sell travel packages. We want to build a travel brand that people trust, recommend to their friends and family, and return to for their next adventure.</p></div></div></section>
  <section className="cta"><div className="container ctaBox"><div><h2>Every journey has a story.</h2><p>We are here to help create yours.</p></div><Link href="/contact">Plan My Trip</Link></div></section>
 </main></SiteShell>
}