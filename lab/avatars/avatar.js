/* Reach avatars: custom-geometry characters on the game's joint rig. Generated from the avatar lab. Needs THREE r128. */
(function(){
'use strict';
const T=THREE;
/* ---------- toon materials + outline ---------- */
const grad=(()=>{const d=new Uint8Array([150,188,224,255]);const t=new T.DataTexture(d,4,1,T.LuminanceFormat);t.minFilter=t.magFilter=T.NearestFilter;t.needsUpdate=true;return t})();
const toon=c=>new T.MeshToonMaterial({color:c,gradientMap:grad});
const outCache={};
function outM(th){const k=th.toFixed(4);if(!outCache[k]){const m=new T.MeshBasicMaterial({color:0x2a1d1f,side:T.BackSide});
  m.onBeforeCompile=s=>{s.vertexShader=s.vertexShader.replace('#include <begin_vertex>','vec3 transformed = position + normalize(normal) * '+th.toFixed(5)+';')};outCache[k]=m}return outCache[k]}
const gradFine=(()=>{const d=new Uint8Array([150,162,176,190,204,218,236,255]);const t=new T.DataTexture(d,8,1,T.LuminanceFormat);t.minFilter=t.magFilter=T.NearestFilter;t.needsUpdate=true;return t})();
function makeMats(){const MAT={skin:new T.MeshToonMaterial({color:0xc68a5e,gradientMap:gradFine}),hair:toon(0x2b1b14),top:toon(0x2f6f8f),collar:toon(0x24586f),bottom:toon(0x3a5a86),shoe:toon(0xf2f2f2),sole:toon(0x8a8a8a),lip:toon(0xb04a52),white:toon(0xf7f3ee),dark:toon(0x2a1d1f),shirtW:toon(0xf4f1ea),tie:toon(0x7a1f2b),belt:toon(0x2a1d18),buckle:toon(0xc9c9cf),hem:toon(0x2c4a78),pants:toon(0x262b3d),mouth:new T.MeshBasicMaterial({color:0x3a1216})};
MAT.skinD=new T.MeshToonMaterial({gradientMap:gradFine});MAT.skinD.color=MAT.skin.color;
['collar','shirtW','tie','belt','skinD'].forEach(k=>MAT[k].side=T.DoubleSide);
return MAT}
let MAT=makeMats();
function weld(g){g.computeVertexNormals();const p=g.attributes.position,n=g.attributes.normal,m=new Map(),K=v=>Math.round(v*5e3);
  for(let i=0;i<p.count;i++){const k=K(p.getX(i))+','+K(p.getY(i))+','+K(p.getZ(i));let e=m.get(k);if(!e){e=[0,0,0,[]];m.set(k,e)}e[0]+=n.getX(i);e[1]+=n.getY(i);e[2]+=n.getZ(i);e[3].push(i)}
  m.forEach(e=>{const l=Math.hypot(e[0],e[1],e[2])||1;e[3].forEach(i=>n.setXYZ(i,e[0]/l,e[1]/l,e[2]/l))});n.needsUpdate=true;return g}
let NOOL=false,HSEG=[36,26];
function mk(parent,geo,mat,x=0,y=0,z=0,ol=0){const m=new T.Mesh(geo,mat);m.position.set(x,y,z);parent.add(m);if(ol&&!NOOL){const o=new T.Mesh(geo,outM(ol));o.renderOrder=-1;m.add(o)}return m}

/* ---------- loft: smooth shape from cross-sections ---------- */
const cr=(a,b,c,d,t)=>{const t2=t*t,t3=t2*t;return .5*((2*b)+(-a+c)*t+(2*a-5*b+4*c-d)*t2+(-a+3*b-3*c+d)*t3)};
const GSCALE=1.28;
let LQ=.55;
function loft(L,seg=32,dense=4,capBottom=true,capTop=true){
  seg=Math.max(10,Math.round(seg*LQ));dense=Math.max(2,Math.round(dense*LQ+.3));
  const ch=['y','rx','rz','cx','cz'],lv=L.map(l=>Object.assign({cx:0,cz:0,p:2},l)),R=[];
  for(let i=0;i<lv.length-1;i++)for(let s=0;s<dense;s++){const t=s/dense,a=lv[Math.max(i-1,0)],b=lv[i],c=lv[i+1],d=lv[Math.min(i+2,lv.length-1)],o={};
    ch.forEach(k=>o[k]=cr(a[k],b[k],c[k],d[k],t));o.p=b.p+(c.p-b.p)*t;R.push(o)}
  R.push(lv[lv.length-1]);
  const pos=[],idx=[];
  R.forEach(r=>{for(let j=0;j<seg;j++){const a=j/seg*Math.PI*2,ca=Math.cos(a),sa=Math.sin(a),e=2/r.p;
    pos.push(r.cx+r.rx*Math.sign(ca)*Math.pow(Math.abs(ca),e),r.y,r.cz+r.rz*Math.sign(sa)*Math.pow(Math.abs(sa),e))}});
  for(let i=0;i<R.length-1;i++)for(let j=0;j<seg;j++){const a=i*seg+j,b=i*seg+(j+1)%seg,c=(i+1)*seg+j,d=(i+1)*seg+(j+1)%seg;idx.push(a,c,b,b,c,d)}
  const f=R[0],l=R[R.length-1];
  if(capBottom){const ci=pos.length/3;pos.push(f.cx,f.y,f.cz);for(let j=0;j<seg;j++)idx.push(ci,j,(j+1)%seg)}
  if(capTop){const ci=pos.length/3,o=(R.length-1)*seg;pos.push(l.cx,l.y,l.cz);for(let j=0;j<seg;j++)idx.push(ci,o+(j+1)%seg,o+j)}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);return weld(g)}
/* tapered limb along -Y from y=0 to y=-len. prof: [[t,rx,rz?],...] t in 0..1 */
function limb(len,prof,seg=24){return loft(prof.map(p=>({y:-len*p[0],rx:p[1],rz:p[2]||p[1]})).reverse(),seg,5)}

/* ---------- sweep: tube with elliptical, varying section along a curve ---------- */
class Sweep{
  constructor(n=16,seg=8){this.n=n;this.seg=seg;const V=(n+1)*seg+2;this.pos=new Float32Array(V*3);this.g=new T.BufferGeometry();
    this.g.setAttribute('position',new T.BufferAttribute(this.pos,3).setUsage(T.DynamicDrawUsage));this.flip=null;this.set0=false}
  build(flip){const n=this.n,s=this.seg,idx=[];
    for(let i=0;i<n;i++)for(let j=0;j<s;j++){const a=i*s+j,b=i*s+(j+1)%s,c=(i+1)*s+j,d=(i+1)*s+(j+1)%s;flip?idx.push(a,b,c,b,d,c):idx.push(a,c,b,b,c,d)}
    const c0=(n+1)*s,c1=c0+1;for(let j=0;j<s;j++){flip?idx.push(c0,(j+1)%s,j):idx.push(c0,j,(j+1)%s);const o=n*s;flip?idx.push(c1,o+j,o+(j+1)%s):idx.push(c1,o+(j+1)%s,o+j)}
    this.g.setIndex(idx)}
  set(pts,r1,r2){const n=this.n,s=this.seg,P=new T.CatmullRomCurve3(pts).getPoints(n),p=this.pos;
    const tg=P.map((_,i)=>P[Math.min(i+1,n)].clone().sub(P[Math.max(i-1,0)]).normalize());
    const ref=Math.abs(tg[0].y)<.9?new T.Vector3(0,1,0):new T.Vector3(1,0,0);let N=ref.clone().sub(tg[0].clone().multiplyScalar(ref.dot(tg[0]))).normalize();
    for(let i=0;i<=n;i++){const u=i/n;N=N.clone().sub(tg[i].clone().multiplyScalar(N.dot(tg[i]))).normalize();const B=new T.Vector3().crossVectors(tg[i],N),a1=r1(u),a2=r2(u);
      for(let j=0;j<s;j++){const a=j/s*Math.PI*2,c=Math.cos(a)*a1,d=Math.sin(a)*a2,k=(i*s+j)*3;p[k]=P[i].x+N.x*c+B.x*d;p[k+1]=P[i].y+N.y*c+B.y*d;p[k+2]=P[i].z+N.z*c+B.z*d}}
    const k0=(n+1)*s*3;p[k0]=P[0].x;p[k0+1]=P[0].y;p[k0+2]=P[0].z;p[k0+3]=P[n].x;p[k0+4]=P[n].y;p[k0+5]=P[n].z;
    if(this.flip===null){ // pick the winding that faces outward
      this.build(false);const q=this.g;q.attributes.position.needsUpdate=true;q.computeVertexNormals();const m=Math.floor(n/2)*s,nn=q.attributes.normal;
      const c=new T.Vector3(P[Math.floor(n/2)].x,P[Math.floor(n/2)].y,P[Math.floor(n/2)].z),v=new T.Vector3(p[m*3],p[m*3+1],p[m*3+2]).sub(c),nv=new T.Vector3(nn.getX(m),nn.getY(m),nn.getZ(m));
      this.flip=nv.dot(v)<0;if(this.flip)this.build(true)}
    this.g.attributes.position.needsUpdate=true;weld(this.g);this.g.computeBoundingSphere()}
}

/* ---------- head shape ---------- */
const FEM={sex:'f',scale:1,shX:.176,legX:.093,armK:.95,legK:1,handK:1,jaw:.36,browK:.8,browY:.004,lipK:1.2,lip:0xb04a52,eyeK:1.08,lash:.0024,noseK:.9,earK:.9,bust:true,adam:false,head:{sx:.092,sy:.118,sz:.103},
  torso:[{y:-.12,rx:.150,rz:.105},{y:.02,rx:.118,rz:.084},{y:.10,rx:.112,rz:.082},{y:.20,rx:.128,rz:.092},{y:.30,rx:.142,rz:.108,cz:.004},{y:.38,rx:.150,rz:.100},{y:.44,rx:.142,rz:.090},{y:.50,rx:.104,rz:.076},{y:.56,rx:.060,rz:.058},{y:.60,rx:.048,rz:.048}],
  neck:[{y:.46,rx:.054,rz:.054},{y:.56,rx:.037,rz:.040},{y:.66,rx:.035,rz:.039},{y:.74,rx:.035,rz:.039}],
  pelvis:[{y:-.16,rx:.152,rz:.110},{y:-.06,rx:.170,rz:.120},{y:.04,rx:.150,rz:.106},{y:.12,rx:.124,rz:.090}]};
const MAN={sex:'m',scale:1.06,shX:.246,legX:.084,armK:1.26,legK:1.12,handK:1.18,jaw:.07,browK:2.1,browY:-.005,lipK:.62,lip:0x8a5048,eyeK:.88,lash:.0005,noseK:1.28,earK:1.2,bust:false,adam:true,head:{sx:.108,sy:.128,sz:.116},
  torso:[{y:-.12,rx:.150,rz:.108},{y:.02,rx:.158,rz:.106},{y:.10,rx:.165,rz:.108},{y:.20,rx:.188,rz:.116},{y:.30,rx:.198,rz:.124},{y:.38,rx:.208,rz:.120},{y:.44,rx:.198,rz:.106},{y:.48,rx:.168,rz:.098},{y:.52,rx:.126,rz:.086},{y:.56,rx:.086,rz:.07},{y:.60,rx:.066,rz:.06}],
  neck:[{y:.46,rx:.078,rz:.072},{y:.56,rx:.058,rz:.057},{y:.66,rx:.056,rz:.055},{y:.74,rx:.056,rz:.055}],
  pelvis:[{y:-.16,rx:.146,rz:.108},{y:-.06,rx:.150,rz:.114},{y:.04,rx:.148,rz:.108},{y:.12,rx:.130,rz:.096}]};
const grow=(c,t,p,a,l,n)=>{c.torso=c.torso.map(x=>Object.assign({},x,{rx:x.rx*t,rz:x.rz*t}));c.pelvis=c.pelvis.map(x=>Object.assign({},x,{rx:x.rx*p,rz:x.rz*p}));c.neck=c.neck.map(x=>Object.assign({},x,{rx:x.rx*n,rz:x.rz*n}));c.shX*=t;c.legX*=p;c.armK*=a;c.legK*=l};
grow(MAN,1.1,1.1,1.12,1.1,1.1);grow(FEM,1.07,1.08,1.1,1.12,1.05);FEM.pelvis=[{y:-.22,rx:.1,rz:.095,cz:-.01},{y:-.14,rx:.17,rz:.13,cz:-.022},{y:-.06,rx:.192,rz:.14,cz:-.026},{y:.03,rx:.162,rz:.118,cz:-.02},{y:.12,rx:.128,rz:.092,cz:-.004}];
FEM.torso[0].cz=-.014;FEM.torso[1].cz=-.008;FEM.legX=.1;FEM.legK=1.2;
MAN.shX=.186;MAN.armK=1.2;MAN.legK=1.08;MAN.legX=.088;
MAN.torso=[{y:-.12,rx:.165,rz:.119},{y:.02,rx:.174,rz:.117},{y:.10,rx:.182,rz:.119},{y:.20,rx:.198,rz:.125},{y:.30,rx:.205,rz:.13},{y:.38,rx:.206,rz:.128},{y:.43,rx:.204,rz:.118},{y:.47,rx:.184,rz:.106},{y:.51,rx:.14,rz:.094},{y:.55,rx:.098,rz:.08},{y:.60,rx:.072,rz:.066}];

let CFG=FEM;
const HS={sx:.094,sy:.118,sz:.104,cy:.2};
const jawW=uy=>{const t=Math.max(0,-uy);return 1-CFG.jaw*Math.pow(t,1.6)+.035*Math.exp(-Math.pow((uy+.35)/.3,2))+(CFG.cheek||0)*Math.exp(-Math.pow((uy+.22)/.26,2))+(CFG.fore||0)*Math.exp(-Math.pow((uy-.5)/.3,2))};
const limbK=(k,len,prof,seg)=>limb(len,prof.map(p=>[p[0],p[1]*k,(p[2]||p[1])*k]),seg);
function headPt(ux,uy,uz){const t=Math.max(0,-uy),w=jawW(uy);let z=uz*HS.sz*(1-.12*t*t);
  if(uz>0){z+=.012*t*t*uz+(CFG.chin||0)*Math.pow(t,3)*uz+(CFG.cheekZ||0)*Math.exp(-Math.pow((uy+.2)/.25,2))*uz;if(uz>.2)z*=1-.04*(1-uy*uy)}else z*=1.07;
  return [ux*HS.sx*w,uy*HS.sy+HS.cy,z]}
function surfZ(x,y){const uy=(y-HS.cy)/HS.sy;if(Math.abs(uy)>=1)return 0;const ux=x/(HS.sx*jawW(uy)),r=1-ux*ux-uy*uy;return r<=0?0:headPt(ux,uy,Math.sqrt(r))[2]}
function headGeo(grow=0,sc=1,keep=null){const g=new T.SphereGeometry(1,HSEG[0],HSEG[1]),p=g.attributes.position;
  for(let i=0;i<p.count;i++){const q=headPt(p.getX(i),p.getY(i),p.getZ(i));let x=q[0],y=q[1]-HS.cy,z=q[2];if(grow||sc!==1){const l=Math.hypot(x,y,z)||1;x=x*sc+x/l*grow;y=y*sc+y/l*grow;z=z*sc+z/l*grow}p.setXYZ(i,x,y+HS.cy,z)}
  if(keep){const ix=g.index.array,nx=[];const ok=[];for(let i=0;i<p.count;i++){ok[i]=keep(g.attributes.position.getX(i),g.attributes.position.getY(i)-HS.cy,g.attributes.position.getZ(i))}
    for(let i=0;i<ix.length;i+=3)if(ok[ix[i]]&&ok[ix[i+1]]&&ok[ix[i+2]])nx.push(ix[i],ix[i+1],ix[i+2]);g.setIndex(nx)}
  return weld(g)}

/* ---------- character ---------- */
const HIP=.9,CY=.96,HY=.56;
function buildChar(){
  const g=new T.Group(),b=new T.Group();g.add(b);
  const P=new T.Group();P.position.set(0,HIP,0);b.add(P);
  const C=new T.Group();C.position.set(0,CY,0);b.add(C);
  const H=new T.Group();H.position.set(0,HY,0);C.add(H);const HR=new T.Group();HR.position.set(0,-.034,0);H.add(HR);
  const OL=.0042;
  // torso (C space): shoulders, bust, waist
  mk(C,loft(CFG.torso,36,4),MAT.skin,0,0,0,OL);
  // neck
  mk(C,loft(CFG.neck,24,4),MAT.skin,0,0,.004,OL);
  if(CFG.bust)[-1,1].forEach(s=>{const bs=mk(C,new T.SphereGeometry(.05,18,14),MAT.skin,s*.064,.29,.062);bs.scale.set(1,.95,.85)});
  if(CFG.adam)mk(C,new T.SphereGeometry(.011,10,8),MAT.skin,0,.6,.05);
  // pelvis (P space)
  const pelM=mk(P,loft(CFG.pelvis.length>4?CFG.pelvis.slice(1):CFG.pelvis,36,4),MAT.skin,0,0,0,OL);
  // head
  const head=mk(HR,headGeo(),MAT.skin,0,0,0,OL);
  [-1,1].forEach(s=>{const e=mk(HR,new T.SphereGeometry(1,16,12),MAT.skin,s*(HS.sx*jawW(0)-.001),.2,-.004);e.scale.set(.010*CFG.earK,.026*CFG.earK,.017*CFG.earK);e.rotation.y=s*.25});
  // nose
  const nz=surfZ(0,.17)+(CFG.noseLen||0)*.5-.004;
  const nose=new Sweep(8,8);nose.set([new T.Vector3(0,.214,surfZ(0,.214)-.003),new T.Vector3(0,.19,surfZ(0,.19)+.002),new T.Vector3(0,.166,nz+.0105)],u=>(.0050+.0026*u)*CFG.noseK,u=>(.0064+.0040*u)*CFG.noseK);mk(HR,nose.g,MAT.skin);
  mk(HR,new T.SphereGeometry(.0115*CFG.noseK,14,10),MAT.skin,0,.160+(CFG.noseUp||0),nz+.009).scale.set(1+(CFG.noseW||0)*.5,.86,1.0);
  [-1,1].forEach(s=>{const w=mk(HR,new T.SphereGeometry(.0068*CFG.noseK*(1+(CFG.noseW||0)*.4),12,8),MAT.skin,s*(.0098*CFG.noseK+(CFG.noseW||0)*.014),.156+(CFG.noseUp||0),nz+.003);w.scale.set(1,.9,.9)});
  // eyes
  const eyes=[];
  [-1,1].forEach(s=>{const e=new T.Group(),ex=s*.044*(CFG.eyeX||1),ey=.212+(CFG.eyeY||0);e.position.set(ex,ey,surfZ(ex,ey)-.0095);e.rotation.z=-s*(CFG.tilt||0);e.scale.set(CFG.eyeW||1,CFG.eyeH||1,.72);HR.add(e);
    const r=.0185*CFG.eyeK;mk(e,new T.SphereGeometry(r,20,14),MAT.white);
    const iris=toon(CFG.iris||0x5b3a24);const ir=mk(e,new T.SphereGeometry(r*1.006,20,10,0,Math.PI*2,0,.62),iris);ir.rotation.x=Math.PI/2;
    const pu=mk(e,new T.SphereGeometry(r*1.012,16,8,0,Math.PI*2,0,.26),MAT.dark);pu.rotation.x=Math.PI/2;
    const hl=mk(e,new T.SphereGeometry(r*1.02,10,6,0,Math.PI*2,0,.1),new T.MeshBasicMaterial({color:0xffffff}));hl.rotation.x=Math.PI/2+.5;hl.rotation.y=.55*s;
    const lid=new T.Group();e.add(lid);const sh=mk(lid,new T.SphereGeometry(r*1.075,20,12,0,Math.PI*2,0,Math.PI/2),MAT.skin);
    const lash=new T.Mesh(new T.TorusGeometry(r*1.075,CFG.lash,6,28,Math.PI),MAT.dark);lash.rotation.x=Math.PI/2;lid.add(lash);
    const low=new T.Group();e.add(low);const sl=mk(low,new T.SphereGeometry(r*1.07,20,12,0,Math.PI*2,Math.PI/2+.62,Math.PI/2*.4),MAT.skin);
    eyes.push({e,lid,low,iris:[ir,pu,hl],sx:s})});
  // brows, lips, mouth
  const brows=[-1,1].map(s=>{const w=new Sweep(10,6);mk(HR,w.g,MAT.hair);return {w,s}});
  const lipU=new Sweep(14,8),lipL=new Sweep(14,8);mk(HR,lipU.g,MAT.lip);mk(HR,lipL.g,MAT.lip);
  const mouth=mk(HR,new T.CircleGeometry(1,20),MAT.mouth,0,.122,surfZ(0,.122)-.004);mouth.scale.set(.021,.001,1);mouth.visible=false;
  // arms (C space) and legs (P space)
  const arm=s=>{const p=new T.Group();p.position.set(s*CFG.shX,.42,0);C.add(p);
    mk(p,new T.SphereGeometry(.041*CFG.armK,16,12),MAT.skin,0,0,0,0).scale.set(1,CFG.sex==='m'?.78:1,1);
    mk(p,limbK(CFG.armK,.31,[[0,.046],[.3,.043],[.7,.037],[1,.034]]),MAT.skin,0,0,0,OL);
    const k=new T.Group();k.position.set(0,-.31,0);p.add(k);
    mk(k,new T.SphereGeometry(.0345*CFG.armK,14,10),MAT.skin,0,0,0,0);
    mk(k,limbK(CFG.armK,.28,[[0,.034],[.25,.033],[.7,.026],[1,.021]]),MAT.skin,0,0,0,OL);
    // hand: palm, four fingers, thumb
    const h=new T.Group();h.position.set(0,-.29,0);h.scale.setScalar(CFG.handK);k.add(h);
    mk(h,loft([{y:.004,rx:.020,rz:.015},{y:-.035,rx:.030,rz:.0205},{y:-.075,rx:.030,rz:.0185}],14,3),MAT.skin,0,0,0,0);
    [-.0225,-.0075,.0075,.0225].forEach((fx,i)=>{const len=[.055,.065,.06,.045][i];const f=mk(h,limb(len*.92,[[0,.0095],[.6,.0085],[1,.0062]],8),MAT.skin,fx,-.07,.002);f.rotation.x=.5})
    const th=mk(h,limb(.045,[[0,.0115],[1,.0072]],8),MAT.skin,-s*.03,-.03,.008);th.rotation.z=s*.9;th.rotation.x=-.2;
    return {p,k,h}};
  const leg=s=>{const p=new T.Group();p.position.set(s*CFG.legX,0,0);P.add(p);
    mk(p,limbK(CFG.legK,.43,[[0,.07],[.14,.082],[.6,.065],[1,.049]]),MAT.skin,0,0,0,OL);
    const k=new T.Group();k.position.set(0,-.43,0);p.add(k);
    mk(k,new T.SphereGeometry(.049*CFG.legK,14,10),MAT.skin,0,0,0,0);
    mk(k,limbK(CFG.legK,.41,[[0,.049],[.18,.054],[.6,.038],[1,.031]]),MAT.skin,0,0,0,OL);
    // sneaker
    const sh=new T.SphereGeometry(1,22,14),sp=sh.attributes.position;
    for(let i=0;i<sp.count;i++){let x=sp.getX(i)*.040,y=sp.getY(i)*.043,z=sp.getZ(i)*.108;if(y<-.018)y=-.018-(-y-.018)*.15;if(z>0)x*=1-.35*(z/.108)*(z/.108);sp.setXYZ(i,x,y,z)}
    const shoe=mk(k,weld(sh),MAT.shoe,0,-.402,.034,OL*.8);shoe.scale.set(CFG.legK,1,CFG.legK*1.04);
    const sole=mk(k,new T.BoxGeometry(.07,.012,.2),MAT.sole,0,-.438,.04);sole.visible=false;
    return {p,k}};
  const hairG=new T.Group();HR.add(hairG);
  const cloth={C:new T.Group(),P:new T.Group()};C.add(cloth.C);P.add(cloth.P);
  const aL=arm(-1),aR=arm(1),lL=leg(-1),lR=leg(1);
  const cg=()=>new T.Group();
  const clothJ={aLp:cg(),aLk:cg(),aRp:cg(),aRk:cg(),lLp:cg(),lLk:cg(),lRp:cg(),lRk:cg()};
  aL.p.add(clothJ.aLp);aL.k.add(clothJ.aLk);aR.p.add(clothJ.aRp);aR.k.add(clothJ.aRk);lL.p.add(clothJ.lLp);lL.k.add(clothJ.lLk);lR.p.add(clothJ.lRp);lR.k.add(clothJ.lRk);
  const c={skinPelvis:pelM,g,b,P,C,H,aL,aR,lL,lR,eyes,brows,lipU,lipL,mouth,hairG,cloth,clothJ,
    ph:0,po:1.3,wk:0,nb:2,bt:0,hy:0,hp:0,mood:.2,moodT:.2,mo:0,seat:false,
    s:{al:0,ar:0,alz:-.06,arz:.06,el:-.1,er:-.1,tl:0,tr:0,kl:0,kr:0,lean:0,cy:0,hpS:0},look:null};
  return c}

/* ---------- clothes ---------- */
function clear(g){while(g.children.length){const o=g.children.pop();o.traverse(m=>{})}}
function setOutfitFold(c,o){
  clear(c.cloth.C);clear(c.cloth.P);Object.values(c.clothJ).forEach(clear);
  const OL=.004,d=.007;
  // top
  if(o.top!=='none'){
    const hem=o.top==='crop'?.1:-.04,TT=CFG.torso,at=y=>{for(let i=0;i<TT.length-1;i++)if(y<=TT[i+1].y){const t=(y-TT[i].y)/(TT[i+1].y-TT[i].y);return {rx:TT[i].rx+(TT[i+1].rx-TT[i].rx)*t,rz:TT[i].rz+(TT[i+1].rz-TT[i].rz)*t}}return TT[TT.length-1]},h0=at(hem),
      lv=[{y:hem,rx:h0.rx+d,rz:h0.rz+d}].concat(TT.filter(l=>l.y>hem&&l.y<=.44).map(l=>({y:l.y,rx:l.rx+d,rz:l.rz+d,cz:l.cz||0})));
    const male=CFG.sex==='m'&&o.top!=='tank'&&o.top!=='crop';
    if(o.top==='tank'){lv.push({y:.47,rx:.115,rz:.086},{y:.5,rx:.092,rz:.07})}
    else if(male){[.48,.52,.545,.565].forEach(y=>{const k=at(y);lv.push({y,rx:k.rx+d+(y>.5?.004:0),rz:k.rz+d+(y>.5?.004:0)})})}
    else{lv.push({y:.5,rx:CFG.torso[7].rx-.008+d,rz:CFG.torso[7].rz-.004+d})}
    mk(c.cloth.C,loft(lv,36,4,true,false),MAT.top,0,0,0,OL);
    if(male){const k=at(.565),rx=k.rx+d+.004,rz=k.rz+d+.004;
      mk(c.cloth.C,loft([{y:.556,rx:rx+.003,rz:rz+.003},{y:.575,rx:rx-.004,rz:rz-.004},{y:.592,rx:rx-.012,rz:rz-.012}],36,3,false,false),MAT.collar,0,0,0,OL*.8);
      if(o.top==='polo'){ // placket and two collar points
        mk(c.cloth.C,new T.BoxGeometry(.016,.13,.006),MAT.collar,0,.50,rz-.002);
        [-1,1].forEach(sx=>{const f=mk(c.cloth.C,new T.BoxGeometry(.05,.034,.006),MAT.collar,sx*.034,.552,rz+.004);f.rotation.z=-sx*.7;f.rotation.x=-.22})}}
    if(CFG.bust&&o.top!=='tank')[-1,1].forEach(sx=>{const bs=mk(c.cloth.C,new T.SphereGeometry(.057,18,14),MAT.top,sx*.064,.29,.062);bs.scale.set(1,.95,.85)});
    if(o.top==='tee'||o.top==='polo'||o.top==='long'){[['aLp'],['aRp']].forEach(a=>mk(c.clothJ[a[0]],new T.SphereGeometry(.048*CFG.armK,14,10),MAT.top));
      const len=o.top==='long'?.31:.13;
      [['aLp','aLk'],['aRp','aRk']].forEach(a=>{mk(c.clothJ[a[0]],limbK(CFG.armK,len,[[0,.05],[.3*(.31/len),.046],[1,o.top==='long'?.040:.043]].map(r=>[Math.min(1,r[0]),r[1],r[2]])),MAT.top,0,0,0,OL);
        if(o.top==='long'){mk(c.clothJ[a[1]],limbK(CFG.armK,.26,[[0,.039],[.3,.036],[1,.027]]),MAT.top,0,0,0,OL);mk(c.clothJ[a[1]],new T.SphereGeometry(.039*CFG.armK,12,8),MAT.top)}})}
  }
  // bottom
  const bm=MAT.bottom;
  if(o.bottom==='jeans'||o.bottom==='shorts'){
    mk(c.cloth.P,loft(CFG.pelvis.map(l=>({y:l.y,rx:l.rx+.011,rz:l.rz+.009})),36,4),bm,0,0,0,OL);
    ['lLp','lRp'].forEach((j,i)=>{const long=o.bottom==='jeans';
      mk(c.clothJ[j],limbK(CFG.legK,long?.43:.2,long?[[0,.074],[.14,.089],[.6,.071],[1,.056]]:[[0,.074],[.2,.089],[.5,.088],[1,.08]]),bm,0,0,0,OL);
      if(long){const k=c.clothJ[i?'lRk':'lLk'];mk(k,new T.SphereGeometry(.056*CFG.legK,12,8),bm);mk(k,limbK(CFG.legK,.4,[[0,.056],[.18,.059],[.6,.046],[1,.042]]),bm,0,0,0,OL)}})
  }else if(o.bottom==='skirt'){
    mk(c.cloth.P,loft([{y:-.34,rx:.255,rz:.215},{y:-.2,rx:.23,rz:.19},{y:-.08,rx:.19,rz:.145},{y:.04,rx:.156,rz:.112},{y:.10,rx:.13,rz:.096}],40,4),bm,0,0,0,OL);
  }
  // sneakers
  c.setSneakers&&c.setSneakers();
}


/* one-piece skinned bottoms: pelvis + legs blend smoothly so nothing floats in front of a swinging thigh */
function setLegSkin(c,v){[c.lL,c.lR].forEach(l=>{l.p.children[0].visible=v;l.k.children[0].visible=v;l.k.children[1].visible=v})}
const taperPel=L=>{const a=L[0];return [{y:a.y-.075,rx:a.rx*.2,rz:a.rz*.35,cz:a.cz||0},{y:a.y-.05,rx:a.rx*.5,rz:a.rz*.7,cz:a.cz||0},{y:a.y-.022,rx:a.rx*.82,rz:a.rz*.93,cz:a.cz||0}].concat(L)};
function dropBones(c){if(c.skinPelvis)c.skinPelvis.visible=true;setLegSkin(c,true);(c._bones||[]).forEach(b=>b.parent&&b.parent.remove(b));c._bones=null}
const OL_SKIN=.004,OLS=new T.MeshBasicMaterial({color:0x2a1d1f,side:T.BackSide});
function skinBottom(c,groups){
  dropBones(c);
  const lx=c.lL.p.position.x,rx=c.lR.p.position.x,ky=c.lL.k.position.y;
  const ss=(a,b,x)=>{const t=Math.max(0,Math.min(1,(x-a)/(b-a)));return t*t*(3-2*t)};
  const bones=[0,1,2,3,4].map(()=>new T.Bone());
  c.P.add(bones[0]);c.lL.p.add(bones[1]);c.lL.k.add(bones[2]);c.lR.p.add(bones[3]);c.lR.k.add(bones[4]);c._bones=bones;
  c.g.updateMatrixWorld(true);
  const Wp=c.P.matrixWorld.clone(),tr=(x,y)=>new T.Matrix4().makeTranslation(x,y,0);
  const Rm=[tr(0,0),tr(lx,0),tr(lx,ky),tr(rx,0),tr(rx,ky)];
  const skel=new T.Skeleton(bones,Rm.map(m=>new T.Matrix4().multiplyMatrices(Wp,m).invert()));
  c.skinPelvis.visible=false;
  groups.forEach(G=>{
    const pos=[],nor=[],idx=[],si=[],sw=[];let off=0;
    G.parts.forEach(pt=>{const g=pt.g,pa=g.attributes.position,na=g.attributes.normal;
      for(let i=0;i<pa.count;i++){const x=pa.getX(i),y=pa.getY(i);pos.push(x,y,pa.getZ(i));nor.push(na.getX(i),na.getY(i),na.getZ(i));
        if(pt.leg===0){const t=ss(.05,-.1,y)*(pt.k||1),sx=ss(-.07,.07,x);si.push(0,1,3,0);sw.push(1-t,t*(1-sx),t*sx,0)}
        else{const wk=ss(ky+.04,ky-.04,y);if(pt.leg<0){si.push(1,2,0,0)}else{si.push(3,4,0,0)}sw.push(1-wk,wk,0,0)}}
      if(g.index){for(let i=0;i<g.index.count;i++)idx.push(g.index.getX(i)+off)}else{for(let i=0;i<pa.count;i++)idx.push(i+off)}
      off+=pa.count});
    const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new T.Float32BufferAttribute(nor,3));
    geo.setAttribute('skinIndex',new T.Uint16BufferAttribute(si,4));geo.setAttribute('skinWeight',new T.Float32BufferAttribute(sw,4));geo.setIndex(idx);
    if(!G.mat.skinning){G.mat.skinning=true;G.mat.needsUpdate=true}
    const m=new T.SkinnedMesh(geo,G.mat);m.frustumCulled=false;c.cloth.P.add(m);m.bind(skel,Wp);
    if(G.ol){const og=geo.clone(),op=og.attributes.position,on=og.attributes.normal;for(let i=0;i<op.count;i++)op.setXYZ(i,op.getX(i)+on.getX(i)*G.ol,op.getY(i)+on.getY(i)*G.ol,op.getZ(i)+on.getZ(i)*G.ol);
      OLS.skinning=true;const o=new T.SkinnedMesh(og,OLS);o.renderOrder=-1;o.frustumCulled=false;c.cloth.P.add(o);o.bind(skel,Wp)}});
}
const kneeP=(c,side,r)=>{const g=new T.SphereGeometry(r,14,10);g.translate(side<0?c.lL.p.position.x:c.lR.p.position.x,c.lL.k.position.y,0);return{g,leg:side}};
const hipP=(c,side,r)=>{const g=new T.SphereGeometry(r,16,12);g.translate(side<0?c.lL.p.position.x:c.lR.p.position.x,-.01,.005);return{g,leg:side}};
const legTube=(c,side,len,prof,K,y0)=>{const g=limbK(K,len,prof);g.translate(side<0?c.lL.p.position.x:c.lR.p.position.x,y0||0,0);return{g,leg:side}};

