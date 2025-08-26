// Simple Working Google Apps Script
// Copy this to a NEW Google Apps Script project

function doPost(e) {
  try {
    // Log what we received
    console.log('Received request:', e);
    
    if (!e || !e.parameter) {
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'No parameters received'
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
         // Extract data
     const email = e.parameter.email || 'No email';
     const source = e.parameter.source || 'Unknown';
     const ip = e.parameter.ip || 'Unknown';
     
     // Format timestamp as M/D/YYYY H:MM:SS
     const now = new Date();
     const timestamp = now.getMonth() + 1 + '/' + now.getDate() + '/' + now.getFullYear() + ' ' + 
                      now.getHours() + ':' + String(now.getMinutes()).padStart(2, '0') + ':' + String(now.getSeconds()).padStart(2, '0');
     
     const userAgent = e.parameter.userAgent || 'Unknown';
    
    console.log('Extracted data:', { email, source, ip, timestamp, userAgent });
    
    // Try to access spreadsheet
    try {
      const spreadsheetId = '1ZaLkh-QWhpigj9fqCOBwcUh0dVeDkc3C_4VrqgxCs88';
      console.log('Trying to access spreadsheet:', spreadsheetId);
      
      const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
      console.log('✅ Spreadsheet accessed!');
      
      const sheet = spreadsheet.getActiveSheet();
      console.log('✅ Sheet accessed!');
      
             // Add data
       const serverTimestamp = new Date().getMonth() + 1 + '/' + new Date().getDate() + '/' + new Date().getFullYear() + ' ' + 
                              new Date().getHours() + ':' + String(new Date().getMinutes()).padStart(2, '0') + ':' + String(new Date().getSeconds()).padStart(2, '0');
       const rowData = [timestamp, email, source, ip, userAgent, serverTimestamp];
      sheet.appendRow(rowData);
      
      console.log('✅ Data added successfully!');
      
      return ContentService.createTextOutput(JSON.stringify({
        success: true,
        message: 'Data captured successfully',
        data: { email, source, ip, timestamp, userAgent }
      })).setMimeType(ContentService.MimeType.JSON);
      
    } catch (spreadsheetError) {
      console.error('❌ Spreadsheet error:', spreadsheetError.toString());
      
      return ContentService.createTextOutput(JSON.stringify({
        success: false,
        error: 'Spreadsheet error: ' + spreadsheetError.toString(),
        debug: {
          spreadsheetId: '1ZaLkh-QWhpigj9fqCOBwcUh0dVeDkc3C_4VrqgxCs88',
          userEmail: Session.getActiveUser().getEmail(),
          error: spreadsheetError.toString()
        }
      })).setMimeType(ContentService.MimeType.JSON);
    }
    
  } catch (error) {
    console.error('❌ General error:', error.toString());
    
    return ContentService.createTextOutput(JSON.stringify({
      success: false,
      error: error.toString()
    })).setMimeType(ContentService.MimeType.JSON);
  }
}

function doGet(e) {
  return ContentService.createTextOutput(JSON.stringify({
    status: 'OK',
    message: 'Script is working',
    timestamp: new Date().toISOString(),
    userEmail: Session.getActiveUser().getEmail()
  })).setMimeType(ContentService.MimeType.JSON);
}

function testAccess() {
  try {
    const spreadsheetId = '1ZaLkh-QWhpigj9fqCOBwcUh0dVeDkc3C_4VrqgxCs88';
    console.log('Testing access to:', spreadsheetId);
    
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    console.log('✅ Spreadsheet found!');
    
    const sheet = spreadsheet.getActiveSheet();
    console.log('✅ Sheet name:', sheet.getName());
    
    return '✅ Access successful! Sheet: ' + sheet.getName();
    
  } catch (error) {
    console.error('❌ Access failed:', error.toString());
    return '❌ Access failed: ' + error.toString();
  }
}

function setupHeaders() {
  try {
    const spreadsheetId = '1ZaLkh-QWhpigj9fqCOBwcUh0dVeDkc3C_4VrqgxCs88';
    const sheet = SpreadsheetApp.openById(spreadsheetId).getActiveSheet();
    
    const headers = ['Timestamp', 'Email', 'Source', 'IP Address', 'User Agent', 'Server Timestamp'];
    
    sheet.clear();
    sheet.getRange(1, 1, 1, headers.length).setValues([headers]);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight('bold');
    sheet.getRange(1, 1, 1, headers.length).setBackground('#f0f0f0');
    
    console.log('✅ Headers set up successfully');
    return '✅ Headers set up successfully';
    
  } catch (error) {
    console.error('❌ Header setup failed:', error.toString());
    return '❌ Header setup failed: ' + error.toString();
  }
}
