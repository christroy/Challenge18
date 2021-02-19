let mongoose = require("mongoose");
let moment = require("moment");
let ReactionSchema = new mongoose.Schema({
    reactionId: { type: mongoose.Schema.Types.ObjectId, default: new mongoose.Schema.Types.ObjectId },
    reactionBody: { type: String, required: true, maxlength: 280 },
    username: { type: String, required: true },
    userId: { type: String, required: true },
    createdAt: { type: Date, default: Date.now(), get: formatTime }
})

function formatTime(date) {
    return moment.unix(date).format("MM/DD/YYYY")
}

module.exports = Reaction = mongoose.model("Reaction", ReactionSchema)
