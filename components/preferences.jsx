'use client';
import {createContext,useContext,useEffect,useState} from 'react';
import {Sun,Moon,Pause,Play} from 'lucide-react';
import {portfolioRepository} from '../repositories/portfolio-repository.mjs';
import saFlag from '../public/flags/sa.svg';
import usFlag from '../public/flags/us.svg';
const Preferences=createContext(null);
export function PortfolioPreferences({children,initialLocale='en'}){
 const [locale,setLocaleState]=useState(initialLocale),[theme,setTheme]=useState('light'),[palette,setPalette]=useState('blue'),[motion,setMotion]=useState(true),[ready,setReady]=useState(false);
 useEffect(()=>{try{const t=localStorage.getItem('portfolio-theme');if(t==='dark'||t==='light')setTheme(t);if(localStorage.getItem('portfolio-palette')==='camel')setPalette('camel');if(localStorage.getItem('portfolio-motion')==='off')setMotion(false)}catch{}setReady(true)},[]);
 useEffect(()=>{document.documentElement.lang=locale;document.documentElement.dir=locale==='ar'?'rtl':'ltr';if(ready){document.documentElement.dataset.theme=theme;document.documentElement.dataset.palette=palette}if(ready)try{localStorage.setItem('portfolio-theme',theme);localStorage.setItem('portfolio-palette',palette);localStorage.setItem('portfolio-motion',motion?'on':'off')}catch{}},[locale,theme,palette,motion,ready]);
 function setLocale(value){setLocaleState(value);try{localStorage.setItem('portfolio-language',value)}catch{}const path=value==='ar'?'/ar/':'/';history.pushState({locale:value},'',path+location.search+location.hash)}
 useEffect(()=>{const back=()=>setLocaleState(location.pathname.startsWith('/ar')?'ar':'en');window.addEventListener('popstate',back);return()=>window.removeEventListener('popstate',back)},[]);
 return <Preferences.Provider value={{locale,setLocale,theme,setTheme,palette,setPalette,motion,setMotion,content:portfolioRepository.getContent(locale),projects:portfolioRepository.getProjects(locale),links:portfolioRepository.getLinks()}}>{children}</Preferences.Provider>
}
export function usePortfolio(){return useContext(Preferences)}
export function PreferenceControls(){const {locale,setLocale,theme,setTheme,palette,setPalette,motion,setMotion,content:t}=usePortfolio();return <div className="preference-controls">
 <div className="flag-switch"><button aria-label={locale==='en'?'التبديل إلى العربية':'Switch to English'} onClick={()=>setLocale(locale==='en'?'ar':'en')}><img src={locale==='en'?saFlag.src:usFlag.src} width="23" height="17" alt=""/></button></div>
 <button className="palette-toggle" aria-label={palette==='blue'?t.studio.camel:t.studio.blue} onClick={()=>setPalette(palette==='blue'?'camel':'blue')}><span className="palette-glyph" aria-hidden="true"><i/><i/></span></button>
 <button aria-label={theme==='dark'?t.settings.light:t.settings.dark} onClick={()=>setTheme(theme==='dark'?'light':'dark')}>{theme==='dark'?<Sun/>:<Moon/>}</button>
 <button aria-label={t.settings.motion} aria-pressed={motion} onClick={()=>setMotion(!motion)}>{motion?<Pause/>:<Play/>}</button>
 </div>}
