import express from 'express';
import User from '../../schema/regstur.js';

const router_Users = express.Router();

router_Users.get('/', async (req, res) => {
    try {
        // استبعاد حقل الباسورد
        const getUser = await User.find().select('-password').lean();
        if (!getUser || getUser.length === 0) {
            return res.status(404).json({ message: "Record Not Found" });
        }

        // console.log(getUser);
        return res.status(200).json({ getUser });
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "خطأ في جلب البيانات" });
    }
});

export default router_Users;