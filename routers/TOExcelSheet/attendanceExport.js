import ExcelJS from 'exceljs';
import express from 'express';
import StateSchema from '../../schema/state.js';
import moment from 'moment'; // لاستخراج اسم اليوم بسهولة
import path from 'path';
import fs from 'fs';

const router_Excel = express.Router();

router_Excel.get('/', async (req, res) => {
  try {
    // جلب البيانات من قاعدة البيانات
    const states = await StateSchema.find().populate('user', 'names').exec();
    // console.log(states);
    
    // إنشاء ملف Excel
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet('Attendance Report');

    // تاريخ اليوم واسم اليوم
    const today = moment().format('YYYY-MM-DD');
    const dayName = moment().format('dddd'); // اسم اليوم

    // إضافة التاريخ واسم اليوم في رأس الجدول
    worksheet.mergeCells('A1:F1');
    worksheet.getCell('A1').value = `تقرير الحضور - ${today} (${dayName})`;
    worksheet.getCell('A1').alignment = { horizontal: 'center', vertical: 'middle' };
    worksheet.getCell('A1').font = { size: 14, bold: true };

    // إضافة العناوين
    worksheet.columns = [
      { header: 'اسم الموظف', key: 'name', width: 20 },
      { header: 'الحالة', key: 'status', width: 15 },
      { header: 'وقت الحضور', key: 'checkIn', width: 20 },
      { header: 'وقت الانصراف', key: 'checkOut', width: 20 }
    ];

    // إضافة البيانات
    states.forEach(item => {
      worksheet.addRow({
        name: item.user.names,
        status: item.status,
        checkIn: item.checkIn ? moment(item.checkIn).format('HH:mm') : 'غير متوفر',
        checkOut: item.checkOut ? moment(item.checkOut).format('HH:mm') : 'غير متوفر'
      });
    });

    // تنسيق الخلايا
    worksheet.getRow(1).font = { size: 12, bold: true }; // تنسيق رأس الجدول
    worksheet.getRow(1).alignment = { horizontal: 'center' }; // توسيط التاريخ في الرأس

    // تحديد المسار المحلي لحفظ الملف
    const folderPath = path.join(process.cwd(), 'exports');
    if (!fs.existsSync(folderPath)) {
      fs.mkdirSync(folderPath); // إنشاء المجلد إذا مش موجود
    }

    const filePath = path.join(folderPath, `attendance-${today}.xlsx`);
    
    // حفظ الملف محليًا
    await workbook.xlsx.writeFile(filePath);

    res.send(`تم حفظ الملف بنجاح في المسار: ${filePath}`);

  } catch (error) {
    console.error(error);
    res.status(500).send('حدث خطأ أثناء تصدير التقرير');
  }
});

export default router_Excel;
