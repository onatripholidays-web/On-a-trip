import Link from "next/link";

export default function NotFound() {
  return <main style={{minHeight:"70vh",display:"grid",placeItems:"center",padding:40}}>
    <div><h1>Page not found</h1><p>The page you requested does not exist.</p><Link href="/">Return to On A Trip Holidays</Link></div>
  </main>;
}