function setOutfit(c,o){return CFG.sex==='m'?setOutfitM(c,o):setOutfitF(c,o)}
function setOutfitF(c,o){
  dropBones(c);clear(c.cloth.C);clear(c.cloth.P);Object.values(c.clothJ).forEach(clear);
  const OL=.004,d=.007,top=o.top,C=c.cloth.C,Pg=c.cloth.P;
  const gown=top==='gownA'||top==='gownB',pep=top==='blouse'||top==='gownB',veeN=top==='blouse'||top==='gownB',colr=top==='polo';
  MAT.shoe.color.setHex(gown?0xcfa27d:0xf2f2f2);
  const TT=CFG.torso,NN=CFG.neck;
  const ip=(L,y)=>{y=Math.max(L[0].y,Math.min(L[L.length-1].y,y));for(let i=0;i<L.length-1;i++)if(y<=L[i+1].y){const t=(y-L[i].y)/(L[i+1].y-L[i].y),f=k=>(L[i][k]||0)+((L[i+1][k]||0)-(L[i][k]||0))*t;return{rx:f('rx'),rz:f('rz'),cz:f('cz')}}const e=L[L.length-1];return{rx:e.rx,rz:e.rz,cz:e.cz||0}};
  const at=y=>ip(TT,y),nk=y=>ip(NN,y);
  const R=(y,off)=>{const a=at(y),n=nk(y),w=Math.max(0,Math.min(1,(y-.5)/.06));return[a.rx+off+((n.rx+off*.5+.008)-(a.rx+off))*w,a.rz+off+((n.rz+off*.5+.008)-(a.rz+off))*w,a.cz]};
  MAT.collar.color.copy(MAT.top.color).multiplyScalar(colr?.82:.85);
  const panel=(mat,rows)=>{const NC=5,pos=[],idx=[];
    rows.forEach(r=>{const [rx,rz,cz]=R(r.y,r.off);for(let k=0;k<NC;k++){const x=r.w*(k/(NC-1)*2-1),q=Math.max(0,1-(x/rx)*(x/rx));pos.push(x,r.y,cz+rz*Math.sqrt(q))}});
    for(let i=0;i<rows.length-1;i++)for(let k=0;k<NC-1;k++){const a=i*NC+k,b=a+1,c2=a+NC,e=c2+1;idx.push(a,c2,b,b,c2,e)}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return mk(C,g,mat)};
  const vee=(mat,ytop,ytip,g,off)=>{const rows=[],n=8;for(let k=0;k<=n;k++){const y=ytop+(ytip-ytop)*k/n,[rx]=R(y,off),f=k/n>.75?Math.max(.03,1-(k/n-.75)/.25):1;rows.push({y,w:rx*Math.sin(g)*f,off})}return panel(mat,rows)};
  const collar=(mat,p)=>{const N=48,M=4,pos=[],idx=[];
    for(let i=0;i<=N;i++){const th=p.g+(Math.PI*2-2*p.g)*i/N,df=Math.min(th,Math.PI*2-th),u=Math.min(1,Math.max(0,(df-p.g)/1)),low=p.y0-p.pd*Math.pow(1-u,1.6),up=p.y0+p.h-.016*(1-u);
      for(let j=0;j<=M;j++){const v=j/M,y=low+(up-low)*v,[rx,rz,cz]=R(y,p.off);pos.push((rx+.005*v)*Math.sin(th),y,cz+(rz+.005*v)*Math.cos(th))}}
    for(let i=0;i<N;i++)for(let j=0;j<M;j++){const a=i*(M+1)+j,b=a+1,c2=a+M+1,e=c2+1;idx.push(a,c2,b,b,c2,e)}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return mk(C,g,mat,0,0,0,.0022)};
  const btn=(y,off,m)=>{const [,rz,cz]=R(y,off);mk(C,new T.SphereGeometry(.0068,8,6),m||MAT.shirtW,0,y,cz+rz+.002)};
  const lvAt=(y,e)=>{const k=at(y);return{y,rx:k.rx+e,rz:k.rz+e,cz:k.cz}};
  // ---- top body ----
  if(top!=='none'){
    const hem=top==='crop'?.1:(gown?.06:-.04),topY=top==='tank'?.5:(colr?.5:(veeN?.53:(top==='tee'||top==='long'||top==='gownA'?.52:.5)));
    const lv=[lvAt(hem,d+(gown||top==='crop'?0:.01))].concat(TT.filter(l=>l.y>hem&&l.y<=.44).map(l=>({y:l.y,rx:l.rx+d,rz:l.rz+d,cz:l.cz||0})));
    if(top==='tank'){lv.push({y:.47,rx:.122,rz:.092},{y:.5,rx:.098,rz:.074})}
    else{[.48,.5,.53].filter(y=>y<=topY+.001).forEach(y=>lv.push(lvAt(y,d+(y>.5?.003:0))))}
    mk(C,loft(lv,36,4,true,false),MAT.top,0,0,0,OL);
    if(top!=='tank')[-1,1].forEach(sx=>{const bs=mk(C,new T.SphereGeometry(.057,18,14),MAT.top,sx*.064,.29,.062);bs.scale.set(1,.95,.85)});
    if(top==='tee'||top==='long'||top==='gownA'){const k=at(topY),e=d+.003;
      mk(C,loft([{y:topY-.025,rx:k.rx+e+.003,rz:k.rz+e+.003,cz:k.cz},{y:topY+.012,rx:k.rx+e-.004,rz:k.rz+e-.004,cz:k.cz},{y:topY+.028,rx:k.rx+e-.012,rz:k.rz+e-.012,cz:k.cz}],36,3,false,false),MAT.collar,0,0,0,OL*.8)}
    if(veeN){vee(MAT.skinD,.535,.36,.46,d+.012);
      const rows=[];for(let k=0;k<=8;k++){const y=.535+(.36-.535)*k/8,[rx]=R(y,d+.012);rows.push({y,w:rx*Math.sin(.46)*Math.max(.03,k/8>.75?1-(k/8-.75)/.25:1)+.012,off:d+.006})}
      // V trim: darker edge strip behind the skin panel
      panel(MAT.collar,rows);
      vee(MAT.skinD,.535,.36,.46,d+.014);
      [.27,.2,.13].forEach(y=>btn(y,d+.004,MAT.dark))}
    if(colr){vee(MAT.skinD,.52,.40,.26,d+.012);collar(MAT.collar,{y0:.49,h:.05,pd:.06,g:.26,off:d+.006});
      panel(MAT.collar,[{y:.41,w:.008,off:d+.004},{y:-.03,w:.008,off:d+.004}]);[.36,.3,.24,.18].forEach(y=>btn(y,d+.004))}
  }
  // ---- sleeves ----
  const longS=top==='long',kA=CFG.armK;
  [['aLp','aLk'],['aRp','aRk']].forEach(a=>{
    if(top==='tank'||top==='crop'||top==='none')return;
    const J=c.clothJ[a[0]];
    if(top==='blouse'){ // flutter sleeve
      mk(J,new T.SphereGeometry(.046*kA,14,10),MAT.top).scale.set(1,.85,1);
      mk(J,limbK(kA,.14,[[0,.05],[.5,.062],[1,.088]]),MAT.top,0,0,0,OL);return}
    mk(J,new T.SphereGeometry(.047*kA,14,10),MAT.top).scale.set(1,.85,1);
    if(colr){mk(J,limbK(kA,.12,[[0,.05],[.35,.07],[.85,.056],[1,.044]]),MAT.top,0,0,0,OL);mk(J,limbK(kA,.03,[[0,.0445],[1,.044]]),MAT.collar,0,-.092,0,OL*.8);return}
    const len=longS?.31:.13;
    mk(J,limbK(kA,len,[[0,.05],[Math.min(1,.3*.31/len),.046],[1,(longS?.04:.043)]]),MAT.top,0,0,0,OL);
    if(longS){mk(c.clothJ[a[1]],limbK(kA,.26,[[0,.039],[.3,.036],[1,.027]]),MAT.top,0,0,0,OL);mk(c.clothJ[a[1]],new T.SphereGeometry(.039*kA,12,8),MAT.top);
      mk(c.clothJ[a[1]],limbK(kA,.045,[[0,.0295],[1,.0285]]),MAT.collar,0,-.215,0,OL)}
  });
  // ---- peplum flare (blouse, gown B) ----
  const pel=CFG.pelvis.map(l=>({y:l.y,rx:l.rx+.014,rz:l.rz+.012,cz:l.cz||0}));
  if(pep){const a=at(.06);mk(C,loft([{y:-.15,rx:.268,rz:.215,cz:-.036},{y:-.12,rx:.255,rz:.205,cz:-.034},{y:-.02,rx:a.rx+.04,rz:a.rz+.035,cz:a.cz-.008},{y:.06,rx:a.rx+d,rz:a.rz+d,cz:a.cz}],40,4,false,false),MAT.top,0,0,0,OL)}
  // ---- bottom / gown skirt ----
  const bm=MAT.bottom;
  const skirt=(m,L,rev)=>mk(Pg,loft(L.slice().sort((p,q)=>rev?q.y-p.y:p.y-q.y).map(l=>Object.assign({},l,{rx:l.rx+.012,rz:l.rz+.016})),44,4,true,false),m,0,0,0,OL);
  // tight skirt: hip part on the pelvis, one tube per leg so it swings with the legs
  const tight=(m,L0,kk,stub)=>{const L=L0.slice().sort((p,q)=>p.y-q.y).map(l=>Object.assign({},l,{rx:l.rx+.008,rz:l.rz+.012}));
    const G=[{parts:[{g:loft(L,44,5,false,false),leg:0,k:kk}],mat:m,ol:OL}];
    if(stub)G.push({parts:[-1,1].map(sd=>legTube(c,sd,.1,[[0,.06],[1,.056]],CFG.legK,-.34)),mat:MAT.skin,ol:OL});
    skinBottom(c,G);c.lL.p.children[0].visible=c.lR.p.children[0].visible=false};
  const waistL=(m)=>{const rr=[-.12,-.04,.02,.066].map(y=>lvAt(y,.011));mk(C,loft(rr,36,4,true,true),m,0,0,0,0)};
  if(top==='gownA'){
    tight(MAT.top,[pel[4],pel[3],Object.assign({},pel[2],{rx:pel[2].rx+.006}),{y:-.15,rx:.265,rz:.225,cz:-.03},{y:-.3,rx:.33,rz:.29,cz:-.02},{y:-.62,rx:.44,rz:.4,cz:0}],.3,false);
  }else if(top==='gownB'){
    tight(MAT.top,[pel[4],pel[3],Object.assign({},pel[2],{rx:pel[2].rx+.004}),{y:-.2,rx:.205,rz:.155,cz:-.028},{y:-.4,rx:.195,rz:.14,cz:-.014}],.85,true);
  }else if(o.bottom==='pencil'){
    tight(bm,[pel[4],pel[3],Object.assign({},pel[2],{rx:pel[2].rx+.004}),{y:-.2,rx:.205,rz:.155,cz:-.028},{y:-.4,rx:.195,rz:.14,cz:-.014}],.85,true);
  }else if(o.bottom==='aline'||o.bottom==='skirt'){
    tight(bm,[pel[4],pel[3],pel[2],{y:-.2,rx:.255,rz:.215,cz:-.03},{y:-.46,rx:.36,rz:.32,cz:-.01}],.3,false);
  }else{
    const shorts=o.bottom==='shorts',wide=o.bottom==='trousers',K=CFG.legK;
    MAT.hem.color.copy(MAT.bottom.color).multiplyScalar(.8);
    const parts=[{g:loft(taperPel(pel.slice(1)),36,4,false,false),leg:0}],hemP=[];
    [-1,1].forEach(sd=>{
      if(shorts){parts.push(legTube(c,sd,.22,[[0,.078],[.2,.093],[.6,.091],[1,.086]],K));hemP.push(legTube(c,sd,.022,[[0,.087],[1,.087]],K,-.2))}
      else if(wide){parts.push(legTube(c,sd,.43,[[0,.076],[.14,.09],[.6,.092],[1,.098]],K));parts.push(kneeP(c,sd,.098*K));parts.push(legTube(c,sd,.4,[[0,.098],[.5,.102],[1,.108]],K,-.43));hemP.push(legTube(c,sd,.025,[[0,.108],[1,.108]],K,-.805))}
      else{parts.push(legTube(c,sd,.49,[[0,.082],[.12,.09],[.245,.092],[.7,.071],[1,.056]],K,.06));parts.push(kneeP(c,sd,.058*K));parts.push(legTube(c,sd,.4,[[0,.056],[.25,.056],[.7,.047],[1,.05]],K,-.43));hemP.push(legTube(c,sd,.025,[[0,.05],[1,.05]],K,-.805))}});
    skinBottom(c,[{parts,mat:bm,ol:OL},{parts:hemP,mat:MAT.hem,ol:OL*.6}]);
    if(!shorts)setLegSkin(c,false);
  }
  c.setSneakers&&c.setSneakers();
}

