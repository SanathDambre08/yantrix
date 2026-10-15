# Connect the Join form to a Google Sheet + automatic emails (≈5 minutes)

You need a Google account (use the club's Gmail if you have one — emails will be sent from it).

1. Go to https://sheets.google.com → create a new blank sheet, name it **Yantrix Applications**.
2. In the sheet: **Extensions → Apps Script**. Delete the sample code and paste everything from `backend/Code.gs`.
3. At the top of the script set `CLUB_EMAIL` to the inbox that should receive a notification for each new application. Save (Ctrl/Cmd+S).
4. Click **Deploy → New deployment → ⚙ Select type → Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, then **Authorize access** and accept the Google permission prompts
     (it needs to edit the sheet and send email; "Advanced → Go to project (unsafe)" is normal for your own script).
5. Copy the **Web app URL** (ends in `/exec`).
6. Open `site/assets/js/data.js` and paste it as `formEndpoint`, e.g.
   `formEndpoint: "https://script.google.com/macros/s/AKfy.../exec",`
7. Test: submit the Join form with your own email. You should get the thank-you email, a new row in the sheet (with date & time), and the club inbox gets a notification.

Notes
- If you change `Code.gs` later: **Deploy → Manage deployments → ✏ → Version: New version → Deploy** (the URL stays the same).
- Gmail lets a normal account send ~100 automatic emails/day (Workspace accounts ~1,500) — plenty for a club.
- Applicant data sits in your Google Sheet only; keep sharing on that sheet limited to core team members.
