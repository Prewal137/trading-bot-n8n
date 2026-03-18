import mongoose, {Schema} from "mongoose";
const UserSchema = new Schema({
    username: {
        type:String,
        required:true
    },
    password: {
        type:String,
        required:true
    }
})

const WorkflowSchema = new Schema({
    userId : {
        type: mongoose.Types.ObjectId,
        required: true,
        
    }
})
export  const UserModel = monogoose.model("User",UserSchema)