function setOutfitM(c,o){
  dropBones(c);clear(c.cloth.C);clear(c.cloth.P);Object.values(c.clothJ).forEach(clear);
  const OL=.004,d=.007,top=o.top,suit=top==='suit',dress=top==='dress',tuck=suit||dress,C=c.cloth.C;
  MAT.shoe.color.setHex(tuck?0x1c1512:0xf2f2f2);
  const TT=CFG.torso,NN=CFG.neck;
  const ip=(L,y)=>{y=Math.max(L[0].y,Math.min(L[L.length-1].y,y));for(let i=0;i<L.length-1;i++)if(y<=L[i+1].y){const t=(y-L[i].y)/(L[i+1].y-L[i].y);return{rx:L[i].rx+(L[i+1].rx-L[i].rx)*t,rz:L[i].rz+(L[i+1].rz-L[i].rz)*t}}return L[L.length-1]};
  const at=y=>ip(TT,y),nk=y=>ip(NN,y);
  const R=(y,off)=>{const a=at(y),n=nk(y),w=Math.max(0,Math.min(1,(y-.545)/.06));return[a.rx+off+((n.rx+off*.5+.008)-(a.rx+off))*w,a.rz+off+((n.rz+off*.5+.008)-(a.rz+off))*w]};
  MAT.collar.color.copy(MAT.top.color).multiplyScalar(dress?.9:.8);
  const colM=suit?MAT.shirtW:MAT.collar;
  // curved panel lying on the torso: rows {y,w,off}
  const panel=(mat,rows,cx=0)=>{const NC=5,pos=[],idx=[];
    rows.forEach(r=>{const [rx,rz]=R(r.y,r.off);for(let k=0;k<NC;k++){const x=r.w*(k/(NC-1)*2-1),q=Math.max(0,1-(x/rx)*(x/rx));pos.push(cx+x,r.y,rz*Math.sqrt(q))}});
    for(let i=0;i<rows.length-1;i++)for(let k=0;k<NC-1;k++){const a=i*NC+k,b=a+1,c2=a+NC,e=c2+1;idx.push(a,c2,b,b,c2,e)}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return mk(C,g,mat)};
  const vee=(mat,ytop,ytip,g,off)=>{const rows=[],n=8;for(let k=0;k<=n;k++){const y=ytop+(ytip-ytop)*k/n,[rx]=R(y,off),f=k/n>.7?Math.max(.03,1-(k/n-.7)/.3):1;rows.push({y,w:rx*Math.sin(g)*f,off})}return panel(mat,rows)};
  const collar=(mat,p)=>{const N=48,M=4,pos=[],idx=[];
    for(let i=0;i<=N;i++){const th=p.g+(Math.PI*2-2*p.g)*i/N,df=Math.min(th,Math.PI*2-th),u=Math.min(1,Math.max(0,(df-p.g)/1)),low=p.y0-p.pd*Math.pow(1-u,1.6),up=p.y0+p.h-.018*(1-u);
      for(let j=0;j<=M;j++){const v=j/M,y=low+(up-low)*v,[rx,rz]=R(y,p.off);pos.push((rx+.005*v)*Math.sin(th),y,(rz+.005*v)*Math.cos(th))}}
    for(let i=0;i<N;i++)for(let j=0;j<M;j++){const a=i*(M+1)+j,b=a+1,c2=a+M+1,e=c2+1;idx.push(a,c2,b,b,c2,e)}
    const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(pos,3));g.setIndex(idx);g.computeVertexNormals();return mk(C,g,mat,0,0,0,.0022)};
  const btn=(y,off,m)=>{const [,rz]=R(y,off);mk(C,new T.SphereGeometry(.0065,8,6),m||MAT.shirtW,0,y,rz+.002)};
  // ---- body of the top ----
  if(suit){
    const lv=[{y:-.2,rx:.188,rz:.142},{y:-.12,rx:at(-.12).rx+.02,rz:at(-.12).rz+.02}].concat(TT.filter(l=>l.y>-.12&&l.y<=.44).map(l=>({y:l.y,rx:l.rx+.016,rz:l.rz+.016})));
    [.48,.52,.545].forEach(y=>{const k=at(y);lv.push({y,rx:k.rx+.016,rz:k.rz+.016})});
    mk(C,loft(lv,36,4,true,false),MAT.top,0,0,0,OL);
    vee(MAT.shirtW,.548,.30,.42,.027);
    collar(MAT.shirtW,{y0:.54,h:.055,pd:.05,g:.30,off:.03});
    collar(MAT.top,{y0:.525,h:.05,pd:.20,g:.42,off:.036});
    // tie
    const tr=[[.545,.016],[.52,.012],[.47,.017],[.38,.026],[.28,.034],[.2,.036],[.17,.014]].map(r=>({y:r[0],w:r[1],off:.044}));
    panel(MAT.tie,tr);const [,kz]=R(.548,.044);mk(C,new T.BoxGeometry(.032,.03,.014),MAT.tie,0,.548,kz+.002);
    mk(C,new T.SphereGeometry(.009,8,6),MAT.dark,0,.27,R(.27,.044)[1]+.002);
  }else{
    const hem=tuck?.065:-.04,h0=at(hem);
    const lv=[{y:hem,rx:h0.rx+d,rz:h0.rz+d}].concat(TT.filter(l=>l.y>hem&&l.y<=.44).map(l=>({y:l.y,rx:l.rx+d,rz:l.rz+d})));
    (top==='tee'||top==='long'?[.48,.52,.545,.565]:[.48,.52,.545]).forEach(y=>{const k=at(y);lv.push({y,rx:k.rx+d+(y>.5?.004:0),rz:k.rz+d+(y>.5?.004:0)})});
    mk(C,loft(lv,36,4,true,false),MAT.top,0,0,0,OL);
    if(top==='tee'||top==='long'){ // crew neck band
      const k=at(.565),rx=k.rx+d+.004,rz=k.rz+d+.004;
      mk(C,loft([{y:.556,rx:rx+.003,rz:rz+.003},{y:.575,rx:rx-.004,rz:rz-.004},{y:.592,rx:rx-.012,rz:rz-.012}],36,3,false,false),MAT.collar,0,0,0,OL*.8)}
    else{ // collar shirt, polo or corporate
      const dr=dress,g=dr?.22:.26,tip=dr?.47:.46;
      vee(MAT.skinD,.572,tip,g,d+.012);
      collar(MAT.collar,{y0:.54,h:dr?.05:.045,pd:dr?.075:.065,g,off:d+.006});
      const hemY=hem+.01;
      panel(dr?MAT.collar:MAT.collar,[{y:tip+.01,w:.008,off:d+.004},{y:hemY,w:.008,off:d+.004}]);
      (dr?[.43,.36,.29,.22,.15,.08]:[.43,.38]).forEach(y=>btn(y,d+.004,dr?MAT.shirtW:MAT.shirtW));
    }
    // sleeves
  }
  const long=top==='long'||dress||suit,kA=CFG.armK,sz=suit?1.07:1,sm=suit?MAT.top:MAT.top;
  [['aLp','aLk'],['aRp','aRk']].forEach(a=>{
    mk(c.clothJ[a[0]],new T.SphereGeometry(.046*kA*sz,14,10),sm).scale.set(1,.78,1);
    const len=long?.31:(top==='tee'?.15:.13);
    mk(c.clothJ[a[0]],limbK(kA,len,[[0,.05*sz],[Math.min(1,.3*.31/len),.046*sz],[1,(long?.041:.044)*sz]]),sm,0,0,0,OL);
    if(long){const lo=suit?.245:.26;
      mk(c.clothJ[a[1]],limbK(kA,lo,[[0,.040*sz],[.3,.036*sz],[1,.0285*sz]]),sm,0,0,0,OL);
      mk(c.clothJ[a[1]],new T.SphereGeometry(.039*kA*sz,12,8),sm);
      if(suit)mk(c.clothJ[a[1]],limbK(kA,.07,[[0,.0285],[1,.0265]]),MAT.shirtW,0,-.19,0,OL*.6);
      else mk(c.clothJ[a[1]],limbK(kA,.045,[[0,.0295],[1,.0285]]),dress?MAT.collar:MAT.collar,0,-.215,0,OL)}
    else if(top==='polo')mk(c.clothJ[a[0]],limbK(kA,.032,[[0,.0455],[1,.0445]]),MAT.collar,0,-.098,0,OL*.8);
  });
  // ---- bottom ----
  MAT.pants.color=MAT.top.color;const shorts=o.bottom==='shorts',bm=(suit&&!shorts)?MAT.pants:MAT.bottom;
  {const K=CFG.legK,parts=[{g:loft(taperPel(CFG.pelvis.map(l=>({y:l.y,rx:l.rx+.02,rz:l.rz+(l.y>0?.034:.016)}))),36,4,false,false),leg:0}];
   [-1,1].forEach(sd=>{if(shorts)parts.push(legTube(c,sd,.25,[[0,.074],[.25,.088],[1,.087]],K));else{parts.push(legTube(c,sd,.49,[[0,.078],[.12,.086],[.245,.088],[.7,.07],[1,.055]],K,.06));parts.push(kneeP(c,sd,.057*K));parts.push(legTube(c,sd,.4,[[0,.055],[.18,.057],[.6,.046],[1,.043]],K,-.43))}});
   skinBottom(c,[{parts,mat:bm,ol:OL}]);if(!shorts)setLegSkin(c,false)}
  if(tuck){
    const wl=[-.12,-.04,.02,.066].map(y=>{const k=at(y);return{y,rx:k.rx+.011,rz:k.rz+.009}});
    if(!suit)mk(C,loft(wl,36,4,true,true),bm,0,0,0,0);
    if(!suit){const bl=[.036,.068].map(y=>{const k=at(y);return{y,rx:k.rx+.014,rz:k.rz+.012}});
      mk(C,loft(bl,36,2,true,true),MAT.belt,0,0,0,OL*.6);
      mk(C,new T.BoxGeometry(.04,.03,.008),MAT.buckle,0,.052,at(.052).rz+.02)}}
  c.setSneakers&&c.setSneakers();
}

