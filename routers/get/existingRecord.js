import express from 'express';
import StateSchema from '../../schema/state.js';

const router_Record = express.Router();

router_Record.get('/:ID', async (req, res) => {

    const { ID } = req.params;
    const getRecord = await StateSchema.find({ user: ID });
    if (!getRecord) {
        return res.status(404).json({ message: "Record Not Found" });
    }       
    
    // console.log(getRecord);
    return res.status(200).json({ getRecord });
})

export default router_Record;
