# Yantrix — Robotics & Aviation Club · DYPIU

Official website for **Yantrix**, the robotics and aviation club of DY Patil International University, Akurdi, Pune.

🌐 **Official Domain**: [https://yantrixdypiu.in](https://yantrixdypiu.in) (or [https://www.yantrixdypiu.in](https://www.yantrixdypiu.in))  
🌐 **Vercel Mirror**: [https://yantrix-dypiu.vercel.app](https://yantrix-dypiu.vercel.app)  
🌐 **GitHub Pages Mirror**: [https://sanathdambre08.github.io/yantrix/](https://sanathdambre08.github.io/yantrix/)  
📂 **GitHub Repository**: [https://github.com/SanathDambre08/yantrix](https://github.com/SanathDambre08/yantrix)

---

## 🚀 About Yantrix
Yantrix is where students at DY Patil International University design, wire, program, and fly real machines — from autonomous rovers and robotic arms to fixed-wing aircraft and multi-rotors.

### Website Features & Pages
- **Home (`index.html`)**: Interactive hero sequence, club statement, disciplines, live announcements, and highlights.
- **Journey (`journey.html`)**: Scroll-driven visual sequence from Earth orbit descending into DYPIU campus, chronicling the club's origin and milestone builds.
- **Team (`team.html`)**: Conveners, Technical Leads, and Club Mentors.
- **Gallery (`gallery.html`)**: Photo archive of lab builds, hackathons, and hardware showcases.
- **Events (`events.html`)**: Upcoming workshops, flight days, competitions, and archive of past events.
- **Join Us (`join.html`)**: Application form connected to Google Apps Script / Google Sheets with automatic applicant confirmation emails.

---

## 🛠️ Local Development

The site is built with pure static modern web technologies (HTML5, CSS3, ES6+ JavaScript) with no heavy build step or bundler dependencies required.

### Run Local Server
Because the scroll-scrubbed interactive videos require HTTP Range support, use the included Python server:

```bash
# Navigate to the site folder and launch
python3 site/serve.py
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

---

## 📂 Project Structure

```text
├── .github/
│   └── workflows/
│       └── deploy.yml          # Automated GitHub Pages CI/CD deployment
├── site/
│   ├── .nojekyll               # Disables Jekyll on GitHub Pages
│   ├── 404.html                # Custom error page for GitHub Pages
│   ├── index.html              # Main landing page
│   ├── journey.html            # Interactive scroll journey page
│   ├── team.html               # Club team & mentors
│   ├── gallery.html            # Media gallery
│   ├── events.html             # Events & workshops schedule
│   ├── join.html               # Membership application form
│   ├── serve.py                # Local dev server with HTTP Range support
│   ├── vercel.json             # Static asset caching headers
│   ├── assets/
│   │   ├── css/                # Main styles and custom typography
│   │   ├── fonts/              # Self-hosted variable fonts
│   │   ├── frames/             # Full-res scroll sequence frames
│   │   ├── frames-sm/          # Mobile-optimized frame sequence
│   │   ├── gallery/            # Showcase images
│   │   ├── img/                # Logos, favicons, and posters
│   │   ├── js/                 # Modular client logic (data.js, main.js, etc.)
│   │   └── video/              # Compressed & scrub-ready video assets
│   └── backend/
│       ├── Code.gs             # Google Apps Script join form handler template
│       └── SETUP.md            # Google Sheet + Email integration guide
├── .gitignore
└── README.md
```

---

## ⚙️ Configuration & Content Updates

To update club details, members, events, or gallery images:
- Edit `site/assets/js/data.js`
- Commit and push to `main` — GitHub Actions will automatically re-deploy the updated website.

---

## 🛡️ License & Credits
- **Media**: Photography and video assets belong to Yantrix & DY Patil International University.
- **Stock assets**: Licensed under Unsplash Free License.
