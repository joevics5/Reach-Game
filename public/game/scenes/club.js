/* Scene: debate club room (Friendship: Club President). A classroom with a whiteboard, posters, and five prospects in a loose circle. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
function ground(sc,RX,RZ,col,sky){sc.background=new THREE.Color(sky);sc.add(new THREE.HemisphereLight(0xffffff,0x8a9a70,.95));var d=new THREE.DirectionalLight(0xfff4d8,.6);d.position.set(4,8,3);sc.add(d);var g=new THREE.Mesh(new THREE.PlaneGeometry(RX*2+20,RZ*2+20),new THREE.MeshLambertMaterial({color:col}));g.rotation.x=-Math.PI/2;sc.add(g)}
function tree(sc,x,z,s,c){cy(sc,.12*s,1.6*s,0x6a4a2a,x,.8*s,z);sp(sc,.8*s,c||0x3f8a46,x,2.0*s,z);sp(sc,.6*s,c||0x4a9a50,x+.4*s,1.7*s,z+.2)}

var RX=7,RZ=6;
var RX=6,RZ=5;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x2a2a32);
 sc.add(new THREE.HemisphereLight(0xffffff,0x9a8a70,.95));var l=new THREE.PointLight(0xfff4e0,.8,14);l.position.set(0,3,0);sc.add(l);
 room(sc,RX,RZ,0xf4efe0,0xa9835a,0xffffff);
 for(var i=-5;i<=5;i++)bx(sc,.04,.025,RZ*2,0x8a6a44,i*1.1,.03,0);
 // whiteboard with club sign-up, posters, windows
 bx(sc,4,1.4,.06,0xffffff,0,1.9,-RZ+.06);bx(sc,4.2,1.6,.04,0x888888,0,1.9,-RZ+.03);bx(sc,2.4,.3,.02,0x2a6ac8,0,2.35,-RZ+.1);for(var j=0;j<4;j++)bx(sc,1.2+j*.2,.05,.02,0x444444,-.4,1.9-j*.2,-RZ+.1);
 [-4.4,4.4].forEach(function(x,i){bx(sc,.9,1.2,.04,[0xe8b04a,0x6aa8e0][i],x,1.9,-RZ+.06)});
 bx(sc,.1,1.6,2.6,0xcfe6f2,RX-.05,1.9,0);bx(sc,.1,1.6,2.6,0xcfe6f2,-RX+.05,1.9,0);
 // teacher desk, a table with sign-up sheets, student chairs in a circle
 bx(sc,1.8,.08,.8,0x6a4a2a,2.8,.78,-3.9);bx(sc,1.6,.5,.04,0x6a4a2a,2.8,.5,-4.2);
 bx(sc,1.2,.06,.7,0x8a6a44,-2.8,.76,-3.8);bx(sc,.3,.01,.2,0xffffff,-2.8,.8,-3.8);
 for(var a=0;a<5;a++){var an=Math.PI*(.2+a*.15)+Math.PI*0,cx=Math.cos(an+Math.PI)*2.2,cz=Math.sin(an+Math.PI)*-2.2+.5;chair(sc,cx,cz+0,0,0x3a5a9a)}
 obst.push({t:"b",x1:-3.5,x2:-2,z1:-4.2,z2:-3.4},{t:"b",x1:2,x2:3.6,z1:-4.3,z2:-3.5});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(0,-2.2,0,0);
 K.person(G.cast[0],{x:0,y:-.45,z:.5,h:Math.PI,seat:1,st:"idle"});
 // the other four prospects, loosely around
 var g=[[-1.8,.2,Math.PI*.8,1],[1.8,.2,-Math.PI*.8,1],[-2.8,1.4,Math.PI*.6,1,1],[2.8,1.4,-Math.PI*.6,1,1]];
 guests(g);
}
K.scenes.reg("club",{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,-.9,5,1.8,1.1,.7),talkLimitZ:-3.5});
})();
