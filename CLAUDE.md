# Reach: notes for Claude sessions

Reach is an AI social-simulation game (categories: Rizz, Make Friends). Next.js 15 shell (`app/`, `components/Game.tsx`) plus a vanilla JS / Three.js r128 game in `public/game/`. Gemini is called client-side (key entered in Settings). Deployed on Vercel from `main`. Playable: The Copper Lantern bar and The Date.

## Script load order (components/Game.tsx SCRIPTS)
three.min.js, GLTFLoader, SkeletonUtils, ai.js, people.js, **avatar.js**, **cast.js**, **challenges.js**, **group.js**, game.js. Scene files in `public/game/scenes/` load on demand when a challenge starts. Add any new script before game.js. When adding or changing a game file, bump `CACHE` in `public/sw.js` (currently reach-v19) and list new files in its ASSETS.

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

## Public Speaking batch (5 challenges, each its own scene)
- Scenes: wedding (Best Man Toast), graduation, debate (1 vs 5), qa (Difficult Question), press (Press Conference). Built with a shared helper block at the top of each file (chair, guests, room, cam); audience are `lod:'lo'` crowd.
- Player stands on the floor (seatY 0; a nonzero seatY triggers the seated pose, so stages are flat decor). One persona reacts as "the room" (grandmother, dean, opponent, questioner, reporter) using `spk()` (a `work()` variant with a speech-specific `extra`) and SPEAK_SK skills.
- 1 vs 5 Debate: one visible opponent; the AI names a new opponent every 3 turns and tallies rounds. Real multi-opponent visuals are a later upgrade.
- Untested with a real Gemini key.

## Friendship batch (5 challenges, each its own scene)
- Scenes: doorstep (New Neighbour), stadium, park (bench), cafeteria (university), club (debate club room). `fr()` in challenges.js = `work()` variant with a friendly, non-romantic `extra`; skills FRIEND_SK. Personas are adults (19+).
- Club President mirrors the debate: one visible prospect, the AI voices five students in turn and tallies joiners (need 3).
- Outdoor scenes use `ground()` + `tree()` helpers at the top of the file (copy them; there is no shared module).
- Untested with a real Gemini key.

## Startup batch (5 challenges, each its own scene)
- Scenes: boardroom (Board Pitch), sharktank (investor studio, five seated investors), shop (The First Client), clientoffice (Difficult Client), loan (branch loan desk; distinct from the Career `bank` scene). `biz()` = `work()` variant with a business-pitch `extra`; skills BIZ_SK.
- Shark Tank mirrors the debate pattern: one persona object, the AI voices the five investors by name.
- Camera tip: `cam(cx,cz,r,py,ty,a0)` orbits the midpoint; use a0 around 0.5-1.0 so the player does not block the other person.
- Untested with a real Gemini key.

## Rizz additions
- The Last Bus (scene `busstop`, uses `BUS_AI`, same target-picker flow as The Date; win needs a day AND a time) and Table for More (scene `cafe`, fixed persona Jade voicing three friends, `work()` ai with its own skills). Rizz now has 4 playable; Coffee by Text still needs a chat-only UI (no 3D scene).
- Untested with a real Gemini key.
- Coffee by Text (scene `phonechat`, `TEXT_AI`): no chat-only mode was added. The scene is a living room with the group chat on a wall screen and the contact standing on a lit plinth, so the standard seated engine works unchanged. All 25 starter challenges are now playable. A true chat-only mode (no 3D) would be an engine change if ever wanted.

## Walk-in flow, chat mode, global cast (Nov 2026 revision)
- ALL scenes are walk-in: `mode:'seated'` challenges start the player at the entrance (`scene.start` or (0, rz-1.1)), the person is placed with a pre-talk heading that does NOT face the player, and tapping Talk auto-walks to the seat/spot given in `setup()` via `K.player(x,z,h,y)` (that call now just records `W.spot`). Scenes whose start collides with obstacles need a `start:{x,z,h}` in `reg()` (stadium, graduation, debate do).
- `side:true` in `reg()` = people sit/stand side by side facing forward (stadium, park, bus stop): bodies do not pivot to face each other, only heads turn.
- `mode:'chat'` (Coffee by Text) = no 3D at all: `#s-play.phonemode` shows only a phone-styled chat; goal in `#pgoal`.
- Goals/titles/places of the 25 challenges are the user's wording and must not be reworded (Cafeteria = "School cafeteria ... name and class"; Table for More = "Restaurant").
- Names are global (no region-specific cluster) and skin tones in `cast.js` SK run fair to deep, spread evenly across the 30. Keep both when adding characters.
- Brief page has an explicit "Back to <category>" button.

