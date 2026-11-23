/* Scene: Q&A hall. Dark auditorium with a lit stage, tiered seats, one audience mic in the aisle. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
var RX=8,RZ=8;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x0e0e14);
 sc.add(new THREE.HemisphereLight(0x9aa0c0,0x201c28,.7));
 var sl=new THREE.PointLight(0xffe8c0,1.1,12);sl.position.set(0,3.3,-4.5);sc.add(sl);
 room(sc,RX,RZ,0x2a2433,0x3a2e3e,0x141218);
 bx(sc,8,.02,3.4,0x6a4a2a,0,.02,-RZ+1.8);bx(sc,8,3,.1,0x14224a,0,1.8,-RZ+.1);bx(sc,5,1.1,.05,0x4a7aff,0,2.1,-RZ+.2);bx(sc,.9,1.2,.45,0x2a2a30,2.4,.9,-RZ+2.4);
 // two chairs on stage (host)
 chair(sc,-2.5,-RZ+2.5,0,0xcfcfd8).position.y=0;
 // tiered rows
 for(var r=0;r<6;r++)for(var c=-5;c<=5;c++){if(Math.abs(c)<=.5)continue;var ch=chair(sc,c*1.0,.2+r*1.2,Math.PI,0x3a3056);ch.position.y=r*.12;bx(sc,1,.12*(r+1),1,0x2a2230,c,.06*(r+1),.2+r*1.2+.1)}
 bx(sc,1,.04,.04,0x111,0,0,0);
 // aisle mic
 cy(sc,.02,1.4,0x222,0,.7,-.5);sp(sc,.06,0x888888,0,1.45,-.5);
 obst.push({t:"b",x1:-5.6,x2:-.8,z1:-.2,z2:7.6},{t:"b",x1:.8,x2:5.6,z1:-.2,z2:7.6});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(0,-5.4,0,0);
 K.person(G.cast[0],{x:-1.9,y:0,z:-.6,h:Math.PI,seat:0,st:"idle"});
 var g=[];for(var r=0;r<5;r++)for(var c=-5;c<=5;c++)if(Math.abs(c)>.5&&Math.random()<.45)g.push([c*1,.2+r*1.2,Math.PI,1,r]);
 guests(g);
}
K.scenes.reg("qa",{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,-3.0,3.6,2.1,1.3,-1.1),talkLimitZ:-1.5});
})();
