let mongoose = require("mongoose");
var validateEmail = function (email) {
    var re = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    return re.test(email)
};

let UserSchema = new mongoose.Schema({
    username: { type: String, required: true, unique: true, trimmed: true },
    email: { type: String, required: true, unique: true, validate: [validateEmail, "Please enter a valid email address"], match: [/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/, "Please enter a valid email address."] },
    friends: [{ type: mongoose.Types.ObjectId, ref: "User" }],
    thoughts: [{ type: mongoose.Types.ObjectId, ref: "Thought" }],
}, { timestamps: true })

module.exports = User = mongoose.model("User", UserSchema);