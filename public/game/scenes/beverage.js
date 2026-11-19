/* Scene: Zest Corner, a sunny beverage shop (Career: The Salesperson). Lime and yellow, fridge wall, can pyramid. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,MB=K.MB,tex=K.tex,V=K.V,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
var RX=6,RZ=5.2,C={x:1.2,z:0};
function build(){
 var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0xffe9a8);
 sc.add(new THREE.HemisphereLight(0xfff6d8,0xc9a35a,1.05));var d=new THREE.DirectionalLight(0xffffff,.7);d.position.set(-3,6,5);sc.add(d);
 var floor=tex(64,64,function(x,w,h){x.fillStyle='#e9c488';x.fillRect(0,0,w,h);for(var i=0;i<8;i++){x.fillStyle=i%2?'rgba(0,0,0,.06)':'rgba(255,255,255,.1)';x.fillRect(0,i*8,w,8);x.fillStyle='rgba(0,0,0,.18)';x.fillRect(0,i*8,w,1)}},6,5);
 var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({map:floor}));fl.rotation.x=-Math.PI/2;sc.add(fl);
 var lime=M(0x8fd13a),yel=M(0xffd23f);bx(sc,RX*2,4,.3,0,0,2,-RZ-.15,lime);bx(sc,.3,4,RZ*2,0,-RX-.15,2,0,yel);bx(sc,.3,4,RZ*2,0,RX+.15,2,0,yel);bx(sc,RX*2,.2,RZ*2,0,0,4.05,0,M(0xfff3cf));
 // front wall is a big window with daylight and a street
 var street=tex(256,128,function(x,w,h){var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#7fc4ff');g.addColorStop(1,'#fff3c8');x.fillStyle=g;x.fillRect(0,0,w,h);x.fillStyle='#d4a373';x.fillRect(0,h-26,w,26);for(var i=0;i<6;i++){x.fillStyle='hsl('+(i*50)+',45%,62%)';x.fillRect(i*44,h-70-((i*17)%24),38,50)}},1,1);
 bx(sc,RX*2,4,.3,0,0,2,RZ+.15,M(0xfff3cf));mesh(sc,new THREE.PlaneGeometry(RX*2-1,2.6),new THREE.MeshBasicMaterial({map:street}),0,2.1,RZ-.02).rotation.y=Math.PI;
 // fridge wall of coloured cans
 bx(sc,RX*2-1,2.6,.8,0x2a3a40,0,1.3,-RZ+.45);
 var cc=[0xe8501c,0x8fd13a,0x1b8fe8,0xe8c21c,0xd63a8a,0x6a3ae0];
 for(var r=0;r<5;r++)for(var k=0;k<16;k++)cy(sc,.12,.26,cc[(r*3+k)%6],-5.2+k*.69,.5+r*.5,-RZ+.88);
 bx(sc,RX*2-1,2.6,.04,0xbfe8ff,0,1.3,-RZ+.92,new THREE.MeshLambertMaterial({color:0xbfe8ff,transparent:true,opacity:.18}));
 obst.push({t:'b',x1:-RX,x2:RX,z1:-RZ,z2:-RZ+.9});
 // Zest Cola pyramid display and banner
 for(var r=0;r<5;r++)for(var k=0;k<5-r;k++)cy(sc,.15,.3,0x8fd13a,-3.6+(k+r*.5)*.34,.15+r*.3,1.2);
 bx(sc,1.2,.04,1.2,0xffffff,-3.0,.02,1.2);var ban=tex(256,128,function(x,w,h){x.fillStyle='#8fd13a';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='800 52px Arial Black,Arial';x.textAlign='center';x.textBaseline='middle';x.fillText('ZEST COLA',w/2,h/2-8);x.font='700 22px Arial';x.fillText('new. lime. loud.',w/2,h/2+34)},1,1);
 mesh(sc,new THREE.PlaneGeometry(3,1.5),new THREE.MeshBasicMaterial({map:ban}),-3,2.2,-RZ+.1);
 obst.push({t:'c',x:-3.0,z:1.2,r:.9});
 // counter with till and a bottle rack
 bx(sc,2.6,1.05,.8,0xfff3cf,C.x,.52,C.z);bx(sc,2.7,.07,.9,0x8fd13a,C.x,1.07,C.z);bx(sc,.4,.3,.3,0x222,C.x+.8,1.28,C.z);
 for(var i=0;i<4;i++)cy(sc,.07,.3,0x8fd13a,C.x-.9+i*.2,1.26,C.z-.1);
 obst.push({t:'b',x1:C.x-1.4,x2:C.x+1.4,z1:C.z-.45,z2:C.z+.45});
 // a stool and plants
 [[-RX+.7,RZ-.7],[RX-.7,RZ-.7]].forEach(function(p){cy(sc,.3,.5,0xd96a3a,p[0],.25,p[1]);sp(sc,.5,0x3e9a4a,p[0],.9,p[1]);obst.push({t:'c',x:p[0],z:p[1],r:.5})});
 return {scene:sc,obst:obst};
}
function setup(){
 K.player(C.x,C.z-.8,0,0);
 K.person(G.cast[0],{x:C.x-1.0,y:0,z:C.z+.95,h:Math.PI+.4,seat:0,st:'idle'});
 var c=makeChar(Object.assign(randLook(Math.random()<.5),{lod:'lo'}));c.g.position.set(-4.4,0,-3.3);c.g.rotation.y=0;W.dyn.add(c.g);W.npcs.push({c:c,st:'phone',t0:0});
 var k=makeChar(Object.assign(randLook(Math.random()<.5),{lod:'lo'}));k.g.position.set(4.2,0,2.6);k.g.rotation.y=Math.PI;W.dyn.add(k.g);W.npcs.push({c:k,st:'idle',t0:2});
}
function talkCam(){var a=W.orb*.5,r=3.6;return {px:C.x-.5+Math.cos(a)*r,py:1.5,pz:C.z+Math.sin(a)*r*.9,tx:C.x-.5,ty:1.3,tz:C.z}}
K.scenes.reg('beverage',{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:talkCam});
})();
