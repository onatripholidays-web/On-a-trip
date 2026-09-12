"use client";
import {useEffect} from "react";

export default function CrmHeaderActionsPatch(){
 useEffect(()=>{
  let bar:HTMLElement|null=null;
  let mark:HTMLElement|null=null;
  let observer:MutationObserver|null=null;
  let timer:number|undefined;

  const patch=()=>{
   bar=document.querySelector(".crm-top-actions") as HTMLElement|null;
   mark=document.querySelector(".crm-brand .crm-mark") as HTMLElement|null;

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

   if(first.textContent!=="▣ Quotation")first.textContent="▣ Quotation";
   first.setAttribute("aria-label","Quotation");
   first.onclick=()=>{window.location.href="/crm/quotation"};
   first.style.display="inline-flex";

   buttons.slice(1).forEach((button)=>{
    const shouldHide=button.textContent?.includes("AI Itinerary")===true;
    if(shouldHide && button.style.display!=="none")button.style.display="none";
   });
  };

  patch();
  timer=window.setTimeout(patch,250);

  const attachObserver=()=>{
   if(!bar)return;
   observer=new MutationObserver(patch);
   observer.observe(bar,{childList:true,subtree:true});
  };
  window.setTimeout(attachObserver,0);

  return()=>{
   if(observer)observer.disconnect();
   if(timer)window.clearTimeout(timer);
  };
 },[]);
 return null;
}
