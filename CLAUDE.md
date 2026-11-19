# Reach: notes for Claude sessions

Reach is an AI social-simulation game (categories: Rizz, Make Friends). Next.js 15 shell (`app/`, `components/Game.tsx`) plus a vanilla JS / Three.js r128 game in `public/game/`. Gemini is called client-side (key entered in Settings). Deployed on Vercel from `main`. Playable: The Copper Lantern bar and The Date.

## Script load order (components/Game.tsx SCRIPTS)
three.min.js, GLTFLoader, SkeletonUtils, ai.js, people.js, **avatar.js**, **cast.js**, **challenges.js**, game.js. Scene files in `public/game/scenes/` load on demand when a challenge starts. Add any new script before game.js. When adding or changing a game file, bump `CACHE` in `public/sw.js` (currently reach-v9) and list new files in its ASSETS.

## Challenge engine (data-driven)
- **`public/game/challenges.js`** is the registry: 5 categories (toasting=Rizz, friends, startup, speaking, career), 5 challenges each (25). An entry with no `scene` shows as "coming soon". To make one playable give it: `scene` (file name in scenes/), `mode` ('approach' = walk around and choose someone, like the bar; 'seated' = start already talking), `cast:{n}`, `maxT` (turns), `ai` (intro, scene text, win rule, wrap-up, review wording; see BAR_AI / DATE_AI), `situation`, `pre`, `chat`, `circs`, `hint`, `openCue`, optional `winScore`/`minWinTurn` (hidden score decides the ending at the last turn, as in The Date), `custom` (optional name box).
- **Every scene is its own place** (decided with the user): one file per scene in `public/game/scenes/<name>.js`, registered with `ReachKit.scenes.reg(name,{rx,rz,exit,build,setup,talkCam?,talkLimitZ?})`. `build(K)` returns `{scene,obst}` and is cached; `setup(K)` places `K.player(x,z,heading,seatY?)`, `K.person(persona,slot)` for the people you talk to, and extras in `W.npcs`. Only the characters are shared between scenes (cast bank). `window.ReachKit` exposes the helpers (bx, cy, cn, sp, mesh, M, MB, tex, haloTex, makeChar, randLook, pk, shuffle, V ...).
- Built so far: Rizz 1 The Copper Lantern (`bar`), Rizz 2 The Date (`restaurant`, Rosa's). Chat-only challenges (coffee by text) will need a chat UI path with no 3D scene.
- The demo replies used when no API key is set are still bar-flavoured.

## Characters (the important part)
- **Do not use the old ellipsoid characters.** `makeChar(o)` in game.js delegates to `ReachAvatar.make(look)` (public/game/avatar.js). Set `window.__OLDCHARS=1` before load only to compare with the old ones.
- avatar.js is generated from the avatar lab: source of truth is `lab/avatars/lab/avatar-lab.tpl.html` (faces, builds, hair, wardrobe, 5 dance styles). `lab/avatars/tools/gen_avatar.py` extracts it into avatar.js. **Edits made by hand to avatar.js (LOD `LQ/NOOL/HSEG`, `bakeStatic`, `GSCALE`, hand/eye/nose tweaks) are not in the lab or generator**, so regenerating would lose them. Prefer editing avatar.js directly, or port the changes to the template.
- `ReachAvatar.spec(look)` maps a look to sex, face (0-9), build (.92/1/1.2/1.42), top, bottom, hair. Fixed fields are honoured: `face, build, top, bottom, style (+styleFixed:true), sk, hair, sh, pn, beard, glasses, woman`. Missing fields are randomised.
- Tops: tee, long, polo, blouse, tank, crop, dress (men: collar button-down), suit, gownA, gownB. Bottoms: jeans, trousers, shorts, pencil, aline, skirt. Hair (men): short, lowcut, bald, spiky, quiff, mohawk, buzz, afro, curly. Hair (women): long, bob, bun, ponytail, afro.
- **Cast bank** (`public/game/cast.js`, `window.ReachCast`): 15 women (f01-f15) + 15 men (m01-m15), each a fixed look. API: `get(id, overrides)`, `deal('f'|'m', n)` for n distinct people, `crowd(woman)` for a background person (cast face/body, fresh outfit and colours). Challenges should ask for people from the bank, not build random looks. Personas (name, personality) are separate from looks; no permanent id-to-name binding yet (add one for recurring characters).
- **Performance:** characters carry `look.lod`: `'hi'` for the player and the people you talk to (outlines, full face animation), `'lo'` for the crowd (no outlines, lower detail, no blinking). `bakeStatic` merges static meshes per joint to cut draw calls. Budget check done in a software renderer: about 0.73M triangles and about 1,100 meshes in the bar scene. Big crowd scenes (wedding, nightclub) are the risk on phones. Test on a real phone.
- Rig: group hierarchy b > P (pelvis) / C (spine) > H (head); arms and legs have `.p` and `.k` (knee/elbow); `pose(c,st,dt,dist,t)` in game.js drives it. Face animation goes through `c.avFace(dt,mood,mo,bl)`; arms use `c.armAb`. Dance pose states `dance1`..`dance5` (Club, Sway, Pump, Disco, Groove) exist in game.js `pose()` but no challenge uses them yet.
- Untested: seated skirts and gowns, heavy builds with dance.

## Product decisions
- Rizz list is 18 challenges plus a relationship section (see the build plan). Goals must vary beyond "number" and "date". Scoring reflects interaction quality; pushing after a firm no is never rewarded. No "she is not interested" challenge. Do not build new challenges until aesthetics and personality are acceptable, then build in agreed order.
- Chat and expression text must not reference place or position (for example "leans across the bar"); use body movement only. NOT implemented yet.
- Optional custom name replaces one of the five women's names per challenge (re-entered each time).
- Win-rate and personality calibration still wanted.
- Next: first new challenge (the date), recurring characters with memory and a fixed id-to-name binding.

## Process
- Avatar design is done in the lab pages first (`lab/avatars/lab/avatar-male.html`, `avatar-female.html`), then ported.
- The user may revoke GitHub access between sessions. Push needs the repo attached to the session (`joevics5/Reach-Game`; the proxy blocks unattached repos).

## Career batch (5 challenges, each its own scene)
- Scenes: interview (BrightWave), electronics (VoltBox, standing), beverage (Zest Corner), office (Mr Roberts), bank (Sterling). Challenges use `work(o)` in challenges.js to build the career `ai`.
- Career challenges use a fixed persona (no target picker) and custom skill schema (WORK_SK) shown as dashboard cards on the review screen.
- Untested with a real Gemini key; demo replies are still bar-flavoured.
