/* Scene: a neighbour's front door (Friendship: New Neighbour). Suburban, sunny, hedges and a path. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
function ground(sc,RX,RZ,col,sky){sc.background=new THREE.Color(sky);sc.add(new THREE.HemisphereLight(0xffffff,0x8a9a70,.95));var d=new THREE.DirectionalLight(0xfff4d8,.6);d.position.set(4,8,3);sc.add(d);var g=new THREE.Mesh(new THREE.PlaneGeometry(RX*2+20,RZ*2+20),new THREE.MeshLambertMaterial({color:col}));g.rotation.x=-Math.PI/2;sc.add(g)}
function tree(sc,x,z,s,c){cy(sc,.12*s,1.6*s,0x6a4a2a,x,.8*s,z);sp(sc,.8*s,c||0x3f8a46,x,2.0*s,z);sp(sc,.6*s,c||0x4a9a50,x+.4*s,1.7*s,z+.2)}

var RX=7,RZ=6;
function build(){var obst=[],sc=new THREE.Scene();ground(sc,RX,RZ,0x7fbf5a,0xa8d8f0);
 bx(sc,3.6,.02,RZ*2,0xd8cfc0,0,.02,0);               // path
 // the house
 bx(sc,8,3.2,.4,0xe8d8b8,0,1.6,-RZ+.4);bx(sc,8.4,.3,1.2,0x8a3a2a,0,3.35,-RZ+.7);bx(sc,1.1,2.2,.12,0x2a5a8a,0,1.1,-RZ+.62);sp(sc,.06,0xd4af37,.35,1.1,-RZ+.7);
 [-2.8,2.8].forEach(function(x){bx(sc,1.3,1.1,.1,0xcfe6f2,x,1.8,-RZ+.62);bx(sc,1.5,.1,.2,0xffffff,x,1.2,-RZ+.7)});
 bx(sc,2,.12,1.2,0xcfc4b0,0,.06,-RZ+1.3);               // step
 // doormat, plant pots, hedges, mailbox, trees, fence
 bx(sc,.9,.03,.5,0x8a5a3a,0,.14,-RZ+1.8);[-1.2,1.2].forEach(function(x){cy(sc,.22,.4,0xb85a3a,x,.2,-RZ+1.2);sp(sc,.3,0x3a9a4a,x,.6,-RZ+1.2)});
 [-4.8,-3.6,3.6,4.8].forEach(function(x){bx(sc,1.1,.8,.8,0x2f7a3a,x,.4,-RZ+1.8)});
 for(var f=-6;f<=6;f+=.6)bx(sc,.08,.9,.08,0xffffff,f,.45,RZ-.3);bx(sc,RX*2,.08,.06,0xffffff,0,.7,RZ-.3);
 tree(sc,-6,-2,1.6);tree(sc,6.2,-1,1.4);
 obst.push({t:"b",x1:-4,x2:4,z1:-RZ,z2:-RZ+1});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(0,-RZ+3,0,0);
 K.person(G.cast[0],{x:0,y:.12,z:-RZ+1.6,h:Math.PI,seat:0,st:"idle"});
 guests([[5.5,3,-2.5,0],[-5.5,2,2,0,1]]);
}
K.scenes.reg("doorstep",{fill:{n:3,pairs:1,wander:2},rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,-RZ+2.3,3.4,1.5,1.3,.35),talkLimitZ:-RZ+2.4});
})();
