"use client";
import {useMemo,useState} from "react";
import type {Package} from "@/lib/site-data";
import {destinationMeta} from "@/lib/site-data";
import PackageCard from "./PackageCard";

const groups={
  "Temples":destinationMeta.temples.packages,
  "Mountains & Adventures":destinationMeta.mountains.packages,
  "Romantic Escapes":destinationMeta.romantic.packages,
  "International":destinationMeta.international.packages,
} as const;

export default function PackageExplorer({items}:{items:Package[]}){
  const[q,setQ]=useState("");
  const[cat,setCat]=useState("All");
  const filtered=useMemo(()=>items.filter(x=>{
    if(x.visible===false)return false;
    const inGroup=cat==="All"||(groups as Record<string,readonly string[]>)[cat]?.includes(x.slug);
    return Boolean(inGroup)&&`${x.name} ${x.route} ${x.from}`.toLowerCase().includes(q.toLowerCase());
  }),[items,q,cat]);
  return <>
    <div className="filters">
      <input value={q} onChange={e=>setQ(e.target.value)} placeholder="Search destination or package…"/>
      <select value={cat} onChange={e=>setCat(e.target.value)}>
        <option>All</option>
        <option>Temples</option>
        <option>Mountains & Adventures</option>
        <option>Romantic Escapes</option>
        <option>International</option>
      </select>
      <span>{filtered.length} packages</span>
    </div>
    <div className="package-grid">{filtered.map(x=><PackageCard key={x.slug} item={x}/>)}</div>
    {!filtered.length&&<div className="empty">No package matches that search. Try another destination or <a href="/contact">request a custom trip</a>.</div>}
  </>;
}
