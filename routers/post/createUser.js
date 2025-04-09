import User from '../../schema/regstur.js';
import express from 'express';
import bcrypt from 'bcryptjs';

const CreatUser =()=>{
const app = express();
app.use(express.json());


app.post('/signup', async (req, res) => {
    try {
        const { names, password, code } = req.body;

        if (!names || !password || !code) {
            return res.status(400).json({ message: "جميع الحقول مطلوبة." });
        }

        const existingUser = await User.findOne({ $or: [{ names }, { code }] });

        if (existingUser) {
            return res.status(409).json({ message: "البريد الإلكتروني أو الرمز مستخدم مسبقًا." });
        }

        // لتشفير الباسورد
        const saltRounds = 10;
        const hashedPassword = await bcrypt.hash(password, saltRounds);

        const newUser = await User.create({ names, password: hashedPassword, code });
        return res.status(201).json({ message: "تم إنشاء الحساب بنجاح", user: newUser });

    }catch(err){
    res.status(500).json({error: err});
    }
}
)
return app ;

}

export default CreatUser;