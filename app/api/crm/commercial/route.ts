import {NextResponse} from "next/server";
import {cookies} from "next/headers";
import {crmSupabaseConfig,getCrmSession} from "@/lib/crm-auth";

const resources={customers:"crm_customers",activities:"crm_lead_activities",tasks:"crm_tasks",quotations:"crm_quotations",quotation_items:"crm_quotation_items",bookings:"crm_bookings",payments:"crm_payments",invoices:"crm_invoices",invoice_items:"crm_invoice_items",travellers:"crm_travellers",suppliers:"crm_suppliers",supplier_bookings:"crm_supplier_bookings",service_bookings:"crm_service_bookings",supplier_ledger:"crm_supplier_ledger",documents:"crm_documents",audit:"crm_audit_logs"} as const;
type Resource=keyof typeof resources;
type Context={session:Awaited<ReturnType<typeof getCrmSession>>;token:string;url:string;key:string};
type HeaderContext={key:string;token:string};
type JsonValue=unknown;
type RequestBody={resource?:string;id?:string|number;data?:Record<string,JsonValue>};
async function ctx():Promise<Context|null>{const session=await getCrmSession();if(!session)return null;const token=(await cookies()).get("oat_crm_access")?.value||"";const {url,key}=crmSupabaseConfig();return{session,token,url,key}}
function resource(v:string|null):Resource|null{return v&&v in resources?(v as Resource):null}
function headers(c:HeaderContext,extra:Record<string,string>={}):Record<string,string>{return{apikey:c.key,Authorization:`Bearer ${c.token}`,...extra}}
function docNo(prefix:string):string{const d=new Date();return `${prefix}-${d.getFullYear()}${String(d.getMonth()+1).padStart(2,"0")}-${Date.now().toString(36).toUpperCase()}`}
async function readJson(req:Request):Promise<RequestBody|null>{try{return await req.json() as RequestBody}catch{return null}}

export async function GET(req:Request):Promise<NextResponse>{
 const c=await ctx();
 if(!c)return NextResponse.json({error:"Unauthorized"},{status:401});
 const p=new URL(req.url).searchParams;
 const r=resource(p.get("resource"));
 if(!r)return NextResponse.json({error:"Unknown resource"},{status:400});
 if(r==="audit"&&c.session.profile.role!=="admin")return NextResponse.json({error:"Forbidden"},{status:403});
 const select=p.get("select")||"*";
 const limit=Math.min(200,Math.max(1,Number(p.get("limit")||50)));
 const offset=Math.max(0,Number(p.get("offset")||0));
 const q=new URLSearchParams({select,limit:String(limit),offset:String(offset)});
 const order=p.get("order");
 if(order)q.set("order",order);
 for(const key of ["id","customer_id","enquiry_id","booking_id","quotation_id","supplier_id","status","assigned_to","salesperson","phone"]){const v=p.get(key);if(v)q.set(key,v)}
 const response=await fetch(`${c.url}/rest/v1/${resources[r]}?${q.toString()}`,{headers:headers(c,{Prefer:"count=exact"}),cache:"no-store"});
 let data:JsonValue=[];
 try{data=await response.json()}catch{data=[]}
 return NextResponse.json(data,{status:response.status,headers:{"x-total":response.headers.get("content-range")||""}})
}

export async function POST(req:Request):Promise<NextResponse>{
 const c=await ctx();
 if(!c)return NextResponse.json({error:"Unauthorized"},{status:401});
 const body=await readJson(req);
 const r=resource(body?.resource||null);
 if(!r||r==="audit")return NextResponse.json({error:"Invalid resource"},{status:400});
 const payload={...(body?.data||{})};
 delete payload.resource;
 payload.created_by=payload.created_by||c.session.user.id;
 if(r==="customers"&&!payload.assigned_to)payload.assigned_to=c.session.profile.salesperson;
 if(r==="payments"&&!payload.receipt_no)payload.receipt_no=docNo("RC");
 if(r==="invoices"&&!payload.invoice_no)payload.invoice_no=docNo("INV");
 const response=await fetch(`${c.url}/rest/v1/${resources[r]}`,{method:"POST",headers:headers(c,{"Content-Type":"application/json",Prefer:"return=representation"}),body:JSON.stringify(payload)});
 let data:JsonValue=null;
 try{data=await response.json()}catch{data=null}
 return NextResponse.json(data,{status:response.status})
}

export async function PATCH(req:Request):Promise<NextResponse>{
 const c=await ctx();
 if(!c)return NextResponse.json({error:"Unauthorized"},{status:401});
 const typedBody=await readJson(req);
 const r=resource(typedBody?.resource||null);
 const id=typedBody?.id;
 if(!r||!id||r==="audit")return NextResponse.json({error:"Resource and id are required"},{status:400});
 const patch={...(typedBody?.data||{})};
 delete patch.id;
 if(c.session.profile.role!=="admin"){delete patch.created_by;if(r==="customers"&&patch.assigned_to)patch.assigned_to=c.session.profile.salesperson}
 const response=await fetch(`${c.url}/rest/v1/${resources[r]}?id=eq.${encodeURIComponent(String(id))}`,{method:"PATCH",headers:headers(c,{"Content-Type":"application/json",Prefer:"return=representation"}),body:JSON.stringify(patch)});
 let data:JsonValue=null;
 try{data=await response.json()}catch{data=null}
 return NextResponse.json(data,{status:response.status})
}

export async function DELETE(req:Request):Promise<NextResponse>{
 const c=await ctx();
 if(!c)return NextResponse.json({error:"Unauthorized"},{status:401});
 if(c.session.profile.role!=="admin")return NextResponse.json({error:"Only admins can delete CRM records"},{status:403});
 const typedBody=await readJson(req);
 const r=resource(typedBody?.resource||null);
 const id=typedBody?.id;
 if(!r||!id||r==="audit")return NextResponse.json({error:"Resource and id are required"},{status:400});
 const response=await fetch(`${c.url}/rest/v1/${resources[r]}?id=eq.${encodeURIComponent(String(id))}`,{method:"DELETE",headers:headers(c,{Prefer:"return=minimal"})});
 return NextResponse.json({ok:response.ok},{status:response.ok?200:response.status})
}
