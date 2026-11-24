/* Scene: night bus stop (Rizz: The Last Bus). Shelter, streetlamp, wet road, shop fronts closed for the night. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
function ground(sc,RX,RZ,col,sky){sc.background=new THREE.Color(sky);sc.add(new THREE.HemisphereLight(0xffffff,0x8a9a70,.95));var d=new THREE.DirectionalLight(0xfff4d8,.6);d.position.set(4,8,3);sc.add(d);var g=new THREE.Mesh(new THREE.PlaneGeometry(RX*2+20,RZ*2+20),new THREE.MeshLambertMaterial({color:col}));g.rotation.x=-Math.PI/2;sc.add(g)}
function tree(sc,x,z,s,c){cy(sc,.12*s,1.6*s,0x6a4a2a,x,.8*s,z);sp(sc,.8*s,c||0x3f8a46,x,2.0*s,z);sp(sc,.6*s,c||0x4a9a50,x+.4*s,1.7*s,z+.2)}

var RX=7,RZ=6;
var RX=8,RZ=6;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x0c1020);
 sc.add(new THREE.HemisphereLight(0x8a9ac8,0x20243a,.6));
 [[-3,3.4,0,0xffc880,1,14],[4,3.4,-3,0xffc880,.8,14],[0,3,3,0x9ab8ff,.4,10]].forEach(function(l){var p=new THREE.PointLight(l[3],l[4],l[5]);p.position.set(l[0],l[1],l[2]);sc.add(p)});
 var g=new THREE.Mesh(new THREE.PlaneGeometry(RX*2+20,RZ*2+20),new THREE.MeshLambertMaterial({color:0x34363e}));g.rotation.x=-Math.PI/2;sc.add(g);
 bx(sc,RX*2+20,.04,3,0x2a2c34,0,.02,3.6);for(var d=-8;d<=8;d+=2)bx(sc,.9,.01,.12,0xdddddd,d,.05,3.6);        // road with dashes
 bx(sc,RX*2+20,.12,1.6,0x6a6c76,0,.06,-1.6);                                                                      // pavement
 // shelter: back panel (glass), roof, side, bench and timetable
 bx(sc,3.4,.08,1.4,0x3a3e4a,0,2.5,-3);bx(sc,3.2,2.2,.05,0x8ab0d0,0,1.3,-3.6);bx(sc,.05,2.2,1.4,0x8ab0d0,-1.6,1.3,-3);bx(sc,.08,2.4,.08,0x222,1.65,1.2,-3.6);bx(sc,.08,2.4,.08,0x222,-1.65,1.2,-3.6);
 bx(sc,2.4,.06,.45,0x6a4a2a,0,.46,-3.3);bx(sc,.5,.7,.04,0xfff4d0,1.1,1.5,-3.55);bx(sc,.4,.5,.01,0x2a6ac8,1.1,1.5,-3.52);
 // bus stop pole and sign, lamp, bin, closed shopfronts behind
 cy(sc,.04,3,0x888,2.8,1.5,-1.2);bx(sc,.5,.4,.05,0xd8362a,2.8,2.9,-1.2);cy(sc,.07,4,0x333,-4,2,-.9);sp(sc,.3,0xffe8b0,-4,4.1,-.9);cy(sc,.2,.8,0x2a6a3a,-2.6,.4,-2.2);
 [[-6,0x3a2a4a],[-2,0x2a3a4a],[2,0x4a2a2a],[6,0x2a4a3a]].forEach(function(p,i){bx(sc,3.6,3.4,.4,p[1],p[0],1.7,-RZ+.2);bx(sc,2.4,1.5,.06,0x151a24,p[0],1.1,-RZ+.45);bx(sc,2.4,.2,.05,[0xe8c040,0x40a8e8,0xe86a8a,0x5ad07a][i],p[0],2.5,-RZ+.45)});
 obst.push({t:"b",x1:-1.7,x2:1.7,z1:-3.7,z2:-2.9});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(-.7,-1.5,0,0);
 K.person(G.cast[0],{x:.4,y:0,z:-1.5,h:0,seat:0,st:"phone"});
}
K.scenes.reg("busstop",{open:true,fill:{n:4,pairs:1,wander:2},side:true,rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,-1.5,3.2,1.5,1.2,1.3),talkLimitZ:-1});
})();
