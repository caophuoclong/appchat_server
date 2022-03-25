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
        this.router.put(`${this.path}/:_id`, validateMiddleware, this.makeUnReadMessageEmpty);
    }
    private getConversation(req: Request<{ id: string }, {}, {}, { page?: number }>, res: Response, next: NextFunction) {
        const { id } = req.params;
        const { page } = req.query
        Conversations.getConverSationById(id, page!).then(result => {
            res.json({
                status: 200,
                message: "Get conversation successfully!",
                data: result
            })
        }).catch(error => {
            next(new TokenException("failed", "Get conversation failed"))
        })
    }
    private makeUnReadMessageEmpty(req: Request<{ _id: string }>, res: Response, next: NextFunction) {
        const { _id } = req.params;
        Conversations.makeUnReadMessageEmpty({ conversationId: _id }).then((result) => {
            return res.json({
                code: 200,
                status: "success",
            })
        }).catch(error => next(new TokenException("failed", "Make unread message empty failed")))
    }
}
// Language: typescript
// Path: src/controllers/conversation.controller.ts
// Compare this snippet from src/controllers/user.controller.ts:
// import IController from "../Interfaces/IController";