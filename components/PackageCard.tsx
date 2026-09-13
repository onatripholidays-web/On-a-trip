import Image from "next/image";
import Link from "next/link";
import type {Package} from "@/lib/site-data";

const FALLBACK="/assets/travel-fallback.svg";

export default function PackageCard({item}:{item:Package}){
  return <article className="package-card">
    <Link href={`/packages/${item.slug}`} className="package-image">
      <Image
        src={item.image||FALLBACK}
        alt={`${item.name} travel package`}
        fill
        sizes="(max-width: 700px) 100vw, (max-width: 1100px) 50vw, 33vw"
        loading="lazy"
        quality={72}
        referrerPolicy="no-referrer"
        onError={(e)=>{const img=e.currentTarget;if(img.src.endsWith(FALLBACK))return;img.src=FALLBACK;}}
      />
      <span>{item.category}</span>
    </Link>
    <div className="package-body">
      <div className="package-meta">{item.duration} <b>•</b> {item.from}</div>
      <h3><Link href={`/packages/${item.slug}`}>{item.name}</Link></h3>
      <p>{item.route}</p>
      <div className="package-bottom"><strong>{item.price}</strong><Link href={`/packages/${item.slug}`}>View trip →</Link></div>
    </div>
  </article>
}
