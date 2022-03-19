import mongoose from "mongoose";
import IMessage from "../Interfaces/IMessage";

const messageSchema = new mongoose.Schema({
    text: {
        type: String,
        required: true,
    },
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
        required: true,
    },
    senderUsername: {
        type: String,
        required: true,
    },
    receiverUsername: {
        type: String,
        required: true,
    },
    createAt: {
        type: Date,
        default: Date.now,
    },
    conversationId: {
        type: mongoose.Types.ObjectId,
        ref: "Conversations",
    }
})

const userModel = mongoose.model<IMessage & mongoose.Document>("Messages", messageSchema);
export default userModel;