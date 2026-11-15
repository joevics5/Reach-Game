
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
function make(look){
  const S=spec(look),sex=S.sex,cfg=clone(sex==='m'?MAN:FEM);
  applyFace(cfg,sex,S.face);applyBuild(cfg,sex,S.build);
  const mats=makeMats();
  const ctx=()=>{CFG=cfg;MAT=mats;Object.assign(HS,cfg.head)};
  ctx();
  mats.skin.color.setHex(look.sk);mats.hair.color.setHex(look.hair);mats.lip.color.setHex(cfg.lip);
  const topCol=S.top==='dress'?pickA([0xd6e2f0,0xf4f1ea,0xc9d6e8,0xe6d9e8]):S.top==='suit'?pickA([0x262b3d,0x3a3d44,0x1f2a3a]):look.sh;
  mats.top.color.setHex(topCol);mats.bottom.color.setHex(look.pn);
  mats.collar.color.copy(mats.top.color).multiplyScalar(.8);
  const c=buildChar();
  c.cfg=cfg;c.ctx=ctx;c.sex=sex;c.armAb=sex==='f'?.13:0;
  c.g.scale.setScalar(cfg.scale*(.99+Math.random()*.04));c.H.scale.setScalar(cfg.hk||1);
  c.setOutfit=o=>{ctx();setOutfit(c,o)};c.setHair=(st,opt)=>{ctx();setHair(c,st,opt)};
  ctx();setHair(c,S.hair,{bangs:false,beard:S.beard});ctx();setOutfit(c,{top:S.top,bottom:S.bottom});
  // glasses
  if(look.glasses){ctx();const gm=new T.MeshBasicMaterial({color:0x222222});
    [-1,1].forEach(s=>{const r=new T.Mesh(new T.TorusGeometry(.024,.0026,6,22),gm);const x=s*.044*(cfg.eyeX||1),y=.212+(cfg.eyeY||0);r.position.set(x,y,surfZ(x,y)+.004);c.H.children[0].add(r)});
    const br=new T.Mesh(new T.BoxGeometry(.03,.003,.003),gm);br.position.set(0,.214,surfZ(0,.214)+.006);c.H.children[0].add(br)}
  // props in the right hand
  const phone=new T.Group();[[.065,.115,.012,0x15151a,0],[.055,.095,.004,0x5b9bff,.007]].forEach(p=>{const m=new T.Mesh(new T.BoxGeometry(p[0],p[1],p[2]),p[3]===0x5b9bff?new T.MeshBasicMaterial({color:p[3]}):new T.MeshLambertMaterial({color:p[3]}));m.position.z=p[4];phone.add(m)});
  phone.position.set(0,-.36,.05);phone.rotation.x=.6;phone.visible=false;c.aR.k.add(phone);
  const glass=new T.Group();const gl=new T.Mesh(new T.CylinderGeometry(.036,.03,.1,12),new T.MeshLambertMaterial({color:0xd9a441,transparent:true,opacity:.85}));glass.add(gl);
  glass.position.set(0,-.38,.035);glass.visible=false;c.aR.k.add(glass);
  c.phone=phone;c.glass=glass;
  c.avFace=(dt,mood,mo,bl)=>{ctx();c.fc=(c.fc||0)+dt;if(c.fc>.04||Math.abs(mo-(c._mo||0))>.02){c.fc=0;c._mo=mo;updateFace(c,mood,mo,bl)}else{c.eyes.forEach(e=>{e.lid.rotation.x=-.92+bl*1.72+Math.max(0,mood)*.07})}};
  c.avSpec=S;
  return c}
window.ReachAvatar={make:make,spec:spec};
