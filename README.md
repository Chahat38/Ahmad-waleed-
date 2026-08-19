# Ahmed Waleed — XR / AR / VR Unity Developer Portfolio

## How to view
Double-click `index.html` (or right-click → Open With → your browser).
No build step, no server required — plain HTML/CSS/JS + Three.js (CDN).

For the closest-to-real-deploy experience:
```
python3 -m http.server 8000
```
then open http://localhost:8000

## Content source
All copy — experience, dates, certifications, skills, projects, contact info —
is pulled directly from `Ahmed_Waleed_XR_Unity_CV_.pdf`. Nothing invented.

## What's inside
- `index.html` / `style.css` / `script.js` — the site
- `assets/videos/reel-1.mp4` … `reel-4.mp4` — your 4 real clips, used in the
  hero 3D object, 4 of the 6 Portfolio Vid cards, and the floating video bubble
- `profile.jpeg` — your photo, used in the hero + About orbit

## Two placeholder "reference clips"
The **Car Simulation Game** and **2D-to-3D Drawing Tool** cards in Portfolio Vid
don't have footage in your CV zip yet, so they currently embed public YouTube
reference clips (clearly tagged "Reference clip" on the card and in the popup)
so the section doesn't sit empty. Swap these for your own captured gameplay
whenever you have it — in `script.js`, find the `videos` array near the top,
change that entry's `type` to `'local'` and `src` to your new file path (same
pattern as the other four).

## Still placeholders — update before publishing
- Social links (GitHub / LinkedIn / YouTube / Instagram) in the footer and the
  floating social button — CV didn't include the actual profile URLs.
- Phone, email and location are already the real ones from your CV.
