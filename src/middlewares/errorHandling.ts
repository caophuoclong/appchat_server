import express from "express";
import TokenException from "../exceptions/tokenException";
const errorHandling = (error: TokenException, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const code = error.code || 500;
    const status = error.status || "failed";
    const message = error.message || "Something went wrong with server!";
    return res.json({
        code,
        status,
        message
    })
}
export default errorHandling;