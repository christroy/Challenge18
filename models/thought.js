const moment = require("moment");
let mongoose = require("mongoose");
let Reaction = require("./reaction");
let ThoughtSchema = new mongoose.Schema({
    thoughtText: { type: String, require: true, minlength: 1, maxlength: 280 },
    createdAt: { type: Date, default: Date.now(), get: formatTime },
    username: { type: String, require: true },
    userId: { type: String, require: true },
    reactions: { type: Array },
}, {
    timestamps: true
})

function formatTime(date) {
    return moment.unix(date).format("MM/DD/YYYY")
}

module.exports = Thought = mongoose.model("Thought", ThoughtSchema)



//.virtual("reactions.count").get(function(){
//    return this.reactions.length
///})