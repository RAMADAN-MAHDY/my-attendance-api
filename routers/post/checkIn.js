import express from 'express';
import StateSchema from '../../schema/state.js';

const checkIn = () => {
    const app = express();
    app.use(express.json());

    app.post('/checkIn/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const status = "Present";
            const now = new Date();
            const startOfDay = new Date(now.getFullYear(), now.getMonth(), now.getDate());
            const endOfDay = new Date(startOfDay);
            endOfDay.setDate(startOfDay.getDate() + 1);
    
            if (!id) {
                return res.status(400).json("خطأ في الـ ID");
            }
    
            // البحث مباشرة عن سجل لهذا المستخدم في نفس اليوم
            const existingRecord = await StateSchema.findOne({
                user: id,
                checkIn: { $gte: startOfDay, $lt: endOfDay }
            });
    
            if (existingRecord) {
                return res.status(400).json("تم تسجيل الحضور بالفعل اليوم، لا يمكن تسجيله مرة أخرى");
            }
    
            // إنشاء سجل جديد للحضور
            await StateSchema.create({
                status,
                user: id,
                checkIn: now,
            });
    
            return res.status(201).json("تم تسجيل الحضور بنجاح");
    
        } catch (err) {
            console.error(err);
            return res.status(500).json("خطأ في التسجيل");
        }
    });
    

    return app;
}

export default checkIn;
