"use client";
import {useEffect} from "react";

export default function ScrollMotion(){
  useEffect(()=>{
    const run=()=>{
      const selectors=[".section-head",".split",".feature-panel",".callout",".destination-tile",".batch-card",".why-grid>div",".package-card",".highlight-list",".travel-note",".sticky-quote"];
      const nodes=Array.from(document.querySelectorAll<HTMLElement>(selectors.join(",")));
      if(!nodes.length)return;
      if(window.matchMedia("(prefers-reduced-motion: reduce)").matches){nodes.forEach(el=>el.classList.add("oat-motion-visible"));return;}
      nodes.forEach((el,i)=>{el.classList.add("oat-motion-ready");el.style.setProperty("--oat-delay",`${Math.min((i%6)*55,275)}ms`);});
      const observer=new IntersectionObserver(entries=>{entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("oat-motion-visible");observer.unobserve(entry.target);}})},{threshold:.08,rootMargin:"0px 0px -8% 0px"});
      nodes.forEach(el=>observer.observe(el));
      return()=>observer.disconnect();
    };
    const idle=typeof window.requestIdleCallback==="function"?window.requestIdleCallback(run,{timeout:1200}):window.setTimeout(run,120);
    return()=>{if(typeof idle==="number")window.clearTimeout(idle);else window.cancelIdleCallback?.(idle);};
  },[]);
  return null;
}
