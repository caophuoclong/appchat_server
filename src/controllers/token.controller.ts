import IController from "../Interfaces/IController";
import express from "express";
import redisClient from "../utils/redis-client";
import { createAccessToken } from "../utils/auth";
import { JWT_SECRET_REFRESH } from "../configs";
import jwt from "jsonwebtoken";
import TokenException from "../exceptions/tokenException";
import { IUserData } from "../Interfaces/IUser";
class Token implements IController {
    private path = "/token"
    private _router: express.Router;
    public get router(): express.Router {
        return this._router;
    }
    public set router(value: express.Router) {
        this._router = value;
    }
    public constructor() {
        this._router = express.Router();
        this.initialRouter();
    }
    initialRouter() {
        this._router.post(`${this.path}/:username`, this.handleFreshToken);
    }
    private async handleFreshToken(req: express.Request<{ username: string }, {}, {
        refreshToken: string
    }>, res: express.Response, next: express.NextFunction) {
        const { refreshToken } = req.body;
        const { username } = req.params;
        const storedreFreshToken = await redisClient.get(username);
        if (!refreshToken || storedreFreshToken !== refreshToken)
            return next(new TokenException("relogin", "Invalid token!"));
        try {
            const decoded = jwt.verify(refreshToken, JWT_SECRET_REFRESH!) as IUserData;
            const accessToken = createAccessToken(decoded);
            return res.json({
                code: 200,
                status: "success",
                message: "Refresh token successfully!",
                token: accessToken
            })
        } catch (error) {
            console.log(error);
            if (error.name === "TokenExpiredError") {
                next(new TokenException("relogin", "Token expired! Please login again."));
            } else if (error.name === "JsonWebTokenError") {
                next(new TokenException("relogin", "Invalid token! Please login again."));
            } else
                next(new TokenException("relogin", "Something went wrong with server! Please login again."));
        }
    }
}

export default Token;