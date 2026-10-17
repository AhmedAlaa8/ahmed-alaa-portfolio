import '@fontsource/bodoni-moda/latin-600.css';
import '@fontsource/cormorant-garamond/latin-600.css';
import '@fontsource/manrope/latin-400.css';
import '@fontsource/manrope/latin-600.css';
import '@fontsource/tajawal/arabic-400.css';
import '@fontsource/tajawal/arabic-700.css';
import './globals.css';
export const metadata={metadataBase:new URL('https://ahmedalaa8.github.io/ahmed-alaa-portfolio/'),title:'Ahmed Alaa — Software Engineer | أحمد علاء',description:'Backend engineering, commerce, payments, bank integrations and investment workflows.',alternates:{languages:{en:'/',ar:'/ar/'}}};
const early="try{var t=localStorage.getItem('portfolio-theme'),p=localStorage.getItem('portfolio-palette');if(t==='dark'||t==='light')document.documentElement.dataset.theme=t;if(p==='camel')document.documentElement.dataset.palette=p;if(location.pathname==='/'&&localStorage.getItem('portfolio-language')==='ar')location.replace('/ar/'+location.search+location.hash)}catch(e){}";
export default function RootDocument({children,locale}){return <html lang={locale} dir={locale==='ar'?'rtl':'ltr'} suppressHydrationWarning><head><script dangerouslySetInnerHTML={{__html:early}}/></head><body>{children}</body></html>}
