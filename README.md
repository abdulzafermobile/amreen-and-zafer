# 💞 From Muscat, With Love — a long-distance quiz

A playful "How well do you know us?" quiz for a couple living in two different cities.

1. **Intro:** live clocks for both cities and the real distance between them, with a plane flying across.
2. **Quiz:** 7 questions with cheeky feedback. Two are live: the distance question and "what time is it for me right now?"
3. **Love-o-meter:** always ends at 100%. Any missing points become a "bonus for being the love of my life".
4. **The big question:** "Will you go on a video-call date with me tonight?" The "No" button runs away and shrinks.
5. **Success:** confetti, the call time in both time zones, a live countdown, the date details, and an Add-to-calendar button with a 15-minute reminder.

Plain HTML/CSS/JS, so it runs on GitHub Pages as-is.

## ✏️ Personalise (all in `script.js`)

**`CONFIG` block (top of file)**

| Field | What it does |
|---|---|
| `yourName`, `greeting`, `introText`, `message` | Your words |
| `me` / `her` | City name, time zone, coordinates. Distance is calculated automatically |
| `call.start` | Call time **in Muscat time**, e.g. `"2026-10-22T20:30:00+04:00"`. Keep the `+04:00`! Her Hyderabad time is calculated automatically |
| `call.platform`, `dressCode`, `bring`, `plan` | The date details |
| `whatsappNumber` | Your number, digits only with country code (e.g. `968XXXXXXXX`). Adds a "Tell me on WhatsApp" button. Leave `""` to hide it |

**`QUESTIONS` block**

- `options`: up to 4 answers
- `correct`: index of the right answer (`0` = first). Use `"all"` for trick questions where every answer is right
- `right` / `wrong`: the message shown after she answers
- Questions with `type: "distance"` or `type: "time"` build their own answers. Only edit their text

Replace the generic questions with inside jokes: where you first met, her favourite food, who's the better cook… That's what makes it special.

## 🧪 Test locally

Double-click `index.html`. To check the India time display, change your computer's time zone, or just trust it. The site always uses Muscat and India time, whatever the device's time zone.

## 🚀 Deploy

```bash
git init
git add .
git commit -m "From Muscat, with love 💞"
git branch -M main
git remote add origin https://github.com/<your-username>/<repo-name>.git
git push -u origin main
```

Then on GitHub: **Settings → Pages → Deploy from a branch → `main` / `(root)` → Save**.
