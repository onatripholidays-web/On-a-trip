import type {Metadata} from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import styles from "./about.module.css";
import "./about-v2.css";

export const metadata:Metadata={title:"About On A Trip Holidays | Founder & CEO",description:"Meet Kadamanchi Nikhil, Founder & CEO of On A Trip Holidays, and discover the story, mission and vision behind the travel brand."};

export default function About(){
 return <SiteShell><main className="aboutV2">
  <section className="hero"><div className="container heroTop">
   <h1 className="heroTitle">Meet the team behind <em>On A Trip Holidays</em></h1>
   <p className="heroIntro">Behind every memorable journey is a passionate team committed to making travel easier, more personal and more meaningful. From carefully planned holidays to pilgrimage journeys and customized experiences, we take care of the details so you can enjoy the journey.</p>
  </div><div className="heroVisual"><div className="heroVisualInner" aria-hidden="true"><span className="sil"/><span className="sil"/><span className="sil"/><span className="sil"/><span className="sil"/></div></div></section>

  <section className="story"><div className="container storyGrid">
   <article className="storyCard"><h2>Our <span>Story</span></h2><p>On A Trip Holidays was created with a simple vision — to make travel easier, more accessible, and more memorable for everyone.</p><p>We noticed that planning a trip often becomes complicated. Travelers have to search for hotels, transportation, sightseeing, activities, and reliable local services separately, while also worrying about pricing and the quality of their experience.</p><p>We wanted to change that.</p><p>Our journey began with the idea of bringing everything together under one trusted travel brand. Today, we focus on affordable pricing, transparent service, well-planned itineraries and customer satisfaction.</p><div className="storyQuote">“Every journey has a story. We are here to help create yours.”</div></article>
   <article className="storyCard"><h2>Our <span>Mission</span></h2><p>Our mission is to make travel simple, memorable, and accessible by creating thoughtfully designed journeys that connect people with new places, cultures, and experiences.</p><p>From group tours and pilgrimage journeys to customized holidays, our aim is to take care of the important details while keeping communication clear and service dependable.</p><div className="storyQuote missionQuote">“Travel should feel exciting before it begins, effortless while you are on the way, and memorable long after you return.”</div></article>
  </div></section>

  <section className="ceo"><div className="container ceoGrid">
   <h2 className="ceoLabel">Founder &<br/>CEO</h2>
   <div className="portrait" aria-label="Kadamanchi Nikhil, Founder & CEO"></div>
   <div className="ceoCopy">
    <h2>Kadamanchi Nikhil</h2><p className="role">Founder & CEO — On A Trip Holidays</p>
    <p className="ceoStoryLead">Turning a passion for exploring the world into journeys people remember.</p>
    <p>My journey began in 2017, when I started building my career with a strong desire to learn, grow, and create something of my own. Over the years, my curiosity took me beyond work—it became a passion for discovering new places, experiencing different cultures, and understanding what makes every journey special.</p>
    <p>In 2021, I founded On A Trip Holidays with a simple vision: to make travel more than just a trip, but an experience worth remembering.</p>
    <p>What started with a passion for exploring destinations has grown into a vision of building a trusted and customer-focused travel brand. From carefully planned holidays and group tours to pilgrimage journeys and customized travel experiences, I believe every traveller deserves a journey that feels personal, seamless, and memorable.</p>
    <p>Today, my focus is on taking On A Trip Holidays to the next level—combining technology, personalized service, and genuine passion for travel to create better experiences for every customer.</p>
    <div className="quote">“I believe the best journeys don't just take you to new places — they create stories you carry with you.”</div>
    <div className="socials"><a href="https://www.instagram.com/kadamanchi_nikhil/" target="_blank" rel="noreferrer">Instagram <span>@KADAMANCHI_NIKHIL ↗</span></a><a href="https://www.linkedin.com/in/nikhil-kadamanchi/" target="_blank" rel="noreferrer">LinkedIn <span>Nikhil Kadamanchi ↗</span></a><a href="mailto:kadamanchinikhil1@gmail.com">Email <span>kadamanchinikhil1@gmail.com ↗</span></a></div>
   </div>
  </div></section>

  <section className="vision"><div className="container visionGrid"><div className="visionCard"><h3>Founder’s Vision</h3><p>To be No 1 in the Travel Industry by building a travel brand defined by trust, thoughtful planning, personalized service and memorable experiences.</p></div><div className="visionCard"><h3>What We Believe</h3><p>Our goal is not simply to sell travel packages. We want to build a travel brand that people trust, recommend to their friends and family, and return to for their next adventure.</p></div></div></section>

  <section className="stats"><div className="container statsGrid"><div className="stat"><strong>50K+</strong><span>Successful travellers</span></div><div className="stat"><strong>5+</strong><span>Years in the travel industry</span></div><div className="stat"><strong>2021</strong><span>On A Trip Holidays founded</span></div></div></section>

  <section className="cta"><div className="container ctaBox"><div><h2>Every journey has a story.</h2><p>We are here to help create yours.</p></div><Link href="/contact">Plan My Trip</Link></div></section>
 </main></SiteShell>
}