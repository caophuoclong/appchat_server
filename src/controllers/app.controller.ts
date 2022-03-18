import express from "express";
class AppController {
    private path = "/";
    public router = express.Router();

    public constructor() {
        this.initialRouter();
    }

    private initialRouter() {
        this.router.post(this.path, this.handlePost);
        this.router.get(this.path, this.handleGet);
    }
    private handlePost(req: express.Request, res: express.Response) {
        return res.json({
            status: 200,
            message: "OK"
        })
    }
    private handleGet(req: express.Request, res: express.Response) {
        return res.json({
            status: 200,
            message: "OK"
        })
    }
}

export default AppController;