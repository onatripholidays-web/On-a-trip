import {NextResponse} from "next/server";

export const dynamic="force-dynamic";

export async function GET(){
  return NextResponse.json({ok:true,service:"On A Trip Holidays AI Itinerary",configured:Boolean(process.env.OPENAI_API_KEY)});
}

export async function POST(req:Request){
  const apiKey=process.env.OPENAI_API_KEY;
  if(!apiKey)return NextResponse.json({error:"OPENAI_API_KEY is not configured for this deployment."},{status:503});
  try{
    const r=await req.json();
    const destination=String(r.dest||"").trim();
    if(!destination)return NextResponse.json({error:"Destination is required."},{status:400});
    const days=Math.max(1,Math.min(30,Number(r.days)||1));
    const pax=Math.max(1,Number(r.pax)||1);
    const system=`You are the senior itinerary planner for On A Trip Holidays, a Telugu-first travel company in India. Create a professional customer-ready itinerary. The destination must be real and specific. Never use undefined, blank, Custom Trip or generic filler. Respect exactly the requested number of days. Never invent confirmed bookings, permits, prices, availability or darshan slots; use subject to confirmation when needed. Preserve supplied quote exactly. For pilgrimage trips use respectful sequencing and senior-friendly pacing. For high-altitude/adventure trips include acclimatization, realistic drives and safety buffers. Match the requested language. Output only valid JSON matching the schema.`;
    const user=`Guest: ${r.guest||"Guest"}\nDestination: ${destination}\nTravellers: ${pax}\nStart city: ${r.start||"TBC"}\nTravel dates: ${r.dates||"TBC"}\nLanguage: ${r.language||"English"}\nTrip type: ${r.type||"Custom"}\nHotel: ${r.hotel||"3 Star"}\nVehicle: ${r.vehicle||"Private Car"}\nMeals: ${r.meals||"Breakfast & Dinner"}\nBudget/quote: ${r.budget||"Price to be quoted"}\nSpecial requirements: ${r.special||"None"}\nInstruction: ${r.instruction||"None"}\nCreate exactly ${days} days.`;
    const schema={type:"object",additionalProperties:false,required:["title","summary","days","hotels","vehicle","meals","price","inclusions","exclusions","notes"],properties:{title:{type:"string"},summary:{type:"string"},days:{type:"array",minItems:days,maxItems:days,items:{type:"object",additionalProperties:false,required:["day","title","summary","hotel","meals"],properties:{day:{type:"integer"},title:{type:"string"},summary:{type:"string"},hotel:{type:"string"},meals:{type:"string"}}}},hotels:{type:"string"},vehicle:{type:"string"},meals:{type:"string"},price:{type:"string"},inclusions:{type:"array",items:{type:"string"}},exclusions:{type:"array",items:{type:"string"}},notes:{type:"string"}}};
    const response=await fetch("https://api.openai.com/v1/responses",{method:"POST",headers:{"Content-Type":"application/json",Authorization:`Bearer ${apiKey}`},body:JSON.stringify({model:process.env.OPENAI_MODEL||"gpt-5.6-luna",input:[{role:"system",content:[{type:"input_text",text:system}]},{role:"user",content:[{type:"input_text",text:user}]}],text:{format:{type:"json_schema",name:"on_a_trip_itinerary",strict:true,schema}}})});
    const raw=await response.text();
    if(!response.ok){let detail="OpenAI request failed.";try{detail=JSON.parse(raw)?.error?.message||detail}catch{}return NextResponse.json({error:`AI provider error (${response.status}): ${detail}`},{status:502});}
    const data=JSON.parse(raw);let text=typeof data.output_text==="string"?data.output_text:"";
    if(!text&&Array.isArray(data.output))for(const item of data.output){for(const c of item?.content||[]){if(typeof c?.text==="string"&&c.text.trim()){text=c.text;break;}}if(text)break;}
    if(!text)return NextResponse.json({error:"AI returned no itinerary text."},{status:502});
    const itinerary=JSON.parse(text);
    if(!itinerary.title||!Array.isArray(itinerary.days)||itinerary.days.length!==days)return NextResponse.json({error:"AI returned an incomplete itinerary."},{status:502});
    return NextResponse.json(itinerary);
  }catch(error){console.error(error);return NextResponse.json({error:"Unable to generate itinerary. Please try again."},{status:500});}
}
