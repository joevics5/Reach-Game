/* Scene: debate room. Two lecterns, judges' table, small audience, cool grey-blue. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
var RX=6,RZ=5.5;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x1e2530);
 sc.add(new THREE.HemisphereLight(0xe8f0ff,0x444a58,.9));var l=new THREE.PointLight(0xffffff,.6,14);l.position.set(0,3.2,0);sc.add(l);
 room(sc,RX,RZ,0xb8c4d4,0x5b6574,0xe6ebf2);
 bx(sc,5,1.2,.05,0xf4f6fa,0,2,-RZ+.05);bx(sc,4.6,.5,.04,0x2a4a8a,0,2.2,-RZ+.1);
 // one table with two chairs facing each other across it
 bx(sc,1,.08,1.4,0x6a4a30,0,.75,-.2);bx(sc,.3,.72,.3,0x4a3420,0,.37,-.2);bx(sc,.28,.2,.04,0x111111,0,.9,-.2);
 chair(sc,-1.15,-.2,Math.PI/2,0x2a4a8a);chair(sc,1.15,-.2,-Math.PI/2,0x7a2a30);
 obst.push({t:'b',x1:-1.5,x2:1.5,z1:-1,z2:.6});
 bx(sc,.5,.3,.04,0x111111,0,2.9,-RZ+.1);
 // judges table
 bx(sc,3.2,.08,.8,0x6a4a30,0,.75,-RZ+1.2);bx(sc,3.2,.7,.04,0x6a4a30,0,.4,-RZ+.8);
 [-1,0,1].forEach(function(x){bx(sc,.25,.14,.02,0xffffff,x,.9,-RZ+1.1)});
 // a sofa where the waiting opponents sit
 bx(sc,.9,.42,3.7,0x4a4a58,5.7,.21,-1.1);bx(sc,.25,.95,3.7,0x3c3c4a,6.2,.72,-1.1);
 obst.push({t:'b',x1:5,x2:6.5,z1:-3.1,z2:.9});
 // audience rows
 for(var r=0;r<3;r++)for(var c=-3;c<=3;c++)chair(sc,c*1.0,2.2+r*1.2,Math.PI,0x384050);
 obst.push({t:"b",x1:-3.7,x2:3.7,z1:1.6,z2:5});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(-1.15,-.2,Math.PI/2,-.45);
 K.person(G.cast[0],{x:1.15,y:-.45,z:-.2,h:-Math.PI/2,seat:1,st:"idle"});
 var g=[];for(var r=0;r<3;r++)for(var c=-3;c<=3;c++)if(Math.random()<.45)g.push([c*1.0,2.2+r*1.2,Math.PI,1,r]);
 [-1,0,1].forEach(function(x,i){g.push([x,-RZ+1.9,0,1,i])});
 guests(g);
 guests([[5.55,-2.4,-Math.PI/2,1],[5.55,-1.6,-Math.PI/2,1,1],[5.55,-.8,-Math.PI/2,1],[5.55,0,-Math.PI/2,1,1]]);
 W.sofa=W.npcs.slice(-4);
}
K.scenes.reg("debate",{start:{x:4.9,z:4.6,h:Math.PI},rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,-.2,3.2,1.9,1,-1.5)});
})();
