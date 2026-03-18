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
});
const EdgesSchema = new Schema({
    id: {
        type: String,
        required: true
    },
    source: {
        type: String,
        required: true
    },
    target: {
        type: String,
        required: true
    }
}, {
    _id: false
})
const NodesSchema = new Schema({
    type: {
        type : mongoose.Types.ObjectId,
        ref:'Nodes'
    }
},{
    _id: false

})

const WorkflowSchema = new Schema({
    userId : {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "User"
    },
    nodes:[],
    edges:[EdgesSchema]
})
export  const UserModel = monogoose.model("User",UserSchema)
