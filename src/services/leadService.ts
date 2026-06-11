/**
 * leadService.ts
 *
 * Google Apps Script does NOT support CORS preflight (OPTIONS).
 * Any fetch() with Content-Type: application/json triggers a preflight → blocked.
 *
 * The only browser-safe approach that actually writes to Sheets:
 *   - Use GET requests with data encoded as URL search params.
 *   - Apps Script's doGet() receives them via e.parameter and writes the row.
 *   - GET requests never trigger a preflight → no CORS issue.
 *
 * Limitation: GET responses are still cross-origin, so we use no-cors mode
 * and cannot read the rowId back. We store a local incrementing ID instead
 * to correlate the lead row for the payment update.
 */

const GOOGLE_SCRIPT_URL = import.meta.env.VITE_GOOGLE_SCRIPT_URL as string | undefined;

export interface LeadPayload {
  name: string;
  mobile: string;
  profession: string;
  email: string;
  city: string;
  dob: string;
  birthTime: string;
  birthPlace: string;
  issues: string;
}

export type PaymentStatus = "Paid" | "Failed";

// ---------------------------------------------------------------------------
// saveLead
// ---------------------------------------------------------------------------

/**
 * Appends a new lead row to Google Sheets using a GET request (CORS-safe).
 * Returns a locally-generated session key that is passed back to the sheet
 * via the payment update so the script can match the row.
 */
export async function saveLead(payload: LeadPayload): Promise<string> {
  // Generate a short unique key — sent as a param so the sheet can store it
  // and we can reference it when updating payment status.
  const sessionKey = _generateSessionKey();

  if (!GOOGLE_SCRIPT_URL) {
    console.log("[leadService] No webhook URL set. Mock lead:", { ...payload, sessionKey });
    return sessionKey;
  }

  const params = new URLSearchParams({
    action: "createLead",
    sessionKey,
    name: payload.name,
    mobile: payload.mobile,
    profession: payload.profession,
    email: payload.email,
    city: payload.city,
    dob: payload.dob,
    birthTime: payload.birthTime,
    birthPlace: payload.birthPlace,
    issues: payload.issues,
  });

  try {
    // no-cors GET — fires and forgets, never blocked by preflight
    await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
      mode: "no-cors",
    });
    console.log("[leadService] Lead dispatched. Session key:", sessionKey);
  } catch (err) {
    console.error("[leadService] Failed to send lead:", err);
  }

  return sessionKey;
}

// ---------------------------------------------------------------------------
// updatePaymentStatus
// ---------------------------------------------------------------------------

/**
 * Updates the Payment Status column for the row matching sessionKey.
 * Also uses a GET request for the same CORS reason.
 */
export async function updatePaymentStatus(
  sessionKey: string,
  status: PaymentStatus,
  transactionId: string
): Promise<void> {
  if (!GOOGLE_SCRIPT_URL) {
    console.log("[leadService] Mock payment update:", { sessionKey, status, transactionId });
    return;
  }

  const params = new URLSearchParams({
    action: "updatePayment",
    sessionKey,
    status,
    transactionId,
  });

  try {
    await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
      mode: "no-cors",
    });
    console.log("[leadService] Payment status update sent:", status);
  } catch (err) {
    console.error("[leadService] Failed to send payment update:", err);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function _generateSessionKey(): string {
  const ts = Date.now().toString(36).toUpperCase();
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `LEAD-${ts}-${rand}`;
}

// ---------------------------------------------------------------------------
// Debug helper — call this from the browser console to verify connectivity:
//   import('/src/services/leadService.ts').then(m => m.testSheetConnection())
// ---------------------------------------------------------------------------
export async function testSheetConnection(): Promise<void> {
  if (!GOOGLE_SCRIPT_URL) {
    console.error("[leadService] VITE_GOOGLE_SCRIPT_URL is not set in .env");
    return;
  }

  const testKey = "TEST-" + Date.now();
  const params = new URLSearchParams({
    action: "createLead",
    sessionKey: testKey,
    name: "TEST ENTRY",
    mobile: "9999999999",
    profession: "Tester",
    email: "test@test.com",
    city: "TestCity",
    dob: "2000-01-01",
    birthTime: "12:00",
    birthPlace: "TestPlace",
    issues: "This is a connectivity test — safe to delete",
  });

  console.log("[leadService] Sending test lead to:", `${GOOGLE_SCRIPT_URL}?${params.toString()}`);

  try {
    await fetch(`${GOOGLE_SCRIPT_URL}?${params.toString()}`, {
      method: "GET",
      mode: "no-cors",
    });
    console.log(
      `[leadService] ✅ Test request sent! Check your Google Sheet for a row with Session Key: ${testKey}`,
      "\nIf nothing appears after 5 seconds, your Apps Script needs to be redeployed with doGet() — see GOOGLE_SHEETS_SETUP.md"
    );
  } catch (err) {
    console.error("[leadService] ❌ Test request failed:", err);
  }
}