/* ---------- hair ---------- */
function hairLine(phi,theta,style){ // is this sphere vertex covered by hair?
  const fa=Math.abs(phi-Math.PI/2); // 0 = front
  if(style==='afro'){const ta=fa<.95?1.02+.28*Math.pow(fa/.95,1.2):1.6+.7*Math.min(1,(fa-.95)/1.1);return theta<ta}
  if(style==='lowcut'||style==='spiky'||style==='quiff'||style==='mohawk'){const t=fa<.95?.88+.22*Math.pow(fa/.95,1.3):1.22+.12*Math.min(1,(fa-.95)/1.1);return theta<t}
  let t1;if(fa<.95)t1=.95+.34*Math.pow(fa/.95,1.3);else t1=1.45+.55*Math.min(1,(fa-.95)/1.1);
  return theta<t1}
function setHair(c,style,opt){
  clear(c.hairG);const G=c.hairG,HM=MAT.hair,OL=.0036;
  const keep=(x,y,z)=>{const l=Math.hypot(x,y,z)||1;const uy=y/HS.sy,ux=x/HS.sx,uz=z/HS.sz;const th=Math.acos(Math.max(-1,Math.min(1,uy/Math.hypot(ux,uy,uz)))),ph=Math.atan2(uz,-ux);return hairLine(ph<0?ph+Math.PI*2:ph,th,style)};
  if(style==='afro'){const g2=headGeo(.042,1.0,keep);mk(G,g2,HM,0,0,0,OL);
    // texture: bumps
    for(let i=0;i<46;i++){const th=Math.random()*2.0+.1,ph=Math.random()*Math.PI*2,fa=Math.abs(ph-Math.PI/2);if(fa<.95&&th>.95)continue;
      const ux=-Math.cos(ph)*Math.sin(th),uy=Math.cos(th),uz=Math.sin(ph)*Math.sin(th),q=headPt(ux,uy,uz),l=Math.hypot(q[0],q[1]-HS.cy,q[2])||1;
      const s=mk(G,new T.SphereGeometry(.034,10,8),HM,q[0]+q[0]/l*.05,q[1]+(q[1]-HS.cy)/l*.05,q[2]+q[2]/l*.05,OL*.5)}
    if(opt&&opt.beard)addBeard(G,HM,OL);return}
  if(style==='bald'){if(opt&&opt.beard)addBeard(G,HM,OL);return}
  if(style==='lowcut'){mk(G,headGeo(.007,1.0,keep),HM,0,0,0,OL*.7);if(opt&&opt.beard)addBeard(G,HM,OL);return}
  const sp=(th,ph,len,w,tilt)=>{const ux=-Math.cos(ph)*Math.sin(th),uy=Math.cos(th),uz=Math.sin(ph)*Math.sin(th),q=headPt(ux,uy,uz),cy=HS.cy,l=Math.hypot(q[0],q[1]-cy,q[2])||1;
    const n=new T.Vector3(q[0],q[1]-cy,q[2]).normalize(),d=n.clone().multiplyScalar(1-tilt).add(new T.Vector3(0,tilt+.35,0)).normalize();
    const m=mk(G,new T.ConeGeometry(w,len,7),HM,q[0]+d.x*len*.4,q[1]+d.y*len*.4,q[2]+d.z*len*.4,OL*.6);m.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),d)};
  if(style==='spiky'){mk(G,headGeo(.007,1.0,keep),HM,0,0,0,OL*.7);
    for(let i=0;i<46;i++){const th=.05+Math.random()*.95,ph=Math.random()*Math.PI*2,fa=Math.abs(ph-Math.PI/2);if(fa<.95&&th>.86-.0*fa)continue;sp(th,ph,.055+Math.random()*.03,.016,.25)}
    for(let i=0;i<9;i++){const ph=Math.PI/2+(i/8-.5)*1.7;sp(.78+Math.random()*.06,ph,.05,.014,.05)}
    if(opt&&opt.beard)addBeard(G,HM,OL);return}
  if(style==='mohawk'){mk(G,headGeo(.003,1.0,keep),HM,0,0,0,OL*.5);
    for(let k=0;k<13;k++){const f=k/12,th=f*1.7,ph=f<.5?Math.PI/2:Math.PI*1.5,thh=f<.5?(.5-f)*2*1.0:(f-.5)*2*1.2;sp(thh+.02,ph,.07+.04*Math.sin(f*Math.PI),.02,.1+.3*Math.abs(f-.5));sp(thh+.02,ph+(f<.5?.14:-.14),.06+.03*Math.sin(f*Math.PI),.016,.1);sp(thh+.02,ph-(f<.5?.14:-.14),.06+.03*Math.sin(f*Math.PI),.016,.1)}
    if(opt&&opt.beard)addBeard(G,HM,OL);return}
  if(style==='quiff'){mk(G,headGeo(.007,1.0,keep),HM,0,0,0,OL*.7);
    const q=mk(G,new T.SphereGeometry(1,20,14),HM,0,HS.cy+HS.sy*.8,HS.sz*.4,OL);q.scale.set(HS.sx*.8,.055,HS.sz*.66);q.rotation.x=-.3;
    const q2=mk(G,new T.SphereGeometry(1,16,12),HM,0,HS.cy+HS.sy*.8,HS.sz*.78,OL);q2.scale.set(HS.sx*.62,.035,.03);
    if(opt&&opt.beard)addBeard(G,HM,OL);return}
  if(style==='buzz'){mk(G,headGeo(.004,1.0,keep),HM,0,0,0,OL*.6);if(opt&&opt.beard)addBeard(G,HM,OL);return}
  if(style==='curly'){mk(G,headGeo(.014,1.0,keep),HM,0,0,0,OL);
    for(let i=0;i<80;i++){const th=Math.random()*1.55+.05,ph=Math.random()*Math.PI*2,fa=Math.abs(ph-Math.PI/2);if(fa<.95&&th>.82)continue;if(fa>=.95&&th>1.7)continue;
      const ux=-Math.cos(ph)*Math.sin(th),uy=Math.cos(th),uz=Math.sin(ph)*Math.sin(th),q=headPt(ux,uy,uz),l=Math.hypot(q[0],q[1]-HS.cy,q[2])||1;
      mk(G,new T.SphereGeometry(.026,9,7),HM,q[0]+q[0]/l*.03,q[1]+(q[1]-HS.cy)/l*.03,q[2]+q[2]/l*.03,OL*.5)}
    if(opt&&opt.beard)addBeard(G,HM,OL);return}
  mk(G,headGeo(.012,1.0,keep),HM,0,0,0,OL);
  // locks
  const locks=[],part=-.16;
  const surf=(th,ph,off)=>{const ux=-Math.cos(ph)*Math.sin(th),uy=Math.cos(th),uz=Math.sin(ph)*Math.sin(th),q=headPt(ux,uy,uz),cy=HS.cy,l=Math.hypot(q[0],q[1]-cy,q[2])||1;
    return new T.Vector3(q[0]+q[0]/l*off,q[1]+(q[1]-cy)/l*off,q[2]+q[2]/l*off)};
  const N=style==='bob'?34:44;
  for(let i=0;i<N;i++){
    const ph=(i/N)*Math.PI*2+.07,fa=Math.abs(ph-Math.PI/2);let ph2=ph;
    const front=fa<.95;
    let t1;if(front)t1=.92+.28*Math.pow(fa/.95,1.2);else t1=1.55+.55*Math.min(1,(fa-.95)/1.1);
    const pts=[];const t0=.06+Math.random()*.1;
    const sidePart=ph<Math.PI/2?1:-1;
    const steps=5;for(let k=0;k<=steps;k++){const u=k/steps;let th=t0+(t1-t0)*u,phk=ph2;
      if(front){const dir=ph2<Math.PI/2?-1:1;phk=ph2+dir*(1-fa/.95)*.7*Math.pow(u,1.4)}
      pts.push(surf(th,phk,.011+.006*Math.sin(u*Math.PI)))}
    // extension below the hairline
    const last=pts[pts.length-1].clone();let L=0;
    if(style==='long')L=front?(fa<.25?.0:.34):(fa<1.6?.40:.46);
    if(style==='bob')L=front?(fa<.5?0:.07):.11;
    if(style==='ponytail')L=0;
    if(L>0){const side=Math.sign(last.x)||1;const tx=last.x*1.05,tz=last.z;const n2=4;
      for(let k=1;k<=n2;k++){const u=k/n2;const bulge=Math.sin(u*Math.PI*.7);
        let px=last.x+ (front? side*.024: side*.012*u) + Math.sign(last.x)*.014*bulge,py=last.y-L*u,pz=last.z+(front?.012*u+.006:-.01*u+(-.01));
        if(style==='bob'){px*=1-.12*u;pz+=front?-.01*u:.0*u}
        pts.push(new T.Vector3(px,py,pz))}}
    if(pts.length>2){const s=new Sweep(Math.max(8,pts.length*2),6);const w0=.0145+Math.random()*.004;
      s.set(pts,u=>u<.15?w0*(.6+u*2.6):w0*(1-.6*Math.max(0,u-.55)/.45),u=>.0085);mk(G,s.g,HM,0,0,0,OL*.8)}
    locks.push(pts)}
  if(style==='bun'||style==='ponytail'){ // gather point at the back-top
    const bp=style==='bun'?new T.Vector3(0,HS.cy+.125,-.07):new T.Vector3(0,HS.cy+.075,-.13);
    if(style==='bun'){mk(G,new T.SphereGeometry(.052,18,14),HM,bp.x,bp.y,bp.z,OL);const tw=mk(G,new T.TorusGeometry(.04,.012,8,20),HM,bp.x,bp.y,bp.z,0);tw.rotation.x=.7}
    else{const s=new Sweep(16,8);s.set([bp,new T.Vector3(0,bp.y-.05,bp.z-.07),new T.Vector3(0,bp.y-.2,bp.z-.09),new T.Vector3(0,bp.y-.39,bp.z-.04),new T.Vector3(0,bp.y-.5,bp.z+.0)],u=>.026*(1-.7*u*u)+.007,u=>.02*(1-.6*u)+.006);mk(G,s.g,HM,0,0,0,OL);
      mk(G,new T.SphereGeometry(.024,12,8),MAT.lip,bp.x,bp.y-.012,bp.z-.01)}
  }
  // fringe sweeping across forehead
  if(opt&&opt.bangs){for(let i=0;i<7;i++){const u=i/6,ph=Math.PI/2+(u-.5)*1.2,pts=[surf(.38,ph*.9+Math.PI/2*.1,.012),surf(.78,ph,.018),surf(1.1+.05*Math.abs(u-.5),ph+(u<.5?-.2:.2)*(1-u*.2),.014),surf(1.35,ph+(u-.5)*.55,.012)];
    const s=new Sweep(10,6);s.set(pts,v=>.014*(1-.5*v),v=>.008);mk(G,s.g,HM,0,0,0,OL*.8)}}
  if(opt&&opt.beard)addBeard(G,HM,OL);
}

