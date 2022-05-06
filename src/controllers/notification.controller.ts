import { Router, Request, Response, NextFunction } from "express";
import { validateMiddleware } from "../middlewares/validateMiddleware";
import TokenException from "../exceptions/tokenException";
import { IController, INotification } from "../Interfaces";
import Noti from "../models/Notification";
class NotificationController implements IController {
    private path = "/noti";
    private _router: Router
    public get router(): Router {
        return this._router;
    }
    public set router(router: Router) {
        this._router = router;
    }
    constructor() {
        this.router = Router();
        this.initialRouter()
    }

    public initialRouter() {
        this.router.post(`${this.path}/add`, validateMiddleware, this.addNotification);
        this.router.put(`${this.path}/update`, validateMiddleware, this.updateNotification);
        this.router.get(`${this.path}/`, validateMiddleware, this.getNotifications);
    }

    private addNotification(req: Request<{}, {}, {
        notification: INotification,
        _id: string
    }>, res: Response, next: NextFunction) {
        const { notification, _id } = req.body;
        Noti.newNotification({ notification, _id }).then((result) => {
            return res.json(result);
        }).catch((error) => {
            next(new TokenException("failed", "Cannot add notification"))
        })

    }
    private updateNotification(req: Request<{ _id: string }, {}, {}>, res: Response, next: NextFunction) {
        const { _id } = req.query;
        Noti.markSeenNotification(_id as string).then((result) => {
            return res.json(result);
        }).catch(error => {
            next(new TokenException("failed", "Cannot mark notification"))
        })

    }
    private getNotifications(req: Request<{}, {}, {}>, res: Response, next: NextFunction) {
        const { _id } = req.user!;
        Noti.getNotifications(_id).then((result) => {
            return res.json(result);
        }).catch(error => {
            next(new TokenException("failed", "Cannot get notifications"))
        })

    }
}

export default NotificationController;