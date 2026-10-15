/**
 * YANTRIX — Join form backend (Google Apps Script)
 *
 * What it does for every application submitted on the website:
 *   1. Saves a row in this Google Sheet (with date & time, India time)
 *   2. Emails the applicant an automatic thank-you
 *   3. Emails the club inbox a notification with all the details
 *
 * Setup: see backend/SETUP.md
 */

// ====== EDIT THESE ======
var CLUB_EMAIL = "";                        // club inbox that receives notifications, e.g. "yantrix@dypiu.ac.in"
var CLUB_NAME  = "Yantrix";
var SHEET_NAME = "Sheet1";                  // the tab name at the bottom of your sheet
var TIMEZONE   = "Asia/Kolkata";
// ========================

var HEADERS = ["Submitted at", "Name", "Email", "Phone", "Programme / branch", "Year", "Interests", "About", "Auto-reply sent"];

function doPost(e) {
  var lock = LockService.getScriptLock();
  try {
    lock.waitLock(20000);
    var d = JSON.parse(e.postData.contents);

    // basic server-side checks (never trust the browser)
    var name = clean(d.name), email = clean(d.email), phone = clean(d.phone);
    if (!name || !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email) || !/^\+?[\d\s\-]{10,15}$/.test(phone)) {
      return out({ ok: false, error: "invalid" });
    }
    if (d.company) return out({ ok: true });            // honeypot: bots fill this in

    var interests = (d.interests || []).map(clean).join(", ");
    var when = new Date();
    var stamp = Utilities.formatDate(when, TIMEZONE, "dd MMM yyyy, hh:mm:ss a");

    var sheet = getSheet();
    var row = sheet.getLastRow() + 1;
    sheet.getRange(row, 4).setNumberFormat("@");        // keep phone numbers as text (no lost + or leading zeros)
    sheet.getRange(row, 1, 1, 9).setValues([[
      stamp, name, email, phone, clean(d.programme), clean(d.year), interests, clean(d.about), "pending"
    ]]);

    // 1) auto-reply to the applicant
    var sent = "yes";
    try { replyToApplicant(name, email); } catch (err) { sent = "FAILED: " + err; }
    sheet.getRange(row, 9).setValue(sent);

    // 2) notify the club inbox
    if (CLUB_EMAIL) {
      MailApp.sendEmail({
        to: CLUB_EMAIL,
        replyTo: email,
        subject: "New Yantrix application — " + name,
        body: "New application received " + stamp + "\n\n" +
              "Name: " + name + "\nEmail: " + email + "\nPhone: " + phone + "\n" +
              "Programme: " + clean(d.programme) + "\nYear: " + clean(d.year) + "\n" +
              "Interests: " + interests + "\n\nAbout:\n" + clean(d.about) + "\n\n" +
              "All applications: " + SpreadsheetApp.getActiveSpreadsheet().getUrl()
      });
    }
    return out({ ok: true });
  } catch (err) {
    return out({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return out({ ok: true, service: "yantrix-join" }); }

function replyToApplicant(name, email) {
  var first = name.split(" ")[0];
  var text =
    "Hi " + first + ",\n\n" +
    "Thanks for contacting " + CLUB_NAME + " — the robotics and aviation club of DY Patil International University.\n\n" +
    "We've received your application and we'll get in contact with you soon.\n\n" +
    "In the meantime, keep an eye on our website for upcoming events.\n\n" +
    "— Team " + CLUB_NAME;
  var html =
    '<div style="font-family:Arial,Helvetica,sans-serif;max-width:560px;margin:0 auto;color:#0b1226">' +
    '<div style="background:#050a17;padding:28px 32px"><div style="font-size:26px;font-weight:800;letter-spacing:.08em;color:#f2efe8">YANTRIX</div>' +
    '<div style="font-size:11px;letter-spacing:.14em;color:#8993ab;margin-top:4px">ROBOTICS &amp; AVIATION CLUB · DYPIU</div></div>' +
    '<div style="padding:32px;background:#f2efe8">' +
    '<p style="font-size:18px;margin:0 0 16px"><b>Hi ' + esc(first) + ',</b></p>' +
    '<p style="font-size:16px;line-height:1.6;margin:0 0 14px">Thanks for contacting ' + CLUB_NAME + '. We\'ve received your application and <b>we\'ll get in contact with you soon.</b></p>' +
    '<p style="font-size:16px;line-height:1.6;margin:0 0 24px">In the meantime, keep an eye on our website for upcoming events.</p>' +
    '<p style="font-size:14px;color:#4a5268;margin:0">— Team ' + CLUB_NAME + '<br>DY Patil International University, Pune</p>' +
    '</div><div style="height:6px;background:#ff7a1a"></div></div>';
  MailApp.sendEmail({ to: email, subject: "Thanks for contacting " + CLUB_NAME, body: text, htmlBody: html, name: CLUB_NAME });
}

function getSheet() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(HEADERS);
    sh.getRange(1, 1, 1, HEADERS.length).setFontWeight("bold").setBackground("#050a17").setFontColor("#ffffff");
    sh.setFrozenRows(1);
    sh.setColumnWidth(1, 190);
  }
  return sh;
}

function clean(v) { return String(v == null ? "" : v).replace(/[\u0000-\u001f]/g, " ").trim().slice(0, 1500); }
function esc(s) { return String(s).replace(/[&<>"]/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]; }); }
function out(o) { return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON); }

/**
 * Run this ONCE from the editor (function dropdown → testEmail → Run) to check that
 * email sending is allowed and see your remaining daily quota in the Execution log.
 */
var TEST_TO = "";   // put your own email here before running testEmail

function testEmail() {
  if (!TEST_TO) throw new Error("Set TEST_TO at the top of testEmail first.");
  Logger.log("Sending as: " + Session.getEffectiveUser().getEmail());
  Logger.log("Remaining email quota today: " + MailApp.getRemainingDailyQuota());
  replyToApplicant("Test User", TEST_TO);
  Logger.log("Test email sent to " + TEST_TO + " — check inbox, Spam and Promotions.");
}
