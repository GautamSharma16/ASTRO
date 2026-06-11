/**
 * GOOGLE APPS SCRIPT WEBHOOK FOR ASTRO VASTU LEADS
 * 
 * SETUP INSTRUCTIONS:
 * 1. Open Google Sheets (sheets.google.com).
 * 2. Create a new Spreadsheet and name it "Astro Vastu Leads".
 * 3. Go to Extensions -> Apps Script.
 * 4. Delete any code in the editor and paste this code.
 * 5. Save the project (Click the floppy disk icon).
 * 6. Click "Deploy" (top right) -> "New deployment".
 * 7. Choose type: "Web app".
 * 8. Set Configuration:
 *    - Description: "Astro Vastu Leads Webhook"
 *    - Execute as: "Me" (your email)
 *    - Who has access: "Anyone" (Crucial for Web API access)
 * 9. Click "Deploy". Copy the "Web app URL".
 * 10. Paste this URL into your Vite project's .env file:
 *     VITE_GOOGLE_SCRIPT_URL=https://script.google.com/macros/s/xxxx/exec
 */

function doPost(e) {
  // CORS header response helper
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Content-Type": "application/json"
  };

  try {
    var rawData = e.postData.contents;
    var data = JSON.parse(rawData);
    var action = data.action;

    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    
    // Auto-create headers if sheet is empty
    if (sheet.getLastRow() === 0) {
      sheet.appendRow([
        "Timestamp",
        "Name",
        "Mobile",
        "Profession",
        "Email",
        "City",
        "DOB",
        "Birth Time",
        "Birth Place",
        "Top 3 Issues",
        "Payment Status",
        "Transaction ID"
      ]);
      // Format headers
      var headerRange = sheet.getRange(1, 1, 1, 12);
      headerRange.setFontWeight("bold");
      headerRange.setBackground("#F3ECDC");
      headerRange.setFontColor("#352611");
    }

    if (action === "createLead") {
      var timestamp = new Date().toISOString();
      var rowData = [
        timestamp,
        data.name || "",
        data.mobile || "",
        data.profession || "",
        data.email || "",
        data.city || "",
        data.dob || "",
        data.birthTime || "",
        data.birthPlace || "",
        data.issues || "",
        "Pending", // Default status is Pending
        "" // Transaction ID placeholder
      ];
      
      sheet.appendRow(rowData);
      var rowNumber = sheet.getLastRow();
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        rowId: rowNumber,
        message: "Lead captured successfully as Pending."
      })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
    } 
    
    else if (action === "updatePayment") {
      var rowId = parseInt(data.rowId);
      var status = data.status; // Paid or Failed
      var transactionId = data.transactionId || "";
      
      if (!rowId || isNaN(rowId) || rowId <= 1 || rowId > sheet.getLastRow()) {
        return ContentService.createTextOutput(JSON.stringify({
          success: false,
          error: "Invalid row index: " + rowId
        })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
      }

      // Column 11 is Payment Status, Column 12 is Transaction ID
      sheet.getRange(rowId, 11).setValue(status);
      sheet.getRange(rowId, 12).setValue(transactionId);
      
      // Apply color highlights based on status
      var statusCell = sheet.getRange(rowId, 11);
      if (status === "Paid") {
        statusCell.setBackground("#E2F0D9"); // soft green
        statusCell.setFontColor("#385723");
      } else if (status === "Failed") {
        statusCell.setBackground("#FCE4D6"); // soft red
        statusCell.setFontColor("#C00000");
      }

      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: "Payment status updated to: " + status
      })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
    } 
    
    else {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: "Invalid Action"
      })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
    }

  } catch(error) {
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON).setHeaders(headers);
  }
}

// Handle OPTIONS preflight requests for CORS
function doOptions(e) {
  var headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, GET, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Max-Age": "86400"
  };
  return ContentService.createTextOutput("").setHeaders(headers);
}
