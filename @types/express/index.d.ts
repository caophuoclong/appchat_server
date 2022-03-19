import { Express } from "express";
declare global {
    namespace Express {
        interface Request {
            user: {
                username: string;
                _id: string;
            }
        }
    }
}