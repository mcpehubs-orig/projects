# CodeQuest Platform

Production-ready gamified coding platform (SaaS-style frontend) with:

- Game quest engine (100 tasks across levels/languages)
- XP, streaks, achievements, daily challenge, hints
- Browser mini IDE for JavaScript execution
- Guest mode (localStorage)
- Optional Google OAuth (Firebase Auth)
- SEO pages and technical SEO assets (`sitemap.xml`, `robots.txt`, schema)

## Stack

- HTML5 + CSS3 + Vanilla JavaScript (modular architecture)
- Optional Firebase (Auth + Firestore extension point)

## Run locally

Use any static server:

```bash
# Python
python -m http.server 8080

# Node
npx serve .
```

Then open:

- `http://localhost:8080/index.html`

## Firebase setup (optional)

1. Copy `src/js/firebase-config.example.js` to `src/js/firebase-config.js`.
2. Add real Firebase credentials.
3. In `index.html`, replace:
   - `src/js/firebase-config.example.js`
   - with `src/js/firebase-config.js`
4. Enable Google Auth in Firebase console.

## Deploy

### Vercel

1. Import repository in Vercel.
2. Framework preset: Other.
3. No build command required.
4. Root output: project root.

### GitHub Pages

1. Push repository to GitHub.
2. In repository settings, enable Pages from main branch root.
3. Site will serve static files directly.

### Firebase Hosting

```bash
npm i -g firebase-tools
firebase login
firebase init hosting
firebase deploy
```

Project already contains `firebase.json`.

## Architecture

`src/js/main.js`  
Orchestrator: initializes profile, UI, auth, quest flow, editor flow.

`src/js/modules/game.js`  
Domain logic: progression, XP, streaks, multipliers, daily challenge, achievements, question selection.

`src/js/modules/storage.js`  
State persistence for guest mode via localStorage.

`src/js/modules/auth.js`  
Optional Firebase Google OAuth integration.

`src/js/modules/editor.js`  
In-browser JavaScript execution with captured console output.

`src/js/data/questions.js`  
Question bank generation (100 tasks).

`pages/*.html`  
SEO landing and educational content pages with internal linking.
