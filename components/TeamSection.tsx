"use client";

import type { SyntheticEvent } from "react";
import { useState } from "react";
import styles from "./TeamSection.module.css";

type Member = {
  name: string;
  role: string;
  image: string;
  email: string;
  phone: string;
  objectPosition?: string;
};

// Employee photos use one clean, sequential naming convention: 01 through 15.
const members: Member[] = [
  { name: "K. Harshika", role: "COO", image: "/assets/01-coo-k-harshika.jpg", email: "beediamharshika10@gmail.com", phone: "9908048909" },
  { name: "K. Naveen", role: "Digital Marketing Manager", image: "/assets/02-digital-marketing-manager-k-naveen.jpg", email: "onatripholidaysnaveen@gmail.com", phone: "8106954146", objectPosition: "center 50%" },
  { name: "CH. Vedavyas", role: "Content Creator", image: "/assets/03-content-creator-ch-vedavyas.jpg", email: "", phone: "" },
  { name: "K. Abhilash", role: "Editor", image: "/assets/04-editor-k-abhilash.jpg", email: "abhilashsalesoat@gmail.com", phone: "7799984303" },
  { name: "K. Mallesh", role: "Trip Captain", image: "/assets/05-trip-captain-k-mallesh.jpg", email: "malleshoatsales@gmail.com", phone: "9652579696" },
  { name: "C. Sai Subramanyam", role: "HR Administrator", image: "/assets/06-hr-administrator-c-sai-subramanyam.jpg", email: "saisubramanyamonatripholidays@gmail.com", phone: "8121718909" },
  { name: "B. Sai Kumar", role: "Sales Manager", image: "/assets/07-sales-manager-b-sai-kumar.jpg", email: "onatripholidayssaikumar@gmail.com", phone: "9000284146" },
  { name: "K. Rohini", role: "Sales Manager", image: "/assets/08-sales-manager-k-rohini.jpg", email: "rohinisalesoat@gmail.com", phone: "9908054146" },
  { name: "T. Godavari", role: "CRM (Customer Relation Manager)", image: "/assets/09-crm-t-godavari.jpg", email: "godavarisalesoat@gmail.com", phone: "9346642150" },
  { name: "M. Shivani", role: "Sales Executive", image: "/assets/10-sales-executive-m-shivani.jpg", email: "shivanisalesoat@gmail.com", phone: "9652679696" },
  { name: "K. Manusha", role: "Sales Executive", image: "/assets/11-sales-executive-k-manusha.jpg", email: "manushasalesoat@gmail.com", phone: "9652479696" },
  { name: "G. Shravanthi", role: "Sales Executive", image: "/assets/12-sales-executive-g-shravanthi.jpg", email: "shravanthisalesoat@gmail.com", phone: "9652649696" },
  { name: "B. Prabhavathi", role: "Sales Executive", image: "/assets/13-sales-executive-b-prabhavathi.jpg", email: "prabhavathisalesaot@gmail.com", phone: "9032049090" },
  { name: "N. Vaishnavi", role: "Sales Executive", image: "/assets/14-sales-executive-n-vaishnavi.jpg", email: "nadamintivaishnavisalesoat@gmail.com", phone: "7093210297" },
  { name: "G. Shireesha", role: "Sales Executive", image: "/assets/15-sales-executive-g-shireesha.jpg", email: "shireeshaoatsales@gmail.com", phone: "9652799696" },
];

function EmployeeImage({ member }: { member: Member }) {
  const handleError = (event: SyntheticEvent<HTMLImageElement>) => {
    event.currentTarget.style.display = "none";
  };

  return (
    <img
      src={member.image}
      alt={`${member.name}, ${member.role}`}
      loading="lazy"
      onError={handleError}
      style={member.objectPosition ? { objectPosition: member.objectPosition } : undefined}
    />
  );
}

export default function TeamSection() {
  const [openMember, setOpenMember] = useState<string | null>(null);

  return (
    <section className={styles.teamSection} aria-labelledby="team-heading">
      <div className={styles.container}>
        <h2 id="team-heading" className={styles.srOnly}>On A Trip Holidays Team</h2>
        <div className={styles.teamGrid}>
          {members.map((member) => {
            const isOpen = openMember === member.name;
            const hasDetails = Boolean(member.email || member.phone);
            return (
              <article className={`${styles.card} ${isOpen ? styles.open : ""}`} key={member.name}>
                <div className={styles.photoFrame}>
                  <EmployeeImage member={member} />
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
                    {member.email ? <a href={`mailto:${member.email}`}>✉ <span>{member.email}</span></a> : null}
                    {member.phone ? <a href={`tel:${member.phone}`}>☎ <span>{member.phone}</span></a> : null}
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
