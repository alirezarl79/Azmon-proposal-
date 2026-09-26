function doGet(e) {
  return ContentService.createTextOutput("اسکریپت فعال است ✅ آماده دریافت نتایج آزمون.");
}

function doPost(e) {
  var data = JSON.parse(e.postData.contents);

  // ۱. ارسال ایمیل با پیوست PDF به مدیر
  var pdfBlob = Utilities.newBlob(
    Utilities.base64Decode(data.pdfBase64),
    'application/pdf',
    data.fileName
  );
  MailApp.sendEmail({
    to: "13alireza.r.l.m79@gmail.com",
    subject: "نتیجه آزمون تربیت بدنی: " + data.firstName + " " + data.lastName,
    body: "برگه آزمون دانشجو: " + data.firstName + " " + data.lastName +
          "\nکد ملی: " + data.nationalCode +
          "\nزمان ثبت: " + data.submittedAt +
          "\n\nفایل PDF کامل پیوست این ایمیل است.",
    attachments: [pdfBlob]
  });

  // ۲. ثبت یک ردیف در Google Sheet همین فایل
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName("نتایج") || ss.insertSheet("نتایج");
  if (sheet.getLastRow() === 0) {
    sheet.appendRow([
      "نام", "نام خانوادگی", "کد ملی", "نام پدر", "سال ورود", "سال تولد", "ایمیل",
      "میانگین زمان واکنش (ms)", "دقت واکنش (%)",
      "نمره انعطاف‌پذیری شناختی", "نمره توجه ذهن‌آگاهانه", "زمان ثبت"
    ]);
  }
  sheet.appendRow([
    data.firstName, data.lastName, data.nationalCode, data.fatherName,
    data.entryYear, data.birthYear, data.email,
    data.reactionAvgMs, data.reactionAccuracy,
    data.cognitiveFlexScore, data.mindfulAttnScore, data.submittedAt
  ]);

  return ContentService.createTextOutput(JSON.stringify({ status: "ok" }))
    .setMimeType(ContentService.MimeType.JSON);
}
