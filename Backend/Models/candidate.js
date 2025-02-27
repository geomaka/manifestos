const mongoose = require("mongoose")
const Schema = mongoose.Schema

const userSchema = new Schema({
    name : String,
    email : String,
    videoUrl : String,
    picture : String,
    manifesto : String,    
    upvotes: { type: Number, default: 0 },
    downvotes: { type: Number, default: 0 }
},{timestamps : true})

const Candidate = mongoose.model('Candidate', userSchema)
module.exports = Candidate