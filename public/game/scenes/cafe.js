/* Scene: sunny brunch cafe (Rizz: Table for More). Plants, light wood, a round table of friends. */
(function(){
var K=window.ReachKit,W=K.W,G=K.G,bx=K.bx,cy=K.cy,sp=K.sp,mesh=K.mesh,M=K.M,tex=K.tex,makeChar=K.makeChar,randLook=K.randLook,pk=K.pk;
function chair(sc,x,z,ry,c){var g=new THREE.Group();g.position.set(x,0,z);g.rotation.y=ry;sc.add(g);bx(g,.46,.07,.44,c,0,.44,0);bx(g,.44,.5,.06,c,0,.72,-.2);cy(g,.03,.42,0x333333,0,.22,0);return g}
function guests(list){list.forEach(function(p,i){var c=makeChar(Object.assign(randLook((i+(p[4]||0))%2===0),{lod:"lo"}));c.seat=!!p[3];c.g.position.set(p[0],p[3]?-.45:0,p[1]);c.g.rotation.y=p[2];W.dyn.add(c.g);W.npcs.push({c:c,st:p[3]?pk(["idle","talk","phone"]):pk(["idle","talk"]),t0:i*1.3})})}
function room(sc,RX,RZ,wc,fc,cc){var fl=new THREE.Mesh(new THREE.PlaneGeometry(RX*2,RZ*2),new THREE.MeshLambertMaterial({color:fc}));fl.rotation.x=-Math.PI/2;sc.add(fl);var w=M(wc);bx(sc,RX*2,3.6,.3,0,0,1.8,-RZ-.15,w);bx(sc,.3,3.6,RZ*2,0,-RX-.15,1.8,0,w);bx(sc,.3,3.6,RZ*2,0,RX+.15,1.8,0,w);bx(sc,RX*2,3.6,.3,0,0,1.8,RZ+.15,w);bx(sc,RX*2,.2,RZ*2,0,0,3.65,0,M(cc))}
function cam(cx,cz,r,py,ty,a0){return function(){var a=(a0||0)+W.orb*.5;return {px:cx+Math.cos(a)*r,py:py,pz:cz+Math.sin(a)*r*.9,tx:cx,ty:ty||1.25,tz:cz}}}
function ground(sc,RX,RZ,col,sky){sc.background=new THREE.Color(sky);sc.add(new THREE.HemisphereLight(0xffffff,0x8a9a70,.95));var d=new THREE.DirectionalLight(0xfff4d8,.6);d.position.set(4,8,3);sc.add(d);var g=new THREE.Mesh(new THREE.PlaneGeometry(RX*2+20,RZ*2+20),new THREE.MeshLambertMaterial({color:col}));g.rotation.x=-Math.PI/2;sc.add(g)}
function tree(sc,x,z,s,c){cy(sc,.12*s,1.6*s,0x6a4a2a,x,.8*s,z);sp(sc,.8*s,c||0x3f8a46,x,2.0*s,z);sp(sc,.6*s,c||0x4a9a50,x+.4*s,1.7*s,z+.2)}

var RX=7,RZ=6;
var RX=6.5,RZ=5.5;
function build(){var obst=[],sc=new THREE.Scene();sc.background=new THREE.Color(0x2a2a30);
 sc.add(new THREE.HemisphereLight(0xfffaf0,0xc8b890,1));var l=new THREE.PointLight(0xfff0d0,.8,16);l.position.set(0,3.2,0);sc.add(l);
 room(sc,RX,RZ,0xf2ead8,0xc9a878,0xfffaf0);
 for(var i=-6;i<=6;i++)bx(sc,.04,.025,RZ*2,0xa88858,i*1,.03,0);
 // big window wall with leafy view, hanging plants, chalkboard menu, counter
 bx(sc,RX*2-2,2,.08,0xcfe9d8,0,1.9,RZ-.02);for(var h=0;h<6;h++){cy(sc,.01,.7,0x666,-4+h*1.6,3.2,RZ-.6);sp(sc,.3,0x4a9a4a,-4+h*1.6,2.7,RZ-.6)}
 bx(sc,2.4,1.2,.05,0x24302a,-3.5,1.9,-RZ+.06);bx(sc,2.1,.04,.02,0xffffff,-3.5,2.2,-RZ+.1);bx(sc,1.8,.04,.02,0xffffff,-3.5,1.9,-RZ+.1);
 bx(sc,5,1.05,.8,0x7a5a3a,2.4,.52,-RZ+1.2);bx(sc,5.2,.07,.95,0xf4f4f0,2.4,1.07,-RZ+1.2);cy(sc,.2,.5,0xcfcfd4,.8,1.35,-RZ+1.2);for(var c=0;c<5;c++)cy(sc,.09,.1,0xffffff,2+c*.4,1.15,-RZ+1.2);
 obst.push({t:"b",x1:-.2,x2:5,z1:-RZ+.7,z2:-RZ+1.7});
 // the table of three friends, a spare chair, other tables
 cy(sc,.8,.04,0xf6f0e4,0,.76,.5);cy(sc,.06,.74,0x777,0,.37,.5);[[-.4,.3],[.2,.7],[.4,.2]].forEach(function(p){cy(sc,.07,.1,0xffffff,p[0],.82,p[1])});sp(sc,.1,0xe86a8a,0,.9,.5);
 obst.push({t:"b",x1:-.95,x2:.95,z1:-.45,z2:1.45});
 [[-4.5,-.5],[4.4,1.6],[-4.4,3]].forEach(function(p){cy(sc,.6,.04,0xf6f0e4,p[0],.76,p[1]);cy(sc,.05,.74,0x777,p[0],.37,p[1]);chair(sc,p[0]-.9,p[1],Math.PI/2,0xb88a58);chair(sc,p[0]+.9,p[1],-Math.PI/2,0xb88a58);obst.push({t:"b",x1:p[0]-.65,x2:p[0]+.65,z1:p[1]-.65,z2:p[1]+.65})});
 [-5.8,5.8].forEach(function(x){cy(sc,.3,.5,0xb85a3a,x,.25,-3);sp(sc,.5,0x3a9a4a,x,.9,-3)});
 return {scene:sc,obst:obst}}
function setup(){
 K.player(0,-1.6,0,0);
 // the three women at the round table, facing in; the chair you are offered is empty on the near side
 K.person(G.cast[0],{x:-.65,y:-.45,z:.5,h:Math.PI/2,seat:1,st:"idle"});
 chair(K.W.dyn,0,-.3,Math.PI,0xb88a58);
 guests([[.55,.95,-Math.PI/2*1.0-.3,1],[.55,.05,-Math.PI/2+.3,1,1]]);
 guests([[-4.5-.9,-.5,Math.PI/2,1],[-4.5+.9,-.5,-Math.PI/2,1,1],[4.4-.9,1.6,Math.PI/2,1]]);
}
K.scenes.reg("cafe",{rx:RX,rz:RZ,exit:{x:0,z:RZ+.8},build:build,setup:setup,talkCam:cam(0,.5,3.8,1.7,1.0,-1.2),talkLimitZ:-1});
})();
