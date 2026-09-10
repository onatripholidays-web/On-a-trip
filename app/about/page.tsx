import type {Metadata} from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import TeamSection from "@/components/TeamSection";

export const metadata:Metadata={title:"About On A Trip Holidays | Founder & CEO",description:"Meet Kadamanchi Nikhil, Founder & CEO of On A Trip Holidays, and discover the story, mission and vision behind the travel brand."};

export default function About(){
 return <SiteShell><main className="aboutV2">
  <section className="hero">
   <div className="container heroTop">
    <div><div className="aboutKicker">OUR PEOPLE</div><h1 className="heroTitle">Meet the Team Behind <em>On A Trip Holidays</em></h1></div>
    <p className="heroIntro">A 30 members passionate team working together to create memorable travel experiences for you</p>
   </div>
  </section>

  <section className="story"><div className="container storyGrid">
   <article className="storyCard storyCardStory"><div className="cardIcon">▱</div><div><h2>Our <span>Story</span></h2><p>On A Trip Holidays was created with a simple vision — to make travel easier, more accessible, and more memorable for everyone. What started as a passion for exploring new places has grown into a trusted travel brand, offering carefully planned group tours, pilgrimage journeys, and customized holidays across India and beyond.</p></div><div className="storyQuote">“Every journey has a story. We are here to help create yours.”</div></article>
   <article className="storyCard storyCardMission"><div className="cardIcon">↗</div><div><h2>Our <span>Mission</span></h2><p>Our mission is to make travel simple, memorable, and accessible by creating thoughtfully designed journeys that connect people with new places, cultures, and experiences. We aim to provide affordable pricing, transparent service, well-planned itineraries, and customer satisfaction — so every traveler can focus on what truly matters: enjoying the journey.</p></div><div className="storyQuote missionQuote">“To create meaningful travel experiences for every Indian traveler.”</div></article>
  </div></section>

  <section className="ceo"><div className="container ceoGrid">
   <div className="ceoIdentity"><div className="ceoKicker">FOUNDER &amp; CEO</div><h2>Kadamanchi<br/>Nikhil</h2><p className="ceoStoryLead">Turning a passion for travel into journeys worth remembering.</p></div>
   <div className="portrait" aria-label="Kadamanchi Nikhil, Founder & CEO"><img src="/assets/nikhil-ceo.png" alt="Kadamanchi Nikhil, Founder & CEO" style={{width:"100%",height:"100%",objectFit:"contain",objectPosition:"center bottom",display:"block",position:"relative",zIndex:2}}/></div>
   <div className="ceoCopy"><p>My journey began in <strong>2017</strong> with a passion to learn, grow, and explore the world. In <strong>2021</strong>, I turned that passion into a vision and founded <strong>On A Trip Holidays</strong> — with a simple belief: travel should be more than a trip; it should be an experience to remember.</p><p>Today, I’m focused on building a trusted, customer-first travel brand that combines <strong>personalized service, technology, and a genuine passion for travel</strong> to create seamless and memorable journeys.</p><div className="quote">“I believe the best journeys don't just take you to new places — they create stories you carry with you.”</div><div className="socials"><a href="https://www.instagram.com/kadamanchi_nikhil/" target="_blank" rel="noreferrer">Instagram <span>@KADAMANCHI_NIKHIL ↗</span></a><a href="https://www.linkedin.com/in/nikhil-kadamanchi/" target="_blank" rel="noreferrer">LinkedIn <span>Nikhil Kadamanchi ↗</span></a><a href="mailto:kadamanchinikhil1@gmail.com">Email <span>kadamanchinikhil1@gmail.com ↗</span></a></div></div>
  </div></section>

  <TeamSection />

  <section className="cta"><div className="container ctaBox"><div>
    <h2 style={{fontSize:"clamp(38px,4.5vw,54px)",lineHeight:1.05,margin:"0 0 8px",letterSpacing:"-.04em",fontWeight:900,color:"#ef5b2a"}}>5 Telugu Chefs</h2>
    <p style={{margin:"0 0 10px",color:"#fff",fontSize:"16px",lineHeight:1.55,fontWeight:500}}>Serving authentic, delicious Telugu cuisine throughout your journey.</p>
    <p style={{margin:0,color:"#fff",fontSize:"16px",lineHeight:1.55,fontWeight:500}}><strong style={{fontSize:"clamp(38px,4.5vw,54px)",lineHeight:1.05,fontWeight:900,color:"#ef5b2a",letterSpacing:"-.04em"}}>10 Trip Coordinators</strong><br/>Dedicated trip coordinators ensuring a smooth, organized, and memorable travel experience.</p>
  </div></div></section>

  <section className="stats"><div className="container statsGrid"><div className="stat"><strong>1 Lakh+</strong><span>Successful Travelers</span></div><div className="stat"><strong>5,000+</strong><span>Successful Trips</span></div><div className="stat"><strong>5+</strong><span>Years in the travel industry</span></div><div className="stat"><strong>2021</strong><span>On A Trip Holidays founded</span></div></div></section>

  <section className="vision"><div className="container visionGrid">
    <article className="visionCard" style={{position:"relative",overflow:"hidden",borderTop:"4px solid #ef5b2a",background:"linear-gradient(145deg,#fff 0%,#fffaf7 100%)",boxShadow:"0 18px 45px rgba(8,37,66,.09)",padding:"34px 36px 30px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"18px",marginBottom:"20px"}}>
        <div aria-hidden="true" style={{width:"62px",height:"62px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:"#fff0e8",color:"#ef5b2a",flex:"0 0 62px"}}>
          <svg width="32" height="32" viewBox="0 0 32 32" fill="none" aria-hidden="true"><path d="M5 25.5 13.2 14l4.2 5.2 3.5-4.1L27 25.5H5Z" fill="currentColor"/><path d="M13.2 14 16 9.5 18.5 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/><path d="M23 5.5v7M19.5 9h7" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/></svg>
        </div>
        <div><h3 style={{margin:0,fontSize:"clamp(26px,3vw,34px)",lineHeight:1.1,color:"#082542",letterSpacing:"-.035em"}}>Founder’s <span style={{color:"#ef5b2a"}}>Vision</span></h3><div style={{marginTop:"8px",fontSize:"11px",fontWeight:900,letterSpacing:".22em",color:"#6b7b89",textTransform:"uppercase"}}>Bigger journeys <span style={{color:"#ef5b2a",padding:"0 5px"}}>•</span> brighter lives</div></div>
      </div>
      <p style={{margin:"0 0 24px",fontSize:"16px",lineHeight:1.7,color:"#53687a",maxWidth:"620px"}}>To be No 1 in the Travel Industry by building a travel brand defined by trust, thoughtful planning, personalized service and memorable experiences.</p>
      <div style={{display:"inline-flex",alignItems:"center",gap:"12px",padding:"12px 20px",borderRadius:"999px",background:"#fff0e8",color:"#ef5b2a",fontSize:"13px",fontWeight:900,letterSpacing:".06em",textTransform:"uppercase"}}>Travel a better tomorrow <span aria-hidden="true" style={{fontSize:"22px",lineHeight:1}}>→</span></div>
    </article>
    <article className="visionCard" style={{position:"relative",overflow:"hidden",borderTop:"4px solid #123f68",background:"linear-gradient(145deg,#fff 0%,#f7fbff 100%)",boxShadow:"0 18px 45px rgba(8,37,66,.09)",padding:"34px 36px 30px"}}>
      <div style={{display:"flex",alignItems:"center",gap:"18px",marginBottom:"20px"}}>
        <div aria-hidden="true" style={{width:"62px",height:"62px",borderRadius:"50%",display:"flex",alignItems:"center",justifyContent:"center",background:"#eaf3ff",color:"#123f68",flex:"0 0 62px"}}>
          <svg width="34" height="34" viewBox="0 0 34 34" fill="none" aria-hidden="true"><path d="M5 27c4.5-5 9-6.8 13.5-5.3 4.2 1.4 6.9-.2 10.5-4.7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/><circle cx="11" cy="12" r="3.2" fill="currentColor"/><circle cx="19" cy="10" r="3.2" fill="currentColor"/><circle cx="27" cy="13" r="3.2" fill="currentColor"/><path d="M5 27c1.5-4.2 4.4-6.2 8.2-5.7 2.8.4 4.8 2 6.7 3.3" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"/></svg>
        </div>
        <div><h3 style={{margin:0,fontSize:"clamp(26px,3vw,34px)",lineHeight:1.1,color:"#082542",letterSpacing:"-.035em"}}>What We <span style={{color:"#ef5b2a"}}>Believe</span></h3><div style={{marginTop:"8px",fontSize:"11px",fontWeight:900,letterSpacing:".22em",color:"#6b7b89",textTransform:"uppercase"}}>People <span style={{color:"#ef5b2a",padding:"0 5px"}}>•</span> places <span style={{color:"#ef5b2a",padding:"0 5px"}}>•</span> lifelong memories</div></div>
      </div>
      <p style={{margin:"0 0 24px",fontSize:"16px",lineHeight:1.7,color:"#53687a",maxWidth:"620px"}}>Our goal is not simply to sell travel packages. We want to build a travel brand that people trust, recommend to their friends and family, and return to for their next adventure.</p>
      <div style={{display:"inline-flex",alignItems:"center",gap:"12px",padding:"12px 20px",borderRadius:"999px",background:"#eaf3ff",color:"#123f68",fontSize:"13px",fontWeight:900,letterSpacing:".06em",textTransform:"uppercase"}}>Travel beyond expectations <span aria-hidden="true" style={{fontSize:"22px",lineHeight:1}}>→</span></div>
    </article>
  </div></section>
 </main></SiteShell>
}
