"use client";

import { memo, useEffect, useState } from "react";
import { MARKUP } from "./markup";

/**
 * The game screens are static markup and the game itself (UI flow, 3D bar, characters)
 * lives in public/game/game.js, which binds to the ids in MARKUP.
 * Three.js is loaded first, then the game script.
 */
// Order matters: Three.js, model loaders, AI client, character models, then the game.
const SCRIPTS = ["/vendor/three.min.js", "/vendor/GLTFLoader.js", "/vendor/SkeletonUtils.js", "/game/ai.js", "/game/people.js", "/game/avatar.js", "/game/cast.js", "/game/challenges.js", "/game/group.js", "/game/game.js"];

// Never re-rendered, so React cannot replace the DOM nodes game.js has already bound to.
const Screens = memo(function Screens() {
  return <div dangerouslySetInnerHTML={{ __html: MARKUP }} suppressHydrationWarning />;
});

export default function Game() {
  useEffect(() => {
    // Load the scripts one after another, after the screens are in the page and hydration is done.
    let cancelled = false;
    (async () => {
      for (const src of SCRIPTS) {
        if (cancelled) return;
        if (document.querySelector(`script[data-reach="${src}"]`)) continue;
        await new Promise<void>(resolve => {
          const s = document.createElement("script");
          s.src = src;
          s.dataset.reach = src;
          s.onload = () => resolve();
          s.onerror = () => resolve(); // optional pieces (models) must not stop the game
          document.body.appendChild(s);
        });
      }
    })();
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
    return () => { cancelled = true; };
  }, []);
  return <Screens />;
}
