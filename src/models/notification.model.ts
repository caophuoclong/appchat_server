import mongoose from "mongoose";
import { INotification } from "../Interfaces";
const notificationSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    },
    seen: {
        type: Boolean,
        default: false
    },
    type: {
        type: String,
    },
    date: {
        type: Date,
        default: Date.now
    }
})

const NotificationModel = mongoose.model<INotification & mongoose.Document>("notifications", notificationSchema);
export default NotificationModel;