/* Scene: stadium seats (Friendship: Stadium). Concrete tiers, bright floodlit pitch beyond the rail. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
function ground(sc,RX,RZ,col,sky){sc.background=new THREE.Color(sky);sc.add(new THREE.HemisphereLight(0xffffff,0x8a9a70,.95));var d=new THREE.DirectionalLight(0xfff4d8,.6);d.position.set(4,8,3);sc.add(d);var g=new THREE.Mesh(new THREE.PlaneGeometry(RX*2+20,RZ*2+20),new THREE.MeshLambertMaterial({color:col}));g.rotation.x=-Math.PI/2;sc.add(g)}
function tree(sc,x,z,s,c){cy(sc,.12*s,1.6*s,0x6a4a2a,x,.8*s,z);sp(sc,.8*s,c||0x3f8a46,x,2.0*s,z);sp(sc,.6*s,c||0x4a9a50,x+.4*s,1.7*s,z+.2)}

var RX=9,RZ=7;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x10182a);
 sc.add(new THREE.HemisphereLight(0xdfe8ff,0x3a3a48,.9));var l=new THREE.PointLight(0xffffff,.9,22);l.position.set(0,6,2);sc.add(l);
 var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:0x6a707c}));fl.rotation.x=-Math.PI/2;sc.add(fl);
 // pitch beyond the front rail (far -z)
 bx(sc,RX*2,.02,6,0x3a9a4a,0,.02,-RZ-1);for(var s=0;s<8;s++)bx(sc,RX*2/8,.025,6,s%2?0x3f9f50:0x358c44,-RX+RX/8+s*RX/4,.03,-RZ-1);
 bx(sc,RX*2,.9,.15,0xc8ccd4,0,.45,-RZ+.9);bx(sc,RX*2,.08,.2,0x2a4a8a,0,.95,-RZ+.9);   // rail
 // floodlight towers, scoreboard
 [-7,7].forEach(function(x){cy(sc,.12,9,0x555a66,x,4.5,-RZ-3);bx(sc,1.4,.8,.2,0xfffbe0,x,9,-RZ-3)});
 bx(sc,3.2,1.2,.2,0x111,0,5,-RZ-2.5);bx(sc,2.8,.9,.05,0xffd060,0,5,-RZ-2.4);
 // rows of seats, flat steps (+z is further back), spectators face the pitch (-z)
 for(var r=0;r<5;r++){bx(sc,RX*2-1,.05,.9,0x4a5aa0,0,.03,-RZ+2+r*1.3+.45);for(var c=-7;c<=7;c++)chair(sc,c*1.15,-RZ+2+r*1.3,Math.PI,[0xd03a3a,0x2a5ad0,0xdddddd][(c+r+9)%3])}
 // refreshment kiosk at the back
 bx(sc,3,1.1,.8,0xd03a3a,0,.55,RZ-.8);bx(sc,3.3,.1,1,0xffffff,0,1.15,RZ-.8);bx(sc,3,.5,.05,0xffd060,0,2,RZ-1.2);
 obst.push({t:"b",x1:-1.7,x2:1.7,z1:RZ-1.3,z2:RZ});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(-.4,-RZ+3.3,Math.PI,-.45);
 K.person(G.cast[0],{x:.4,y:-.45,z:-RZ+3.3,h:Math.PI,seat:1,st:"idle"});
 var g=[];for(var r=0;r<5;r++)for(var c=-6;c<=6;c++){if(r===2&&Math.abs(c)<2)continue;if(r!==1&&Math.abs(c)>0&&Math.random()<.45)g.push([c*1.15,-RZ+2+r*1.3,Math.PI,1,r]);else if(r===1&&Math.abs(c)>2&&Math.random()<.5)g.push([c*1.15,-RZ+3.3,Math.PI,1,r])}
 guests(g);
}
K.scenes.reg("stadium",{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,-RZ+3.3,3,1.4,1.0,-1.2),talkLimitZ:-RZ+1.5});
})();
