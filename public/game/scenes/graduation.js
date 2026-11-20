/* Scene: graduation hall. Navy and gold, stage with podium, rows of gowned graduates. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty){return function(){var a=W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}

var RX=9,RZ=8;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x15182a);
 sc.add(new THREE.HemisphereLight(0xdfe6ff,0x40384a,.85));var l=new THREE.PointLight(0xfff2d0,.7,18);l.position.set(0,3.4,-2);sc.add(l);
 room(sc,RX,RZ,0x24315a,0x6a5a48,0x1c2444);
 // stage, curtain, crest, podium
 bx(sc,12,.02,3.4,0x4a3a2c,0,.02,-RZ+1.8);bx(sc,12,2.8,.2,0x7a1d2a,0,1.8,-RZ+.1);for(var i=0;i<12;i++)bx(sc,.08,2.8,.12,0x5a1420,-5.5+i,1.8,-RZ+.22);
 bx(sc,1.6,1.6,.06,0xd4af37,0,2.6,-RZ+.3);sp(sc,.45,0xf2d060,0,2.6,-RZ+.34);
 bx(sc,.9,1,.6,0x3a2a1c,0,.88,-RZ+2.3);bx(sc,.7,.05,.5,0x5a432e,0,1.4,-RZ+2.3);
 for(var k=0;k<5;k++){bx(sc,.8,.04,.8,0xffffff,0,0,0);}
 // faculty chairs on stage
 [-4,-3,3,4].forEach(function(x){chair(sc,x,-RZ+1.7,0,0x7a1d2a).position.y=0});
 // flags and balloons
 [-5.5,5.5].forEach(function(x){cy(sc,.03,3,0x777777,x,1.5,-RZ+3.2);bx(sc,.8,.5,.02,x<0?0xd4af37:0x24315a,x+.4,2.7,-RZ+3.2)});
 for(var b=0;b<9;b++)sp(sc,.18,[0xd4af37,0x24315a,0xffffff][b%3],-7+b*1.7,3.1,-RZ+.9);
 // rows of seats
 for(var r=0;r<5;r++)for(var c=-4;c<=4;c++)chair(sc,c*1.05,2+r*1.3,Math.PI,0x333b55);
 obst.push({t:"b",x1:-5,x2:5,z1:1.4,z2:7.5});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(0,-6.3,0,0);
 K.person(G.cast[0],{x:-2.4,y:0,z:-6.2,h:Math.PI/2,seat:0,st:"idle"});
 var g=[];for(var r=0;r<3;r++)for(var c=-4;c<=4;c++)if(Math.random()<.7)g.push([c*1.05,2+r*1.3,Math.PI,1,r]);
 guests(g);
}
K.scenes.reg("graduation",{start:{x:6.6,z:7,h:Math.PI},rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(-1.2,-5.2,6,2.2,1.5),talkLimitZ:-2});
})();