## Group engine (`public/game/group.js`, `window.ReachGroup`)
Copied in spirit from Courtroom Quest (`src/lib/ai/trialAI.ts`): every agent is its own AI call over a shared transcript (`G.grp.gh`); concurrency 4, retries 2s/6s, quorum, optional deliberation round, no invented votes for absent agents.
- Add `group:{...}` to a challenge: `lead`, `speak:'lead'|'rotate'|'rounds'`, `chime`, `open`, `scene`, `rubric`, `rateIntro`, `agents:[{name,gender,age,job,role,who,where}]`, `audience:{n,talkers,role,jobs,where}`, `rule:{type:'share'|'any'|'majority',min}`; `rounds:{n,perRound,min,raters:'judges'|'self',opponents:[...]}` for debate/club (lead is swapped each round).
- game.js glue: `buildGroup`, `bindAgents` (adopts static scene NPCs as named agents; scenes need enough NPCs), `groupStart/groupTurn/groupRoundEnd/groupFinish`, `groupReviewPrompt`, `panelHtml` (per-agent ratings on the end screen).
- Used by: Best Man, Graduation, Difficult Question, Press, Shark Tank, Board Pitch, Table for More, 1 vs 5 Debate, Club President. Other challenges stay 1:1.
- Only tested on the demo path (no key); verify with a live Gemini key.
- **Structured flow** (`group.flow`, `speak:'flow'`): intro (player's one long turn) -> panelists ask in random order, one question + one follow-up each, either may be forfeited (forfeited question skips the follow-up) -> optional closing (Skip button) -> every panelist votes with a 0-100 score; `labels` rename yes/no (Invest/Out). Used by Shark Tank and Board Pitch; other panel-style challenges (Press, Q&A) can adopt it by adding `flow`, `labels`, `scoreHelp` to their group config. Code: `flowTurn/flowNext/flowAsk` in game.js, kinds `question`/`followup` in group.js.

## Nov 2026 polish pass
- **First message turns the person.** After the player walks up and taps Talk, the person keeps its pre-talk heading and does not look over (`G.engaged=false`). Sending the first message sets `G.engaged=true`; `updHer` then turns them and the scene's `openCue` is shown as the reaction. Group scenes where the lead speaks first (`group.open`, not flow) engage immediately.
- **Speech scenes:** the lead (grandmother, questioner, reporter) sits/stands off to the side among the audience, never between the speaker and the room. Challenges with `walkTitle`, `walk`, `talkLabel` show a podium-style prompt and the Talk button appears at the speaking spot (`W.spot`) rather than near the lead.
- **`K.fill(o)`** (game.js): scatter background people over free floor (`n`, `pairs`, `wander`, `box`, `avoid`); it keeps clear of obstacles, the entrance, the walk to the spot, the people you talk to and the talk camera sightline. Scenes opt in with `fill:{...}` in `reg()`. Do not add it to scenes whose crowd is already placed (wedding, graduation, qa, press, debate, stadium, restaurant, bar) or where it blocks the shot (sharktank).
- Debate has a sofa with four waiting opponents (`W.sofa`); `swapLead` sends the next opponent up from the sofa and seats the one who just spoke.
- Coffee by Text shows a group-chat contact picker (8 people) before the chat opens (`showContacts`).
- Explore camera rises when the player is against a wall, so the head does not fill the screen.
- Shark Tank and Board Pitch: the lead is one of the five panelists (4 named agents + lead; `leadRates:true`) and also asks in the flow.
- Source of truth for goals/setups: the user's original document (attachment 68cc7ac7). Debate = player seated at a table opposite one opponent, four wait on the sofa, rounds judged silently (`rounds.hidden`), result only after all five. Career goals use the document's own "Goal:" lines. Coffee by Text offers 10 contacts.
- **Flow options** (`group.flow`): `skipIntro` + `total` + `followUp:false` = panel asks in rotation (Job Interview: 3 interviewers, 12 questions, kind `interview`, `rule:{type:'avg',min:75}`); `ask:false` + `parts` = a speech the room rates (Graduation: up to 3 parts, 10 audience + dean rate). Challenge `inputs:[{id,label,def,area,opt}]` renders extra fields on the brief page into `G.inputs`; the interview uses `role` and `cv`, appended to the scene text for every agent.
- **Speech help:** challenges with `speech:{parts:[...]}` (Best Man, Graduation) let the player use the provided speech (shown part by part with a "Say this part" button) or paste their own (split into up to 3 parts by `splitSpeech`), or type freely. Both are `ask:false` flows rated by the audience.
- **Interview roles:** `inputs` entry with `options`+`other` renders a select (default + 10 common roles + Other). Blank Other with a pasted CV = interviewers infer the role from the CV; CV is optional.
