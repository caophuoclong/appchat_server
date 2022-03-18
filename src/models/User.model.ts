import mongoose from "mongoose";
import { IUser } from "src/Interfaces/IUser";

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        date: Number,
        month: Number,
        year: Number,
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
        required: true,
    },
    salt: {
        type: String,
        required: true,
    }
})

const UserModel = mongoose.model<IUser & mongoose.Document>("Users", userSchema);
export default UserModel;
export { userSchema };