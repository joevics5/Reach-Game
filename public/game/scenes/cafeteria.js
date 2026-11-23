/* Scene: university cafeteria (Friendship: Cafeteria Connection). Long tables, trays, a serving counter, bright and noisy. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
function ground(sc,RX,RZ,col,sky){sc.background=new THREE.Color(sky);sc.add(new THREE.HemisphereLight(0xffffff,0x8a9a70,.95));var d=new THREE.DirectionalLight(0xfff4d8,.6);d.position.set(4,8,3);sc.add(d);var g=new THREE.Mesh(new THREE.PlaneGeometry(RX*2+20,RZ*2+20),new THREE.MeshLambertMaterial({color:col}));g.rotation.x=-Math.PI/2;sc.add(g)}
function tree(sc,x,z,s,c){cy(sc,.12*s,1.6*s,0x6a4a2a,x,.8*s,z);sp(sc,.8*s,c||0x3f8a46,x,2.0*s,z);sp(sc,.6*s,c||0x4a9a50,x+.4*s,1.7*s,z+.2)}

var RX=7,RZ=6;
var RX=9,RZ=6.5;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x2a2a30);
 sc.add(new THREE.HemisphereLight(0xffffff,0x8a8a90,.95));var l=new THREE.PointLight(0xfff4e0,.7,18);l.position.set(0,3.2,0);sc.add(l);
 room(sc,RX,RZ,0xf0e6c8,0xb8c0c8,0xffffff);
 for(var i=-4;i<=4;i++)bx(sc,.9,.04,.9,(i%2)?0xdde2e8:0xc4cbd4,i*2,.025,0.0);
 // serving counter (back) with sneeze guard, menu board
 bx(sc,10,1,.9,0x8a8e98,0,.5,-RZ+1);bx(sc,10.2,.08,1.05,0xd8dce2,0,1.04,-RZ+1);bx(sc,10,.5,.04,0xcfe6f2,0,1.45,-RZ+1.4);
 bx(sc,5,1.3,.06,0x1a2a3a,0,2.4,-RZ+.1);bx(sc,4.6,.9,.04,0xffe8a0,0,2.4,-RZ+.15);
 for(var t=0;t<3;t++)bx(sc,.45,.03,.32,0x4a5060,-3+t*3,1.1,-RZ+1.1);
 // long tables with benches
 [[-5.2,.2],[0,.2],[5.2,.2],[-5.2,3.4],[5.2,3.4]].forEach(function(p){bx(sc,1.2,.06,4,0xc98a4a,p[0],.76,p[1]);[-.75,.75].forEach(function(dx){bx(sc,.35,.06,3.8,0x4a5a8a,p[0]+dx*1.05,.44,p[1])});obst.push({t:"b",x1:p[0]-.7,x2:p[0]+.7,z1:p[1]-2,z2:p[1]+2});
  for(var k=0;k<3;k++)bx(sc,.38,.03,.28,[0xd04a3a,0x3a8ad0,0xd0b03a][k],p[0]+(k%2?.2:-.2),.8,p[1]-1.2+k*1.1)});
 return {scene:sc,obst:obst}}
function setup(){
 // you meet someone sitting alone at the end of the middle table
 K.player(1.6,-1.2,Math.PI*1.5,0);
 K.person(G.cast[0],{x:.78,y:-.45,z:-1.6,h:-Math.PI/2,seat:1,st:"idle"});
 var g=[];[[-5.2+.8,-1.2],[-5.2+.8,0],[-5.2-.8,.5],[-5.2+.8,1.4],[5.2-.8,-.8],[5.2+.8,.3],[5.2-.8,1],[-5.2+.8,4],[-5.2-.8,3],[5.2+.8,3.8],[5.2-.8,2.6]].forEach(function(p,i){g.push([p[0],p[1]+(p[1]>2?0:0),p[0]<0?(p[0]%1<0?Math.PI/2:-Math.PI/2):-Math.PI/2,1,i])});
 guests(g);
 guests([[-2.5,-RZ+2,0,0],[3,-RZ+2.2,Math.PI*.9,0,1],[1.5,-RZ+.4,Math.PI,0]]);
}
K.scenes.reg("cafeteria",{fill:{n:3,pairs:1,wander:2},rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(1.2,-1.4,3.6,1.6,1.1,1.4),talkLimitZ:-3});
})();
