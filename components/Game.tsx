"use client";

import Script from "next/script";
import { useEffect, useState } from "react";
import { MARKUP } from "./markup";

/**
 * The game screens are static markup and the game itself (UI flow, 3D bar, characters)
 * lives in public/game/game.js, which binds to the ids in MARKUP.
 * Three.js is loaded first, then the game script.
 */
export default function Game() {
  // Scripts must run in order: Three.js, then the AI client, then the game.
  const [step, setStep] = useState(0);
  useEffect(() => {
    if ("serviceWorker" in navigator && process.env.NODE_ENV === "production") {
      navigator.serviceWorker.register("/sw.js").catch(() => {});
    }
  }, []);
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: MARKUP }} suppressHydrationWarning />
      <Script src="/vendor/three.min.js" strategy="afterInteractive" id="three" onReady={() => setStep(s => Math.max(s, 1))} />
      {step >= 1 && <Script src="/game/ai.js" strategy="afterInteractive" id="ai" onReady={() => setStep(s => Math.max(s, 2))} />}
      {step >= 2 && <Script src="/game/game.js" strategy="afterInteractive" id="game" />}
    </>
  );
}
