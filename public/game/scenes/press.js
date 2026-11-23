/* Scene: press briefing room. Bright, blue backdrop with logos, podium with microphones, camera tripods, reporters seated. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
var RX=7,RZ=6.5;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x202630);
 sc.add(new THREE.HemisphereLight(0xffffff,0x555a66,.95));var l=new THREE.PointLight(0xffffff,.9,16);l.position.set(0,3.3,0);sc.add(l);
 room(sc,RX,RZ,0xdde3ea,0x3c424d,0xf2f4f7);
 // blue backdrop with repeated logo squares
 bx(sc,7,2.6,.1,0x1a3a7a,0,1.5,-RZ+.1);for(var i=0;i<5;i++)for(var j=0;j<3;j++)bx(sc,.35,.35,.02,0xffffff,-2.8+i*1.4,.6+j*.8,-RZ+.18);
 // podium with a cluster of mics
 bx(sc,1,1.15,.55,0x1a1a20,0,.58,-RZ+1.6);bx(sc,.9,.04,.5,0x333a48,0,1.18,-RZ+1.6);for(var m=0;m<5;m++){cy(sc,.012,.2,0x111,-.35+m*.17,1.3,-RZ+1.45);sp(sc,.035,[0xe03030,0x3060e0,0xffffff,0x20a040,0xe0a020][m],-.35+m*.17,1.42,-RZ+1.45)}
 // camera tripods at the back
 for(var t=0;t<4;t++){var x=-4.5+t*3;cy(sc,.03,1.4,0x222,x,.7,5.2);bx(sc,.4,.3,.5,0x111,x,1.5,5.2);sp(sc,.07,0xff3030,x,1.62,4.95)}
 // reporters' chairs
 for(var r=0;r<4;r++)for(var c=-3;c<=3;c++)chair(sc,c*1.15,1.2+r*1.2,Math.PI,0x2f3542);
 obst.push({t:"b",x1:-4.2,x2:4.2,z1:.7,z2:5});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(0,-5.4,0,0);
 K.person(G.cast[0],{x:-1.9,y:0,z:-1.4,h:Math.PI,seat:0,st:"idle"});
 var g=[];for(var r=0;r<4;r++)for(var c=-3;c<=3;c++)if(Math.random()<.65)g.push([c*1.15,1.2+r*1.2,Math.PI,1,r]);
 guests(g);
 // a couple of photographers standing at the sides
 guests([[-4.8,-1.5,Math.PI/2,0],[4.8,-1.2,-Math.PI/2,0,1]]);
}
K.scenes.reg("press",{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,-3.2,3.6,2.0,1.3,-1.1),talkLimitZ:-2.5});
})();
