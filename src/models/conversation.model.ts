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
    unreadmessages: [
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
    deleted: {
        type: Boolean,
        default: false
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    },
    type: {
        type: String,
        default: "direct"
    },
    imgUrl: {
        type: String,
        default: "https://picsum.photos/400"
    },
    groupUnRead: [
        {
            user: {
                type: String,
            },
            messages: [
                {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Messages"
                }
            ],
            default: {}
        }
    ]



});

const conversationModel = mongoose.model<IConversation & mongoose.Document>("Conversations", conversationSchema);
export default conversationModel;
