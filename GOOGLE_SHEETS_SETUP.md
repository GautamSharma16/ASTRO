# Google Sheets Setup Guide

## Root cause of the sheet-not-updating bug

The Apps Script uses `getSheetByName("Astro Vastu Leads")` but your actual sheet **tab name**
(shown at the bottom of the spreadsheet) is most likely still `Sheet1`.  
`getSheetByName` returns `null` when the name doesn't match → `appendRow` throws → data is lost silently.

**The updated script below uses a safe fallback**: if the named tab isn't found, it writes to the first tab automatically.

---

## Why GET and not POST?

Google Apps Script does not support CORS preflight (OPTIONS). Any `fetch()` with
`Content-Type: application/json` triggers a preflight → Google blocks it with 401.
The only browser-safe solution: **send data as GET query parameters**.
GET requests never trigger a preflight.

---

## Step 1 — Set up the Google Sheet

1. Go to [sheets.google.com](https://sheets.google.com) → **New Spreadsheet**.
2. Rename the spreadsheet title to anything you like (e.g. `Astro Vastu Leads`).
3. Look at the **tab at the bottom** — it's probably called `Sheet1`. Leave it as is.
4. In **Row 1**, add these headers:

| A | B | C | D | E | F | G | H | I | J | K | L | M |
|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Timestamp | Session Key | Name | Mobile | Profession | Email | City | DOB | Birth Time | Birth Place | Issues | Payment Status | Transaction ID |

---

## Step 2 — Paste this Apps Script

1. Inside the sheet: **Extensions → Apps Script**.
2. **Delete all existing code** and paste:

```javascript
// ============================================================
//  Energy Acharya Shilpa — Google Apps Script Webhook
//  Uses doGet() — no CORS preflight, always works from browser.
// ============================================================

// ⚠️ Set this to the TAB NAME shown at the bottom of your sheet.
// Default is "Sheet1". The script falls back to the first tab if not found.
const SHEET_NAME = "Sheet1";

function doGet(e) {
  try {
    const action = e.parameter.action;
    if (action === "createLead")   return createLead(e.parameter);
    if (action === "updatePayment") return updatePayment(e.parameter);
    return response("error", "Unknown action: " + action);
  } catch (err) {
    return response("error", err.toString());
  }
}

// Accept POST too (some environments send POST)
function doPost(e) {
  return doGet(e);
}

// Safe sheet getter — falls back to first tab if name doesn't match
function getSheet() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  return ss.getSheetByName(SHEET_NAME) || ss.getSheets()[0];
}

function createLead(p) {
  const sheet = getSheet();
  sheet.appendRow([
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata" }), // A
    p.sessionKey  || "",  // B: Session Key
    p.name        || "",  // C: Name
    p.mobile      || "",  // D: Mobile
    p.profession  || "",  // E: Profession
    p.email       || "",  // F: Email
    p.city        || "",  // G: City
    p.dob         || "",  // H: DOB
    p.birthTime   || "",  // I: Birth Time
    p.birthPlace  || "",  // J: Birth Place
    p.issues      || "",  // K: Issues
    "Pending",            // L: Payment Status
    "",                   // M: Transaction ID
  ]);
  return response("ok", "Lead saved: " + (p.sessionKey || "no-key"));
}

function updatePayment(p) {
  const sheet = getSheet();
  const data  = sheet.getDataRange().getValues();
  for (let i = 1; i < data.length; i++) {
    if (data[i][1] === p.sessionKey) {           // column B = Session Key
      sheet.getRange(i + 1, 12).setValue(p.status        || "Unknown");
      sheet.getRange(i + 1, 13).setValue(p.transactionId || "");
      return response("ok", "Payment updated: " + p.sessionKey);
    }
  }
  return response("error", "Session key not found: " + p.sessionKey);
}

function response(status, message) {
  return ContentService
    .createTextOutput(JSON.stringify({ status, message }))
    .setMimeType(ContentService.MimeType.JSON);
}
```

3. Click **Save** (Ctrl+S).

---

## Step 3 — Deploy as Web App (must do this after every code change)

1. Click **Deploy → New Deployment**.
2. Click the ⚙ gear → **Web App**.
3. Set:
   - **Execute as**: Me
   - **Who has access**: **Anyone** ← not "Anyone with Google account"
4. Click **Deploy** → authorize → copy the Web App URL.

> ⚠️ You must always create a **New Deployment** after changing code.
> Editing and saving the script alone does NOT update the live endpoint.

---

## Step 4 — Update .env

```env
VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/YOUR_NEW_ID/exec
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXXXX
```

Restart `npm run dev` after saving.

---

## Step 5 — Test it

Open a terminal and run this curl command (replace the URL with yours):

```bash
curl "https://script.google.com/macros/s/YOUR_SCRIPT_ID/exec?action=createLead&sessionKey=TEST-001&name=TestUser&mobile=9999999999&profession=Tester&email=test@test.com&city=Mumbai&dob=2000-01-01&birthTime=12:00&birthPlace=Pune&issues=Test"
```

Expected response:
```json
{"status":"ok","message":"Lead saved: TEST-001"}
```

Then check your sheet — a new row should appear with `Payment Status = Pending`.

---

## Troubleshooting

### `TypeError: Cannot read properties of null (reading 'appendRow')`
The tab name in `SHEET_NAME` doesn't match your actual sheet tab.
- Look at the tab name at the **bottom** of your Google Sheet
- Update `const SHEET_NAME = "Sheet1"` to match exactly (case-sensitive)
- Create a **New Deployment** after saving

### Sheet gets no data at all
Your script is still the old version (with `doPost` only, no `doGet`).
Delete all code, paste the new script above, save, and create a **New Deployment**.

### 401 Unauthorized
"Who has access" is set to "Anyone with Google account" instead of "Anyone".
Create a new deployment with the correct setting.

### Payment Status never updates
The `sessionKey` must match column B exactly.
Check Apps Script → **Executions** (left sidebar) for `"Session key not found"` errors.

### Razorpay favicon errors on localhost
Expected — Razorpay's servers can't reach `localhost`.
This is cosmetic and doesn't affect payment processing. It goes away on a live domain.
