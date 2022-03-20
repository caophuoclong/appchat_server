import IController from "../Interfaces/IController";

import { Router, Request, Response, NextFunction } from "express"
import { IMessage } from "../Interfaces";
import MessageException from "../exceptions/messaceException";
import Message from "../models/Message";
import { validateMiddleware } from "../middlewares/validateMiddleware";
class MessageController implements IController {
    private path = "/message";
    private _router: Router;
    public get router(): Router {
        return this._router;
    }
    public set router(value: Router) {
        this._router = value;
    }
    constructor() {
        this.router = Router();
        this.initialRouter();
    }
    initialRouter() {
        this._router.post(this.path + "/add/:conversationId", validateMiddleware, this.addNewMessage);
    }
    private addNewMessage(req: Request<{ conversationId: string }, {}, Omit<IMessage, "conversationId | senderId">>, res: Response, next: NextFunction) {
        const { conversationId } = req.params;
        const { _id, username } = req.user;
        const { type, text, receiverId } = req.body;
        const message = new Message({
            type,
            text,
            senderId: _id,
            receiverId,
            conversationId
        });
        message.newMessage()
            .then(result => {
                return res.json({
                    status: 200,
                    message: "Create message successfully!",
                    data: result
                })
            }
            )
            .catch(error => {
                next(new MessageException("failed", error.message));
            })

    }
}

export default MessageController;