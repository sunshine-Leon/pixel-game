/**
 * Google Apps Script for Cyberpunk Quiz Game
 * Deploy as Web App: "Anyone" has access
 */

function doGet(e) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName("題目");
  const data = sheet.getDataRange().getValues();
  const headers = data[0]; // 題號、題目、A、B、C、D、解答
  const rows = data.slice(1);
  
  // Shuffle and pick N questions
  const n = parseInt(e.parameter.n) || 10;
  const shuffled = rows.sort(() => 0.5 - Math.random());
  const selected = shuffled.slice(0, n);
  
  const result = selected.map(row => {
    return {
      id: row[0],
      question: row[1],
      options: {
        A: row[2],
        B: row[3],
        C: row[4],
        D: row[5]
      }
      // Note: "解答" (row[6]) is NOT sent to frontend
    };
  });
  
  return ContentService.createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

function doPost(e) {
  const payload = JSON.parse(e.postData.contents);
  const { userId, answers } = payload; // answers: [{id: 1, choice: 'A'}, ...]
  
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const qSheet = ss.getSheetByName("題目");
  const aSheet = ss.getSheetByName("回答");
  
  const qData = qSheet.getDataRange().getValues();
  const qMap = {};
  qData.slice(1).forEach(row => {
    qMap[row[0]] = row[6]; // id -> answer
  });
  
  // Calculate score
  let score = 0;
  answers.forEach(ans => {
    if (qMap[ans.id] === ans.choice) {
      score++;
    }
  });
  
  // Update "回答" sheet
  // Columns: ID、闖關次數、總分、最高分、第一次通關分數、花了幾次通關、最近遊玩時間
  const aData = aSheet.getDataRange().getValues();
  let userRowIndex = -1;
  const passThreshold = 8; // Example threshold, can be passed from frontend if needed
  const isPassed = score >= passThreshold;

  for (let i = 1; i < aData.length; i++) {
    if (aData[i][0] === userId) {
      userRowIndex = i + 1;
      break;
    }
  }
  
  const now = new Date();
  if (userRowIndex === -1) {
    // New User
    aSheet.appendRow([
      userId, 
      1, 
      score, 
      score, 
      isPassed ? score : "", 
      isPassed ? 1 : 0, 
      now
    ]);
  } else {
    // Existing User
    const existingData = aData[userRowIndex - 1];
    const totalTries = existingData[1] + 1;
    const totalScore = existingData[2] + score;
    const maxScore = Math.max(existingData[3], score);
    let firstPassScore = existingData[4];
    let triesToPass = existingData[5];
    
    if (isPassed && firstPassScore === "") {
      firstPassScore = score;
      triesToPass = totalTries;
    }
    
    aSheet.getRange(userRowIndex, 1, 1, 7).setValues([[
      userId,
      totalTries,
      totalScore,
      maxScore,
      firstPassScore,
      triesToPass,
      now
    ]]);
  }
  
  return ContentService.createTextOutput(JSON.stringify({
    status: "success",
    score: score,
    isPassed: isPassed
  })).setMimeType(ContentService.MimeType.JSON);
}
