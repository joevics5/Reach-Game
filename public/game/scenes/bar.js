/* Scene: The Copper Lantern (bar). Used by Rizz 1. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,cn=K.cn,sp=K.sp,mesh=K.mesh,M=K.M,MB=K.MB,tex=K.tex,haloTex=K.haloTex,V=K.V,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk,shuffle=K.shuffle;
var RX=12.6,RZ=9.4;
var SLOTS=[
 {x:-7,y:-.08,z:-4.9,seat:1,st:'phone',h:Math.PI+.25,where:'at the bar'},
 {x:-3.2,y:-.08,z:-4.9,seat:1,st:'drink',h:Math.PI-.3,where:'at the bar'},
 {x:1.0,y:-.08,z:-4.9,seat:1,st:'phone',h:Math.PI+.1,where:'at the bar'},
 {x:-8.8,y:-.45,z:3.4,seat:1,st:'drink',h:Math.PI/2,where:'in a booth'},
 {x:3.6,y:0,z:.4,seat:0,st:'drink',h:-1.2,where:'standing by the pillar'}
];
function build(){
 var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x120d14);
 var hemi=new THREE.HemisphereLight(0xffd9b0,0x2a1a20,.62);sc.add(hemi);
 [[-4,3.4,-3,0xffa95a,.85,15],[6,3.4,1,0xffb070,.7,15],[-7,3.4,5,0xff9a60,.6,13],[3,3.4,7,0xffb070,.45,12]].forEach(function(l){var p=new THREE.PointLight(l[3],l[4],l[5]);p.position.set(l[0],l[1],l[2]);sc.add(p)});
 var floorT=tex(128,128,function(x,w,h){x.fillStyle='#6b4527';x.fillRect(0,0,w,h);for(var i=0;i<8;i++){x.fillStyle='rgba('+(i%2?'0,0,0,.14':'255,200,140,.06')+')';x.fillRect(0,i*16,w,16);x.fillStyle='rgba(0,0,0,.35)';x.fillRect(0,i*16,w,1.5);x.fillRect((i*37)%w,i*16,1.5,16)}},6,5);
 var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2.2),new THREE.MeshLambertMaterial({map:floorT}));fl.rotation.x=-Math.PI/2;sc.add(fl);
 var brick=tex(128,64,function(x,w,h){x.fillStyle='#5c2f25';x.fillRect(0,0,w,h);for(var r=0;r<4;r++){for(var cI=0;cI<4;cI++){var ox=(r%2)*16,x0=cI*32+ox;x.fillStyle='hsl(12,'+(40+((r*7+cI*13)%20))+'%,'+(26+((r*5+cI*9)%10))+'%)';x.fillRect(x0+1,r*16+1,30,14)}}},8,2.5);
 var wallM=new THREE.MeshLambertMaterial({map:brick});
 var wb=bx(sc,RX*2,5,.3,0,0,2.5,-RZ-.15,wallM);var wl=bx(sc,.3,5,RZ*2.2,0,-RX-.15,2.5,0,wallM);var wr=bx(sc,.3,5,RZ*2.2,0,RX+.15,2.5,0,wallM);
 bx(sc,RX-1.3,5,.3,0,-(RX+1.3)/2,2.5,RZ+.1,wallM);bx(sc,RX-1.3,5,.3,0,(RX+1.3)/2,2.5,RZ+.1,wallM);bx(sc,2.6,1.6,.3,0,0,4.2,RZ+.1,wallM);
 bx(sc,2.4,2.6,.1,0x1a2a3a,0,1.3,RZ+.2,MB(0x1a2638));
 bx(sc,RX*2,.2,RZ*2.2,0x1a1217,0,5.05,0);
 [-8,0,8].forEach(function(x){bx(sc,.35,.35,RZ*2.2,0x2a1d22,x,4.85,0)});
 // back bar
 var wood=M(0x3a2216),top=M(0x8a5a35);
 bx(sc,12,1.1,1.1,0,-3.4,.55,-6.1,wood);bx(sc,12.3,.12,1.4,0,-3.4,1.16,-6.1,top);
 bx(sc,12,.55,.14,0x241810,-3.4,.28,-5.5);
 bx(sc,12,3,.4,0x1c120d,-3.4,1.5,-RZ+.2);
 var bottles=new THREE.InstancedMesh(K.geo.GC,M(0x66a36b),60),o=new THREE.Object3D(),colors=[0x66a36b,0xb8864b,0xcf4f4f,0x5b8fd0,0xe0c070,0x9a6fc0],i=0;
 [1.4,2.1,2.8].forEach(function(y){bx(sc,12,.06,.5,0x5a3a22,-3.4,y,-RZ+.6);for(var k=0;k<20;k++){o.position.set(-8.9+k*.6,y+.2,-RZ+.6);o.scale.set(.09,.34,.09);o.updateMatrix();bottles.setMatrixAt(i,o.matrix);bottles.setColorAt&&0;i++}});
 sc.add(bottles);
 // strip light + neon
 bx(sc,12,.08,.08,0xffcf8a,-3.4,3.15,-RZ+.7,MB(0xffcf8a));
 var neon=tex(512,128,function(x,w,h){x.clearRect(0,0,w,h);x.font='800 62px Syne,Arial Black,sans-serif';x.textAlign='center';x.textBaseline='middle';x.shadowColor='#ffb454';x.shadowBlur=22;x.fillStyle='#ffd9a0';x.fillText('THE COPPER LANTERN',w/2,h/2)});
 neon.repeat.set(1,1);var np=mesh(sc,new THREE.PlaneGeometry(6,1.5),new THREE.MeshBasicMaterial({map:neon,transparent:true}),-3.4,3.85,-RZ+.42);
 // pendant lamps
 var halo=new THREE.SpriteMaterial({map:haloTex(),transparent:true,opacity:.7,depthWrite:false,blending:THREE.AdditiveBlending});
 [[-7,-4],[-3,-2],[1,-4],[5,-1],[8,3],[-6,4],[2,5],[-1,7]].forEach(function(p){cy(sc,.015,1.4,0x222222,p[0],4.35,p[1]);cn(sc,.4,.3,0x2a1d22,p[0],3.6,p[1]);sp(sc,.12,0xffd9a0,p[0],3.52,p[1],MB(0xffe0b0));var h=new THREE.Sprite(halo);h.scale.set(2.4,2.4,1);h.position.set(p[0],3.5,p[1]);sc.add(h)});
 // stools
 for(var x=-8.5;x<=1.6;x+=2){cy(sc,.2,.04,0x2a2a2a,x,.74,-4.9);cy(sc,.04,.72,0x555555,x,.37,-4.9);cy(sc,.22,.03,0x333333,x,.08,-4.9);obst.push({t:'c',x:x,z:-4.9,r:.34})}
 obst.push({t:'b',x1:-9.6,x2:2.8,z1:-6.7,z2:-5.5});
 // tables
 function table(x,z,high){var h=high?1.05:.75;cy(sc,.5,.05,0x7a4a28,x,h,z);cy(sc,.06,h,0x333,x,h/2,z);cy(sc,.3,.04,0x333,x,.04,z);obst.push({t:'c',x:x,z:z,r:.62})}
 table(7,-3,true);table(9.5,-6.4,true);table(5.2,3.4,true);table(-8,3.4,false);table(-10.2,-1,false);table(9,5.8,false);
 // booths left
 bx(sc,1.1,.5,3.4,0x6b2f3a,-11.6,.25,6.4);bx(sc,.3,1.1,3.4,0x6b2f3a,-12.2,.8,6.4);bx(sc,1.1,.5,3.4,0x6b2f3a,-11.6,.25,-4.2);bx(sc,.3,1.1,3.4,0x6b2f3a,-12.2,.8,-4.2);
 obst.push({t:'b',x1:-12.4,x2:-11,z1:4.7,z2:8.1},{t:'b',x1:-12.4,x2:-11,z1:-5.9,z2:-2.5});
 // tv
 bx(sc,2.4,1.4,.1,0x0a0a0a,10.5,3.2,-RZ+.1);bx(sc,2.2,1.2,.02,0x24a05a,10.5,3.2,-RZ+.17,MB(0x1f7a46));
 // door mat, plants
 bx(sc,2,.02,1.2,0x3a2a2a,0,.02,RZ-.7);
 [[-11.5,8.6],[11.5,8.6],[11.8,-8.4]].forEach(function(p){cy(sc,.3,.5,0x5a3a22,p[0],.25,p[1]);sp(sc,.55,0x2f7a3a,p[0],.95,p[1]);obst.push({t:'c',x:p[0],z:p[1],r:.5})});
 // jukebox
 bx(sc,.9,1.5,.5,0x7a2a30,-11.8,.75,0.6);bx(sc,.7,.5,.06,0xffd080,-11.8,1.2,.88,MB(0xffc070));obst.push({t:'b',x1:-12.3,x2:-11.3,z1:.2,z2:1.1});
 return {scene:sc,obst:obst};
}
function setup(){
 var slots=shuffle(SLOTS.slice());G.cast.forEach(function(gp,i){gp.slot=slots[i]});
 K.player(0,6.4,Math.PI);
 G.cast.forEach(function(gp){K.person(gp,gp.slot)});
 // neighbours at bar
 [-8.5,-6.5,-4.5,-2.5,-0.5,1.5].forEach(function(x){
  if(G.cast.some(function(gp){return gp.slot.z<-4&&Math.abs(gp.slot.x-x)<1.9}))return;
  if(Math.random()<.55){var c=makeChar(randLook(Math.random()<.5));c.seat=true;c.g.position.set(x,-.08,-4.9);c.g.rotation.y=Math.PI+(Math.random()-.5)*.6;W.dyn.add(c.g);W.npcs.push({c:c,st:pk(['drink','talk','phone']),t0:Math.random()*10})}
 });
 // bartender
 var bt=makeChar(randLook(Math.random()<.5));bt.g.position.set(-4.5,0,-7.1);bt.g.rotation.y=0;W.dyn.add(bt.g);W.npcs.push({c:bt,st:'work',t0:0});
 var bt2=makeChar(randLook(Math.random()<.5));bt2.g.position.set(-1.2,0,-7.1);bt2.g.rotation.y=.2;W.dyn.add(bt2.g);W.npcs.push({c:bt2,st:'talk',t0:2});
 // groups at high tables
 function grp(cx,cz,n,r,st){for(var i=0;i<n;i++){var a=i/n*Math.PI*2+.5,c=makeChar(randLook(Math.random()<.5));c.g.position.set(cx+Math.cos(a)*r,0,cz+Math.sin(a)*r);c.g.rotation.y=Math.atan2(cx-c.g.position.x,cz-c.g.position.z);c.look=V(cx,1.7,cz);c.moodT=.3;W.dyn.add(c.g);W.npcs.push({c:c,st:st,t0:Math.random()*10})}}
 grp(7,-3,3,1.0,'talk');grp(9.5,-6.4,2,.95,'talk');grp(5.2,3.4,4,1.0,'talk');
 // seated pairs
 function seated(x,z,h){var c=makeChar(randLook(Math.random()<.5));c.seat=true;c.g.position.set(x,-.45,z);c.g.rotation.y=h;W.dyn.add(c.g);W.npcs.push({c:c,st:'talk',t0:Math.random()*10})}
 seated(-11.3,6.4,Math.PI/2*1.0);seated(-11.3,5.4,Math.PI/2);
 seated(-11.3,-4.2,Math.PI/2);
 // wanderers
 for(var i=0;i<2;i++){var c=makeChar(randLook(i%2===0));c.g.position.set(-3,0,2);W.dyn.add(c.g);W.npcs.push({c:c,wander:true,wp:[V(-6,0,1),V(3,0,6),V(8,0,1.5),V(-2,0,4),V(2,0,-2)],wi:i,pause:Math.random()*2,t0:i})}
}

K.scenes.reg('bar',{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkLimitZ:-4.2});
})();
