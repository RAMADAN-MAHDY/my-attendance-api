import User from '../../schema/regstur.js';
import express from 'express';
import bcrypt from 'bcryptjs';

const CreatUser = () => {
  const app = express();
  app.use(express.json());

  app.post('/signup', async (req, res) => {
    try {
      // استلام البيانات من body
      const { fullName, password, code, phone, confirmPassword } = req.body;

      if (!fullName || !password || !code || !phone || !confirmPassword) {
        return res.status(400).json({ message: "جميع الحقول مطلوبة." });
      }

      // التحقق من أن كلمة السر وتأكيد كلمة السر متطابقين
      if (password !== confirmPassword) {
        return res.status(400).json({ message: "كلمة السر غير متطابقة." });
      }

      // التحقق إذا كان المستخدم موجود مسبقًا
      const existingUser = await User.findOne({ $or: [{ code }] });

      if (existingUser) {
        return res.status(409).json({ message: "البريد الإلكتروني أو الرمز مستخدم مسبقًا." });
      }

      // تشفير كلمة السر
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(password, saltRounds);

      // إنشاء المستخدم الجديد
      const newUser = await User.create({ names : fullName, password: hashedPassword, code, phone });
      
      return res.status(201).json({ message: "تم إنشاء الحساب بنجاح" });
    } catch (err) {
      return res.status(500).json({ error: err.message });
    }
  });

  return app;
};

export default CreatUser;