function addBeard(G,HM,OL){
  const keep=(x,y,z)=>{const uy=y/HS.sy,ux=x/HS.sx,uz=z/HS.sz;return (uy<-.74&&uz>-.15)||(uy<-.05&&uy>-.74&&Math.abs(ux)>.84&&uz>-.4)};
  mk(G,headGeo(.006,1.0,keep),HM,0,0,0,OL*.6);
  const m=new Sweep(10,6),zz=(x,y)=>surfZ(x,y)+.004,pts=[[-.032,.15],[-.016,.146],[0,.145],[.016,.146],[.032,.15]].map(p=>new T.Vector3(p[0],p[1],zz(p[0],p[1])));
  m.set(pts,u=>.0038*(1-Math.abs(u*2-1)*.4)+.001,u=>.0042);mk(G,m.g,HM,0,0,0,OL*.5)}
/* ---------- face updates ---------- */
const V3=(x,y,z)=>new T.Vector3(x,y,z);
function updateFace(c,mood,mo,bl){
  const sm=Math.max(0,mood),fr=Math.max(0,-mood),w=.0275*(CFG.mouthW||1);
  // brows
  c.brows.forEach(({w:bw,s})=>{const by=.262+CFG.browY+mood*.003+(fr?.0:0),pts=[];for(let i=0;i<5;i++){const u=i/4,x=s*(.013+u*.058),inner=u<.5?-fr*.007*(1-u*2):0,outer=u>.5?fr*.002*(u-.5)*2:0,y=by+.011*Math.sin(Math.min(1,u*1.05)*Math.PI*.8)+inner+outer+sm*.002*u;pts.push(V3(x,y,surfZ(x,y)+.0012))}
    bw.set(pts,u=>(.0034*(1-.5*u)+.0012)*CFG.browK,u=>.003*CFG.browK)});
  // lips
  const up=[],lo=[],opn=mo;
  for(let i=0;i<=6;i++){const u=i/6*2-1,x=u*w,corner=Math.pow(Math.abs(u),2.2),lift=(sm*.010-fr*.006)*corner,arch=1-u*u,wide=1+sm*.18;
    const xx=x*wide,ym=.126+(CFG.mouthY||0);
    const yu=ym+.0042*arch*(1-.35*Math.abs(Math.sin(u*Math.PI*1.2)))+lift,yl=ym-.0035*arch*(1+0)-opn*.017*(1-corner*.55)+lift*.85-.0016;
    const zp=surfZ(xx,yu)+.0022+.0032*arch-.002*corner;const zl=surfZ(xx,yl)+.0022+.0036*arch-.002*corner;
    up.push(V3(xx,yu,zp));lo.push(V3(xx,yl,zl))}
  c.lipU.set(up,u=>(.0034*(1-Math.abs(u*2-1)*.55)+.0008)*CFG.lipK,u=>.0034);
  c.lipL.set(lo,u=>(.0046*(1-Math.abs(u*2-1)*.6)+.0008)*CFG.lipK,u=>.0042);
  // mouth interior
  c.mouth.visible=opn>.04;c.mouth.scale.set(.0235*(1+sm*.12),Math.max(.0005,opn*.0105),1);c.mouth.position.y=.126-opn*.0085;c.mouth.position.z=surfZ(0,.124)-.003;
  // eyes
  c.eyes.forEach(e=>{const sq=sm*.18;e.lid.rotation.x=-.92+bl*(.92+.8)+sq*.4;e.low.rotation.x=-sq*.35+.0;
    const gx=e.gx||0,gy=e.gy||0;e.e.children.forEach(ch=>{})});
}

