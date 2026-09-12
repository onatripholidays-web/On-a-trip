"use client";
import {useEffect} from "react";

export default function CrmHeaderActionsPatch(){
 useEffect(()=>{
  const patch=()=>{
   const bar=document.querySelector(".crm-top-actions") as HTMLElement|null;
   const mark=document.querySelector(".crm-brand .crm-mark") as HTMLElement|null;

   if(mark && !mark.querySelector("img")){
    mark.textContent="";
    const img=document.createElement("img");
    img.src="/assets/logo.png";
    img.alt="On A Trip Holidays";
    mark.appendChild(img);
   }

   if(!bar)return;
   const buttons=Array.from(bar.querySelectorAll("button")) as HTMLButtonElement[];
   const first=buttons[0];
   if(!first)return;

   first.textContent="▣ Quotation";
   first.setAttribute("aria-label","Quotation");
   first.onclick=()=>{window.location.href="/crm/quotation"};
   first.style.display="inline-flex";

   buttons.slice(1).forEach((button)=>{
    if(button.textContent?.includes("AI Itinerary"))button.style.display="none";
   });
  };

  patch();
  const observer=new MutationObserver(patch);
  observer.observe(document.body,{childList:true,subtree:true});
  const timer=window.setTimeout(patch,500);
  return()=>{
   observer.disconnect();
   window.clearTimeout(timer);
  };
 },[]);
 return null;
}
