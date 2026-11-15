# Reach avatars: handoff
- lab/avatar-lab.tpl.html : single source of the avatar designer (faces, builds, hair, wardrobe, 5 dances). gen.sh makes avatar-male.html / avatar-female.html.
- tools/gen_avatar.py (+avatar_core.js, avatar_tail.js): extracts the lab code into game/avatar.js. Note: LOD tweaks (LQ, NOOL, HSEG) were edited into avatar.js by hand, so re-apply them if you regenerate.
- game/avatar.js : window.ReachAvatar={make(look),spec(look)}. look.lod='lo' = crowd detail (no outlines, fewer segments).
- game/game.js : makeChar uses ReachAvatar; pose() has face block guard (c.avFace), armAb, dance styles (st='dance1'..'dance5').
- Also needed: add "/game/avatar.js" before game.js in components/Game.tsx, bump sw.js cache.
- Status: bar scene works; ~0.72M tris / 3100 meshes, needs mesh merging for phones. Next: cast bank (10M+10F presets), then new challenges.
