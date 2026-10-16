export function createWebGLContext(canvas){
 for(const lite of [false,true]){
  const attributes={alpha:true,antialias:!lite,powerPreference:'low-power',failIfMajorPerformanceCaveat:!lite};
  try{
   const context=canvas.getContext('webgl2',attributes);
   if(context)return {context,attributes,lite};
  }catch{}
 }
 return null;
}
