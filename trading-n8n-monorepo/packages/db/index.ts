import mongoose, {Schema} from "mongoose";
const UserSchema = new Schema({
    username: {
        type:String,
        required:true,
        unique:true
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
        type: Number,
        required: true
    },
    y:{
        type: Number,
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
const WorkflowNodesSchema = new Schema({
    id:{
        type:String,
        required:true,
    },
    position:PositionSchema,
    credentials:Schema.Types.Mixed,
    nodeId: {
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
    nodes:[WorkflowNodesSchema],
    edges:[EdgesSchema]
})
const CredentialsTypeSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    type:{
        type:String,
        required:true,
       
    },
    required:{
        type:Boolean,
        required:true
    },
    
})

const MetadataSchemaItemSchema = new Schema({
    kind: { type: String, required: true }, // e.g., "select", "number"
    title: { type: String, required: true },
    description: { type: String },
    values: [String], // for select fields
}, { _id: false });

const NodesSchema = new Schema({
    title:{
        type:String,
        required:true
    },
    description: {
        type: String
    },
    kind: {
        type: String,
        enum: ["ACTION", "TRIGGER"],
        required: true
    },
    type: {
        type: String,
        required: true,
        unique: true
    },
    credentialsType: [CredentialsTypeSchema],
    metadataSchema: [MetadataSchemaItemSchema]
})

const ExecutionSchema = new Schema({
    workflowId:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:'Workflows',
    },
    status:{
        type:String,
        enum:["SUCCESS","FAILED","PENDING"],
        required:true
    },
    startTime:{
        type:Date,
        default:Date.now(),
        required:true
    },
    endTime:{
        type:Date,
        default:Date.now(),
        required:true
    }
    
})
export  const UserModel = mongoose.model("User",UserSchema)
export const WorkflowModel = mongoose.model("Workflows",WorkflowSchema);
export const NodesModel = mongoose.model("Nodes",NodesSchema);
export const ExecutionModel = mongoose.model("Executions",ExecutionSchema);