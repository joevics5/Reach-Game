/* Scene: Rosa's, a candlelit restaurant on a Saturday night. Used by Rizz 2 (The Date).
   Warm plaster walls, green wainscot, tiled floor, night windows, white tablecloths. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,cn=K.cn,sp=K.sp,mesh=K.mesh,M=K.M,MB=K.MB,tex=K.tex,haloTex=K.haloTex,V=K.V,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
var RX=8.2,RZ=6.6,T={x:-2.6,z:-3.4};   // T = our table
function build(){
 var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x140f12);
 sc.add(new THREE.HemisphereLight(0xffe3c0,0x3a2418,.7));
 [[T.x,3.2,T.z+.5,0xffc58a,1.0,9],[4.5,3.4,-2,0xffc08a,.7,12],[-5.5,3.4,3,0xffc08a,.6,12],[3,3.4,3.5,0xffb878,.5,11]].forEach(function(l){var p=new THREE.PointLight(l[3],l[4],l[5]);p.position.set(l[0],l[1],l[2]);sc.add(p)});
 // floor: terracotta and cream tiles
 var floorT=tex(128,128,function(x,w,h){for(var i=0;i<4;i++)for(var j=0;j<4;j++){x.fillStyle=(i+j)%2?'#e8d9bd':'#b4573a';x.fillRect(i*32,j*32,32,32);x.fillStyle='rgba(0,0,0,.12)';x.fillRect(i*32,j*32,32,1);x.fillRect(i*32,j*32,1,32)}},7,6);
 var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({map:floorT}));fl.rotation.x=-Math.PI/2;sc.add(fl);
 // walls: warm plaster with a green wainscot and gold rail
 var wall=M(0xc98a62),wains=M(0x2c4a3b);
 bx(sc,RX*2,5,.3,0,0,2.5,-RZ-.15,wall);bx(sc,.3,5,RZ*2,0,-RX-.15,2.5,0,wall);bx(sc,.3,5,RZ*2,0,RX+.15,2.5,0,wall);
 bx(sc,RX*2,5,.3,0,0,2.5,RZ+.15,wall);
 bx(sc,RX*2,1.1,.12,0,0,.55,-RZ+.05,wains);bx(sc,.12,1.1,RZ*2,0,-RX+.05,.55,0,wains);bx(sc,.12,1.1,RZ*2,0,RX-.05,.55,0,wains);
 bx(sc,RX*2,.08,.16,0,0,1.14,-RZ+.07,M(0xd9b45a));bx(sc,.16,.08,RZ*2,0,-RX+.07,1.14,0,M(0xd9b45a));bx(sc,.16,.08,RZ*2,0,RX-.07,1.14,0,M(0xd9b45a));
 bx(sc,RX*2,.2,RZ*2,0,0,5.05,0,M(0x241812));
 // three night windows on the back wall
 var night=tex(128,128,function(x,w,h){var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#10183a');g.addColorStop(1,'#3a2a5a');x.fillStyle=g;x.fillRect(0,0,w,h);
  x.fillStyle='#0a0c1e';for(var i=0;i<7;i++){var bw=14+((i*11)%10),bh=30+((i*23)%46);x.fillRect(i*19,h-bh,bw,bh)}
  for(var k=0;k<46;k++){x.fillStyle=k%5?'#ffd98a':'#ffffff';x.fillRect((k*37)%124,h-6-((k*29)%70),2,2)}
  x.fillStyle='#fff6d0';x.beginPath();x.arc(98,26,8,0,7);x.fill()},1,1);
 [-5,-1.6,1.8].forEach(function(wx){mesh(sc,new THREE.PlaneGeometry(2.1,2.5),new THREE.MeshBasicMaterial({map:night}),wx,2.55,-RZ+.2);
  bx(sc,2.4,.14,.2,0,wx,3.85,-RZ+.22,M(0x5a3a22));bx(sc,2.4,.14,.2,0,wx,1.25,-RZ+.22,M(0x5a3a22));bx(sc,.14,2.6,.2,0,wx-1.1,2.55,-RZ+.22,M(0x5a3a22));bx(sc,.14,2.6,.2,0,wx+1.1,2.55,-RZ+.22,M(0x5a3a22));bx(sc,.06,2.5,.2,0,wx,2.55,-RZ+.22,M(0x5a3a22))});
 // chandelier over our table, plus little fairy lights
 var halo=new THREE.SpriteMaterial({map:haloTex(),transparent:true,opacity:.65,depthWrite:false,blending:THREE.AdditiveBlending});
 function lamp(x,z,y){cy(sc,.012,5-y,0x222222,x,(5+y)/2,z);cy(sc,.5,.05,0x6b4a22,x,y,z);for(var i=0;i<6;i++){var a=i/6*Math.PI*2;sp(sc,.05,0xffe7b0,x+Math.cos(a)*.42,y+.07,z+Math.sin(a)*.42,MB(0xffe7b0))}var h=new THREE.Sprite(halo);h.scale.set(3,3,1);h.position.set(x,y,z);sc.add(h)}
 lamp(T.x,T.z,3.6);lamp(4.5,-2,3.7);lamp(-5.5,2.8,3.7);lamp(3,3.4,3.7);
 for(var i=0;i<28;i++){var fx=-RX+.7+i*.58;sp(sc,.035,0xffd98a,fx,4.35-Math.sin(i/27*Math.PI*3)*.0-.15*Math.abs(Math.sin(i*.55)),-RZ+.35,MB(0xffd98a))}
 // furniture
 var cloth=M(0xf6f0e4),dark=M(0x3a2a22),wood=M(0x6a3f22),flameM=MB(0xffd27a);
 function chair(x,z,ry){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.5,.05,.5,0,0,.44,0,wood);bx(g,.5,.62,.05,0,0,.78,-.23,wood);[[-.2,-.2],[.2,-.2],[-.2,.2],[.2,.2]].forEach(function(p){bx(g,.05,.44,.05,0,p[0],.22,p[1],wood)})}
 function table(x,z,n,ours){cy(sc,.6,.04,0,x,.76,z,cloth);cy(sc,.66,.28,0,x,.6,z,cloth);cy(sc,.07,.5,0,x,.25,z,dark);cy(sc,.32,.04,0,x,.03,z,dark);
  cy(sc,.026,.12,0xf5e6c8,x+.12,.84,z+.05);sp(sc,.022,0xffd27a,x+.12,.92,z+.05,flameM);var h=new THREE.Sprite(halo);h.scale.set(.55,.55,1);h.position.set(x+.12,.94,z+.05);sc.add(h);
  cy(sc,.04,.07,0x3b6e3f,x-.15,.84,z-.1);sp(sc,.05,0xd9556b,x-.15,.92,z-.1);
  obst.push({t:'c',x:x,z:z,r:.85});
  if(!ours)for(var i=0;i<n;i++){var a=i/n*Math.PI*2;chair(x+Math.cos(a)*.95,z+Math.sin(a)*.95,Math.atan2(-Math.cos(a),-Math.sin(a)))}}
 table(T.x,T.z,2,true);
 chair(T.x,T.z+.95,Math.PI);chair(T.x,T.z-.95,0);
 // set our table: two plates and glasses
 [[0,.42],[0,-.42]].forEach(function(p){cy(sc,.15,.012,0xffffff,T.x+p[0],.8,T.z+p[1]);sp(sc,.03,0xb8323f,T.x+p[0]-.18,.85,T.z+p[1],MB(0xcf4f5f))});
 var tbl=[[4.5,-2,4],[-5.5,2.8,2],[3,3.4,4],[5.6,-4.6,2],[-1.2,2.4,2],[0.6,-0.6,3]];
 tbl.forEach(function(t){table(t[0],t[1],t[2],false)});
 // host stand near the door, wine wall on the left, plants
 bx(sc,1.6,1.05,.6,0,-4.6,.52,RZ-.6,wood);bx(sc,1.7,.06,.7,0,-4.6,1.07,RZ-.6,M(0xd9b45a));obst.push({t:'b',x1:-5.4,x2:-3.8,z1:RZ-.95,z2:RZ-.25});
 bx(sc,.5,3,4.6,0,-RX+.35,1.5,-1.2,M(0x3a2218));
 var cols=[0x4a1f2a,0x2d4a2a,0x6a4a20,0x2a2a4a];
 for(var r=0;r<5;r++)for(var k=0;k<9;k++){cy(sc,.07,.34,cols[(r+k)%4],-RX+.62,.5+r*.55,-3.3+k*.5).rotation.z=Math.PI/2}
 obst.push({t:'b',x1:-RX,x2:-RX+.8,z1:-3.5,z2:1.1});
 [[-RX+.8,RZ-.8],[RX-.8,RZ-.8],[RX-.8,-RZ+.8]].forEach(function(p){cy(sc,.3,.5,0x8a4a2a,p[0],.25,p[1]);sp(sc,.55,0x2f7a3a,p[0],.95,p[1]);obst.push({t:'c',x:p[0],z:p[1],r:.5})});
 // door and rug
 bx(sc,1.8,2.7,.12,0,0,1.35,RZ,M(0x3b2416));bx(sc,2.2,.02,1.3,0,0,.02,RZ-.9,M(0x7a2a2a));
 // kitchen pass on the right wall
 bx(sc,.5,1.1,3,0,RX-.35,.55,-.4,M(0x8a6a4a));bx(sc,.6,.06,3.2,0,RX-.35,1.12,-.4,M(0xcfc6b0));bx(sc,.2,.7,2.6,0,RX-.15,1.75,-.4,MB(0xffb85a));
 obst.push({t:'b',x1:RX-.7,x2:RX,z1:-2,z2:1.2});
 return {scene:sc,obst:obst};
}
function setup(){
 // our table: you sit facing the back window, your date opposite
 K.player(T.x,T.z+.95,Math.PI,-.45);
 var gp=G.cast[0];K.person(gp,{x:T.x,y:-.45,z:T.z-.95,h:0,seat:1,st:'drink'});
 // other diners (lower detail), seated at the other tables
 function diners(x,z,n,w){for(var i=0;i<n;i++){var a=i/n*Math.PI*2,c=makeChar(randLook(w!==undefined?w:Math.random()<.5));c.seat=true;c.g.position.set(x+Math.cos(a)*.95,-.45,z+Math.sin(a)*.95);
   c.g.rotation.y=Math.atan2(-Math.cos(a),-Math.sin(a));W.dyn.add(c.g);W.npcs.push({c:c,st:pk(['talk','drink','talk']),t0:Math.random()*10})}}
 diners(4.5,-2,2);diners(-5.5,2.8,2);diners(3,3.4,3);diners(5.6,-4.6,2);diners(-1.2,2.4,2);
 // a waiter with a route between tables
 var wt=makeChar(randLook(Math.random()<.5));wt.g.position.set(1.5,0,0);W.dyn.add(wt.g);
 W.npcs.push({c:wt,wander:true,wp:[V(1.5,0,-0.6),V(6,0,1),V(2,0,5),V(-2,0,5),V(-3.4,0,0.8),V(2.6,0,-3.2)],wi:0,pause:1,t0:0});
 // the host by the door
 var ho=makeChar(randLook(Math.random()<.5));ho.g.position.set(-4.6,0,RZ-1.4);ho.g.rotation.y=Math.PI;W.dyn.add(ho.g);W.npcs.push({c:ho,st:'idle',t0:1});
}
/* camera: a side-on two-shot across the table, with a gentle swipe-to-orbit */
function talkCam(){
 var a=W.orb*.5,r=4.3;
 return {px:T.x+Math.cos(a)*r,py:1.75,pz:T.z+Math.sin(a)*r*.9,tx:T.x,ty:1.2,tz:T.z};
}
K.scenes.reg('restaurant',{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:talkCam});
})();
