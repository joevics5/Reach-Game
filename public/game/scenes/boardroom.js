/* Scene: boardroom (Startup: Board Pitch). Long dark table, presentation screen, five directors. */
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
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x14181f);
 sc.add(new THREE.HemisphereLight(0xe8f0ff,0x44485a,.85));var l=new THREE.PointLight(0xfff4e0,.8,14);l.position.set(0,3.2,0);sc.add(l);
 room(sc,RX,RZ,0x2d3a4a,0x3a3a44,0xdfe6ee);
 // screen with a chart on the far wall
 bx(sc,4.4,2.2,.08,0x111111,0,2,-RZ+.08);bx(sc,4.2,2,.04,0xf4f7fb,0,2,-RZ+.14);[[-1.4,.6],[-.7,1],[0,1.5],[.7,1.1],[1.4,1.8]].forEach(function(p){bx(sc,.4,p[1],.03,0x3a7ad8,p[0],1.3+p[1]/2,-RZ+.18)});
 // window wall (city)
 bx(sc,.1,1.8,3.6,0xa8d0f0,RX-.05,2,0);
 // the table and executive chairs
 bx(sc,1.6,.08,5.4,0x2a1c14,0,.76,-.2);bx(sc,.4,.7,4.6,0x1a120c,0,.38,-.2);
 [-1.1,1.1].forEach(function(x){for(var i=0;i<3;i++)chair(sc,x,-1.4+i*1.5,x<0?-Math.PI/2:Math.PI/2,0x1a1a20)});
 chair(sc,0,-RZ+1.3,0,0x1a1a20);
 for(var k=0;k<3;k++){bx(sc,.2,.01,.28,0xffffff,-.3+k*.3,.81,.2-1+k*1.4);cy(sc,.04,.1,0xdddddd,.4,.82,-1+k*1.4)}
 obst.push({t:"b",x1:-.9,x2:.9,z1:-2.9,z2:2.5});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(0,3.2,Math.PI,0);       // you stand at the foot of the table, facing the board
 K.person(G.cast[0],{x:0,y:-.45,z:-RZ+1.3,h:0,seat:1,st:"idle"});   // the chair, at the head of the table
 guests([[-1.35,-1.4,Math.PI/2,1],[1.35,-1.4,-Math.PI/2,1,1],[-1.35,.1,Math.PI/2,1,1],[1.35,.1,-Math.PI/2,1]]);
}
K.scenes.reg("boardroom",{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,0,4.6,1.9,1.2,.6),talkLimitZ:2.5});
})();
