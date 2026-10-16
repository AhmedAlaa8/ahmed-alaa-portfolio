'use client';
import {useId,useState} from 'react';
import {usePortfolio} from '../preferences';
import {useArtParallax} from '../../hooks/use-art-parallax';

export default function InvestmentArt(){
 const {locale,motion,content}=usePortfolio(),ar=locale==='ar';
 const [redeem,setRedeem]=useState(false),ref=useArtParallax(motion),uid=useId().replaceAll(':',''),fill=`${uid}-investment`;
 const t=content.studio.investmentFlow;
 const steps=redeem?t.redemptionSteps:t.subscriptionSteps;
 return <div ref={ref} className="work-illustration investment-story" data-redeem={redeem}>
  <div className="investment-story-head"><span>{t.heading}</span><div aria-label={t.switchLabel}><button type="button" aria-pressed={!redeem} onClick={()=>setRedeem(false)}>{t.subscribe}</button><button type="button" aria-pressed={redeem} onClick={()=>setRedeem(true)}>{t.redeem}</button></div></div>
  <svg viewBox="0 0 440 214" role="img" aria-label={redeem?t.redemptionDescription:t.subscriptionDescription}>
   <defs><linearGradient id={fill} x1="0" y1="0" x2="1" y2="1"><stop stopColor="var(--art-bright)"/><stop offset="1" stopColor="var(--art-deep)"/></linearGradient></defs>
   <ellipse cx="78" cy="186" rx="61" ry="7" fill="var(--ink)" opacity=".06"/><ellipse cx="222" cy="186" rx="58" ry="7" fill="var(--ink)" opacity=".06"/><ellipse cx="367" cy="186" rx="54" ry="7" fill="var(--ink)" opacity=".06"/>
   <path d="M127 106H166M274 106h35" fill="none" stroke="var(--line)" strokeWidth="2"/>
   <circle cx="147" cy="106" r="4" fill="var(--brand)"/><circle cx="293" cy="106" r="4" fill="var(--brand)"/>
   <g className="investment-cash">
    <path d="m22 84 87-18v86l-87 18Z" fill="var(--art-deep)"/>
    <rect x="26" y="85" width="102" height="85" rx="13" fill={`url(#${fill})`}/>
    <path d="M27 93c0-11 10-16 22-16h55" stroke="var(--art-bright)" strokeWidth="6" fill="none"/>
    <rect x="89" y="109" width="40" height="32" rx="8" fill="var(--art-paper)"/><circle cx="102" cy="125" r="3" fill="var(--art-deep)"/>
    <g fill="var(--card)" stroke="var(--line)"><ellipse cx="62" cy="62" rx="21" ry="8"/><path d="M41 62v12c0 11 42 11 42 0V62"/><ellipse cx="62" cy="74" rx="21" ry="8"/></g>
    <text x="60" y="135" textAnchor="middle" fill="var(--card)" fontSize="15" fontFamily="inherit">{ar?'ريال':'SAR'}</text>
   </g>
   <g>
    <rect x="173" y="34" width="103" height="140" rx="12" fill="var(--art-paper)" transform="rotate(5 224 104)"/>
    <rect x="170" y="30" width="103" height="140" rx="12" fill="var(--card)" stroke="var(--line)"/>
    <text x="186" y="55" fill="var(--sub)" fontSize="11" fontFamily="inherit">{t.order}</text>
    <path d="M185 70h47M185 78h28" stroke="var(--line)" strokeWidth="3" strokeLinecap="round"/>
    <rect x="185" y="90" width="72" height="40" rx="5" fill="var(--soft)"/>
    <path d="m193 120 13-13 13 6 17-17 11 6" fill="none" stroke="var(--brand)" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
    <circle cx="244" cy="150" r="12" fill="var(--brand)"/><path d="m238 150 4 4 8-9" fill="none" stroke="var(--card)" strokeWidth="2"/>
    <path d="M185 147h35" stroke="var(--line)" strokeWidth="3" strokeLinecap="round"/>
   </g>
   <g className="investment-units">
    <rect x="323" y="63" width="98" height="114" rx="12" fill="var(--art-paper)" transform="rotate(7 371 120)"/>
    <rect x="310" y="53" width="98" height="114" rx="12" fill="var(--card)" stroke="var(--line)"/>
    <rect x="319" y="62" width="80" height="33" rx="7" fill={`url(#${fill})`}/>
    <text x="359" y="84" textAnchor="middle" fill="var(--card)" fontSize="14" fontFamily="inherit">{t.units}</text>
    {[0,1,2,3,4,5].map(i=><rect key={i} x={324+(i%3)*23} y={107+Math.floor(i/3)*23} width="16" height="16" rx="4" fill={i<3?'var(--brand)':'var(--art-paper)'}/>)}
   </g>
  </svg>
  <div className="investment-steps" aria-live="polite">{steps.map((step,i)=><div key={`${redeem}-${i}`}><span>{String(i+1).padStart(2,'0')}</span><strong>{step}</strong></div>)}</div>
  <p className="investment-explanation" aria-live="polite">{redeem?t.redemptionDescription:t.subscriptionDescription}</p>
 </div>;
}
