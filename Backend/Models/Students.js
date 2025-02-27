const mongoose = require("mongoose")
const Schema = mongoose.Schema

const studentSchema = new Schema({
    registrationNumber: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    votes: [
        {
          candidateId: { type: mongoose.Schema.Types.ObjectId, ref: "Candidate" },
          voteType: { type: String, enum: ["upvote", "downvote"], required: true },
        },
      ],
})

const Student = mongoose.model('Student', studentSchema)
module.exports = Student