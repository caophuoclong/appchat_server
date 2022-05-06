import express from "express";
import HttpException from "../exceptions/httpException";
import { JWT_SECRET } from "../configs/index";
import jwt from "jsonwebtoken";
import TokenException from "../exceptions/tokenException";

export const validateMiddleware = (req: express.Request, res: express.Response, next: express.NextFunction) => {
    const authHeader = req.headers["authorization"];
    const accessToken = authHeader && authHeader.split(" ")[1];
    if (!accessToken)
        next(new HttpException(403, "A token is required for authentication!"));
    else
        try {
            const decoded = jwt.verify(accessToken, JWT_SECRET!) as {
                username: string,
                _id: string;
            };
            req.user = decoded;
            next();
        }
        catch (error) {
            if (error.name === "TokenExpiredError") {
                next(new TokenException("relogin", "Token expired!"));
            } else if (error.name === "JsonWebTokenError") {
                next(new TokenException("relogin", "Invalid token!"));
            } else
                next(new TokenException("relogin", "Something went wrong with server!"));
        }

}