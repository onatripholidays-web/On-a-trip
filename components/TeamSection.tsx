"use client";

import { useState } from "react";
import styles from "./TeamSection.module.css";

type Member = {
  name: string;
  role: string;
  image: string;
  fallback?: string;
  email: string;
  phone: string;
};

const members: Member[] = [
  { name: "K. Harshika", role: "COO", image: "/assets/01-coo-k-harshika.jpg", email: "beediamharshika10@gmail.com", phone: "9908048909" },
  { name: "K. Naveen", role: "Digital Marketing Manager", image: "/assets/02-digital-marketing-manager-k-naveen.jpg", fallback: "/assets/04-editor-k-naveen.jpg", email: "onatripholidaysnaveen@gmail.com", phone: "8106954146" },
  { name: "CH. Vedavyas", role: "Content Creator", image: "/assets/03-content-creator-ch-vedavyas.jpg", email: "", phone: "" },
  { name: "K. Abhilash", role: "Editor", image: "/assets/04-editor-k-abhilash.jpg", fallback: "/assets/07-team1-k-abilash.jpg", email: "abhilashsalesoat@gmail.com", phone: "7799984303" },
  { name: "K. Mallesh", role: "Trip Captain", image: "/assets/05-trip-captain-k-mallesh.jpg", fallback: "/assets/travel-fallback.svg", email: "malleshoatsales@gmail.com", phone: "9652579696" },
  { name: "C. Sai Subramanyam", role: "HR Administrator", image: "/assets/06-hr-administrator-c-sai-subramanyam.jpg", fallback: "/assets/05-it-c-sai-subramanyam.jpg", email: "saisubramanyamonatripholidays@gmail.com", phone: "8121718909" },
  { name: "B. Sai Kumar", role: "Sales Manager", image: "/assets/07-sales-manager-b-sai-kumar.jpg", fallback: "/assets/03-tl2-b-sai-kumar.jpg", email: "onatripholidayssaikumar@gmail.com", phone: "9000284146" },
  { name: "K. Rohini", role: "Sales Manager", image: "/assets/08-sales-manager-k-rohini.jpg", fallback: "/assets/02-tl1-k-rovini.jpg", email: "rohinisalesoat@gmail.com", phone: "9908054146" },
  { name: "T. Godavari", role: "CRM (Customer Relation Manager)", image: "/assets/09-crm-t-godavari.jpg", fallback: "/assets/06-team1-t-godavari.jpg", email: "godavarisalesoat@gmail.com", phone: "9346642150" },
  { name: "M. Shivani", role: "Sales Executive", image: "/assets/10-sales-executive-m-shivani.jpg", fallback: "/assets/10-team2-m-shivani.jpg", email: "shivanisalesoat@gmail.com", phone: "9652679696" },
  { name: "K. Manusha", role: "Sales Executive", image: "/assets/11-sales-executive-k-manusha.jpg", fallback: "/assets/11-team2-k-manusha.jpg", email: "manushasalesoat@gmail.com", phone: "9652479696" },
  { name: "G. Shravanthi", role: "Sales Executive", image: "/assets/12-sales-executive-g-shravanthi.jpg", fallback: "/assets/12-team2-g-shravanthi.jpg", email: "shravanthisalesoat@gmail.com", phone: "9652649696" },
  { name: "B. Prabhavathi", role: "Sales Executive", image: "/assets/13-sales-executive-b-prabhavathi.jpg", fallback: "/assets/13-team2-b-prabhavathi.jpg", email: "prabhavathisalesaot@gmail.com", phone: "9032049090" },
  { name: "N. Vaishnavi", role: "Sales Executive", image: "/assets/14-sales-executive-n-vaishnavi.jpg", fallback: "/assets/08-team1-n-vaishnavi.jpg", email: "nadamintivaishnavisalesoat@gmail.com", phone: "7093210297" },
];

function EmployeeImage({ member }: { member: Member }) {
  const handleError = (event: React.SyntheticEvent<HTMLImageElement>) => {
    const img = event.currentTarget;
    if (member.fallback && img.src !== new URL(member.fallback, window.location.origin).href) {
      img.src = member.fallback;
      return;
    }
    img.style.display = "none";
    img.parentElement?.classList.add(styles.emptyPhoto);
  };

  return <img src={member.image} alt={`${member.name}, ${member.role}`} onError={handleError} />;
}

export default function TeamSection() {
  const [openMember, setOpenMember] = useState<string | null>(null);

  return (
    <section className={styles.teamSection} aria-labelledby="team-heading">
      <div className={styles.container}>
        <div className={styles.teamIntro}>
          <div className={styles.kicker}>OUR PEOPLE</div>
          <h2 id="team-heading">Meet the People Behind Your Journeys</h2>
          <p>A 30 members passionate team working together to create memorable travel experiences for you</p>
        </div>

        <div className={styles.teamGrid}>
          {members.map((member) => {
            const isOpen = openMember === member.name;
            const hasDetails = Boolean(member.email || member.phone);
            return (
              <article className={`${styles.card} ${isOpen ? styles.open : ""}`} key={member.name}>
                <div className={styles.photoFrame}>
                  <EmployeeImage member={member} />
                  {!member.image.includes("03-content-creator") && !member.fallback?.includes("travel-fallback") && null}
                  {member.name === "CH. Vedavyas" && <span className={styles.photoPlaceholder}>Photo</span>}
                  {member.name === "K. Mallesh" && <span className={styles.photoPlaceholder}>Photo</span>}
                </div>
                <div className={styles.cardInfo}>
                  <div className={styles.name}>{member.name}</div>
                  <div className={styles.roleRow}>
                    <strong>{member.role}</strong>
                    {hasDetails ? (
                      <button
                        type="button"
                        className={styles.expandButton}
                        aria-label={`${isOpen ? "Hide" : "Show"} official details for ${member.name}`}
                        aria-expanded={isOpen}
                        onClick={() => setOpenMember(isOpen ? null : member.name)}
                      >
                        <span aria-hidden="true">⌄</span>
                      </button>
                    ) : null}
                  </div>
                </div>
                <div className={`${styles.detailsWrap} ${isOpen ? styles.detailsOpen : ""}`}>
                  <div className={styles.details}>
                    <a href={`mailto:${member.email}`}>✉ <span>{member.email}</span></a>
                    <a href={`tel:${member.phone}`}>☎ <span>{member.phone}</span></a>
                  </div>
                </div>
              </article>
            );
          })}

          <article className={`${styles.card} ${styles.chiefsCard}`} aria-label="Ground team: 5 Chiefs and 10 Trip Co Ordinators">
            <div className={styles.chiefsVisual}>
              <div className={styles.chiefsDecor} aria-hidden="true">✦</div>
              <div className={styles.chiefsText}>
                <strong>5 Chiefs</strong>
                <span>10 Trip Co Ordinators</span>
              </div>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
