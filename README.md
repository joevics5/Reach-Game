# Reach

A social simulation game. Pick a category (Rizz, Make Friends), choose a challenge, walk into a 3D scene, and talk to a character who has their own personality, mood and limits. You get a review at the end.

Right now: the dashboard, both challenge lists, and challenge 1 of Rizz ("Break the Ice at the Bar", approach a woman or a man). The other 39 challenges are placeholders.

## Stack

- **Next.js 15 (App Router) + TypeScript** for the app shell, the API and deployment
- **Vanilla JavaScript + Three.js r128** for the game itself (`public/game/game.js`): UI flow, procedural 3D bar, animated characters
- **Claude API** for character replies and the end-of-challenge review, called from the server only (`app/api/ai/route.ts`)
- Installable as a PWA (`public/manifest.webmanifest`, `public/sw.js`)

## Run it

```bash
npm install
cp .env.example .env.local     # add ANTHROPIC_API_KEY
npm run dev                    # http://localhost:3000
```

Without an API key the app runs in **demo mode** with canned replies, so you can try the whole flow.

Production: `npm run build && npm start`, or deploy to Vercel (set `ANTHROPIC_API_KEY` in project settings).

## Layout

```
app/page.tsx            renders the game
app/api/ai/route.ts     server AI proxy (validation, rate limit, model choice, demo mode)
components/markup.ts    static HTML for the game screens
public/game/game.js     the game
public/vendor/three.min.js
lib/                    mock replies, rate limiter
```

## Notes

- Voice input uses the browser's speech recognition (best in Chrome and Safari). It needs HTTPS or localhost.
- Progress is saved in the browser (`localStorage`). Accounts and cross-device sync are not built yet.
- The rate limiter is in memory. Swap it for Redis or Upstash before running several instances.
- Next steps: the remaining challenges, Make Friends scenes, recurring characters with memory, accounts, content moderation.
