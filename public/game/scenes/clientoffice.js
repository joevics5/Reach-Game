/* Scene: client's corner office (Startup: The Difficult Client). Modern, glass, skyline, a big angry-looking desk. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
function ground(sc,RX,RZ,col,sky){sc.background=new THREE.Color(sky);sc.add(new THREE.HemisphereLight(0xffffff,0x8a9a70,.95));var d=new THREE.DirectionalLight(0xfff4d8,.6);d.position.set(4,8,3);sc.add(d);var g=new THREE.Mesh(new THREE.PlaneGeometry(RX*2+20,RZ*2+20),new THREE.MeshLambertMaterial({color:col}));g.rotation.x=-Math.PI/2;sc.add(g)}
function tree(sc,x,z,s,c){cy(sc,.12*s,1.6*s,0x6a4a2a,x,.8*s,z);sp(sc,.8*s,c||0x3f8a46,x,2.0*s,z);sp(sc,.6*s,c||0x4a9a50,x+.4*s,1.7*s,z+.2)}

var RX=7,RZ=6;
var RX=5,RZ=4.5;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x1a2230);
 sc.add(new THREE.HemisphereLight(0xdcecff,0x40485a,.9));var l=new THREE.PointLight(0xfff4e0,.6,12);l.position.set(0,3,0);sc.add(l);
 room(sc,RX,RZ,0x3a4658,0x4a4e58,0xe8edf2);
 // skyline window wall
 var sky=tex(128,128,function(x,w,h){var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#2a4a8a');g.addColorStop(1,'#f4a868');x.fillStyle=g;x.fillRect(0,0,w,h);for(var i=0;i<12;i++){x.fillStyle='hsl(220,20%,'+(14+i%4*4)+'%)';var bh=30+(i*37)%60;x.fillRect(i*11,h-bh,10,bh)}},1,1);
 mesh(sc,new THREE.PlaneGeometry(RX*2-1,2.6),new THREE.MeshBasicMaterial({map:sky}),0,2,-RZ+.03);
 // desk, laptop, a thick contract folder with a red tab, two visitor chairs, sofa
 bx(sc,2.4,.08,1,0x1a1a20,0,.76,-1.4);bx(sc,2.2,.7,.06,0x111118,0,.4,-1.85);bx(sc,.5,.32,.03,0x333,-.6,1.04,-1.6);bx(sc,.3,.04,.22,0xd8d8e0,.5,.82,-1.3);bx(sc,.06,.04,.2,0xd8362a,.38,.84,-1.3);
 chair(sc,0,-2.4,0,0x111118);chair(sc,-.8,.3,Math.PI,0x8a95a8);chair(sc,.8,.3,Math.PI,0x8a95a8);
 bx(sc,2.2,.45,.8,0x5a6a8a,3.6,.25,2.4);bx(sc,2.2,.5,.15,0x5a6a8a,3.6,.6,2.8);
 bx(sc,.5,1.4,.5,0x2a2a30,-4.4,.7,-3.5);sp(sc,.45,0x3a9a5a,-4.4,1.6,-3.5);
 obst.push({t:"b",x1:-1.3,x2:1.3,z1:-2,z2:-.85},{t:"b",x1:2.4,x2:4.8,z1:2,z2:3.2});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(0,-.25,Math.PI,0);      // you stand in front of the desk, facing it
 K.person(G.cast[0],{x:0,y:-.45,z:-2.4,h:0,seat:1,st:"phone"});
}
K.scenes.reg("clientoffice",{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,-1.3,3.5,1.7,1.2,1.0),talkLimitZ:-.3});
})();
