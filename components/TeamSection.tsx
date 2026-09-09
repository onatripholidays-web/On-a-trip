"use client";

import {useState} from "react";

const leaders = [
  {
    id: "team1",
    name: "K. Rovini",
    role: "Team Leader",
    image: "/assets/02-tl1-k-rovini.jpg",
    members: [
      ["T. Godavari", "/assets/06-team1-t-godavari.jpg"],
      ["K. Abilash", "/assets/07-team1-k-abilash.jpg"],
      ["N. Vaishnavi", "/assets/08-team1-n-vaishnavi.jpg"],
      ["K. Mallesh", "/assets/09-team1-k-mallesh.jpg"],
    ],
  },
  {
    id: "team2",
    name: "B. Sai Kumar",
    role: "Team Leader",
    image: "/assets/03-tl2-b-sai-kumar.jpg",
    members: [
      ["M. Shivani", "/assets/10-team2-m-shivani.jpg"],
      ["K. Manusha", "/assets/11-team2-k-manusha.jpg"],
      ["G. Shravanthi", "/assets/12-team2-g-shravanthi.jpg"],
      ["B. Prabhavathi", "/assets/13-team2-b-prabhavathi.jpg"],
    ],
  },
] as const;

const supporting = [
  ["K. Naveen", "Editor", "/assets/04-editor-k-naveen.jpg"],
  ["C. Sai Subramanyam", "Tech Team (IT)", "/assets/05-it-c-sai-subramanyam.jpg"],
] as const;

export default function TeamSection(){
  const [openTeam, setOpenTeam] = useState<string | null>(null);

  return (
    <section className="teamSection" aria-labelledby="team-heading">
      <div className="container">
        <div className="teamIntro">
          <div className="aboutKicker">OUR TEAM</div>
          <h2 id="team-heading">Meet the People Behind Your Journeys</h2>
          <p>A passionate team working together to create memorable travel experiences.</p>
        </div>

        <div className="teamHierarchy">
          <article className="teamPerson teamPersonTop">
            <div className="teamPhoto"><img src="/assets/nikhil-ceo.png" alt="K. Nikhil, Founder & CEO" /></div>
            <div><h3>K. Nikhil</h3><span>Founder &amp; CEO</span><p>On A Trip Holidays</p></div>
          </article>

          <div className="teamConnector teamConnectorVertical" aria-hidden="true" />

          <article className="teamPerson teamPersonTop">
            <div className="teamPhoto"><img src="/assets/01-coo-k-harshika.jpg" alt="K. Harshika, COO" /></div>
            <div><h3>K. Harshika</h3><span>COO</span><p>On A Trip Holidays</p></div>
          </article>

          <div className="teamConnector teamConnectorBranch" aria-hidden="true" />

          <div className="teamLeadersRow">
            {leaders.map((leader) => {
              const isOpen = openTeam === leader.id;
              return (
                <button
                  className={`teamLeader ${isOpen ? "isOpen" : ""}`}
                  key={leader.id}
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenTeam(isOpen ? null : leader.id)}
                >
                  <div className="teamPhoto"><img src={leader.image} alt={`${leader.name}, ${leader.role}`} /></div>
                  <div className="teamPersonText"><h3>{leader.name}</h3><span>{leader.role}</span><p>Team size: 4</p></div>
                  <div className="teamExpand" aria-hidden="true">⌄</div>
                </button>
              );
            })}
            {supporting.map(([name, role, image]) => (
              <article className="teamLeader teamSupport" key={name}>
                <div className="teamPhoto"><img src={image} alt={`${name}, ${role}`} /></div>
                <div className="teamPersonText"><h3>{name}</h3><span>{role}</span></div>
              </article>
            ))}
          </div>

          <div className="teamPanels">
            {leaders.map((leader) => {
              const isOpen = openTeam === leader.id;
              return (
                <div className={`teamPanelWrap ${isOpen ? "isOpen" : ""}`} key={leader.id}>
                  <div className="teamPanel" aria-hidden={!isOpen}>
                    <div className="teamPanelHeader"><strong>{leader.id === "team1" ? "Team 1" : "Team 2"} — {leader.name}</strong><span>{isOpen ? "⌃" : "⌄"}</span></div>
                    <div className="teamMembers">
                      {leader.members.map(([name, image]) => (
                        <div className="teamMember" key={name}>
                          <div className="teamMemberPhoto"><img src={image} alt={name} /></div>
                          <strong>{name}</strong>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
