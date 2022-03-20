import Express from "./App";
import { createServer } from "http";
import { Server } from "socket.io";
import { AppController, ConversationController, MessageController, TokenController, UserController } from "./controllers";
import redisClient from "./utils/redis-client";
const app = new Express([
    new AppController().router,
    new TokenController().router,
    new UserController().router,
    new MessageController().router,
    new ConversationController().router,
]);
const server = createServer(app.app);
const io = new Server(server, {
    cors: {
        origin: "*",
        credentials: true
    }
});


io.on("connection", (socket) => {
    const id = socket.id;
    io.to(id).emit("new_connection", {
        id: id,
    });
    socket.on("init_user", (data: { id: string }) => {
        redisClient.set(`user_${data.id}`, id);
    })
    socket.on("send_message", (data: string) => {
        const { _id, message } = JSON.parse(data) as {
            _id: string,
            message: string
        };
        redisClient.get(`user_${_id}`).then((result) => {
            io.to(result!).emit("receive_message", {
                message,
                _id,
            });
        });
    })
    socket.on("disconnect", () => {
        console.log(socket.id);
    })
})

server.listen(4004);