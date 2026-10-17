/**
 * Google Apps Script Backend for RTO Survey & Monitoring Dashboard
 * 
 * Deployment Instructions:
 * 1. Open your Google Sheet containing the survey responses.
 * 2. Click "Extensions" -> "Apps Script".
 * 3. Delete any default code in Code.gs and paste this entire script.
 * 4. Click "Deploy" -> "New deployment".
 * 5. Select type "Web app".
 * 6. Set Description: "RTO Dashboard API".
 * 7. Set "Execute as": "Me" (your account).
 * 8. Set "Who has access": "Anyone" (or "Anyone within domain").
 * 9. Click "Deploy", authorize access, and copy the Web App URL.
 * 10. Paste this Web App URL into the RTO Dashboard "Data Source" settings modal!
 */

function doGet(e) {
  try {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    const data = sheet.getDataRange().getValues();

    if (data.length <= 1) {
      return createJsonResponse({
        status: 'error',
        message: 'No survey data rows found in Google Sheet.'
      });
    }

    const headers = data[0];
    const rows = [];

    for (var i = 1; i < data.length; i++) {
      var row = data[i];
      // Skip completely empty rows
      var hasContent = row.some(function(cell) {
        return cell !== '' && cell !== null && cell !== undefined;
      });
      if (!hasContent) continue;

      var rowObj = {};
      for (var j = 0; j < headers.length; j++) {
        var header = headers[j];
        var val = row[j];
        if (val instanceof Date) {
          val = Utilities.formatDate(val, Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss");
        }
        rowObj[header] = val;
      }
      rows.push(rowObj);
    }

    return createJsonResponse({
      status: 'success',
      count: rows.length,
      timestamp: Utilities.formatDate(new Date(), Session.getScriptTimeZone(), "dd/MM/yyyy HH:mm:ss"),
      data: rows
    });

  } catch (err) {
    return createJsonResponse({
      status: 'error',
      message: err.toString()
    });
  }
}

function createJsonResponse(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj))
    .setMimeType(ContentService.MimeType.JSON);
}
