/** Native canvas labels for the model's front panels. Drawn on selection/locale changes, never per frame. */
export function createServiceLabels(T,services,color){
 return services.map((service,index)=>{
  const canvas=document.createElement('canvas');canvas.width=512;canvas.height=384;
  const c=canvas.getContext('2d');
  c.fillStyle='#f0ebe1';c.beginPath();c.roundRect(0,0,512,384,38);c.fill();
  c.strokeStyle=color;c.fillStyle=color;c.lineWidth=10;c.lineCap='round';c.lineJoin='round';
  c.save();c.translate(256,109);
  if(index===0){
   c.beginPath();c.moveTo(0,-60);c.lineTo(54,-38);c.lineTo(49,18);c.quadraticCurveTo(37,46,0,65);c.quadraticCurveTo(-37,46,-49,18);c.lineTo(-54,-38);c.closePath();c.stroke();
   c.beginPath();c.moveTo(-23,2);c.lineTo(-5,20);c.lineTo(29,-17);c.stroke();
  }else if(index===1){
   c.beginPath();c.roundRect(-53,-36,106,97,10);c.stroke();c.beginPath();c.moveTo(-25,-35);c.lineTo(-25,-45);c.quadraticCurveTo(-25,-70,0,-70);c.quadraticCurveTo(25,-70,25,-45);c.lineTo(25,-35);c.stroke();
  }else if(index===2){
   c.beginPath();c.roundRect(-68,-42,136,88,12);c.stroke();c.beginPath();c.moveTo(-65,-13);c.lineTo(65,-13);c.stroke();c.beginPath();c.moveTo(-43,22);c.lineTo(-13,22);c.stroke();
  }else{
   c.beginPath();c.moveTo(-50,-32);c.lineTo(0,6);c.lineTo(50,-32);c.moveTo(0,6);c.lineTo(0,55);c.stroke();
   [[-50,-32],[0,6],[50,-32],[0,55]].forEach(([x,y])=>{c.beginPath();c.arc(x,y,13,0,Math.PI*2);c.fill();});
  }
  c.restore();c.fillStyle='#24334b';c.textAlign='center';c.textBaseline='middle';
  c.direction=/[\u0600-\u06ff]/.test(service.name)?'rtl':'ltr';
  c.font='600 59px Tajawal, Manrope, sans-serif';c.fillText(service.name,256,253,460);
  c.fillStyle=color;c.font='500 33px Tajawal, Manrope, sans-serif';c.fillText(service.tags[0],256,325,460);
  const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;return texture;
 });
}
