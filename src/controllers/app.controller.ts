import express from "express";
class AppController {
    private path = "/";
    private _router = express.Router();
    public get router() {
        return this._router;
    }


    public constructor() {
        this.initialRouter();
    }

    private initialRouter() {
        this._router.post(this.path, this.handlePost);
        this._router.get(this.path, this.handleGet);
    }
    private handlePost(req: express.Request, res: express.Response) {
        return res.json({
            status: 200,
            message: "Request to api successfully!"
        })
    }
    private handleGet(req: express.Request, res: express.Response) {
        return res.json({
            status: 200,
            message: "Request to api successfully!"
        })
    }
}

export default AppController;