const mongoose  = require("mongoose")

const IssueSchema = new mongoose.Schema({
    title : { type : String},
    description :{ type : String},
    location : { type : String},
    pincode : { type : String},
    imageUrl : { type : String},
    status: {type: String,enum: ['pending', 'in-progress', 'resolved', 'rejected'],default: 'pending',},
    createdBy: { type : mongoose.Schema.Types.ObjectId, ref: 'User'},
})

const IssueModel = mongoose.model("issues", IssueSchema)
module.exports = IssueModel