/* ---------- face bank ---------- */
const FB={f:{},m:{}};['f','m'].forEach(k=>{const C0=k==='m'?MAN:FEM;FB[k]={jaw:C0.jaw,noseK:C0.noseK,eyeK:C0.eyeK,browK:C0.browK,browY:C0.browY,lipK:C0.lipK,earK:C0.earK,lash:C0.lash,lip:C0.lip,head:Object.assign({},C0.head)}});
const FACES={
 f:[['Soft',{}],
  ['Oval',{cheek:-.02,chin:.004,noseW:-.3,noseLen:-.001,eyeW:1.04,tilt:.05,mouthW:.95,fore:.0,jaw:.06}],
  ['Round',{cheek:.07,cheekZ:.004,chin:-.006,noseW:.2,noseUp:.003,eyeW:1.0,eyeH:1.1,tilt:0,mouthW:.9,mouthY:-.003,jaw:-.08,eyeK:1.08}],
  ['Heart',{cheek:.01,fore:.05,chin:.012,noseW:-.4,noseLen:-.002,eyeW:1.1,tilt:.12,mouthW:.88,mouthY:.002,jaw:.16,lip:1.25}],
  ['Strong',{cheek:.0,fore:-.01,chin:.008,noseW:.5,noseLen:.004,eyeW:.95,eyeH:.9,tilt:-.03,mouthW:1.15,brow:1.4,jaw:-.1,iris:0x3a2a1c}],
  ['Wide',{cheek:.06,cheekZ:.003,chin:-.003,noseW:.9,noseLen:.001,noseUp:.002,eyeW:1.0,tilt:.02,mouthW:1.22,lip:1.35,jaw:-.05,eyeX:1.1,iris:0x4a3a28}],
  ['Narrow',{cheek:-.06,fore:-.03,chin:.01,noseW:-.5,noseLen:.006,eyeW:.96,eyeH:.92,tilt:-.06,mouthW:.82,lip:.85,jaw:.1,eyeX:.94,iris:0x35502e}],
  ['Full lips',{cheek:.03,chin:.002,noseW:.3,eyeW:1.06,tilt:.08,mouthW:1.1,mouthY:-.002,lip:1.7,lipc:0xa03c48,jaw:0}],
  ['Sharp',{cheek:-.05,fore:.02,chin:.016,noseW:-.3,noseLen:.007,eyeW:1.12,eyeH:.82,tilt:.14,mouthW:.92,lip:.8,brow:1.5,jaw:.18,eyeX:.96,iris:0x2f4a66}],
  ['Cute',{cheek:.05,cheekZ:.005,chin:-.008,noseW:-.2,noseLen:-.004,noseUp:.004,eyeW:1.0,eyeH:1.2,tilt:.0,mouthW:.78,mouthY:-.004,lip:1.1,jaw:-.03,eyeK:1.2,eyeX:1.07}]],
 m:[['Classic',{}],
  ['Square',{cheek:.01,fore:.02,chin:.01,noseW:.2,eyeW:.98,mouthW:1.1,brow:1.3,jaw:-.06}],
  ['Long',{cheek:-.05,fore:-.02,chin:.012,noseW:-.2,noseLen:.008,eyeW:.96,eyeH:.92,tilt:-.04,mouthW:.9,lip:.9,jaw:.04,eyeX:.96,iris:0x3a2a1c}],
  ['Round',{cheek:.07,cheekZ:.005,chin:-.01,noseW:.4,noseUp:.004,eyeW:1.0,eyeH:1.05,mouthW:1.0,mouthY:-.003,lip:1.1,jaw:-.1,brow:.8}],
  ['Hard',{cheek:-.03,fore:.0,chin:.018,noseW:.6,noseLen:.007,eyeW:.94,eyeH:.82,tilt:-.07,mouthW:1.15,lip:.7,brow:1.7,jaw:-.1,eyeX:.95,iris:0x2f2a24}],
  ['Soft',{cheek:.03,cheekZ:.003,chin:-.004,noseW:-.3,noseLen:-.003,eyeW:1.06,eyeH:1.1,tilt:.05,mouthW:.92,lip:1.3,jaw:.14,brow:.75,eyeX:1.03}],
  ['Wide',{cheek:.06,fore:.01,chin:-.002,noseW:1.0,noseUp:.002,eyeW:1.0,mouthW:1.28,lip:1.4,jaw:-.04,eyeX:1.12,iris:0x4a3a28}],
  ['Narrow',{cheek:-.07,fore:-.04,chin:.012,noseW:-.5,noseLen:.01,eyeW:.95,eyeH:.9,tilt:-.05,mouthW:.82,lip:.8,jaw:.08,eyeX:.93,iris:0x35502e}],
  ['Heavy brow',{cheek:.0,fore:.03,chin:.008,noseW:.5,noseLen:.004,eyeW:.9,eyeH:.78,tilt:-.1,mouthW:1.0,lip:.85,brow:2.1,browY:-.005,jaw:-.07}],
  ['Young',{cheek:.04,chin:-.004,noseW:-.3,noseLen:-.004,eyeW:1.06,eyeH:1.2,tilt:.06,mouthW:.9,lip:1.2,jaw:.1,brow:.75,eyeX:1.05,iris:0x4a3a28}]]};
