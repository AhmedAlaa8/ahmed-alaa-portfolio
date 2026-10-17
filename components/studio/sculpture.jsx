'use client';
import {useEffect,useRef,useState} from 'react';
import {Logo} from './identity';
import {X,ShieldCheck,ShoppingBag,CreditCard,Radio} from 'lucide-react';
import {serviceOrbitContent} from '../../data/service-orbit-content.mjs';
import {createServiceOrbit} from '../../lib/create-service-orbit.mjs';
import {createServiceLabels} from '../../lib/create-service-labels.mjs';
import {createWebGLContext} from '../../lib/create-webgl-context.mjs';

export default function Sculpture({palette,motion,locale}){
 const host=useRef(null),engine=useRef(null),state=useRef({palette,motion,locale});state.current={palette,motion,locale};
 const [focused,setFocused]=useState(false);
 const [ready,setReady]=useState(false),[unavailable,setUnavailable]=useState(false),[stage,setStage]=useState(1);
 const view=useRef({stage,focused});view.current={stage,focused};
 useEffect(()=>{let disposed=false,started=false,visible=false,lite=false,idle=0,cleanup=()=>{};
  const start=async()=>{if(started)return;started=true;let renderer,model,environment,shadow,shadowTexture;
   try{
    const T=await import('../../lib/three-subset.mjs');if(disposed)return;
    const node=host.current;
    // Software rendering uses a lower resolution and frame rate while keeping motion available.
    // Chrome does not always flag SwiftShader as a performance caveat, so the renderer name is checked too.
    const canvas=document.createElement('canvas'),available=createWebGLContext(canvas);
    if(!available){setUnavailable(true);return;}
    lite=available.lite;
    renderer=new T.WebGLRenderer({canvas,context:available.context,...available.attributes});
    if(!lite){const gl=renderer.getContext(),info=gl.getExtension('WEBGL_debug_renderer_info');if(info&&/swiftshader|llvmpipe|softpipe|software|basic render/i.test(gl.getParameter(info.UNMASKED_RENDERER_WEBGL)))lite=true;}
    renderer.setPixelRatio(lite?1:Math.min(window.devicePixelRatio||1,1.5));renderer.setClearColor(0,0);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.12;
    node.prepend(renderer.domElement);renderer.domElement.setAttribute('aria-hidden','true');
    const scene=new T.Scene(),camera=new T.PerspectiveCamera(34,1,.1,30);camera.position.set(2.25,1.45,7.65);camera.lookAt(0,0,0);
    model=createServiceOrbit(T);scene.add(model.group);
    scene.add(new T.HemisphereLight('#fff7ed','#304569',2.6));
    const key=new T.DirectionalLight('#ffffff',4);key.position.set(-3,5,6);scene.add(key);
    const rim=new T.DirectionalLight('#aac8ff',2.4);rim.position.set(4,2,-3);scene.add(rim);
    // Bake a small reflection map once. No HDR download or per-frame reflection rendering.
    const room=new T.Scene();room.background=new T.Color('#c8ced8');const roomGeo=new T.PlaneGeometry(5,5),roomMats=[];
    [[-4,3,2],[3,4,-2],[0,-4,2]].forEach((p,i)=>{const material=new T.MeshBasicMaterial({color:i===1?'#a6bce5':'#ffffff'});roomMats.push(material);const mesh=new T.Mesh(roomGeo,material);mesh.position.set(...p);mesh.lookAt(0,0,0);room.add(mesh);});
    const pmrem=new T.PMREMGenerator(renderer);environment=pmrem.fromScene(room,.12,.1,20,{size:64});scene.environment=environment.texture;scene.environmentIntensity=.7;pmrem.dispose();roomGeo.dispose();roomMats.forEach(m=>m.dispose());
    const c=document.createElement('canvas');c.width=c.height=128;const context=c.getContext('2d'),gradient=context.createRadialGradient(64,64,5,64,64,62);gradient.addColorStop(0,'rgba(25,34,52,0.18)');gradient.addColorStop(1,'rgba(25,34,52,0)');context.fillStyle=gradient;context.fillRect(0,0,128,128);
    shadowTexture=new T.CanvasTexture(c);shadow=new T.Mesh(new T.PlaneGeometry(3.7,2),new T.MeshBasicMaterial({map:shadowTexture,transparent:true,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=-1.62;scene.add(shadow);
    const reduce=matchMedia('(prefers-reduced-motion: reduce)');let raf=0,last=0,seconds=0,tx=0,ty=0,x=0,y=0,lost=false,down=null,slow=0,warm=0;
    const allowed=()=>visible&&!document.hidden&&state.current.motion&&!reduce.matches&&!lost;
    const draw=(now=0)=>{raf=0;if(disposed||lost)return;const delta=last?Math.max(0,(now-last)/1000):0,move=allowed();if(delta<1/(lite?15:30)&&last&&move){raf=requestAnimationFrame(draw);return;}
     // Several consecutive frames over 120 ms switch weak GPUs to the lower frame rate.
     // The first frames are skipped: shader compilation and label uploads make them slow on any GPU.
     if(move&&!lite&&last&&++warm>15){slow=delta>.12?slow+1:0;if(slow>=4){lite=true;renderer.setPixelRatio(1);}}last=now;if(move)seconds+=Math.min(delta,.1);x+=(tx-x)*(move?.13:1);y+=(ty-y)*(move?.13:1);
     model.group.rotation.set(y+(move?Math.sin(seconds*.6)*.018:0),x+(move?Math.sin(seconds*.4)*.055:0),move?Math.sin(seconds*.5)*.012:0);model.group.position.y=move?Math.sin(seconds*.65)*.024:0;model.tick(seconds,move,delta);renderer.render(scene,camera);if(move)raf=requestAnimationFrame(draw);
    };
    const wake=()=>{cancelAnimationFrame(raf);last=0;draw(performance.now());};
    const resize=new ResizeObserver(()=>{const r=node.getBoundingClientRect();if(!r.width||!r.height)return;renderer.setSize(r.width,r.height,false);camera.aspect=r.width/r.height;camera.updateProjectionMatrix();wake();});resize.observe(node);
    const pointer=e=>{if(!allowed()||(e.pointerType==='touch'&&!e.buttons))return;const r=node.getBoundingClientRect();tx=((e.clientX-r.left)/r.width-.5)*.60;ty=((e.clientY-r.top)/r.height-.5)*.23;};
    const leave=()=>{tx=ty=0;},pointerDown=e=>{down={x:e.clientX,y:e.clientY};};
    const ray=new T.Raycaster(),cursor=new T.Vector2();
    const pick=e=>{if(down&&e.detail!==0&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>8)return;if(view.current.focused){setFocused(false);model.setStage(view.current.stage,false);wake();return;}if(e.detail===0){setFocused(true);setStage(current=>(current+1)%4);return;}if(down&&Math.hypot(e.clientX-down.x,e.clientY-down.y)>8)return;const r=node.getBoundingClientRect();cursor.set((e.clientX-r.left)/r.width*2-1,-((e.clientY-r.top)/r.height)*2+1);ray.setFromCamera(cursor,camera);const hit=ray.intersectObjects(model.nodes,true)[0];if(hit){let object=hit.object;while(object&&object.userData.service===undefined)object=object.parent;if(object){model.setStage(object.userData.service,true);setStage(object.userData.service);setFocused(true);wake();}}else {setFocused(true);setStage(current=>(current+1)%4);}};
    const onLost=e=>{e.preventDefault();lost=true;cancelAnimationFrame(raf);setUnavailable(true);};
    const events=[['pointermove',pointer],['pointerleave',leave],['pointerup',leave],['pointercancel',leave],['pointerdown',pointerDown],['click',pick]];events.forEach(([event,handler])=>node.addEventListener(event,handler));renderer.domElement.addEventListener('webglcontextlost',onLost);document.addEventListener('visibilitychange',wake);reduce.addEventListener('change',wake);
    const refreshLabels=()=>{const current=state.current,color=current.palette==='camel'?'#8f5a30':'#2456db';model.setLabels(createServiceLabels(T,serviceOrbitContent[current.locale==='ar'?'ar':'en'].services,color));wake();};
    engine.current={wake,color(v){model.setColor(v==='camel'?'#8f5a30':'#2456db');refreshLabels();},labels:refreshLabels,stage(v,focus=false){model.setStage(v,focus);wake();}};engine.current.color(state.current.palette);document.fonts?.ready.then(()=>{if(!disposed&&!lost)engine.current?.labels();});setReady(true);
    cleanup=()=>{cancelAnimationFrame(raf);resize.disconnect();events.forEach(([event,handler])=>node.removeEventListener(event,handler));document.removeEventListener('visibilitychange',wake);reduce.removeEventListener('change',wake);renderer.domElement.removeEventListener('webglcontextlost',onLost);model.dispose();environment.dispose();shadowTexture.dispose();shadow.geometry.dispose();shadow.material.dispose();renderer.dispose();renderer.domElement.remove();engine.current=null;};wake();
   }catch{model?.dispose();environment?.dispose();shadowTexture?.dispose();shadow?.geometry.dispose();shadow?.material.dispose();renderer?.dispose();renderer?.domElement.remove();if(!disposed)setUnavailable(true);}
  };
  // three.js is the largest download on the page: fetch it only after the page has loaded and gone idle,
  // so it never competes with the text, fonts and styles that make the first paint.
  const whenIdle=()=>{const run=()=>{idle=0;if(visible)start();};idle=window.requestIdleCallback?requestIdleCallback(run,{timeout:2500}):setTimeout(run,200);};
  let loaded=document.readyState==='complete';const onLoad=()=>{loaded=true;whenIdle();};if(loaded)whenIdle();else window.addEventListener('load',onLoad,{once:true});
  const observer=new IntersectionObserver(([entry])=>{visible=entry.isIntersecting;if(visible&&loaded&&!idle)start();engine.current?.wake();});observer.observe(host.current);
  return()=>{disposed=true;observer.disconnect();window.removeEventListener('load',onLoad);if(idle)(window.cancelIdleCallback||clearTimeout)(idle);cleanup();};
 },[]);
 useEffect(()=>engine.current?.stage(stage,focused),[stage,focused,ready]);useEffect(()=>engine.current?.color(palette),[palette]);useEffect(()=>engine.current?.wake(),[motion]);useEffect(()=>engine.current?.labels(),[locale]);
 const ar=locale==='ar',copy=serviceOrbitContent[ar?'ar':'en'],stages=copy.services.map(s=>s.name),detail=copy.services[stage],Icon=[ShieldCheck,ShoppingBag,CreditCard,Radio][stage];
 return <div className="sculpture-wrap flow-sculpture orbit-sculpture" data-focused={focused}><div ref={host} className="sculpture-stage">{(!ready||unavailable)&&<div className="model-fallback" aria-hidden="true"><Logo/></div>}<button className="sculpture-hit" aria-pressed={focused} aria-label={focused?copy.close:(ar?'استكشف مجسّم الخدمات؛ اضغط لاختيار خدمة':'Explore the service sculpture; tap to select a service')}/></div><div className="paper-note flow-note"><small>{ar?'أعمل حاليًا في':'Currently at'}</small><strong>{ar?'ادّخار':'Eddekhar'}</strong></div><div className="flow-stages" aria-label={ar?'الخدمات المصغّرة':'Microservices'}>{stages.map((label,i)=><button key={i} aria-pressed={stage===i} onClick={()=>{const next=!(focused&&stage===i);setStage(i);setFocused(next);engine.current?.stage(i,next);}}><span className="flow-dot"/><span>{label}</span></button>)}</div><div className="service-detail" hidden={!focused} aria-live="polite"><div className="service-detail-heading"><Icon aria-hidden="true"/><strong>{detail.name}</strong><button aria-label={copy.close} onClick={()=>{setFocused(false);engine.current?.stage(stage,false);host.current?.parentElement.querySelectorAll('.flow-stages button')[stage]?.focus();}}><X aria-hidden="true"/></button></div><p>{detail.description}</p><div className="service-detail-tags">{detail.tags.map(tag=><span key={tag}>{tag}</span>)}</div></div><span className="sculpture-hint" aria-live="polite">{unavailable?(ar?'العرض ثلاثي الأبعاد غير متاح على هذا الجهاز':'3D is unavailable on this device'):(ar?`${stages[stage]} · اختر خدمة لتدور حلقتها نحوك`:`${stages[stage]} · Select a service to turn its orbit toward you`)}</span></div>;
}
