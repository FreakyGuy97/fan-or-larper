# Fan or Larper?

A video game trivia app that separates the real fans from the larpers.
12 questions, instant verdicts, and a leaderboard for when you pass the
phone around.

## How it works

- **Home** — enter your gamer tag, see the leaderboard, hit START QUIZ.
- **Quiz** — 12 multiple-choice questions in random order. Tap an answer to
  lock it in: correct answers glow green, wrong ones glow red, and every
  question comes with a fun fact.
- **Verdict** — your score out of 12 earns a title, from
  CERTIFIED DAY-ONE FAN down to EXPOSED LARPER. Scores save to a
  leaderboard on the device.

Party mode: pass the phone around, everyone plays, lowest score buys snacks.

## Run it

```sh
npm install
npx expo start
```

Then scan the QR code with the **Expo Go** app on your phone
(or press `w` to open it in a web browser).

## Project layout

- `App.js` — all screens (home, quiz, result) and styles
- `questions.js` — the 12 trivia questions and the verdict tiers
- `app.json` — Expo app config

## Tech

Expo SDK 57, React Native, React 19. Scores persist with
`@react-native-async-storage/async-storage`.
