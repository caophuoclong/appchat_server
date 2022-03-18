import express from "express";
import mongoose from "mongoose";
import { MONGO_USERNAME, MONGO_PASSWORD } from "./configs/index"
import errorHandling from "./middlewares/errorHandling";
class App {
    public app: express.Application;

    public constructor(controllers: Array<{ router: express.IRouter }>) {
        this.app = express();
        this.initialConnectDatabase();
        this.initialMiddleware();
        this.initialController(controllers);
        this.initialErrorHandler();

    }

    private initialMiddleware() {
        this.app.use(express.json());
        this.app.use(express.urlencoded({ extended: true }));
    }

    private initialController(controllers: Array<{ router: express.IRouter }>) {
        controllers.forEach(controller => {
            this.app.use("/", controller.router);
        })
    }
    private initialErrorHandler() {
        this.app.use(errorHandling);
    }
    private initialConnectDatabase() {
        mongoose.connect(`mongodb://${MONGO_USERNAME}:${MONGO_PASSWORD}@localhost:27017`)
            .then(result => {
                console.log("Connect to database successfully");
            })
            .catch(error => {
                console.log("Connect failed: " + error);
            })
    }
}
export default App;