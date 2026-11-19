/* Scene: Mr Roberts's office (Career: Deadline Negotiation). Cluttered, lived-in, warm wood and blue-grey carpet. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,MB=K.MB,tex=K.tex,V=K.V,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
var RX=4.2,RZ=3.8,C={x:0,z:-.3};
function build(){
 var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x2a2a30);
 sc.add(new THREE.HemisphereLight(0xfff0d8,0x55483a,.85));var l=new THREE.PointLight(0xffe2b0,.7,10);l.position.set(0,3,0);sc.add(l);var d=new THREE.DirectionalLight(0xffe9c8,.5);d.position.set(0,4,-4);sc.add(d);
 var carpet=tex(64,64,function(x,w,h){x.fillStyle='#4a5868';x.fillRect(0,0,w,h);for(var i=0;i<80;i++){x.fillStyle='rgba(255,255,255,.05)';x.fillRect((i*17)%w,(i*31)%h,2,2)}},5,4);
 var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({map:carpet}));fl.rotation.x=-Math.PI/2;sc.add(fl);
 var wall=M(0xcdbfa8);bx(sc,RX*2,3.2,.3,0,0,1.6,-RZ-.15,wall);bx(sc,.3,3.2,RZ*2,0,-RX-.15,1.6,0,wall);bx(sc,.3,3.2,RZ*2,0,RX+.15,1.6,0,wall);bx(sc,RX*2,3.2,.3,0,0,1.6,RZ+.15,wall);bx(sc,RX*2,.2,RZ*2,0,0,3.25,0,M(0xe8e2d6));
 // window with blinds (afternoon light)
 var out=tex(128,128,function(x,w,h){var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#8fc4ee');g.addColorStop(1,'#f4e2b8');x.fillStyle=g;x.fillRect(0,0,w,h);for(var i=0;i<6;i++){x.fillStyle='hsl(30,15%,'+(40+i*4)+'%)';x.fillRect(i*22,h-30-((i*23)%40),20,70)}},1,1);
 mesh(sc,new THREE.PlaneGeometry(2.6,1.7),new THREE.MeshBasicMaterial({map:out}),0,1.9,-RZ+.02);bx(sc,2.8,.1,.1,0x6a5a48,0,2.8,-RZ+.08);bx(sc,2.8,.1,.1,0x6a5a48,0,1.05,-RZ+.08);
 for(var i=0;i<9;i++)bx(sc,2.6,.05,.03,0xf0eadc,0,2.65-i*.1,-RZ+.1);
 // bookshelf (right) and filing cabinet (left), pinboard
 bx(sc,.5,2.6,2.6,0x5a3a22,RX-.25,1.3,.3);for(var r=0;r<5;r++)for(var k=0;k<10;k++)bx(sc,.28,.36,.07,[0x9a2a2a,0x2a5a9a,0x2a7a4a,0xc8a02a,0x6a2a8a][(r+k)%5],RX-.4,.35+r*.5,-.7+k*.2);
 obst.push({t:'b',x1:RX-.6,x2:RX,z1:-1.1,z2:1.7});
 bx(sc,.7,1.3,.6,0x6a7078,-RX+.5,.65,-2.4);obst.push({t:'b',x1:-RX,x2:-RX+.9,z1:-2.8,z2:-2});
 bx(sc,1.4,.9,.05,0xc8a86a,-RX+.05,1.9,0.5).rotation.y=Math.PI/2;
 [[-2.5,.6],[-2.5,.2],[-2.5,-.2]].forEach(function(p,i){bx(sc,.35,.4,.02,[0xfff3a0,0xffc0c0,0xc0e0ff][i],-RX+.12,1.8+.0,p[0]+i*.4).rotation.y=Math.PI/2});
 // desk with monitor, papers, mug; two chairs; framed diploma
 bx(sc,1.9,.08,.9,0x6a4426,C.x,.76,C.z);bx(sc,.08,.72,.8,0x5a3a20,C.x-.9,.38,C.z);bx(sc,.08,.72,.8,0x5a3a20,C.x+.9,.38,C.z);bx(sc,1.8,.5,.04,0x5a3a20,C.x,.5,C.z-.38);
 bx(sc,.55,.34,.04,0x151515,C.x-.4,1.02,C.z-.2);bx(sc,.06,.2,.06,0x333,C.x-.4,.88,C.z-.2);bx(sc,.2,.01,.14,0xfafafa,C.x+.3,.81,C.z+.1);bx(sc,.2,.01,.14,0xfafafa,C.x+.35,.83,C.z+.12);cy(sc,.04,.09,0xc8362a,C.x+.7,.85,C.z-.15);
 obst.push({t:'b',x1:C.x-1,x2:C.x+1,z1:C.z-.5,z2:C.z+.5});
 function chair(x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.54,.08,.52,c,0,.44,0);bx(g,.52,.65,.07,c,0,.8,-.25);cy(g,.04,.42,0x333,0,.22,0)}
 chair(C.x,C.z-.95,0,0x2b2b30);chair(C.x,C.z+.95,Math.PI,0x7a8a9a);
 bx(sc,.6,.45,.04,0xe8e0c8,-1.8,2.1,-RZ+.06);
 sp(sc,.45,0x3e8a4a,-RX+.6,.8,RZ-.6);cy(sc,.25,.5,0x777,-RX+.6,.25,RZ-.6);
 return {scene:sc,obst:obst};
}
function setup(){
 K.player(C.x,C.z+.95,Math.PI,-.45);
 K.person(G.cast[0],{x:C.x,y:-.45,z:C.z-.95,h:0,seat:1,st:'phone'});
}
function talkCam(){var a=W.orb*.5,r=3.4;return {px:C.x+Math.cos(a)*r,py:1.6,pz:C.z+Math.sin(a)*r*.9,tx:C.x,ty:1.2,tz:C.z}}
K.scenes.reg('office',{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:talkCam});
})();
