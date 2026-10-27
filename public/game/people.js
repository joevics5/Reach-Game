/* Reach: real rigged human models.
 *
 * The game animates every character with a small procedural rig (the "proxy": groups P, C, H, arms, legs
 * driven by pose() in game.js). When a rigged GLB model is available, this file hides the proxy meshes,
 * puts the model in its place, and every frame copies the proxy's joint rotations onto the model's bones.
 * That keeps walking, sitting, talking gestures and gaze identical no matter which skeleton the model has,
 * and nothing is retargeted from animation clips.
 *
 * Models are listed in /models/manifest.json. If none load, characters stay procedural.
 */
(function () {
 var T = window.THREE;
 var R = window.ReachPeople = { models: [], ready: false, enabled: true, pending: [], used: {} };

 function key(n) {
  n = String(n).toLowerCase().replace(/^mixamorig[:_]?/, '').replace(/[^a-z0-9]/g, '');
  var alias = { pelvis: 'hips', chest: 'spine2', upperchest: 'spine2', spine3: 'spine2',
   upperarml: 'leftarm', upperarmr: 'rightarm', lowerarml: 'leftforearm', lowerarmr: 'rightforearm',
   thighl: 'leftupleg', thighr: 'rightupleg', calfl: 'leftleg', calfr: 'rightleg', shinl: 'leftleg', shinr: 'rightleg',
   footl: 'leftfoot', footr: 'rightfoot', lefthigh: 'leftupleg', righthigh: 'rightupleg', leftshin: 'leftleg', rightshin: 'rightleg',
   leftupperarm: 'leftarm', rightupperarm: 'rightarm', leftlowerarm: 'leftforearm', rightlowerarm: 'rightforearm' };
  return alias[n] || n;
 }

 function loadAll() {
  if (!T.GLTFLoader) { R.ready = true; return; }
  fetch(/[?&]models=samples/.test(location.search) ? '/models/samples.json' : '/models/manifest.json').then(function (r) { return r.ok ? r.json() : null; }).then(function (man) {
   if (!man || !man.models || !man.models.length) { R.ready = true; return; }
   R.allowRepeat = man.allowRepeat !== false;
   var left = man.models.length, loader = new T.GLTFLoader();
   man.models.forEach(function (m) {
    loader.load('/models/' + m.file, function (gltf) {
     var info = { file: m.file, gender: m.gender || 'f', scene: gltf.scene, name: m.name || m.file, tint: m.tint };
     if (prep(info)) R.models.push(info);
     done();
    }, undefined, function () { done(); });
   });
   function done() { if (--left === 0) { R.ready = true; R.pending.splice(0).forEach(function (c) { R.attach(c, c._look); }); } }
  }).catch(function () { R.ready = true; });
 }

 /* find bones, measure rest pose */
 function prep(info) {
  var bones = {}, root = info.scene;
  root.traverse(function (o) { if (o.isBone) bones[key(o.name)] = o; });
  var need = ['hips', 'spine', 'neck', 'head', 'leftarm', 'leftforearm', 'rightarm', 'rightforearm', 'leftupleg', 'leftleg', 'rightupleg', 'rightleg'];
  for (var i = 0; i < need.length; i++) if (!bones[need[i]]) { console.warn('[people] ' + info.file + ' lacks bone ' + need[i]); return false; }
  info.bonesKey = bones; root.updateMatrixWorld(true);
  var hp = new T.Vector3(), fp = new T.Vector3(); // measure from bones: skinned bounding boxes are unreliable
  bones.head.getWorldPosition(hp); (bones.leftfoot || bones.leftleg).getWorldPosition(fp);
  info.h = (hp.y - fp.y) / .89; info.minY = fp.y - .055 * info.h;
  return true;
 }

 var q1 = new T.Quaternion(), q2 = new T.Quaternion(), v1 = new T.Vector3(), v2 = new T.Vector3(), m1 = new T.Matrix4(), DOWN = new T.Vector3(0, -1, 0);

 function worldQ(o, out) { o.updateWorldMatrix(true, false); return o.matrixWorld.decompose(v1, out, v2), out; }

 R.attach = function (c, look) {
  if (!R.enabled || c.model) return;
  if (!R.ready) { c._look = look; R.pending.push(c); return; }
  var woman = !!(look && look.woman), list = R.models.filter(function (m) { return (m.gender === 'f') === woman; });
  if (!list.length) return;
  var uk = woman ? 'f' : 'm', n = R.used[uk] = (R.used[uk] || 0) + 1;
  if (!R.allowRepeat && n > list.length) return;
  var pick = list[(n - 1) % list.length];
  build(c, pick);
 };

 function build(c, info) {
  var T3 = T, model = T3.SkeletonUtils ? T3.SkeletonUtils.clone(info.scene) : info.scene.clone(true);
  var holder = new T3.Group(); holder.add(model); c.g.add(holder);
  // hide the procedural body but keep held props (phone, glass)
  var keep = {}; [c.phone, c.glass].forEach(function (p) { p.traverse(function (o) { keep[o.id] = 1; }); });
  c.b.traverse(function (o) { if (o.isMesh && !keep[o.id]) o.visible = false; });
  // find bones in this clone
  var B = {}; model.traverse(function (o) { if (o.isBone) B[key(o.name)] = o; if (o.isMesh) { o.frustumCulled = false; if (o.material) { var mt = o.material = o.material.clone(); if (mt.map) mt.map.anisotropy = 4; if ('metalness' in mt) { mt.metalness = Math.min(mt.metalness, .04); mt.metalnessMap = null; mt.roughness = Math.max(mt.roughness, .7); mt.roughnessMap = null; mt.envMapIntensity = 0; } if (mt.emissive && !mt.emissiveMap) mt.emissive.setHex(0); } } });
  // size: about 1.74 m in the character's own units (g.scale then adds per-person variation)
  var hh = info.h, ms = 1.74 / hh;
  holder.scale.setScalar(ms); holder.position.y = -info.minY * ms;
  holder.updateMatrixWorld(true);

  // rest data: world orientation relative to the character group
  c.g.updateMatrixWorld(true);
  var gQ = new T3.Quaternion(); c.g.matrixWorld.decompose(v1, gQ, v2); var gInv = gQ.clone().invert();
  function relW(o) { var q = new T3.Quaternion(), p = new T3.Vector3(), s = new T3.Vector3(); o.updateWorldMatrix(true, false); o.matrixWorld.decompose(p, q, s); return { q: gInv.clone().multiply(q), p: p }; }
  function gPos(o) { var p = new T3.Vector3(); o.getWorldPosition(p); return c.g.worldToLocal(p); }

  // which model limb is on which side (by rest x): proxy aL/lL sit at x<0
  function side(a, b) { return gPos(B[a]).x < gPos(B[b]).x ? [a, b] : [b, a]; }
  var arms = side('leftarm', 'rightarm'), forearms = [arms[0].replace('arm', 'forearm'), arms[1].replace('arm', 'forearm')];
  var ups = side('leftupleg', 'rightupleg'), legs = [ups[0].replace('upleg', 'leg'), ups[1].replace('upleg', 'leg')];
  var feet = [ups[0].replace('upleg', 'foot'), ups[1].replace('upleg', 'foot')];

  var rest = {}; Object.keys(B).forEach(function (k) { rest[k] = relW(B[k]).q; });
  function neutral(bn, childKey) { // swing the bone so that it points straight down
   var ch = B[childKey]; if (!ch) return rest[bn].clone();
   var d = gPos(ch).sub(gPos(B[bn])).normalize();
   var sw = new T3.Quaternion().setFromUnitVectors(d, DOWN);
   return sw.multiply(rest[bn]);
  }
  var hips = B.hips, hipsRestG = gPos(hips), hipsLocal = hips.position.clone();
  var N = {};
  N[arms[0]] = neutral(arms[0], forearms[0]); N[arms[1]] = neutral(arms[1], forearms[1]);
  N[forearms[0]] = neutral(forearms[0], arms[0].replace('arm', 'hand')); N[forearms[1]] = neutral(forearms[1], arms[1].replace('arm', 'hand'));
  N[ups[0]] = neutral(ups[0], legs[0]); N[ups[1]] = neutral(ups[1], legs[1]);
  N[legs[0]] = neutral(legs[0], feet[0]); N[legs[1]] = neutral(legs[1], feet[1]);

  // morph targets for the face
  var morphs = []; model.traverse(function (o) { if (o.isMesh && o.morphTargetDictionary) morphs.push(o); });
  function morph(re) { var out = []; morphs.forEach(function (m) { Object.keys(m.morphTargetDictionary).forEach(function (n) { if (re.test(n)) out.push([m, m.morphTargetDictionary[n]]); }); }); return out; }
  var mOpen = morph(/mouthopen|jawopen|viseme_aa/i), mSmile = morph(/mouthsmile|smile/i), mBlink = morph(/blink/i);

  // proxy rotation relative to the character group (product of local rotations up to c.g)
  var pq = new T3.Quaternion();
  function proxy(o, out) { out.identity(); var n = o; var chain = []; while (n && n !== c.g) { chain.push(n); n = n.parent; } for (var i = chain.length - 1; i >= 0; i--) out.multiply(chain[i].quaternion); return out; }

  var Qp = new T3.Quaternion(), Qc = new T3.Quaternion(), Qh = new T3.Quaternion(), tq = new T3.Quaternion(), tmpV = new T3.Vector3();
  var spineKeys = ['spine', 'spine1', 'spine2'].filter(function (k) { return B[k]; });
  var order = []; // bones in top-down order with a function giving the desired g-relative orientation
  order.push([ 'hips', function () { return tq.copy(Qp).multiply(rest.hips); } ]);
  spineKeys.forEach(function (k, i) { var w = (i + 1) / spineKeys.length * .9; order.push([k, function () { return tq.copy(Qp).slerp(Qc, w).multiply(rest[k]); }]); });
  if (B.neck) order.push(['neck', function () { return tq.copy(Qc).slerp(Qh, .5).multiply(rest.neck); }]);
  order.push(['head', function () { return tq.copy(Qh).multiply(rest.head); }]);
  var P = c.P, aL = c.aL, aR = c.aR, lL = c.lL, lR = c.lR;
  [[arms[0], aL.p], [arms[1], aR.p], [forearms[0], aL.k], [forearms[1], aR.k], [ups[0], lL.p], [ups[1], lR.p], [legs[0], lL.k], [legs[1], lR.k]].forEach(function (a) {
   order.push([a[0], function () { return tq.copy(proxy(a[1], q1)).multiply(N[a[0]]); }]);
  });
  [[feet[0], lL.k], [feet[1], lR.k]].forEach(function (a) { if (B[a[0]]) order.push([a[0], function () { return tq.copy(rest[a[0]]); }]); });
  // top-down by depth
  function depth(o) { var d = 0; while (o) { d++; o = o.parent; } return d; }
  order.sort(function (a, b) { return depth(B[a[0]]) - depth(B[b[0]]); });

  var gq = new T3.Quaternion(), pw = new T3.Quaternion();
  c.model = info.file;
  c.sync = function () {
   proxy(P, Qp); proxy(c.C, Qc); proxy(c.H, Qh);
   c.g.updateMatrixWorld(true);
   c.g.matrixWorld.decompose(v1, gq, v2); var gi = gq.clone().invert();
   // hips position follows the proxy pelvis (bob, sitting)
   var dy = P.position.y + c.b.position.y - .9, dx = c.b.position.x + P.position.x, dz = c.b.position.z + P.position.z;
   tmpV.set(hipsRestG.x + dx, hipsRestG.y + dy, hipsRestG.z + dz);
   c.g.localToWorld(tmpV); hips.parent.worldToLocal(tmpV); hips.position.copy(tmpV);
   for (var i = 0; i < order.length; i++) {
    var b = B[order[i][0]], want = order[i][1]();
    var par = b.parent; par.updateWorldMatrix(true, false); par.matrixWorld.decompose(v1, pw, v2);
    // local = inv(parentWorldRelG) * wantRelG
    b.quaternion.copy(pw).invert().multiply(gq.clone().multiply(want));
    b.updateMatrix();
   }
   // face
   var mo = Math.min(1, c.mo * 1.1), sm = Math.max(0, Math.min(1, c.mood * 1.1 + .1));
   mOpen.forEach(function (m) { m[0].morphTargetInfluences[m[1]] = mo * .7; });
   mSmile.forEach(function (m) { m[0].morphTargetInfluences[m[1]] = sm * .8; });
   var bl = c.bt > 0 ? Math.sin(Math.max(0, Math.min(1, 1 - c.bt / .15)) * Math.PI) : 0;
   mBlink.forEach(function (m) { m[0].morphTargetInfluences[m[1]] = bl; });
  };
 }

 loadAll();
})();
