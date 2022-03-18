import { Server as SocketServer } from "socket.io";
import Server from "./Server";
import App from "./App";
import AppController from "./controllers/app.controller";
class Socket {
    private io: SocketServer;
    private server: Server;
    public constructor() {
        const app = new App([
            new AppController()
        ]);
        this.server = new Server(app.app)
        this.io = new SocketServer(this.server.httpServer);
        this.server.listen();
    }

}
export default Socket;