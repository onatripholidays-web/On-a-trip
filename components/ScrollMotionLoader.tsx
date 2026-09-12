"use client";
import {useEffect,useState,type ComponentType} from "react";

export default function ScrollMotionLoader(){
  const [Motion,setMotion]=useState<ComponentType|null>(null);
  useEffect(()=>{
    const load=()=>import("./ScrollMotion").then(m=>setMotion(()=>m.default));
    if(typeof window.requestIdleCallback==="function"){
      const id=window.requestIdleCallback(load,{timeout:1500});
      return ()=>window.cancelIdleCallback?.(id);
    }
    const id=window.setTimeout(load,250);
    return ()=>window.clearTimeout(id);
  },[]);
  return Motion ? <Motion/> : null;
}
