# Reach: notes for Claude sessions

Reach is an AI social-simulation game (categories: Rizz, Make Friends). Next.js 15 shell (`app/`, `components/Game.tsx`) plus a vanilla JS / Three.js r128 game in `public/game/`. Gemini is called client-side (key entered in Settings). Deployed on Vercel from `main`. First challenge, "The Copper Lantern" bar, is playable.

## Script load order (components/Game.tsx SCRIPTS)
three.min.js, GLTFLoader, SkeletonUtils, ai.js, people.js, **avatar.js**, **cast.js**, game.js. Add any new script before game.js. When adding or changing a game file, bump `CACHE` in `public/sw.js` (currently reach-v8) and list new files in its ASSETS.

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
