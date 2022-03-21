import IController from "../Interfaces/IController";
import express, { NextFunction } from "express";
import User from "../models/User"
import IUser, { IUserInformation } from "../Interfaces/IUser";
import HttpException from "../exceptions/httpException"
import UserException from "../exceptions/UserException";
import { validateMiddleware } from "../middlewares/validateMiddleware";
import Conversations from "../models/Conversation";
class UserController implements IController {
    private path: string;
    private _router: express.Router;
    public get router(): express.Router {
        return this._router;
    }
    private user = User;
    public constructor() {
        this.path = "/user";
        this._router = express.Router();
        this.initialRouter();
    }

    initialRouter() {
        this._router.post(this.path + "/signup", this.handleSignUp.bind(this))
        this._router.post(`${this.path}/signin`, this.handleSignIn);
        this._router.get(`${this.path}/me`, validateMiddleware, this.handleGetMe);
        this._router.put(`${this.path}/addfriend`, validateMiddleware, this.addFriend);
        this._router.put(`${this.path}/acceptrequest`, validateMiddleware, this.acceptRequest);
        this._router.put(`${this.path}/rejectrequest`, validateMiddleware, this.rejectRequest);
        this._router.put(`${this.path}/deletefriend`, validateMiddleware, this.deleteFriend);
        this._router.put(`${this.path}/update/`, validateMiddleware, this.updateInformation)
        this._router.put(`${this.path}/update/password`, validateMiddleware, this.updatePassword)
        this._router.get(`${this.path}/search`, validateMiddleware, this.searchFriend)
    }
    private handleSignUp(req: express.Request<{}, {}, IUser>, res: express.Response, next: express.NextFunction) {
        const user = new User({
            ...req.body,
            name: req.body.username,
        })
        user.register()
            .then(result => {
                return res.json({
                    status: 200,
                    message: "Create user successfully!",
                })
            })
            .catch(error => {
                if (error.code === 11000)
                    next(new UserException(user.username));
                else next(new HttpException(500, error.message));
            })
    }
    private handleSignIn(req: express.Request<{}, {}, { username: string, password: string }>, res: express.Response, next: NextFunction) {
        const user = new User({
            ...req.body
        })
        user.login().then(async (result) => {
            return res.json({
                ...result
            })
        }
        )
            .catch(error => {
                next(new HttpException(error.code, error.message));
            })
    }
    private updateInformation(req: express.Request<{}, {}, IUserInformation>, res: express.Response, next: express.NextFunction) {
        const { username } = req.user;
        const user = new User({
            username,
            ...req.body,
        });
        user.updateInformation().then((result) => {
            res.json({
                ...result,
            })
        })
    }
    private updatePassword(req: express.Request<{}, {}, { oldPassword: string, newPassword: string }>, res: express.Response, next: express.NextFunction) {
        const { username, _id } = req.user;
        const { newPassword, oldPassword } = req.body;
        const user = new User({
            username,
            password: newPassword,
        });
        user.updatePassword(oldPassword, newPassword).then((result) => {
            res.json({
                ...result,
            })
        })
            .catch(error => {
                next(new HttpException(error.code, error.message));
            })
    }
    private handleGetMe(req: express.Request, res: express.Response, next: express.NextFunction) {
        const username = req.user!.username;
        const id = req.user!._id;
        const user = new User({
            username,
            _id: id,
        });
        user.getMe().then((result) => {
            res.json({
                ...result,
            })
        })
            .catch(error => {
                next(new HttpException(error.code, error.message));
            })
    }
    private addFriend(req: express.Request, res: express.Response, next: express.NextFunction) {
        const { _id } = req.body;
        const username = req.user!.username;
        const user = new User({
            username,
            _id: req.user._id
        });
        user.addFriend({ _id: _id! }).then((result) => {
            res.json({
                ...result,
            })
        })
            .catch(error => {
                next(new HttpException(error.code, error.message));
            })
    }
    private acceptRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        const { _id } = req.body;
        const username = req.user.username;
        const user = new User({
            username,
            _id: req.user._id
        });
        user.acceptRequest({ _id: _id! }).then((result) => {
            res.json({
                ...result,
            })
        })
            .catch(error => {
                next(new HttpException(error.code, error.message));
            })
    }
    private rejectRequest(req: express.Request, res: express.Response, next: express.NextFunction) {
        const { _id } = req.body;
        const username = req.user!.username;
        const user = new User({
            username,
            _id: req.user._id
        });
        user.rejectRequest({ _id: _id! }).then((result) => {
            res.json({
                ...result,
            })
        })
            .catch(error => {
                next(new HttpException(error.code, error.message));
            })
    }
    private deleteFriend(req: express.Request, res: express.Response, next: express.NextFunction) {
        const { _id } = req.body;
        const username = req.user!.username;
        const user = new User({
            username,
        });
        user.deleteFriend({ _id: _id! }).then((result) => {
            res.json({
                ...result,
            })
        })
            .catch(error => {
                next(new HttpException(error.code, error.message));
            })
    }
    private searchFriend(req: express.Request<{}, { type: string, value: string }>, res: express.Response, next: express.NextFunction) {
        const type = req.query.type as string;
        const value = req.query.value as string;
        User.handleSearchFriend({
            type,
            value
        }).then((result) => {
            console.log(result);
            res.json({
                ...result,
            })
        })
            .catch(error => {
                next(new HttpException(error.code, error.message));
            })
    }

}
export default UserController;