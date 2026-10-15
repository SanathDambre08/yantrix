# Yantrix — Robotics & Aviation Club, DYPIU

Static website (no build step). Pages: Home · Journey · Team · Gallery · Events · Join us.

## Run it
    python3 serve.py          # then open http://localhost:8000
(Use serve.py rather than opening the files directly or `python3 -m http.server` — the
scroll-scrubbed videos need HTTP Range support, which serve.py provides.)

## Edit content — assets/js/data.js
- `contact`: email, Instagram, LinkedIn, GitHub, YouTube, `formEndpoint` (empty = link hidden)
- `faculty` / `team`: add `name`, `photo: "assets/team/x.jpg"`, `linkedin`, `github`
- `events`: set `date: "2026-11-14"`, `status: "upcoming" | "past"`, `link` for registration
- `gallery`: add your own photos/videos

## Assets
- assets/frames/f001–f240.jpg  → Journey scroll sequence (Earth → DYPIU)
- assets/video/hero.*          → Home hero reel
- assets/video/*-scrub.mp4     → all-intra encodes for scroll scrubbing (keep `-g 1` if re-encoding)

## Deploy
Upload the whole `site/` folder to any static host (Netlify, Vercel, GitHub Pages, Cloudflare Pages).

## Photo credits (Unsplash License, free to use)
Journey film strip: drawings/PCB/robot-arm/drone photos from Unsplash — e.g. Nik (drone), Valentin Zickner (drones), Minh Đức (PCB). Campus image is from the club's own footage.

## Join form → Google Sheet + auto-reply email
See `backend/SETUP.md` (5-minute setup). Paste the web-app URL into `formEndpoint` in `assets/js/data.js`.
