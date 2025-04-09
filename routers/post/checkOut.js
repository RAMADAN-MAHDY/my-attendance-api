import express from 'express';
import StateSchema from '../../schema/state.js';

const checkOut = () => {
    const app = express();
    app.use(express.json());

    app.put('/checkOut/:id', async (req, res) => {
        try {
            const { id } = req.params;
            const date = new Date();
            const startOfDay = new Date(date.getFullYear(), date.getMonth(), date.getDate());
            const endOfDay = new Date(startOfDay);
            endOfDay.setDate(startOfDay.getDate() + 1);
    
            if (!id) {
                return res.status(400).json("خطأ في الـ ID");
            }
    
            // البحث عن آخر سجل للحضور بدون تسجيل انصراف
            const state = await StateSchema.findOne({
                user: id,
                checkIn: { $gte: startOfDay, $lt: endOfDay }, // الحضور تم اليوم
                $or: [{ checkOut: { $exists: false } }, { checkOut: null }] // لم يسجل انصراف
            });
    
            if (!state) {
                return res.status(400).json("لم يتم العثور على سجل حضور لهذا اليوم أو تم تسجيل الانصراف بالفعل يرجي التواصل مع الادارة");
            }
    
            // تحديث سجل الانصراف
            await StateSchema.findOneAndUpdate(
                { _id: state._id },
                { checkOut: date },
                { new: true }
            );
    
            return res.status(200).json("تم تسجيل الانصراف بنجاح");
    
        } catch (err) {
            console.error(err);
            return res.status(500).json("خطأ في تسجيل الانصراف");
        }
    });
    

    return app; 
}

export default checkOut;
