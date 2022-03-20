import { Router, Request, Response, NextFunction } from "express";
import { validateMiddleware } from "../middlewares/validateMiddleware";
import { IController } from "../Interfaces";
import Conversations from "../models/Conversation";
import TokenException from "../exceptions/tokenException";

export default class Conversation implements IController {
    private path = "/conversation";
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
        this._router.get(`${this.path}/:id`, validateMiddleware, this.getConversation);
    }
    private getConversation(req: Request<{ id: string }>, res: Response, next: NextFunction) {
        const { id } = req.params;
        Conversations.getConverSationById(id).then(result => {
            res.json({
                status: 200,
                message: "Get conversation successfully!",
                data: result
            })
        }).catch(error => {
            next(new TokenException("failed", "Get conversation failed"))
        })
    }

}
// Language: typescript
// Path: src/controllers/conversation.controller.ts
// Compare this snippet from src/controllers/user.controller.ts:
// import IController from "../Interfaces/IController";