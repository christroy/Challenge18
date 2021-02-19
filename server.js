let express = require("express");
let app = express();
let mongoose = require("mongoose");
require("dotenv").config();
let bodyParser = require("body-parser");
app.use(bodyParser.json());
const User = require("./models/user");
const ObjectId = require("mongodb").ObjectID;
const Thought = require("./models/thought");
const Reaction = require("./models/reaction");


mongoose.connect(`mongodb+srv://admin:${process.env.DB_PW}@cluster0.1bwdl.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true });

app.get("/api/users", async (request, response) => {
    const users = await User.find()
    response.status(200).send(users)

})

app.get("/api/users/:id", async (request, response) => {
    const id = request.params.id;
    const user = await User.findById(id).exec();

    if (user) {
        response.send(user)
    } else {
        response.status(500).send("User not found.")
    }
})

app.delete("/api/users/:id", async (request, response) => {
    const id = request.params.id;
    User.deleteOne({
        _id: ObjectId(id)
    }, function (error) {
        if (error) {
            response.status(500).send(error)

        } else {
            Thought.remove({
                userId: id
            }).then(item => {
                response.send("Removed user and their thoughts.")
            }).catch(error => {
                response.status(500).send(`User was removed but thoughts were not. ${error}`)
            })
        }
    })
})

app.post("/api/users/:userId/friends/:friendId", async (request, response) => {
    let user = await User.findById(request.params.userId).exec();
    if (!user.friends.includes(request.params.friendId)) {
        user.friends.push(request.params.friendId)
        user.save().then(item => {
            response.send("Friend added!")
        })
    } else {
        response.status(500).send("Friend already exists in friend's list.")
    }

})

app.delete("/api/users/:userId/friends/:friendId", async (request, response) => {
    let user = await User.findById(request.params.userId).exec();
    if (user.friends.includes(request.params.friendId)) {
        let index = user.friends.indexOf(request.params.friendId);
        user.friends.splice(index, 1);
        user.save().then(res => {
            response.send("Friend removed!")
        })

    } else {
        response.status(500).send("Friend does not exist in friend's list.")
    }


})

app.post("/api/users", async (request, response) => {
    let user = new User(request.body);
    user.save().then(item => {
        response.send("user created")
    }).catch(error => {
        response.status(400).send(`Unable to create user: ${error}`)
    })


})


app.get("/api/thoughts", async (request, response) => {
    const thoughts = await Thought.find();
    response.status(200).send(thoughts);

})

app.get("/api/thoughts/:thoughtId", async (request, response) => {
    const thoughts = await Thought.findById(request.params.thoughtId);
    response.status(200).send(thoughts);

})

app.post("/api/thoughts", async (request, response) => {
    let thought = new Thought(request.body);
    thought.save().then(item => {
        response.send("Thought created!")
    }).catch(error => {
        response.status(500).send(error)
    })
})

app.put("/api/thoughts/:thoughtId", async (request, response) => {
    const id = request.params.thoughtId
    Thought.findByIdAndUpdate({
        _id: id
    },
        { thoughtText: request.body.thoughtText }
        , function (error, result) {
            if (error) {
                response.status(500).send(error)
            } else {
                response.send("Thought updated." + result)
            }
        })
})

app.delete("/api/thoughts/:id", async (request, response) => {
    const id = request.params.id;
    Thought.deleteOne({
        _id: ObjectId(id)
    }, function (error) {
        if (error) {
            response.status(500).send(error)

        } else {
            response.send("Thought Deleted!")
        }
    })
})

app.post("/api/thoughts/:thoughtId/reactions", async (request, response) => {
    let reaction = new Reaction(request.body);
    let thought = await Thought.findById(request.params.thoughtId);
    thought.reactions.push(reaction)
    thought.save().then(res => {
        response.send("Reaction added to thought.")
    }).catch(error => {
        response.status(500).send(error)
    })
})

app.delete("/api/thoughts/:thoughtId/reactions/:reactionId", async (request, response) => {
    let thought = await Thought.findById(request.params.thoughtId);
    let position = thought.reactions.map(function (x) {
        return x._id
    }).indexOf(request.params.reactionId)
    if (position > -1) {
        thought.reactions.splice(position, 1)
        thought.save().then(res => {
            response.send("Reaction removed.")
        }).catch(error => {
            response.status(500).send(error)
        })
    } else { response.status(404).send("Reaction not found in array.") }

})

app.listen(3000, () => {
    console.log("server running on 3000");

})