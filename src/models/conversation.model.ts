import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
    participants: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Messages",
        }
    ],
    createAt: {
        type: Date,
        default: Date.now,
    },
});

const conversationModel = mongoose.model("Conversations", conversationSchema);
