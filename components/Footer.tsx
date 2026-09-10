import Link from "next/link";

const linkStyle: React.CSSProperties = { display: "flex", alignItems: "flex-start", gap: 9, fontSize: 13, lineHeight: 1.55, margin: "10px 0", color: "#c5d0d8" };
const headingStyle: React.CSSProperties = { color: "#ef5b2a", fontWeight: 900, fontSize: 15, margin: "0 0 17px" };
const arrow = <span aria-hidden="true" style={{ color: "#ef5b2a", fontWeight: 900, lineHeight: 1.4 }}>»</span>;

function SocialIcon({type, href, label}:{type:"instagram"|"facebook"|"youtube";href:string;label:string}){
  return <a href={href} target="_blank" rel="noreferrer" aria-label={label} className="oat-social-icon">
    {type === "instagram" && <svg viewBox="0 0 24 24" aria-hidden="true"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.4" cy="6.7" r="1" fill="currentColor" stroke="none"/></svg>}
    {type === "facebook" && <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14.1 21v-8h2.7l.4-3.1h-3.1V7.9c0-.9.3-1.5 1.6-1.5h1.7V3.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.2v2.2H8.2V13h2.7v8h3.2z" fill="currentColor" stroke="none"/></svg>}
    {type === "youtube" && <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.4 7.2a2.9 2.9 0 0 0-2-2C17.7 4.7 12 4.7 12 4.7s-5.7 0-7.4.5a2.9 2.9 0 0 0-2 2A30 30 0 0 0 2.1 12a30 30 0 0 0 .5 4.8 2.9 2.9 0 0 0 2 2c1.7.5 7.4.5 7.4.5s5.7 0 7.4-.5a2.9 2.9 0 0 0 2-2 30 30 0 0 0 .5-4.8 30 30 0 0 0-.5-4.8z" fill="currentColor" stroke="none"/><path d="m10.2 15.4 5-3.4-5-3.4v6.8z" fill="#071827" stroke="none"/></svg>}
  </a>;
}

export default function Footer(){
  return <>
    <style>{`
      .oat-footer{background:#071827;color:#c5d0d8;padding:58px 0 0;overflow:hidden}
      .oat-footer-inner{width:min(1220px,calc(100% - 40px));margin:auto}
      .oat-footer-grid{display:grid;grid-template-columns:1.55fr 1fr 1fr 1fr 1.35fr;gap:34px}
      .oat-footer-brand{padding-right:10px}
      .oat-footer-logo{width:185px;height:70px;object-fit:contain;background:#fff;border-radius:8px;padding:4px;margin-bottom:12px}
      .oat-footer p{font-size:13px;line-height:1.65;margin:0 0 12px;color:#c5d0d8}
      .oat-footer strong{color:#fff}
      .oat-footer-link:hover{color:#fff!important}
      .oat-socials{display:flex;gap:10px;margin-top:18px}
      .oat-social-icon{width:37px;height:37px;border:1px solid rgba(255,255,255,.2);border-radius:50%;display:grid;place-items:center;color:#e5edf2;transition:.18s}
      .oat-social-icon:hover{color:#ef5b2a;border-color:#ef5b2a;transform:translateY(-2px)}
      .oat-social-icon svg{width:17px;height:17px;fill:none;stroke:currentColor;stroke-width:1.7}
      .oat-footer-contact a{color:#c5d0d8}
      .oat-footer-contact a:hover{color:#fff}
      .oat-footer-contact-line{display:flex;gap:9px;align-items:flex-start;font-size:13px;line-height:1.55;margin:10px 0}
      .oat-contact-icon{color:#ef5b2a;font-weight:900;min-width:15px}
      .oat-skyline-wrap{margin-top:48px;border-top:1px solid rgba(255,255,255,.12);height:112px;display:flex;align-items:flex-end;justify-content:center;background:linear-gradient(180deg,rgba(18,28,48,.25),rgba(8,4,25,.55))}
      .oat-skyline{width:min(620px,82%);height:82px;color:#b8bec6;opacity:.82}
      .oat-bottom{width:min(1220px,calc(100% - 40px));margin:auto;padding:15px 0 18px;border-top:1px solid rgba(255,255,255,.1);display:flex;justify-content:center;gap:26px;flex-wrap:wrap;text-align:center;font-size:11px;color:#d3dbe0}
      .oat-bottom .accent{color:#ef5b2a;font-weight:900}
      @media(max-width:1100px){.oat-footer-grid{grid-template-columns:1.4fr 1fr 1fr 1fr;}.oat-footer-contact{grid-column:1/-1;display:grid;grid-template-columns:repeat(3,1fr);gap:10px}.oat-footer-contact h3{grid-column:1/-1}}
      @media(max-width:760px){.oat-footer{padding-top:45px}.oat-footer-grid{grid-template-columns:1fr 1fr;gap:30px}.oat-footer-brand,.oat-footer-contact{grid-column:1/-1}.oat-footer-contact{display:block}.oat-footer-logo{width:165px;height:64px}.oat-footer p,.oat-footer-link,.oat-footer-contact-line{font-size:12px}.oat-skyline-wrap{height:90px;margin-top:38px}.oat-skyline{height:64px}}
      @media(max-width:480px){.oat-footer-inner,.oat-bottom{width:calc(100% - 28px)}.oat-footer-grid{grid-template-columns:1fr;gap:25px}.oat-footer-contact{grid-column:auto}.oat-footer h3{margin-bottom:12px}.oat-social-icon{width:35px;height:35px}.oat-skyline{width:94%}.oat-bottom{gap:6px;display:block}.oat-bottom span{display:block;margin:4px 0}}
    `}</style>
    <footer className="oat-footer">
      <div className="oat-footer-inner">
        <div className="oat-footer-grid">
          <div className="oat-footer-brand">
            <img className="oat-footer-logo" src="/assets/logo.png" alt="On A Trip Holidays"/>
            <p>Telugu-first travel support from Hyderabad for pilgrimage, domestic and international holidays across India and the world.</p>
            <p><strong>Founder &amp; CEO:</strong> KADAMANCHI NIKHIL</p>
            <div className="oat-socials" aria-label="Social media links">
              <SocialIcon type="facebook" href="https://www.facebook.com/p/Onatrip-Holidays-100088055905534/" label="On A Trip Holidays on Facebook"/>
              <SocialIcon type="instagram" href="https://www.instagram.com/onatripholidays/?hl=en" label="On A Trip Holidays on Instagram"/>
              <SocialIcon type="youtube" href="https://www.youtube.com/@Onatripholidays" label="On A Trip Holidays on YouTube"/>
            </div>
          </div>

          <div>
            <h3 style={headingStyle}>Useful Links</h3>
            <Link className="oat-footer-link" style={linkStyle} href="/packages">{arrow} Packages</Link>
            <Link className="oat-footer-link" style={linkStyle} href="/destinations">{arrow} Destinations</Link>
            <Link className="oat-footer-link" style={linkStyle} href="/about">{arrow} About Us</Link>
            <Link className="oat-footer-link" style={linkStyle} href="/itineraries">{arrow} Upcoming Batches</Link>
            <Link className="oat-footer-link" style={linkStyle} href="/blogs#reviews">{arrow} Reviews</Link>
            <Link className="oat-footer-link" style={linkStyle} href="/blogs">{arrow} Travel Guides</Link>
            <Link className="oat-footer-link" style={linkStyle} href="/contact">{arrow} Contact Us</Link>
          </div>

          <div>
            <h3 style={headingStyle}>Company Policies</h3>
            <Link className="oat-footer-link" style={linkStyle} href="/booking-terms">{arrow} Booking Terms &amp; Conditions</Link>
            <Link className="oat-footer-link" style={linkStyle} href="/privacy-policy">{arrow} Company Privacy Policy</Link>
            <Link className="oat-footer-link" style={linkStyle} href="/cancellation-refund">{arrow} Cancellation &amp; Refund Policy</Link>
            <Link className="oat-footer-link" style={linkStyle} href="/contact">{arrow} Contact Us</Link>
          </div>

          <div>
            <h3 style={headingStyle}>Yatra Pages</h3>
            <Link className="oat-footer-link" style={linkStyle} href="/packages/char-dham-yatra">{arrow} Char Dham Yatra</Link>
            <Link className="oat-footer-link" style={linkStyle} href="/packages/do-dham-yatra">{arrow} Do Dham Yatra</Link>
            <Link className="oat-footer-link" style={linkStyle} href="/packages/kedarnath">{arrow} Kedarnath Yatra</Link>
            <Link className="oat-footer-link" style={linkStyle} href="/pilgrimage">{arrow} On A Trip Temple</Link>
          </div>

          <div className="oat-footer-contact">
            <h3 style={headingStyle}>Contact Info</h3>
            <div className="oat-footer-contact-line"><span className="oat-contact-icon">⌖</span><span>Metro Pillar No. A1454, Banaras Arcade,<br/>16-2-701/614A, Room No.2,<br/>beside Chermas, Hyderabad, Telangana 500036</span></div>
            <div className="oat-footer-contact-line"><span className="oat-contact-icon">☎</span><a href="tel:+919182894146">+91 91828 94146</a></div>
            <div className="oat-footer-contact-line"><span className="oat-contact-icon">✉</span><a href="mailto:Travel@onatripholidays.com">Travel@onatripholidays.com</a></div>
            <div className="oat-footer-contact-line"><span className="oat-contact-icon">⌖</span><a href="https://maps.app.goo.gl/L7ouM5yy2vXGUVhT7" target="_blank" rel="noreferrer">Open in Google Maps →</a></div>
          </div>
        </div>

        <div className="oat-skyline-wrap" aria-hidden="true">
          <svg className="oat-skyline" viewBox="0 0 900 120" preserveAspectRatio="xMidYMax meet">
            <g fill="currentColor" stroke="currentColor" strokeWidth="2">
              <path d="M80 110V72h42v38H80Zm50 0V52h28v58h-28Zm38 0V78h45v32h-45Zm56 0V42h20v68h-20Zm29 0V63h45v47h-45Zm58 0V27h18v83h-18Zm27 0V70h39v40h-39Zm48 0V48h28v62h-28Zm38 0V72h42v38h-42Zm53 0V36h18v74h-18Zm28 0V57h44v53h-44Zm56 0V20h20v90h-20Zm31 0V49h28v61h-28Zm39 0V65h46v45h-46Zm57 0V31h17v79h-17Zm27 0V55h41v55h-41Zm50 0V73h34v37h-34Z"/>
              <path d="M26 110h848" fill="none" stroke="#7f8790" strokeWidth="3"/>
              <path d="M284 110V58l18-18 18 18v52M594 110V51l15-15 15 15v59M716 110V43l14-14 14 14v67" fill="none" stroke="#e3e5e7" strokeWidth="3"/>
            </g>
          </svg>
        </div>
      </div>
      <div className="oat-bottom">
        <span><span className="accent">On A Trip Holidays</span> © {new Date().getFullYear()} All Rights Reserved.</span>
        <span>GST: 36GMYPK9431B1ZK</span>
      </div>
    </footer>
  </>
}
