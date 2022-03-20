import mongoose from "mongoose";
import { IConversation } from "../Interfaces";

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
    latest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Messages",
    },
    name: {
        type: String
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
});

const conversationModel = mongoose.model<IConversation & mongoose.Document>("Conversations", conversationSchema);
export default conversationModel;
