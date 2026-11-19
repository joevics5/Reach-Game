/* Scene: BrightWave Media meeting room (Career: The Job Interview). Light, glassy, modern. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,MB=K.MB,tex=K.tex,V=K.V,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
var RX=6.5,RZ=5.2,C={x:0,z:-.6};
function build(){
 var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0xcfe3f5);
 sc.add(new THREE.HemisphereLight(0xffffff,0x9aa7b4,.95));var d=new THREE.DirectionalLight(0xfff4e0,.55);d.position.set(3,6,4);sc.add(d);
 var carpet=tex(64,64,function(x,w,h){x.fillStyle='#8e98a4';x.fillRect(0,0,w,h);for(var i=0;i<60;i++){x.fillStyle='rgba(255,255,255,.07)';x.fillRect((i*13)%w,(i*29)%h,3,1)}},8,6);
 var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({map:carpet}));fl.rotation.x=-Math.PI/2;sc.add(fl);
 var white=M(0xf4f6f8);bx(sc,.3,4,RZ*2,0,-RX-.15,2,0,white);bx(sc,.3,4,RZ*2,0,RX+.15,2,0,white);bx(sc,RX*2,4,.3,0,0,2,RZ+.15,white);bx(sc,RX*2,.2,RZ*2,0,0,4.05,0,M(0xe8ecef));
 // floor-to-ceiling window onto a daytime skyline
 var sky=tex(256,128,function(x,w,h){var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#5fa8e8');g.addColorStop(1,'#cfe6f7');x.fillStyle=g;x.fillRect(0,0,w,h);
  for(var i=0;i<14;i++){var bw=16+((i*7)%18),bh=30+((i*37)%70);x.fillStyle='hsl(210,'+(10+i%4*6)+'%,'+(48+i%5*6)+'%)';x.fillRect(i*19,h-bh,bw,bh);x.fillStyle='rgba(255,255,255,.5)';for(var k=0;k<bh;k+=9)x.fillRect(i*19+3,h-bh+k+2,bw-6,3)}},1,1);
 mesh(sc,new THREE.PlaneGeometry(RX*2-.6,3.5),new THREE.MeshBasicMaterial({map:sky}),0,2,-RZ+.02);
 [-4,-1.3,1.3,4].forEach(function(x){bx(sc,.08,3.6,.12,0x9aa4ae,x,2,-RZ+.06)});bx(sc,RX*2,.1,.12,0x9aa4ae,0,3.75,-RZ+.06);bx(sc,RX*2,.1,.12,0x9aa4ae,0,.28,-RZ+.06);
 // right: glass partition into the open office
 bx(sc,.05,3,5.4,0xb8d8ea,RX-.8,1.5,0,new THREE.MeshLambertMaterial({color:0xb8d8ea,transparent:true,opacity:.28}));
 [-2.4,0,2.4].forEach(function(z){bx(sc,.9,.05,.6,0xd8dde2,RX-.4+.1,.75,z);bx(sc,.35,.25,.04,0x222,RX-.35,.95,z-.1)});
 // left wall: whiteboard and brand panel
 var wb=tex(256,128,function(x,w,h){x.fillStyle='#fff';x.fillRect(0,0,w,h);x.strokeStyle='#2a66d9';x.lineWidth=3;x.strokeRect(10,10,w-20,h-20);x.fillStyle='#2a66d9';x.font='800 26px Arial';x.fillText('BrightWave',20,46);x.fillStyle='#e0663a';x.fillRect(24,64,60,10);x.fillRect(24,84,110,10);x.fillRect(24,104,84,10);x.beginPath();x.arc(190,86,24,0,7);x.fill()},1,1);
 var wm=mesh(sc,new THREE.PlaneGeometry(3,1.5),new THREE.MeshBasicMaterial({map:wb}),-RX+.04,2,-2);wm.rotation.y=Math.PI/2;
 // our table and chairs
 cy(sc,.8,.05,0xcaa078,C.x,.75,C.z);cy(sc,.07,.72,0x777f88,C.x,.37,C.z);cy(sc,.4,.04,0x777f88,C.x,.03,C.z);obst.push({t:'c',x:C.x,z:C.z,r:.95});
 function chair(x,z,ry){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.52,.07,.5,0x2c3e50,0,.44,0);bx(g,.5,.6,.06,0x2c3e50,0,.78,-.24);cy(g,.04,.42,0x555,0,.22,0)}
 chair(C.x,C.z+.95,Math.PI);chair(C.x,C.z-.95,0);
 // CV folder, water glasses, laptop
 bx(sc,.3,.015,.22,0xe0663a,C.x-.1,.79,C.z-.3);cy(sc,.04,.1,0xddeeff,C.x+.35,.82,C.z+.1);cy(sc,.04,.1,0xddeeff,C.x-.35,.82,C.z-.2);
 // plants, credenza
 [[-RX+.8,RZ-.8],[RX-1.4,-RZ+.9]].forEach(function(p){cy(sc,.3,.5,0xdddddd,p[0],.25,p[1]);sp(sc,.5,0x3e9a4a,p[0],.9,p[1]);obst.push({t:'c',x:p[0],z:p[1],r:.5})});
 bx(sc,2.2,.7,.5,0x9a7a56,-3.6,.35,-RZ+.6);obst.push({t:'b',x1:-4.7,x2:-2.5,z1:-RZ+.3,z2:-RZ+.9});
 // ceiling light panels
 [[0,-1],[0,2],[-3,0],[3,0]].forEach(function(p){bx(sc,1.6,.04,.5,0xffffff,p[0],3.95,p[1],MB(0xffffff))});
 return {scene:sc,obst:obst};
}
function setup(){
 K.player(C.x,C.z+.95,Math.PI,-.45);
 K.person(G.cast[0],{x:C.x,y:-.45,z:C.z-.95,h:0,seat:1,st:'drink'});
 // staff in the open office beyond the glass
 [[-2.4,.5],[0,.1],[2.4,.5]].forEach(function(p,i){var c=makeChar(Object.assign(randLook(i%2==0),{lod:'lo'}));c.seat=true;c.g.position.set(RX-.15,-.45,p[0]);c.g.rotation.y=-Math.PI/2;W.dyn.add(c.g);W.npcs.push({c:c,st:pk(['talk','phone','drink']),t0:i*3})});
}
function talkCam(){var a=W.orb*.5,r=3.9;return {px:C.x+Math.cos(a)*r,py:1.65,pz:C.z+Math.sin(a)*r*.9,tx:C.x,ty:1.2,tz:C.z}}
K.scenes.reg('interview',{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:talkCam});
})();
