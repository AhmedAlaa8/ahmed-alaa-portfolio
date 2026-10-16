/** Shared contours keep the small vector logo and Three.js sculpture consistent. */
export const aOutline = [[-.88,-1],[-.21,1.04],[.14,1.04],[.88,-1],[.43,-1],[.24,-.43],[-.28,-.43],[-.46,-1]];
export const aCounter = [[-.17,-.08],[.12,-.08],[-.03,.44]];
export const markLayers = [
  {name:'rear',x:.55,y:.10,z:-.25,split:[1,.25,-.55]},
  {name:'front',x:-.55,y:-.06,z:.24,split:[-1,-.15,.45]},
];
export const aSvgPath = [aOutline,aCounter].map(points=>'M'+points.map(p=>p.join(',')).join('L')+'Z').join('');
