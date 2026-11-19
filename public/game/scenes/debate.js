/* Scene: debate room. Two lecterns, judges' table, small audience, cool grey-blue. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty){return function(){var a=W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
var RX=6,RZ=5.5;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x1e2530);
 sc.add(new THREE.HemisphereLight(0xe8f0ff,0x444a58,.9));var l=new THREE.PointLight(0xffffff,.6,14);l.position.set(0,3.2,0);sc.add(l);
 room(sc,RX,RZ,0xb8c4d4,0x5b6574,0xe6ebf2);
 bx(sc,5,1.2,.05,0xf4f6fa,0,2,-RZ+.05);bx(sc,4.6,.5,.04,0x2a4a8a,0,2.2,-RZ+.1);
 // two lecterns facing each other with side-by-side clocks
 [-1.2,1.2].forEach(function(x,i){bx(sc,.8,1.1,.5,i?0x7a2a30:0x2a4a8a,x,.55,0);bx(sc,.7,.04,.45,0xeeeeee,x,1.12,0)});
 bx(sc,.5,.3,.04,0x111111,0,2.9,-RZ+.1);
 // judges table
 bx(sc,3.2,.08,.8,0x6a4a30,0,.75,-RZ+1.2);bx(sc,3.2,.7,.04,0x6a4a30,0,.4,-RZ+.8);
 [-1,0,1].forEach(function(x){bx(sc,.25,.14,.02,0xffffff,x,.9,-RZ+1.1)});
 // audience rows
 for(var r=0;r<3;r++)for(var c=-3;c<=3;c++)chair(sc,c*1.0,2.2+r*1.2,Math.PI,0x384050);
 obst.push({t:"b",x1:-3.7,x2:3.7,z1:1.6,z2:5});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(-1.2,-.7,0,0);
 K.person(G.cast[0],{x:1.2,y:0,z:-.7,h:0,seat:0,st:"idle"});
 var g=[];for(var r=0;r<3;r++)for(var c=-3;c<=3;c++)if(Math.random()<.45)g.push([c*1.0,2.2+r*1.2,Math.PI,1,r]);
 [-1,0,1].forEach(function(x,i){g.push([x,-RZ+1.9,0,1,i])});
 guests(g);
}
K.scenes.reg("debate",{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,0,3.8,1.7,1.35),talkLimitZ:-2});
})();
