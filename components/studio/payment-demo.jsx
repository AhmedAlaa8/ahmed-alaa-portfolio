'use client';
import {useState} from 'react';
import {Plus,Check,CreditCard,RotateCcw,UserRound,Store,Landmark,ChartNoAxesCombined,Truck} from 'lucide-react';
import {usePortfolio} from '../preferences';
import {workflowDemos,resolveWorkflow} from '../../data/workflow-demos.mjs';

const icons={payments:[UserRound,CreditCard,Store],investment:[UserRound,Landmark,ChartNoAxesCombined],shipping:[Store,Truck,UserRound]};
export default function PaymentDemo(){
 const {content:t,locale}=usePortfolio(),copy=workflowDemos[locale]||workflowDemos.en,s=t.studio;
 const [flow,setFlow]=useState('payments'),[step,setStep]=useState(0);
 const example=resolveWorkflow(locale,flow),returning=flow==='payments'&&step>=2,count=example.steps.length;
 const active=flow==='payments'?(step===0||step===3?0:1):step===0?0:step===count-1?2:1;
 const IconSet=icons[flow];
 function choose(id){setFlow(id);setStep(0);}
 return <section className="payment-demo enhanced-demo workflow-demo">
  <div className="workflow-demo-head"><span className="eyebrow">{copy.eyebrow}</span><div className="workflow-choices" aria-label={copy.label}>{copy.examples.map(item=><button key={item.id} type="button" aria-pressed={flow===item.id} onClick={()=>choose(item.id)}>{item.name}</button>)}</div></div>
  <div className="demo-copy"><h3>{example.title}</h3><p>{copy.copy}</p><div className="demo-actions"><button className="action" onClick={()=>setStep((step+1)%count)}><span>{step===count-1?s.replay:s.next}</span><span className="action-icon">{step===count-1?<RotateCcw/>:<Plus/>}</span></button><button className="demo-previous" disabled={step===0} onClick={()=>setStep(step-1)}>{s.previous}</button></div><div className="demo-step-dots" aria-label={example.name}>{example.steps.map((label,i)=><button key={i} type="button" aria-label={label} aria-current={i===step?'step':undefined} className={i===step?'selected':''} onClick={()=>setStep(i)}>{String(i+1).padStart(2,'0')}</button>)}</div></div>
  <div className="demo-visual"><div className="payment-network" data-reverse={returning} key={`${flow}-${step}`} aria-hidden="true">{IconSet.map((Icon,i)=><div className="network-part" key={i}><div className={`network-node ${active===i?'active':''}`}><Icon/><small>{example.nodes[i]}</small></div>{i<2&&<div className={`network-wire ${i===1?'second':''}`}><span className="network-packet"/></div>}</div>)}</div><div className="demo-ledger"><div className="ledger-top"><span>{example.name}</span><span className="ledger-count">{String(step+1).padStart(2,'0')} / {String(count).padStart(2,'0')}</span></div><ol>{example.steps.map((label,i)=><li key={i} className={i<step?'completed':i===step?'current':'pending'}><span className="ledger-marker">{i<=step?<Check/>:<span/>}</span><span>{label}</span>{i===step&&<span className="ledger-now">{s.currentStep}</span>}</li>)}</ol><p className="ledger-detail" aria-live="polite">{example.details[step]}</p></div><small className="demo-simulation-note">{example.note}</small></div>
 </section>;
}
