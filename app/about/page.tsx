import type {Metadata} from "next";
import Link from "next/link";
import SiteShell from "@/components/SiteShell";
import styles from "./about.module.css";

export const metadata:Metadata={
  title:"About On A Trip Holidays | Founder & CEO",
  description:"Meet Kadamanchi Nikhil, Founder & CEO of On A Trip Holidays, and discover the story, vision and mission behind the travel brand."
};

export default function About(){
  return <SiteShell>
    <main className={styles.page}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.eyebrow}>MEET THE FOUNDER</span>
          <h1>Behind every memorable journey is a <em>passion for travel.</em></h1>
          <p>Discover the story behind On A Trip Holidays and the founder who turned a passion for exploring the world into a customer-focused travel brand.</p>
        </div>
      </section>

      <section className={styles.story}>
        <div className={`${styles.container} ${styles.storyGrid}`}>
          <div>
            <span className={styles.eyebrow}>OUR STORY & MISSION</span>
            <h2 className={styles.sectionTitle}>Making travel <em>easier, accessible and memorable.</em></h2>
            <p className={styles.lead}>On A Trip Holidays was created with a simple vision — to make travel easier, more accessible, and more memorable for everyone.</p>
          </div>
          <div className={styles.storyText}>
            <p>We noticed that planning a trip often becomes complicated. Travelers have to search for hotels, transportation, sightseeing, activities, and reliable local services separately, while also worrying about pricing and the quality of their experience.</p>
            <p>We wanted to change that.</p>
            <p>Our journey began with the idea of bringing everything together under one trusted travel brand. From carefully planned itineraries and group tours to customized holidays, we aim to take care of the details so our customers can focus on enjoying the journey.</p>
            <p>Today, <strong>On A Trip Holidays</strong> is focused on creating memorable travel experiences across India and beyond, with an emphasis on <strong>affordable pricing, transparent service, well-planned itineraries, and customer satisfaction.</strong></p>
            <p>Our goal is not simply to sell travel packages. <strong>We want to build a travel brand that people trust, recommend to their friends and family, and return to for their next adventure.</strong></p>
            <div className={styles.mission}>
              <h3>Our Mission</h3>
              <p>Our mission is to make travel simple, memorable, and accessible by creating thoughtfully designed journeys that connect people with new places, cultures, and experiences.</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.ceo}>
        <div className={`${styles.container} ${styles.ceoGrid}`}>
          <div className={styles.portrait} aria-label="Kadamanchi Nikhil, Founder & CEO portrait placeholder">
            <div className={styles.initials}>KN</div>
          </div>
          <div className={styles.ceoCopy}>
            <span className={styles.eyebrow}>FOUNDER & CEO</span>
            <h2>KADAMANCHI NIKHIL</h2>
            <p className={styles.role}>Founder & CEO — On A Trip Holidays</p>
            <p>Turning a passion for exploring the world into journeys people remember.</p>
            <p>My journey began in 2017, when I started building my career with a strong desire to learn, grow, and create something of my own. Over the years, my curiosity took me beyond work—it became a passion for discovering new places, experiencing different cultures, and understanding what makes every journey special.</p>
            <p>In 2021, I founded On A Trip Holidays with a simple vision: to make travel more than just a trip, but an experience worth remembering.</p>
            <p>What started with a passion for exploring destinations has grown into a vision of building a trusted and customer-focused travel brand. From carefully planned holidays and group tours to pilgrimage journeys and customized travel experiences, I believe every traveller deserves a journey that feels personal, seamless, and memorable.</p>
            <p>Today, my focus is on taking On A Trip Holidays to the next level—combining technology, personalized service, and genuine passion for travel to create better experiences for every customer.</p>
            <blockquote className={styles.quote}>“I believe the best journeys don't just take you to new places — they create stories you carry with you.”</blockquote>
            <div className={styles.signature}>Kadamanchi Nikhil<span>Founder & CEO · On A Trip Holidays</span></div>
            <div className={styles.links}>
              <a href="https://www.instagram.com/kadamanchi_nikhil/" target="_blank" rel="noreferrer">Instagram · @KADAMANCHI_NIKHIL</a>
              <a href="https://www.linkedin.com/in/nikhil-kadamanchi/" target="_blank" rel="noreferrer">LinkedIn · Nikhil Kadamanchi</a>
              <a href="mailto:kadamanchinikhil1@gmail.com">Email</a>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.values}>
        <div className={`${styles.container} ${styles.valuesIntro}`}>
          <span className={styles.eyebrow}>FOUNDER'S VISION</span>
          <h2 className={styles.sectionTitle}>A clear direction for the <em>journey ahead.</em></h2>
          <p className={styles.lead}>To be No 1 in the Travel Industry by building a travel brand defined by trust, thoughtful planning, personalized service and memorable experiences.</p>
        </div>
        <div className={`${styles.container} ${styles.valueGrid}`}>
          <article className={styles.valueCard}><span className={styles.valueNumber}>01</span><h3>Simple Travel</h3><p>Make the planning process easier by bringing important travel services and coordination together.</p></article>
          <article className={styles.valueCard}><span className={styles.valueNumber}>02</span><h3>Memorable Journeys</h3><p>Create thoughtfully planned experiences that travellers remember long after the trip ends.</p></article>
          <article className={styles.valueCard}><span className={styles.valueNumber}>03</span><h3>Customer Trust</h3><p>Build lasting relationships through transparent service, practical planning and customer satisfaction.</p></article>
        </div>
      </section>

      <section className={styles.stats}>
        <div className={`${styles.container} ${styles.statsGrid}`}>
          <div className={styles.stat}><strong>50K+</strong><span>Successful travellers</span></div>
          <div className={styles.stat}><strong>5+</strong><span>Years in the travel industry</span></div>
          <div className={styles.stat}><strong>2021</strong><span>On A Trip Holidays founded</span></div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={`${styles.container} ${styles.ctaBox}`}>
          <div><h2>Every journey has a story.</h2><p>We are here to help create yours.</p></div>
          <Link href="/contact">Plan My Trip</Link>
        </div>
      </section>
    </main>
  </SiteShell>
}