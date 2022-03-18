import http from "http"
import express from "express"
import { PORT } from "./configs/index"
class Server {
    public httpServer: http.Server;
    private port: string;
    public constructor(app: express.Application) {
        this.httpServer = http.createServer(app);
        this.port = PORT!;
    }

    public listen() {
        this.httpServer.listen(this.port, () => {
            console.log("Server is running on port " + this.port);
        })
    }
}
export default Server;