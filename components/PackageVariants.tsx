"use client";
import Link from "next/link";
import {useEffect,useState} from "react";
import type {Package} from "@/lib/site-data";

export default function PackageVariants({options}:{options:Package[]}){
  const[open,setOpen]=useState(true);
  useEffect(()=>{document.body.style.overflow=open?"hidden":"";return()=>{document.body.style.overflow=""}},[open]);
  if(!options.length)return null;
  return <>
    <button type="button" className="variant-trigger" onClick={()=>setOpen(true)}>Choose your package →</button>
    {open&&<div className="variant-overlay" role="dialog" aria-modal="true" aria-label="Choose package option">
      <div className="variant-modal">
        <div className="variant-modal-head">
          <div><span className="eyebrow">CHOOSE YOUR ROUTE</span><h2>Select your package</h2><p>Pick the travel plan that matches your route and trip style.</p></div>
          <button type="button" className="variant-close" onClick={()=>setOpen(false)} aria-label="Close package options">×</button>
        </div>
        <div className="variant-grid">
          {options.map(option=><Link className="variant-card" href={`/packages/${option.slug}`} key={option.slug} onClick={()=>setOpen(false)}>
            <div className="variant-card-image"><img src={option.image} alt={option.name}/></div>
            <div className="variant-card-body"><span>{option.duration}</span><h3>{option.name}</h3><p>{option.route}</p><b>View package →</b></div>
          </Link>)}
        </div>
      </div>
    </div>}
  </>;
}
