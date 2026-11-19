/* Scene: a newly opened shop (Startup: The First Client). Fresh paint, grand-opening balloons, half-stocked shelves. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
function ground(sc,RX,RZ,col,sky){sc.background=new THREE.Color(sky);sc.add(new THREE.HemisphereLight(0xffffff,0x8a9a70,.95));var d=new THREE.DirectionalLight(0xfff4d8,.6);d.position.set(4,8,3);sc.add(d);var g=new THREE.Mesh(new THREE.PlaneGeometry(RX*2+20,RZ*2+20),new THREE.MeshLambertMaterial({color:col}));g.rotation.x=-Math.PI/2;sc.add(g)}
function tree(sc,x,z,s,c){cy(sc,.12*s,1.6*s,0x6a4a2a,x,.8*s,z);sp(sc,.8*s,c||0x3f8a46,x,2.0*s,z);sp(sc,.6*s,c||0x4a9a50,x+.4*s,1.7*s,z+.2)}

var RX=7,RZ=6;
var RX=5.5,RZ=5;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x2a2a30);
 sc.add(new THREE.HemisphereLight(0xfffaf0,0xb0a890,1));var l=new THREE.PointLight(0xfff4e0,.7,14);l.position.set(0,3,0);sc.add(l);
 room(sc,RX,RZ,0xf6efe2,0xd9c9a8,0xffffff);
 // shop window on the front, GRAND OPENING banner, balloons
 bx(sc,RX*2-3,1.8,.08,0xcfe6f2,0,1.8,RZ-.02);bx(sc,6,.7,.05,0xd8362a,0,3.1,-RZ+.1);bx(sc,5.5,.4,.02,0xffffff,0,3.1,-RZ+.14);
 [-4.6,-4.1,4.1,4.6].forEach(function(x,i){sp(sc,.22,[0xff5a5a,0xffd040,0x4aa8ff,0x5ad07a][i],x,2.6+i%2*.2,-RZ+.6);cy(sc,.005,1.5,0xcccccc,x,1.8,-RZ+.6)});
 // shelves along the walls, a few half-empty, boxed stock on the floor
 [-RX+.3,RX-.3].forEach(function(x){bx(sc,.5,2.4,6,0x8a6a44,x,1.2,0);for(var r=0;r<4;r++)for(var k=0;k<8;k++)if((r*3+k)%5)bx(sc,.3,.28,.5,[0xd8362a,0x3a8ad8,0xe8c040,0x5aa850][(r+k)%4],x+(x<0?.1:-.1),.35+r*.55,-2.7+k*.75)});
 obst.push({t:"b",x1:-RX,x2:-RX+.7,z1:-3,z2:3},{t:"b",x1:RX-.7,x2:RX,z1:-3,z2:3});
 [[-1.6,1.4],[1.8,2.2],[2.6,.8]].forEach(function(p){bx(sc,.8,.5,.6,0xc9a46a,p[0],.25,p[1])});
 // counter with till and a 'first sale' frame
 bx(sc,3,1,.8,0x6a8aa8,0,.5,-RZ+1.8);bx(sc,3.2,.08,.95,0xf0f0f0,0,1.02,-RZ+1.8);bx(sc,.5,.35,.4,0x222,-.8,1.25,-RZ+1.8);bx(sc,.3,.4,.03,0xe8c040,.9,1.3,-RZ+1.75);
 obst.push({t:"b",x1:-1.6,x2:1.6,z1:-RZ+1.3,z2:-RZ+2.3});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(0,-.2,Math.PI*0+Math.PI,0);
 K.person(G.cast[0],{x:0,y:0,z:-RZ+2.6,h:0,seat:0,st:"idle"});
}
K.scenes.reg("shop",{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,-1.8,3.8,1.6,1.2,.6),talkLimitZ:-1.2});
})();
