/* Scene: branch loan desk (Startup: The Business Loan). Open-plan bank branch, queue ticket machine, glass booth. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
function ground(sc,RX,RZ,col,sky){sc.background=new THREE.Color(sky);sc.add(new THREE.HemisphereLight(0xffffff,0x8a9a70,.95));var d=new THREE.DirectionalLight(0xfff4d8,.6);d.position.set(4,8,3);sc.add(d);var g=new THREE.Mesh(new THREE.PlaneGeometry(RX*2+20,RZ*2+20),new THREE.MeshLambertMaterial({color:col}));g.rotation.x=-Math.PI/2;sc.add(g)}
function tree(sc,x,z,s,c){cy(sc,.12*s,1.6*s,0x6a4a2a,x,.8*s,z);sp(sc,.8*s,c||0x3f8a46,x,2.0*s,z);sp(sc,.6*s,c||0x4a9a50,x+.4*s,1.7*s,z+.2)}

var RX=7,RZ=6;
var RX=7,RZ=5.5;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x2a2f3a);
 sc.add(new THREE.HemisphereLight(0xf4f8ff,0x8a9098,.95));var l=new THREE.PointLight(0xffffff,.7,16);l.position.set(0,3.2,0);sc.add(l);
 room(sc,RX,RZ,0xe6ebf2,0xcfd6de,0xffffff);
 for(var i=-3;i<=3;i++)bx(sc,.03,.02,RZ*2,0xb8c0cc,i*2,.025,0);
 bx(sc,5,.7,.06,0x0f5a8a,0,2.7,-RZ+.08);bx(sc,4.4,.3,.02,0xffffff,0,2.7,-RZ+.14);
 // teller line along the left, a ticket machine, plants
 bx(sc,.7,1.1,5,0x335a7a,-RX+1,.55,-.5);for(var t=0;t<3;t++)bx(sc,.5,.4,.03,0x111,-RX+1.1,1.4,-2+t*1.6);
 bx(sc,.5,1.2,.4,0xd8362a,RX-1,.6,3.8);bx(sc,.35,.25,.03,0xfff4d0,RX-1,1.1,3.62);
 sp(sc,.4,0x3e8a4a,RX-.7,.8,-3.6);cy(sc,.25,.5,0x888,RX-.7,.25,-3.6);
 // glass loan booth in the middle-back: desk with two chairs
 bx(sc,.04,2.2,3,0xcfe6f2,-2.6,1.1,-2.4);bx(sc,.04,2.2,3,0xcfe6f2,2.6,1.1,-2.4);bx(sc,5.2,.04,.04,0xcfe6f2,0,2.2,-3.9);
 bx(sc,1.8,.08,.9,0x8a6a44,0,.76,-2.6);bx(sc,1.6,.7,.04,0x5a432e,0,.4,-2.95);bx(sc,.5,.3,.03,0x222,-.5,1.02,-2.8);bx(sc,.3,.02,.22,0xffffff,.4,.82,-2.5);
 chair(sc,0,-3.5,0,0x2a3a50);chair(sc,0,-1.6,Math.PI,0x8a95a8);
 obst.push({t:"b",x1:-RX,x2:-RX+1.4,z1:-3,z2:2},{t:"b",x1:-1,x2:1,z1:-3,z2:-2.1});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(0,-1.5,Math.PI,-.45);   // you are seated at the loan desk, facing the officer
 K.person(G.cast[0],{x:0,y:-.45,z:-3.5,h:0,seat:1,st:"idle"});
 guests([[-RX+1.9,.4,Math.PI/2*3,0],[-RX+2,-2,Math.PI/2*3,0,1],[3,3,Math.PI,0],[4,-.5,0,0,1]]);
}
K.scenes.reg("loan",{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,-2.5,3.4,1.55,1.2,.7),talkLimitZ:-1.2});
})();
