/* Reach cast bank: 15 women + 15 men, each a fixed look (face, build, hair, skin, outfit).
   Challenges ask for a person by id, or deal distinct people. Background people reuse the
   same bank with a fresh outfit. window.ReachCast = {F,M,get,deal,crowd,ids} */
(function(){
var SK=[0xF3D2B8,0xE8BE98,0xD9A87C,0xC68A5E,0xA9704A,0x8D5A3B,0x6B4128,0x4A2C1A];  // fair to deep, spread evenly
var HC=[0x15100d,0x2a1a10,0x5a3a22,0x8a5a2b,0x0d0d0d,0x3b2a1a];
var TC=[0xE74C3C,0x3498DB,0xF1C40F,0x2ECC71,0xECF0F1,0x9B59B6,0xE67E22,0x1ABC9C,0xFF6FB5,0x34495E,0x2f6f4f,0xb03060];
var BC=[0x2C3E50,0x34495E,0x1B1B1B,0x7F8C8D,0x3E5C76,0x5C4033];
function pk(a){return a[Math.floor(Math.random()*a.length)]}
// [face 0-9, build idx 0-3, skin idx, hair colour idx, hair style, top, bottom, top colour idx, bottom colour idx, glasses]
var F=[
 ['f01',0,1,2,0,'long','blouse','pencil',8,2,0],
 ['f02',1,1,6,0,'afro','tee','jeans',6,4,0],
 ['f03',2,2,0,3,'bob','polo','trousers',3,1,1],
 ['f04',3,1,4,0,'ponytail','tank','shorts',2,4,0],
 ['f05',4,2,1,1,'bun','long','aline',5,2,0],
 ['f06',5,0,0,5,'long','crop','jeans',0,0,0],
 ['f07',6,1,3,2,'bob','blouse','trousers',7,2,1],
 ['f08',7,3,7,0,'afro','tee','jeans',4,1,0],
 ['f09',8,1,1,4,'long','gownA','jeans',11,2,0],
 ['f10',9,2,5,1,'bun','polo','aline',9,3,0],
 ['f11',0,1,2,5,'ponytail','tank','jeans',1,0,0],
 ['f12',3,0,3,2,'bob','long','pencil',10,2,1],
 ['f13',5,2,5,0,'afro','blouse','trousers',2,1,0],
 ['f14',7,1,4,3,'long','gownB','jeans',5,2,0],
 ['f15',1,3,0,5,'bun','tee','shorts',8,4,0]];
var M=[
 ['m01',0,1,3,4,'lowcut','tee','jeans',1,1,0,0],
 ['m02',1,1,0,0,'bald','polo','trousers',9,2,1,0],
 ['m03',2,2,1,1,'quiff','suit','trousers',9,2,0,0],
 ['m04',3,1,6,0,'afro','long','jeans',3,1,0,0],
 ['m05',4,2,2,1,'spiky','tee','shorts',0,5,0,0],
 ['m06',5,0,4,2,'short','polo','jeans',7,4,0,1],
 ['m07',6,1,0,4,'lowcut','dress','trousers',4,2,1,1],
 ['m08',7,3,5,0,'bald','tee','jeans',11,1,0,1],
 ['m09',8,1,1,4,'short','long','trousers',10,3,0,0],
 ['m10',9,2,3,5,'quiff','polo','jeans',2,1,0,0],
 ['m11',0,1,7,0,'lowcut','suit','trousers',9,2,0,1],
 ['m12',2,0,2,3,'mohawk','tee','shorts',6,5,0,0],
 ['m13',4,2,0,1,'short','dress','trousers',4,0,1,0],
 ['m14',6,1,5,2,'afro','tee','jeans',8,1,0,0],
 ['m15',3,3,4,4,'bald','long','jeans',0,1,0,1]];
function mk(r,woman){var o=r,l={id:o[0],woman:woman,face:o[1],build:[.92,1,1.2,1.42][o[2]],sk:SK[o[3]],hair:HC[o[4]],style:o[5],styleFixed:true,top:o[6],bottom:o[7],sh:TC[o[8]],pn:BC[o[9]],glasses:!!o[10],dress:false};
  if(!woman)l.beard=!!o[11];return l}
var LF=F.map(function(r){return mk(r,true)}),LM=M.map(function(r){return mk(r,false)});
function copy(l){var c={};for(var k in l)c[k]=l[k];return c}
function shuf(a){a=a.slice();for(var i=a.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=a[i];a[i]=a[j];a[j]=t}return a}
var ByID={};LF.concat(LM).forEach(function(l){ByID[l.id]=l});
window.ReachCast={F:LF,M:LM,ids:Object.keys(ByID),
 get:function(id,over){var l=copy(ByID[id]);if(over)for(var k in over)l[k]=over[k];return l},
 /* n distinct people of one sex ('f'|'m') */
 deal:function(sex,n){return shuf(sex==='f'?LF:LM).slice(0,n).map(copy)},
 /* background person: a cast face and body in a fresh outfit and colours */
 crowd:function(woman){var b=copy(pk(woman?LF:LM));delete b.id;
  var tops=woman?['tee','long','polo','blouse','tank','crop','gownA']:['tee','long','polo','dress','suit'];
  var bots=woman?['jeans','trousers','pencil','aline','shorts']:['jeans','trousers','shorts'];
  b.top=pk(tops);b.bottom=(b.top==='gownA'?'jeans':pk(bots));b.sh=pk(TC);b.pn=pk(BC);return b}};
})();
