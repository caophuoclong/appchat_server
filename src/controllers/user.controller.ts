import IController from "../Interfaces/IController";
import express from "express";
import { IUser } from "src/Interfaces/IUser";
import crypto from "crypto";
import User from "../models/User.model"
import HttpException from "../exceptions/httpException"

class UserController implements IController {
    private path: string;
    private router: express.Router;
    private user = User;
    public constructor() {
        this.path = "/user";
        this.router = express.Router();
    }

    initialRouter() {
        this.router.post(this.path + "/signup", this.handleSignUp)
    }
    private handleSignUp(req: express.Request<{}, {}, IUser>, res: express.Response, next: express.NextFunction) {
        const { dateOfBirth, username, password, email, gender, numberPhone } = req.body;
        const salt = crypto.randomBytes(20).toString("hex");
        const newPassword = this.hashPassword(password, salt);
        const createdUser = new this.user({
            username,
            password: newPassword,
            salt: salt,
            email,
            gender,
            numberPhone,
            dateOfBirth
        })
        const { password: test, ...xxx } = req.body;
        createdUser.save()
            .then(result => {
                return res.json({
                    status: 200,
                    message: "Create user successfully!",
                    user: {
                        ...xxx
                    }
                })
            })
            .catch(error => {
                next(new HttpException(500, error.message));
            })
    }
    private hashPassword(password: string, salt: string) {
        let hash = crypto.createHmac("sha512", salt);
        hash.update(password);
        let value = hash.digest("hex");
        return value;
    }
}