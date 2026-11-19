/* Scene: living room with the phone mirrored on a wall screen (Rizz: Coffee by Text). The contact appears as a lit "profile" figure beside the chat. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
function ground(sc,RX,RZ,col,sky){sc.background=new THREE.Color(sky);sc.add(new THREE.HemisphereLight(0xffffff,0x8a9a70,.95));var d=new THREE.DirectionalLight(0xfff4d8,.6);d.position.set(4,8,3);sc.add(d);var g=new THREE.Mesh(new THREE.PlaneGeometry(RX*2+20,RZ*2+20),new THREE.MeshLambertMaterial({color:col}));g.rotation.x=-Math.PI/2;sc.add(g)}
function tree(sc,x,z,s,c){cy(sc,.12*s,1.6*s,0x6a4a2a,x,.8*s,z);sp(sc,.8*s,c||0x3f8a46,x,2.0*s,z);sp(sc,.6*s,c||0x4a9a50,x+.4*s,1.7*s,z+.2)}

var RX=7,RZ=6;
var RX=4.5,RZ=4.5;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x14101c);
 sc.add(new THREE.HemisphereLight(0xffd8b8,0x3a2a40,.7));var l=new THREE.PointLight(0xffb878,.7,12);l.position.set(-1.5,2.8,.5);sc.add(l);var l2=new THREE.PointLight(0x7a9aff,.6,10);l2.position.set(0,2,-3);sc.add(l2);
 room(sc,RX,RZ,0x4a3a5a,0x7a5a3a,0x2a2230);
 bx(sc,3.4,.02,2.4,0x8a3a4a,0,.02,.6);                                  // rug
 // wall screen showing a group chat (bubbles)
 var scr=tex(256,160,function(x,w,h){x.fillStyle='#10141c';x.fillRect(0,0,w,h);x.fillStyle='#2a3a5a';x.fillRect(0,0,w,18);x.fillStyle='#fff';x.font='11px sans-serif';x.fillText('Friday crew (6)',8,13);
  var rows=[[8,28,150,'#2f3b52'],[90,52,150,'#2a7ad8'],[8,76,170,'#2f3b52'],[60,100,180,'#2a7ad8'],[8,124,120,'#2f3b52']];
  rows.forEach(function(r){x.fillStyle=r[3];x.beginPath();x.roundRect?x.roundRect(r[0],r[1],r[2],18,9):x.rect(r[0],r[1],r[2],18);x.fill();x.fillStyle='rgba(255,255,255,.7)';x.fillRect(r[0]+8,r[1]+7,r[2]-30,3)})},1,1);
 bx(sc,3.4,2.1,.12,0x0a0a0e,-.6,1.8,-RZ+.1);mesh(sc,new THREE.PlaneGeometry(3.2,1.9),new THREE.MeshBasicMaterial({map:scr}),-.6,1.8,-RZ+.17);
 // contact plinth with a warm spotlight
 cy(sc,.7,.12,0x2a2230,2.5,.06,-RZ+1.6);var sl=new THREE.PointLight(0xffe0c0,.9,6);sl.position.set(2.5,2.6,-RZ+2.4);sc.add(sl);
 // sofa (back toward +z), coffee table with a mug, lamp, plant, shelf
 bx(sc,2.4,.45,.9,0x3a4a6a,0,.23,2.7);bx(sc,2.4,.6,.2,0x3a4a6a,0,.65,3.1);[-1.1,1.1].forEach(function(x){bx(sc,.2,.55,.9,0x344464,x,.3,2.7)});
 bx(sc,1.2,.06,.6,0x6a4a2a,0,.4,1.4);cy(sc,.05,.1,0xffffff,.2,.48,1.4);
 cy(sc,.04,1.5,0x333,-3.6,.75,2.4);sp(sc,.22,0xffe0a0,-3.6,1.6,2.4);sp(sc,.4,0x3e8a4a,3.7,.8,3);cy(sc,.22,.5,0x8a4a3a,3.7,.25,3);
 bx(sc,.35,2,2,0x5a3a22,-RX+.2,1,-1);for(var r=0;r<4;r++)for(var k=0;k<5;k++)bx(sc,.2,.3,.06,[0x9a2a2a,0x2a5a9a,0x2a7a4a,0xc8a02a][(r+k)%4],-RX+.3,.4+r*.45,-1.8+k*.2+.1);
 obst.push({t:"b",x1:-1.4,x2:1.4,z1:2.1,z2:3.3},{t:"b",x1:-.7,x2:.7,z1:1,z2:1.8});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(0,2.7,Math.PI,-.45);
 K.person(G.cast[0],{x:2.5,y:.12,z:-RZ+1.6,h:Math.PI*.9,seat:0,st:"phone"});
}
K.scenes.reg("phonechat",{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(.8,0,4.2,1.6,1.2,1.35),talkLimitZ:1.5});
})();
