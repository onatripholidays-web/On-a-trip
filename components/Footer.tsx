import Link from "next/link";

const headingStyle = { color: "#ef5b2a", fontWeight: 900 };

export default function Footer(){
  return <footer className="footer">
    <div className="footer-grid">
      <div>
        <img className="footer-logo" src="/assets/logo.png" alt="On A Trip Holidays"/>
        <p>Telugu-first travel support from Hyderabad for pilgrimage, domestic and international holidays.</p>
        <p><strong>Founder &amp; MD:</strong> KADAMANCHI NIKHIL</p>
      </div>
      <div>
        <h3 style={headingStyle}>Explore</h3>
        <Link href="/packages">Packages</Link>
        <Link href="/destinations">Destinations</Link>
        <Link href="/pilgrimage">On A Trip Temple</Link>
        <Link href="/itineraries">Upcoming Batches</Link>
      </div>
      <div>
        <h3 style={headingStyle}>Services</h3>
        <span>Customized Tours</span>
        <span>Flight &amp; Train Booking</span>
        <span>Bus &amp; Cab Booking</span>
        <span>Hotel Booking</span>
        <span>Visa Assistance</span>
        <span>Travel Insurance</span>
      </div>
      <div>
        <h3 style={headingStyle}>Contact</h3>
        <a href="tel:+919182894146">+91 91828 94146</a>
        <a href="mailto:Travel@onatripholidays.com">Travel@onatripholidays.com</a>
        <span>Metro Pillar No. A1454, Banaras Arcade,<br/>16-2-701/614A, Room No.2,<br/>beside Chermas, Hyderabad 500036</span>
        <a href="https://maps.app.goo.gl/L7ouM5yy2vXGUVhT7" target="_blank" rel="noreferrer">Open in Google Maps →</a>
      </div>
    </div>
    <div className="footer-bottom">
      <span>© {new Date().getFullYear()} On A Trip Holidays</span>
      <span>GST: 36GMYPK9431B1ZK</span>
    </div>
  </footer>
}
