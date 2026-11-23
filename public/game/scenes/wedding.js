/* Scene: wedding reception hall (Best Man Toast). Warm string lights, round tables, head table. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}

var RX=8,RZ=7;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x2a1f2e);
 sc.add(new THREE.HemisphereLight(0xffe6c8,0x5a4048,.8));var l=new THREE.PointLight(0xffd8a0,.8,16);l.position.set(0,3.2,0);sc.add(l);
 room(sc,RX,RZ,0xf3e6dc,0x8a5a3a,0xf8f0e8);
 // dance floor + stage riser at the far end
 bx(sc,4,.02,3,0xb08050,0,.02,3.2);bx(sc,5,.02,1.6,0x6a4a38,0,.02,-RZ+1.1);
 // string lights
 for(var i=0;i<14;i++){var x=-RX+1+i*(RX*2-2)/13;sp(sc,.07,0xfff0b0,x,3.2-Math.sin(i/13*Math.PI)*.35,-1.2);sp(sc,.07,0xfff0b0,x,3.2-Math.sin(i/13*Math.PI)*.35,3.4)}
 // banner and flowers
 bx(sc,3.2,.5,.05,0xe8b4b8,0,2.4,-RZ+.05);bx(sc,3,.08,.06,0xffffff,0,2.4,-RZ+.09);
 [-3.4,3.4].forEach(function(x){cy(sc,.25,.9,0xffffff,x,.45,-RZ+.6);sp(sc,.4,0xe86a8a,x,1.2,-RZ+.6);sp(sc,.3,0xfff2f2,x+.25,1.1,-RZ+.6)});
 // head table (long, top) with bride and groom seats, round guest tables
 var tabs=[[-5,-.5],[5,-.5],[-5,3.4],[5,3.4],[-2.8,4.8],[2.8,4.8]];
 tabs.forEach(function(p){cy(sc,.9,.75,0xfaf6f0,p[0],.38,p[1]);cy(sc,.1,.75,0x888888,p[0],.38,p[1]);obst.push({t:"b",x1:p[0]-1,x2:p[0]+1,z1:p[1]-1,z2:p[1]+1});sp(sc,.12,0xe86a8a,p[0],.9,p[1])});
 // mic stand
 cy(sc,.02,1.4,0x222222,0,.7,-RZ+1.1);
 return {scene:sc,obst:obst}}
function setup(){
 K.player(0,-5.8,0,0);
 K.person(G.cast[0],{x:-3.99,y:-.45,z:.25,h:-2.2,seat:1,st:"idle"});
 var g=[];[[-5,-.5],[5,-.5],[-5,3.4],[5,3.4]].forEach(function(t,k){for(var i=0;i<5;i++){var a=i/5*6.28+k;g.push([t[0]+Math.cos(a)*1.25,t[1]+Math.sin(a)*1.25,Math.atan2(-Math.cos(a),-Math.sin(a)),1])}});
 guests(g);
}
K.scenes.reg("wedding",{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,-3.4,3.4,2.0,1.2,-1.1),talkLimitZ:-3});
})();
