/* Scene: investor studio (Startup: Shark Tank). Dark studio, spotlight mark, five investors on a dais. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
function ground(sc,RX,RZ,col,sky){sc.background=new THREE.Color(sky);sc.add(new THREE.HemisphereLight(0xffffff,0x8a9a70,.95));var d=new THREE.DirectionalLight(0xfff4d8,.6);d.position.set(4,8,3);sc.add(d);var g=new THREE.Mesh(new THREE.PlaneGeometry(RX*2+20,RZ*2+20),new THREE.MeshLambertMaterial({color:col}));g.rotation.x=-Math.PI/2;sc.add(g)}
function tree(sc,x,z,s,c){cy(sc,.12*s,1.6*s,0x6a4a2a,x,.8*s,z);sp(sc,.8*s,c||0x3f8a46,x,2.0*s,z);sp(sc,.6*s,c||0x4a9a50,x+.4*s,1.7*s,z+.2)}

var RX=7,RZ=6;
var RX=7,RZ=6;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x07080d);
 sc.add(new THREE.HemisphereLight(0x7a88c0,0x1a1a28,.55));
 [[-3,3,-3,0xff6a5a],[3,3,-3,0x5a9aff],[0,3.4,2,0xffffff]].forEach(function(p){var l=new THREE.PointLight(p[3],.9,12);l.position.set(p[0],p[1],p[2]);sc.add(l)});
 room(sc,RX,RZ,0x161a2a,0x1a1c26,0x0a0a10);
 // glossy floor ring and a gold star mark under the pitcher
 cy(sc,1.1,.03,0x2a2e44,0,.02,2.6);cy(sc,.5,.04,0xe8b830,0,.04,2.6);
 // investors' dais with five armchairs, backlit panels
 bx(sc,11,.3,2.4,0x20243a,0,.15,-RZ+1.7);for(var i=-2;i<=2;i++){bx(sc,1.3,.8,.7,0x6a1a1a+0x00020200*(i+2),i*2.1,.7,-RZ+1.9);bx(sc,.9,.3,.05,0xffd860,i*2.1,1.1,-RZ+1.52)}
 bx(sc,12,2.6,.1,0x23304a,0,1.7,-RZ+.1);for(var j=0;j<12;j++)bx(sc,.8,2.4,.05,j%2?0x2e3d5e:0x1f2a42,-5.5+j,1.7,-RZ+.2);
 // cameras
 [[-5,-0.5],[5,0.5]].forEach(function(p){bx(sc,.6,.5,.9,0x111,p[0],1.3,p[1]);cy(sc,.04,1.1,0x222,p[0],.55,p[1]);sp(sc,.06,0xff2020,p[0],1.6,p[1]+.45)});
 obst.push({t:"b",x1:-5.5,x2:5.5,z1:-RZ,z2:-RZ+2.9});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(0,2.6,Math.PI,0);
 K.person(G.cast[0],{x:0,y:.3-.45,z:-RZ+1.9,h:0,seat:1,st:"idle"});
 var n0=W.npcs.length;guests([[-4.2,-RZ+1.9,0,1],[-2.1,-RZ+1.9,0,1,1],[2.1,-RZ+1.9,0,1],[4.2,-RZ+1.9,0,1,1]]);for(var i=n0;i<W.npcs.length;i++)W.npcs[i].c.g.position.y+=.3;
}
K.scenes.reg("sharktank",{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,-.8,5.6,1.8,1.1,.5),talkLimitZ:1.2});
})();
