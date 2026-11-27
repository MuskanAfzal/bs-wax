'use client';
import {useMemo,useState} from 'react';
import {ArrowUpRight,Check,Car,Truck,Bus,ChevronRight,Download,ShieldCheck} from 'lucide-react';
import {Bee} from './Brand';
import {homepageDefaults} from '@/lib/homepage.mjs';
import {Content} from '@/lib/types';
import {buildResetPlan,vehicleOptions} from '@/lib/reset-plan.mjs';
import {money,readAddonPrice} from '@/lib/estimate.mjs';
export type PlanSelection={vehicle:string;concerns:string[];service:string;notes:string;estimate?:{level:number;quantities:Record<string,number>}};

export default function ResetBuilder({content,onUsePlan}:{content:Content;onUsePlan:(plan:PlanSelection)=>void}){
 const copy={...homepageDefaults,...content.homepage};
 const [vehicle,setVehicle]=useState('Sedan / Coupe'),[level,setLevel]=useState(1),[serviceId,setServiceId]=useState('');
 const [quantities,setQuantities]=useState<Record<string,number>>({});
 const plan=useMemo(()=>{
   const priorities=Object.entries(quantities).filter(([,quantity])=>quantity>0).flatMap(([id])=>id==='pet-hair'?['pets']:id==='staining'?['stains']:id==='cargo'?['carpets']:[]);
   return buildResetPlan({vehicle,level,priorities,serviceId,services:content.services,addons:content.addons||[],quantities});
 },[vehicle,level,serviceId,quantities,content.services,content.addons]);
 const selected=Object.fromEntries(plan.estimate.lines.map(line=>[line.id,line.quantity]));
 const downloadUrl='/api/reset-plan/?'+new URLSearchParams({vehicle,level:String(level),priorities:'',service:plan.service?.id||'',addons:JSON.stringify(selected)}).toString();
 const toggle=(id:string)=>setQuantities(previous=>({...previous,[id]:previous[id]?0:1}));
 return <section className="reset-section section" id="build-my-reset">
  <div className="reset-heading"><div><span className="eyebrow"><span/>{copy.builderEyebrow}</span><h2 className="editable-heading">{copy.builderHeading.split('\n').map((line,index,lines)=><span key={index}>{index>0&&<br/>}{index===lines.length-1&&lines.length>1?<em>{line}</em>:line}</span>)}</h2></div><p>{copy.builderIntro}</p></div>
  <div className="reset-workspace"><div className="reset-controls">
   <div className="reset-control-group"><div className="reset-step"><b>01</b><div><h3>{copy.builderVehicleHeading}</h3><span>{copy.builderVehicleHint}</span></div></div><div className="vehicle-grid">{vehicleOptions.map((option:string,index:number)=>{const Icon=[Car,Car,Truck,Bus][index];return <button key={option} aria-pressed={vehicle===option} onClick={()=>setVehicle(option)} className={vehicle===option?'selected':''}><Icon size={25}/><span>{option}</span>{vehicle===option&&<Check size={12}/>}</button>})}</div></div>
   <div className="reset-control-group"><div className="reset-step"><b>02</b><div><h3>{copy.builderConditionHeading}</h3><span>{copy.builderConditionHint}</span></div></div><div className="condition-scale" role="group" aria-label="Interior condition">{[['Light','Routine maintenance'],['Lived-in','Everyday use'],['Heavy','Quote required']].map(([title,hint],index)=><button key={title} onClick={()=>setLevel(index)} aria-pressed={level===index} className={level===index?'selected':''}><span className="condition-dots">{Array.from({length:3},(_,n)=><i key={n} className={n<=index?'filled':''}/>)}</span><strong>{title}</strong><small>{hint}</small></button>)}</div></div>
   <div className="reset-control-group"><div className="reset-step"><b>03</b><div><h3>{copy.builderPackageHeading}</h3><span>{copy.builderPackageHint}</span></div></div><div className="estimate-packages">{content.services.filter(service=>service.active).map(service=><button key={service.id} aria-pressed={plan.service?.id===service.id} className={plan.service?.id===service.id?'selected':''} onClick={()=>setServiceId(service.id)}><span><strong>{service.name}</strong><small>{service.description}</small></span><b>{service.price===null?'Quote':`From ${money(service.price)}`}</b>{plan.service?.id===service.id&&<Check size={15}/>}</button>)}</div></div>
   <div className="reset-control-group"><div className="reset-step"><b>04</b><div><h3>{copy.builderAddonsHeading}</h3><span>{copy.builderAddonsHint}</span></div></div><div className="estimate-addons">{(content.addons||[]).filter(item=>item.active).map(item=><div key={item.id} className={'estimate-addon '+(quantities[item.id]?'selected':'')}><button aria-pressed={!!quantities[item.id]} onClick={()=>toggle(item.id)}><span><strong>{item.name}</strong><small>{item.description}</small></span><b>{item.priceLabel}</b><span className="addon-check">{quantities[item.id]?<Check size={13}/>: '+'}</span></button>{!!quantities[item.id]&&readAddonPrice(item.priceLabel)?.each&&<label className="addon-quantity">{copy.builderQuantity}<input aria-label={item.name+' quantity'} type="number" min="1" max="10" step="1" value={quantities[item.id]} onChange={event=>setQuantities(previous=>({...previous,[item.id]:Math.max(1,Math.min(10,Math.floor(Number(event.target.value)||1)))}))}/></label>}</div>)}</div>{!content.addons?.some(item=>item.active)&&<p className="receipt-why">{copy.builderNoExtras}</p>}</div>
  </div><aside className="reset-receipt" aria-live="polite" aria-atomic="true">
   <div className="receipt-top"><Bee/><span>{copy.builderReceiptTitle}</span><span className="receipt-live"><i/> {copy.builderLive}</span></div>
   <div className="receipt-main"><div className="receipt-kicker">{copy.builderDetailLabel}</div><h3>{plan.service?.name||'Choose a package'}</h3><p className="receipt-why">{plan.service?.description||'Choose an available package to build your estimate.'}</p><div className="receipt-vehicle"><Car size={15}/>{vehicle}<span>{plan.condition}</span></div>
    <div className="estimate-lines"><div><span>{plan.service?.name||'Package'}</span><strong>{plan.service?.price!=null?'From '+money(plan.service.price):'Quote required'}</strong></div>{plan.estimate.lines.map(line=><div key={line.id}><span>{line.name}{line.quantity>1?` × ${line.quantity}`:''}</span><strong>{line.quantity>1&&line.min!==null?money(line.min):line.priceLabel}</strong></div>)}{plan.estimate.lines.length===0&&<p>{copy.builderNoSelection}</p>}</div>
    <details className="prep-details"><summary>{copy.builderInclusions} <ChevronRight size={14}/></summary><ul>{plan.service?.features.filter(Boolean).map(feature=><li key={feature}>{feature}</li>)}</ul></details>
    <details className="prep-details"><summary>{copy.builderPreparation} <ChevronRight size={14}/></summary><ul>{plan.prep.map((item:string)=><li key={item}>{item}</li>)}</ul></details>
    <div className="receipt-price"><span>{copy.builderTotalLabel}</span><strong>{plan.estimate.totalLabel}</strong>{plan.estimate.needsQuote&&plan.estimate.min!==null&&<small>Known starting subtotal: {money(plan.estimate.min)}. Additional quoted charges may apply.</small>}<small>{copy.builderDisclaimer}</small></div>
    <button className="button gold" disabled={!plan.service} onClick={()=>onUsePlan({vehicle,concerns:plan.concerns,service:plan.service?.id||'',notes:plan.notes,estimate:{level,quantities:selected}})}>{copy.builderRequest} <ArrowUpRight size={17}/></button>
    {plan.service&&<a className="receipt-download" href={downloadUrl} download><Download size={13}/>{copy.builderDownload}</a>}
   </div><div className="receipt-bottom"><ShieldCheck size={13}/> {copy.builderFootnote}</div>
  </aside></div>
 </section>;
}