function faceAvg(c){const o=CFG;CFG=c;let a=0,n=0;for(let uy=-.85;uy<=.8;uy+=.05){a+=jawW(uy);n++}CFG=o;return a/n}
function applyFace(C0,sex,i){const b=FB[sex],p=FACES[sex][i][1],A=sex==='m'?1.9:1,dv=(v,d)=>v==null?d:d+(v-d)*A;
 C0.jaw=b.jaw+(p.jaw||0)*A;C0.noseK=b.noseK;C0.eyeK=b.eyeK*dv(p.eyeK,1);C0.browK=b.browK*dv(p.brow,1);C0.browY=b.browY+(p.browY||0);C0.lipK=b.lipK*dv(p.lip,1);
 ['cheek','cheekZ','fore','chin','noseW','noseLen','noseUp','tilt','eyeW','eyeH','mouthW','mouthY'].forEach(k=>{const d=(k==='eyeW'||k==='eyeH'||k==='mouthW')?1:0;C0[k]=dv(p[k],d)});
 C0.eyeX=dv(p.eyeX,1);C0.eyeY=p.eyeY||0;C0.iris=p.iris||0x5b3a24;C0.lip=p.lipc||b.lip;
 const z={jaw:b.jaw,cheek:0,fore:0};const a0=faceAvg(Object.assign({},C0,z)),a1=faceAvg(C0);
 const f=Math.max(.9,Math.min(1.25,a0/a1));C0.head={sx:b.head.sx*f,sy:b.head.sy*(1+(f-1)*.5),sz:b.head.sz*(1+(f-1)*.5)}}

