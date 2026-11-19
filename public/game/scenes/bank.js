/* Scene: Mr Thompson's office at Sterling Bank (Career: The Workplace Mistake). Formal: marble, dark green leather, brass, heavy curtains. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,MB=K.MB,tex=K.tex,V=K.V,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
var RX=4.6,RZ=4,C={x:0,z:-.4};
function build(){
 var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x0e1410);
 sc.add(new THREE.HemisphereLight(0xe6f0e0,0x1a2a20,.6));[[0,3.2,-.4,0xffe2b0,.9,10],[-3,3,2,0xffe2b0,.4,8]].forEach(function(q){var p=new THREE.PointLight(q[3],q[4],q[5]);p.position.set(q[0],q[1],q[2]);sc.add(p)});
 var marble=tex(128,128,function(x,w,h){x.fillStyle='#d8d4cc';x.fillRect(0,0,w,h);x.strokeStyle='rgba(120,110,100,.25)';for(var i=0;i<9;i++){x.beginPath();x.moveTo((i*23)%w,0);x.bezierCurveTo((i*41)%w,40,(i*17)%w,80,(i*53)%w,h);x.stroke()}x.strokeStyle='rgba(0,0,0,.3)';x.strokeRect(0,0,w,h)},5,4.5);
 var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({map:marble}));fl.rotation.x=-Math.PI/2;sc.add(fl);
 bx(sc,3.2,.02,2.4,0x6a1f24,C.x,.02,C.z);   // burgundy rug
 var panel=M(0x1f3a2c),trim=M(0xb8933a);bx(sc,RX*2,3.4,.3,0,0,1.7,-RZ-.15,panel);bx(sc,.3,3.4,RZ*2,0,-RX-.15,1.7,0,panel);bx(sc,.3,3.4,RZ*2,0,RX+.15,1.7,0,panel);bx(sc,RX*2,3.4,.3,0,0,1.7,RZ+.15,panel);bx(sc,RX*2,.2,RZ*2,0,0,3.45,0,M(0x2a2a26));
 [-3,-1,1,3].forEach(function(x){bx(sc,1.5,1.9,.05,0x183024,x,1.5,-RZ+.04);bx(sc,1.6,.05,.07,0xb8933a,x,2.5,-RZ+.06);bx(sc,1.6,.05,.07,0xb8933a,x,.55,-RZ+.06)});
 bx(sc,RX*2,.12,.14,0xb8933a,0,1.0,-RZ+.07);
 // bank crest and framed portrait, flag
 var crest=tex(128,128,function(x,w,h){x.fillStyle='#b8933a';x.beginPath();x.arc(w/2,h/2,56,0,7);x.fill();x.fillStyle='#1f3a2c';x.beginPath();x.arc(w/2,h/2,46,0,7);x.fill();x.fillStyle='#e6c870';x.font='800 24px Georgia,serif';x.textAlign='center';x.fillText('STERLING',w/2,h/2+2);x.font='600 14px Georgia,serif';x.fillText('BANK',w/2,h/2+24)},1,1);
 mesh(sc,new THREE.PlaneGeometry(1.2,1.2),new THREE.MeshBasicMaterial({map:crest,transparent:true}),0,2.45,-RZ+.1);
 bx(sc,.8,1,.06,0x6a4a22,-RX+.05,1.9,1.6).rotation.y=Math.PI/2;bx(sc,.6,.8,.02,0xc8b07a,-RX+.1,1.9,1.6).rotation.y=Math.PI/2;
 cy(sc,.025,2.1,0xb8933a,RX-.6,1.05,-RZ+.6);bx(sc,.8,.5,.02,0xc03a3a,RX-.9,1.9,-RZ+.6);
 // curtains and a tall window on the right
 var nightcity=tex(64,128,function(x,w,h){var g=x.createLinearGradient(0,0,0,h);g.addColorStop(0,'#9ac4e8');g.addColorStop(1,'#e8dcc0');x.fillStyle=g;x.fillRect(0,0,w,h)},1,1);
 var wm=mesh(sc,new THREE.PlaneGeometry(1.4,2.4),new THREE.MeshBasicMaterial({map:nightcity}),RX-.02,1.7,1.5);wm.rotation.y=-Math.PI/2;
 [.55,2.45].forEach(function(dz){bx(sc,.2,2.8,.5,0x5a1a24,RX-.12,1.6,.45+dz)});
 // mahogany desk, leather chairs, brass lamp, ledger, pen set
 bx(sc,2.2,.1,1.0,0x4a2412,C.x,.78,C.z);bx(sc,.9,.7,.9,0x3a1c0e,C.x-.9,.4,C.z);bx(sc,.9,.7,.9,0x3a1c0e,C.x+.9,.4,C.z);bx(sc,2.1,.04,1.05,0x274a35,C.x,.82,C.z);
 cy(sc,.07,.28,0xb8933a,C.x+.7,.95,C.z-.2);cy(sc,.14,.06,0x2a6a3a,C.x+.7,1.12,C.z-.2);bx(sc,.28,.04,.2,0xe8e0c8,C.x-.2,.86,C.z+.1);bx(sc,.35,.03,.26,0xf4f0e0,C.x-.1,.88,C.z+.05);bx(sc,.3,.03,.1,0x222,C.x-.6,.86,C.z-.2);
 obst.push({t:'b',x1:C.x-1.2,x2:C.x+1.2,z1:C.z-.6,z2:C.z+.6});
 function chair(x,z,ry,c,tall){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.6,.12,.56,c,0,.44,0);bx(g,.6,tall?1.0:.7,.1,c,0,tall?.95:.8,-.27);bx(g,.08,.28,.5,c,-.3,.62,0);bx(g,.08,.28,.5,c,.3,.62,0)}
 chair(C.x,C.z-1.0,0,0x14301f,true);chair(C.x,C.z+1.0,Math.PI,0x6a1f24,false);
 // bookcase with ledgers (left) and a globe
 bx(sc,.5,2.6,2.4,0x3a1c0e,-RX+.25,1.3,-1.4);for(var r=0;r<5;r++)for(var k=0;k<9;k++)bx(sc,.3,.34,.08,[0x5a1a24,0x14301f,0x8a6a2a,0x1a2a4a][(r+k)%4],-RX+.4,.35+r*.5,-2.4+k*.23);
 obst.push({t:'b',x1:-RX,x2:-RX+.6,z1:-2.7,z2:-.1});
 sp(sc,.22,0x3a6aa8,-RX+1.2,1.05,RZ-.8);cy(sc,.04,.8,0xb8933a,-RX+1.2,.4,RZ-.8);
 return {scene:sc,obst:obst};
}
function setup(){
 K.player(C.x,C.z+1.0,Math.PI,-.45);
 K.person(G.cast[0],{x:C.x,y:-.45,z:C.z-1.0,h:0,seat:1,st:'idle'});
}
function talkCam(){var a=W.orb*.5,r=3.6;return {px:C.x+Math.cos(a)*r,py:1.6,pz:C.z+Math.sin(a)*r*.9,tx:C.x,ty:1.2,tz:C.z}}
K.scenes.reg('bank',{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:talkCam});
})();
