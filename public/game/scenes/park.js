/* Scene: city park bench (Friendship: Park Bench). Pond, trees, path, a kickabout patch of grass. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
function ground(sc,RX,RZ,col,sky){sc.background=new THREE.Color(sky);sc.add(new THREE.HemisphereLight(0xffffff,0x8a9a70,.95));var d=new THREE.DirectionalLight(0xfff4d8,.6);d.position.set(4,8,3);sc.add(d);var g=new THREE.Mesh(new THREE.PlaneGeometry(RX*2+20,RZ*2+20),new THREE.MeshLambertMaterial({color:col}));g.rotation.x=-Math.PI/2;sc.add(g)}
function tree(sc,x,z,s,c){cy(sc,.12*s,1.6*s,0x6a4a2a,x,.8*s,z);sp(sc,.8*s,c||0x3f8a46,x,2.0*s,z);sp(sc,.6*s,c||0x4a9a50,x+.4*s,1.7*s,z+.2)}

var RX=7,RZ=6;
var RX=10,RZ=8;
function build(){var obst=[],sc=new THREE.Scene();ground(sc,RX,RZ,0x6fb552,0xa8d8f0);
 bx(sc,16,.02,2,0xd8c8a8,0,.02,2.5);bx(sc,2,.02,8,0xd8c8a8,-3,.02,-1);
 // pond
 var p=new THREE.Mesh(new THREE.CircleGeometry(2.6,28),new THREE.MeshLambertMaterial({color:0x5aa8d8}));p.rotation.x=-Math.PI/2;p.position.set(4.5,.03,-4);sc.add(p);
 // bench (backrest toward -z, so seated people look +z)
 bx(sc,2,.08,.5,0x8a5a32,0,.44,-1.4);bx(sc,2,.5,.06,0x8a5a32,0,.75,-1.66);[-.85,.85].forEach(function(x){bx(sc,.08,.44,.4,0x3a3a40,x,.22,-1.4)});
 tree(sc,-6,-5,1.8);tree(sc,-7.5,1,1.5);tree(sc,7.5,3,1.7,0x4a9a3a);tree(sc,0,-6.5,2);tree(sc,8,-6,1.4);
 // lamp, bin, goalposts for the kickabout
 cy(sc,.05,2.6,0x333,2.6,1.3,0.6);sp(sc,.2,0xfff0b0,2.6,2.7,.6);cy(sc,.18,.7,0x2a6a3a,-1.8,.35,-1.5);
 [-2,0].forEach(function(z,i){cy(sc,.04,1.2,0xffffff,5.5+i*0,.6,5.2+z*.7+(i?1.6:0))});
 obst.push({t:"b",x1:-1.1,x2:1.1,z1:-1.9,z2:-1.0},{t:"b",x1:2,x2:7,z1:-6.8,z2:-1.4});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(-.5,-1.3,0,-.45);
 K.person(G.cast[0],{x:.5,y:-.45,z:-1.3,h:0,seat:1,st:"idle"});
 // the two friends with a ball, and passers-by
 guests([[5.2,4.5,-2.4,0],[6.3,5.6,-2.7,0,1],[-5,3,1.2,0],[-6,2.6,-1,0,1]]);
}
K.scenes.reg("park",{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,-1.3,3.2,1.3,1.0,1.1),talkLimitZ:-1});
})();