/* ---------- build ---------- */
const BASE={};['f','m'].forEach(k=>{const C0=k==='m'?MAN:FEM;BASE[k]={torso:JSON.parse(JSON.stringify(C0.torso)),pelvis:JSON.parse(JSON.stringify(C0.pelvis)),neck:JSON.parse(JSON.stringify(C0.neck)),armK:C0.armK,legK:C0.legK,legX:C0.legX,shX:C0.shX}});
const BUILDS=[['Slim',.92],['Average',1],['Heavy',1.2],['Very heavy',1.42]];
function applyBuild(C0,sex,k){const B=BASE[sex],belly=y=>Math.exp(-Math.pow((y-.12)/.2,2));
 C0.torso=B.torso.map(l=>{const f=1+(k-1)*(.55+.9*belly(l.y));return Object.assign({},l,{rx:l.rx*f,rz:l.rz*(1+(k-1)*(.7+1.3*belly(l.y)))})});
 C0.pelvis=B.pelvis.map(l=>{const f=1+(k-1)*1.1;return Object.assign({},l,{rx:l.rx*f,rz:l.rz*(1+(k-1)*1.3)})});
 C0.neck=B.neck.map(l=>{const f=1+(k-1)*.8;return Object.assign({},l,{rx:l.rx*f,rz:l.rz*f})});
 C0.hk=1+(k-1)*.75;C0.armK=B.armK*(1+(k-1)*.9);C0.legK=B.legK*(1+(k-1)*.95);C0.legX=B.legX*(1+(k-1)*.9);C0.shX=B.shX*(1+(k-1)*.5)}
/* ===== game integration ===== */
const pickA=a=>a[Math.floor(Math.random()*a.length)];
const wpick=(a,w)=>{let t=0;w.forEach(x=>t+=x);let r=Math.random()*t;for(let i=0;i<a.length;i++){r-=w[i];if(r<=0)return a[i]}return a[a.length-1]};
const clone=o=>JSON.parse(JSON.stringify(o));
function spec(look){
  const woman=!!look.woman,sex=woman?'f':'m',S={sex,face:look.face!=null?look.face:Math.floor(Math.random()*10),build:look.build!=null?look.build:wpick([.92,1,1.2,1.42],[.2,.5,.22,.08])};
  S.top=look.top||(woman?(look.dress?pickA(['gownA','gownB']):wpick(['tee','long','polo','blouse','tank','crop'],[3,2,2,2,1,1])):wpick(['tee','long','polo','dress','suit'],[3,2,3,1.2,.8]));
  S.bottom=look.bottom||(woman?(S.top==='gownA'||S.top==='gownB'?'jeans':wpick(['jeans','trousers','pencil','aline','shorts'],[4,2,1.5,1.5,.5])):wpick(['jeans','shorts'],[9,1]));
  let hs=look.style||'short';
  if(woman){if(hs==='short')hs='bob';if(hs==='curly')hs='long';if(hs==='buzz')hs='bob'}
  else{if(hs==='long'||hs==='bob'||hs==='ponytail')hs='short';if(!look.styleFixed&&hs==='short'&&Math.random()<.4)hs=wpick(['lowcut','bald','spiky','quiff','mohawk'],[3,1.4,2,2,.5]);if(hs==='buzz'&&Math.random()<.5)hs='lowcut'}
  S.hair=hs;S.beard=!woman&&!!look.beard;
  return S}

/* merge static meshes per joint+material (crowd LOD): fewer draw calls */
function bakeStatic(c,keepFace){
  const bones=new Set([c.g,c.b,c.P,c.C,c.H,c.aL.p,c.aL.k,c.aR.p,c.aR.k,c.lL.p,c.lL.k,c.lR.p,c.lR.k]);
  if(c.clothJ)Object.values(c.clothJ).forEach(o=>o&&o.isObject3D&&bones.add(o));
  c.g.updateMatrixWorld(true);
  const groups=new Map(),dead=[];
  const nearest=o=>{let p=o.parent;while(p&&!bones.has(p))p=p.parent;return p};
  const animG=new Set([c.lipU.g,c.lipL.g,...c.brows.map(b=>b.w.g)]),eyeE=new Set(c.eyes.map(e=>e.e));
  const inEye=o=>{for(let p=o;p;p=p.parent)if(eyeE.has(p))return true;return false};
  c.g.traverse(o=>{if(!o.isMesh||o.isSkinnedMesh||!o.visible)return;if(keepFace&&(o===c.mouth||animG.has(o.geometry)||inEye(o)))return;const b=nearest(o);if(!b)return;
    let key=b.id+'|'+o.material.id,e=groups.get(key);if(!e){e={b,m:o.material,list:[]};groups.set(key,e)}e.list.push(o);dead.push(o)});
  const inv=new T.Matrix4(),mm=new T.Matrix4();
  groups.forEach(e=>{inv.copy(e.b.matrixWorld).invert();
    const P=[],N=[],I=[];let off=0;
    e.list.forEach(o=>{mm.multiplyMatrices(inv,o.matrixWorld);const g=o.geometry,pa=g.attributes.position,na=g.attributes.normal,nm=new T.Matrix3().getNormalMatrix(mm),v=new T.Vector3();
      for(let i=0;i<pa.count;i++){v.fromBufferAttribute(pa,i).applyMatrix4(mm);P.push(v.x,v.y,v.z);if(na){v.fromBufferAttribute(na,i).applyMatrix3(nm).normalize();N.push(v.x,v.y,v.z)}else N.push(0,1,0)}
      if(g.index){for(let i=0;i<g.index.count;i++)I.push(g.index.getX(i)+off)}else for(let i=0;i<pa.count;i++)I.push(i+off);off+=pa.count});
    const G=new T.BufferGeometry();G.setAttribute('position',new T.Float32BufferAttribute(P,3));G.setAttribute('normal',new T.Float32BufferAttribute(N,3));G.setIndex(I);
    const mesh=new T.Mesh(G,e.m);e.b.add(mesh)});
  dead.forEach(o=>{if(o.parent)o.parent.remove(o);o.geometry.dispose&&0});
}
function make(look){
  const S=spec(look),sex=S.sex,cfg=clone(sex==='m'?MAN:FEM);
  applyFace(cfg,sex,S.face);applyBuild(cfg,sex,S.build);
  const mats=makeMats();
  const hi=look.lod!=='lo';const ctx=()=>{CFG=cfg;MAT=mats;Object.assign(HS,cfg.head);LQ=hi?.55:.32;NOOL=!hi;HSEG=hi?[36,26]:[20,14]};
  ctx();
  mats.skin.color.setHex(look.sk);mats.hair.color.setHex(look.hair);mats.lip.color.setHex(cfg.lip);
  const topCol=S.top==='dress'?pickA([0xd6e2f0,0xf4f1ea,0xc9d6e8,0xe6d9e8]):S.top==='suit'?pickA([0x262b3d,0x3a3d44,0x1f2a3a]):look.sh;
  mats.top.color.setHex(topCol);mats.bottom.color.setHex(look.pn);
  mats.collar.color.copy(mats.top.color).multiplyScalar(.8);
  const c=buildChar();
  c.cfg=cfg;c.ctx=ctx;c.sex=sex;c.armAb=sex==='f'?.13:0;
  c.g.scale.setScalar(cfg.scale*GSCALE*(.99+Math.random()*.04));c.H.scale.setScalar(cfg.hk||1);
  c.setOutfit=o=>{ctx();setOutfit(c,o)};c.setHair=(st,opt)=>{ctx();setHair(c,st,opt)};
  ctx();setHair(c,S.hair,{bangs:false,beard:S.beard});ctx();setOutfit(c,{top:S.top,bottom:S.bottom});
  // glasses
  if(look.glasses){ctx();const gm=new T.MeshBasicMaterial({color:0x222222});
    [-1,1].forEach(s=>{const r=new T.Mesh(new T.TorusGeometry(.024,.0026,6,22),gm);const x=s*.044*(cfg.eyeX||1),y=.212+(cfg.eyeY||0);r.position.set(x,y,surfZ(x,y)+.004);c.H.children[0].add(r)});
    const br=new T.Mesh(new T.BoxGeometry(.03,.003,.003),gm);br.position.set(0,.214,surfZ(0,.214)+.006);c.H.children[0].add(br)}
  ctx();if(!hi)try{updateFace(c,.15,0,0)}catch(e){}bakeStatic(c,hi)
  // props in the right hand
  const phone=new T.Group();[[.065,.115,.012,0x15151a,0],[.055,.095,.004,0x5b9bff,.007]].forEach(p=>{const m=new T.Mesh(new T.BoxGeometry(p[0],p[1],p[2]),p[3]===0x5b9bff?new T.MeshBasicMaterial({color:p[3]}):new T.MeshLambertMaterial({color:p[3]}));m.position.z=p[4];phone.add(m)});
  phone.position.set(0,-.36,.05);phone.rotation.x=.6;phone.visible=false;c.aR.k.add(phone);
  const glass=new T.Group();const gl=new T.Mesh(new T.CylinderGeometry(.036,.03,.1,12),new T.MeshLambertMaterial({color:0xd9a441,transparent:true,opacity:.85}));glass.add(gl);
  glass.position.set(0,-.38,.035);glass.visible=false;c.aR.k.add(glass);
  c.phone=phone;c.glass=glass;
  c.avFace=(dt,mood,mo,bl)=>{ctx();c.fc=(c.fc||0)+dt;if(c.fc>.04||Math.abs(mo-(c._mo||0))>.02){c.fc=0;c._mo=mo;updateFace(c,mood,mo,bl)}else{c.eyes.forEach(e=>{e.lid.rotation.x=-.92+bl*1.72+Math.max(0,mood)*.07})}};
  if(!hi)c.avFace=()=>{};
  c.avSpec=S;
  return c}
window.ReachAvatar={make:make,spec:spec};

})();
