import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    names : {
        type : String ,
        required :true ,
    },
    password: {
        type: String,
        required: true
      },
      code: {
        type: Number,
        required: true
      },
      phone: {
        type: Number,
        required: true
      }
})


const User = mongoose.model('User' , userSchema);
export default User;