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
const PositionSchema = new Schema({
    x:{
        type: String,
        required: true
    },
    y:{
        type: String,
        required: true
    }

},{
    _id: false
})
const NodeDataSchema = new Schema({
    kind: {
        type: String,enum:["ACTION","TRIGGER"]
    },
    metadata: Schema.Types.Mixed
},{
    _id : false
})
const NodesSchema = new Schema({
    id:{
        type:String,
        required:true,
    },
    position:PositionSchema,
    credentials:Schema.Types.Mixed,
    type: {
        type : mongoose.Types.ObjectId,
        ref:'Nodes'
    },
    data:NodeDataSchema
},{
    _id: false

})

const WorkflowSchema = new Schema({
    userId : {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: "Users"
    },
    nodes:[NodesSchema],
    edges:[EdgesSchema]
})
const NodesSchema = new Schema({
    title:{
        type:String,
        required:true
    }
})
export  const UserModel = monogoose.model("User",UserSchema)
export const WorkflowModel = mongoose.model("Workflows",WorkflowSchema);