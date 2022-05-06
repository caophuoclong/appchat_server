import jwt from "jsonwebtoken";
import { IUserData } from "../Interfaces/IUser";
import { JWT_SECRET, JWT_SECRET_REFRESH } from "../configs/index"
function createAccessToken(data: IUserData) {
    return jwt.sign({
        username: data.username,
        _id: data._id,
    }, JWT_SECRET!, {
        expiresIn: 60 * 60
    });
}
function createRefreshToken(data: IUserData) {
    return jwt.sign({
        username: data.username,
        _id: data._id,
    }, JWT_SECRET_REFRESH!, {
        expiresIn: 7 * 24 * 60 * 60
    });
}
export { createAccessToken, createRefreshToken }