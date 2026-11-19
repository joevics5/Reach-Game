/* Scene: an electronics store (Career: The Customer Complaint). Cool white light, TV wall, service counter. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,MB=K.MB,tex=K.tex,V=K.V,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
var RX=9,RZ=6.5,C={x:0,z:-.2};
function build(){
 var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x10131a);
 sc.add(new THREE.HemisphereLight(0xe8f1ff,0x445066,.95));[[0,3.4,0,0xdfeaff,.6,16],[-6,3.4,-3,0xdfeaff,.4,12],[6,3.4,2,0xdfeaff,.4,12]].forEach(function(l){var p=new THREE.PointLight(l[3],l[4],l[5]);p.position.set(l[0],l[1],l[2]);sc.add(p)});
 var floor=tex(128,128,function(x,w,h){x.fillStyle='#d9dde3';x.fillRect(0,0,w,h);x.strokeStyle='rgba(0,0,0,.14)';x.lineWidth=2;x.strokeRect(0,0,w,h);x.fillStyle='rgba(255,255,255,.35)';x.fillRect(0,0,w,h/2)},9,6.5);
 var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({map:floor}));fl.rotation.x=-Math.PI/2;sc.add(fl);
 var wall=M(0xeef1f5);bx(sc,RX*2,4,.3,0,0,2,-RZ-.15,wall);bx(sc,.3,4,RZ*2,0,-RX-.15,2,0,wall);bx(sc,.3,4,RZ*2,0,RX+.15,2,0,wall);bx(sc,RX*2,4,.3,0,0,2,RZ+.15,wall);bx(sc,RX*2,.2,RZ*2,0,0,4.05,0,M(0x2a2f38));
 [-7,-3.5,0,3.5,7].forEach(function(x){bx(sc,2.2,.05,.6,0xffffff,x,3.9,0,MB(0xffffff))});
 // blue strip and sign
 bx(sc,RX*2,.1,.1,0x2a7bff,0,3.4,-RZ+.1,MB(0x2a7bff));
 var sign=tex(512,128,function(x,w,h){x.fillStyle='#1b64e8';x.fillRect(0,0,w,h);x.fillStyle='#fff';x.font='800 70px Arial Black,Arial';x.textAlign='center';x.textBaseline='middle';x.fillText('VOLTBOX',w/2,h/2)},1,1);
 mesh(sc,new THREE.PlaneGeometry(4.5,1.1),new THREE.MeshBasicMaterial({map:sign}),0,3.0,-RZ+.2);
 // TV wall (colourful screens)
 var cols=['#1c6fe8','#e8501c','#18b86b','#a02fe0','#e8c21c','#14b5d6'];
 for(var r=0;r<2;r++)for(var k=0;k<7;k++){var scr=tex(64,36,function(x,w,h){var g=x.createLinearGradient(0,0,w,h);g.addColorStop(0,cols[(r*3+k)%6]);g.addColorStop(1,'#101828');x.fillStyle=g;x.fillRect(0,0,w,h)},1,1);
  bx(sc,1.2,.72,.06,0x111111,-6+k*2,1.4+r*.95,-RZ+.2);mesh(sc,new THREE.PlaneGeometry(1.1,.62),new THREE.MeshBasicMaterial({map:scr}),-6+k*2,1.4+r*.95,-RZ+.24)}
 bx(sc,RX*2-.6,.9,.5,0x2d3340,0,.45,-RZ+.35);obst.push({t:'b',x1:-RX,x2:RX,z1:-RZ,z2:-RZ+.7});
 // display tables with laptops, shelves of boxes on the sides
 [[-5.5,2.8],[5.6,3.2],[-5,-3],[5.4,-2.6]].forEach(function(p){bx(sc,2.2,.8,1,0xcfd5dd,p[0],.4,p[1]);for(var i=0;i<3;i++){bx(sc,.45,.02,.32,0x222,p[0]-.7+i*.7,.82,p[1]);bx(sc,.45,.28,.02,0x1b64e8,p[0]-.7+i*.7,.96,p[1]-.14).rotation.x=-.2}obst.push({t:'b',x1:p[0]-1.1,x2:p[0]+1.1,z1:p[1]-.5,z2:p[1]+.5})});
 for(var s=0;s<5;s++){bx(sc,.6,2.4,1.6,0xdfe4ea,-RX+.5,1.2,-4+s*2);for(var l=0;l<4;l++)bx(sc,.4,.32,1.2,[0xe8501c,0x1b64e8,0x18b86b,0xe8c21c][(s+l)%4],-RX+.55,.35+l*.55,-4+s*2)}
 obst.push({t:'b',x1:-RX,x2:-RX+.9,z1:-5,z2:5});
 // service counter
 bx(sc,3.6,1.05,.8,0xffffff,C.x,.52,C.z);bx(sc,3.7,.07,.9,0x2a7bff,C.x,1.07,C.z);bx(sc,.5,.4,.06,0x111,C.x+1.1,1.3,C.z-.1);bx(sc,.35,.04,.28,0x111,C.x+1.1,1.1,C.z);
 bx(sc,.5,.45,.35,0xb89a6a,C.x-1.1,1.33,C.z+.1);cy(sc,.14,.3,0xcccccc,C.x-1.1,1.7,C.z+.1);  // the broken blender on the counter
 obst.push({t:'b',x1:C.x-1.9,x2:C.x+1.9,z1:C.z-.45,z2:C.z+.45});
 bx(sc,1.8,2.6,.12,0,0,1.3,RZ,M(0x445066));
 return {scene:sc,obst:obst};
}
function setup(){
 K.player(C.x,C.z-.8,0,0);
 K.person(G.cast[0],{x:C.x,y:0,z:C.z+.95,h:Math.PI,seat:0,st:'idle'});
 // other customers and a colleague (lower detail)
 var spots=[[-5.5,2.2,Math.PI],[5.6,2.6,Math.PI],[-5,-2.4,0],[5.4,-2.1,0],[2.8,3.8,Math.PI*1.2]];
 spots.forEach(function(p,i){var c=makeChar(Object.assign(randLook(i%2===0),{lod:'lo'}));c.g.position.set(p[0],0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:pk(['phone','idle','talk']),t0:i*2})});
 var col=makeChar(Object.assign(randLook(false),{lod:'lo'}));col.g.position.set(2.6,0,-1.6);col.g.rotation.y=Math.PI;W.dyn.add(col.g);W.npcs.push({c:col,st:'idle',t0:1});
}
function talkCam(){var a=W.orb*.5,r=3.9;return {px:C.x+Math.cos(a)*r,py:1.55,pz:C.z+Math.sin(a)*r*.9,tx:C.x,ty:1.3,tz:C.z}}
K.scenes.reg('electronics',{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:talkCam});
})();
