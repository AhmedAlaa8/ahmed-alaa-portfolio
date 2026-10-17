'use client';
import {useEffect,useRef,useState} from 'react';
import {usePortfolio} from '../preferences';
import php from '../../public/toolkit/php.svg';
import javascript from '../../public/toolkit/javascript.svg';
import python from '../../public/toolkit/python.svg';
import cplusplus from '../../public/toolkit/cplusplus.svg';
import laravel from '../../public/toolkit/laravel.svg';
import nestjs from '../../public/toolkit/nestjs.svg';
import nodejs from '../../public/toolkit/nodejs.svg';
import docker from '../../public/toolkit/docker.svg';
import git from '../../public/toolkit/git.svg';
import cicd from '../../public/toolkit/cicd.svg';
import linux from '../../public/toolkit/linux.svg';
import postgresql from '../../public/toolkit/postgresql.svg';
const icons={php,javascript,python,cplusplus,laravel,nestjs,nodejs,docker,git,cicd,linux,postgresql};
const languages=[['PHP','php'],['JavaScript','javascript'],['Python','python'],['C++','cplusplus']];
const tools=[['Laravel','laravel'],['NestJS','nestjs'],['Node.js','nodejs'],['Docker','docker'],['Git','git'],['CI/CD','cicd'],['Linux','linux'],['PostgreSQL','postgresql']];
function Rail({items,reverse}){return <div className="skill-rail"><div className={`rail-track ${reverse?'reverse':''}`}>{[0,1].map(copy=><div className="rail-group" key={copy} aria-hidden={copy===1?true:undefined}>{items.map(([label,slug])=><span className="tool" key={slug}><img src={icons[slug].src} width="32" height="32" alt=""/><bdi>{label}</bdi></span>)}</div>)}</div></div>}
export default function Toolkit(){const {content:t,motion}=usePortfolio();const host=useRef(null),[visible,setVisible]=useState(false);useEffect(()=>{const observer=new IntersectionObserver(([e])=>setVisible(e.isIntersecting));observer.observe(host.current);const hide=()=>{if(document.hidden)setVisible(false);else setVisible(host.current.getBoundingClientRect().top<innerHeight&&host.current.getBoundingClientRect().bottom>0)};document.addEventListener('visibilitychange',hide);return()=>{observer.disconnect();document.removeEventListener('visibilitychange',hide)}},[]);return <section className="section toolkit-section" ref={host} data-running={motion&&visible}><div className="section-head"><span className="eyebrow">03 / {t.profile.tabs[2]}</span><h2>{t.studio.toolkit}</h2></div><p className="rail-label">{t.studio.languages}</p><Rail items={languages}/><p className="rail-label">{t.studio.tools}</p><Rail items={tools} reverse/><div className="skill-foot"><p>REST APIs <span>·</span> {t.skills[1].items[1]}</p><p><small>{t.profile.basic}</small> Kubernetes <span>·</span> {t.profile.cloud}</p></div></section>}
