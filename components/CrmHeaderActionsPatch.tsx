"use client";
import {useEffect} from "react";

export default function CrmHeaderActionsPatch(){
 useEffect(()=>{
  const patch=()=>{
   const bar=document.querySelector(".crm-top-actions");
   if(!bar)return;
   const buttons=bar.querySelectorAll("button");
   const first=buttons[0] as HTMLButtonElement|undefined;
   if(!first)return;
   first.textContent="▣ Quotation";
   first.onclick=()=>{window.location.href="/crm/quotation"};
  };
  patch();
  const observer=new MutationObserver(patch);
  observer.observe(document.body,{childList:true,subtree:true});
  return()=>observer.disconnect();
 },[]);
 return null;
}

// Keep CRM header action patch isolated from the production branch.
