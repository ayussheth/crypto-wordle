# CryptoWordle 🔗

Daily crypto word puzzle — Wordle for crypto/web3 terms. Guess the 5-letter crypto word in 6 tries.

## Features

- 🎯 Daily crypto word (seeded by date, 100+ curated words)
- 🟩 Green = correct position, 🟨 Yellow = wrong position, ⬛ Gray = not in word
- ⌨️ Virtual keyboard with color feedback
- 💾 Game state saved in localStorage
- 📱 Mobile-first design (424x695px Farcaster mini app)
- 🔗 Share results as emoji grid via Farcaster cast
- 🌙 Dark crypto aesthetic with neon green accents

## Setup

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Deploy as Farcaster Mini App

1. Deploy to Vercel/similar
2. Update `.well-known/farcaster.json` with your domain and account association
3. Update `homeUrl`, `iconUrl`, `splashImageUrl` in the manifest
4. Register your mini app in the Farcaster developer portal

## Tech Stack

- Next.js 14 (React)
- @farcaster/miniapp-sdk
- Tailwind CSS
- TypeScript
- Pure client-side (no backend)

## Word List

100+ curated 5-letter crypto/web3 terms in `src/data/words.ts`. PRs welcome to expand the list!
