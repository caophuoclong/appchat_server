import express from "express";
import HttpException from "src/exceptions/httpException";
const errorHandling = (error: HttpException, req: express.Request, res: express.Response, next: express.NextFunction) => {
    const status = error.status || 500;
    const message = error.message || "Something went wrong with server!";
    return res.json({
        status,
        message
    })
}
export default errorHandling;