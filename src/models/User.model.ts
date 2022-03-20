import mongoose from "mongoose";
import IUser from "src/Interfaces/IUser";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        index: true,
        readonly: true,
    },
    password: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        date: {
            type: Number,
            default: 1
        },
        month: {
            type: Number,
            default: 1
        },
        year: {
            type: Number,
            default: 2000
        }
    },
    email: {
        type: String,
        required: true,
    },
    numberPhone: {
        type: String,
        default: "",
    },
    gender: {
        type: String,
        default: "other",
    },
    salt: {
        type: String,
        required: true,
    },
    name: {
        type: String
    },
    friends: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        }
    ],
    conversations: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Conversations",
        }
    ],
    messages: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Messages",
        }
    ],
    friendsRequested: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        }
    ],
    friendsPending: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        }
    ],
    friendsRejected: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Users",
        }
    ],
    imgUrl: {
        type: String,
        default: ""
    },
    createdAt: {
        type: Date,
        default: Date.now,
    }
})

const UserModel = mongoose.model<IUser & mongoose.Document>("Users", userSchema);
export default UserModel;
export { userSchema };