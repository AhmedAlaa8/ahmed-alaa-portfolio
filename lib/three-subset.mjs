// Named re-exports let webpack drop the parts of three the sculpture never uses;
// `import('three')` as a namespace kept the whole library in the bundle.
export {
 ACESFilmicToneMapping,CanvasTexture,Color,Curve,DirectionalLight,ExtrudeGeometry,Group,HemisphereLight,
 Matrix4,Mesh,MeshBasicMaterial,MeshStandardMaterial,PerspectiveCamera,PlaneGeometry,PMREMGenerator,
 QuadraticBezierCurve3,Quaternion,Raycaster,Scene,Shape,SphereGeometry,SRGBColorSpace,TubeGeometry,
 Vector2,Vector3,WebGLRenderer,
} from 'three';
