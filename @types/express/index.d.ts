import { Express } from "express";
import { SocketIO } from "socket.io";
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
declare module "socket.io" {
    interface Socket {
        users: Array<{ [key: string]: string }>
    }
}