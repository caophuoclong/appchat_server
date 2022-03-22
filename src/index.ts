import Express from "./App";
import { createServer } from "http";
import { Server } from "socket.io";
import { AppController, ConversationController, MessageController, TokenController, UserController } from "./controllers";
import redisClient from "./utils/redis-client";
import { IMessage } from "./Interfaces";
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
    io.to(id).emit("new_connection", id);
    socket.on("init_user", (data: string) => {
        redisClient.set(`user_${data}`, id);
    })
    socket.on("send_message", (data: string) => {
        const { conversationId, message } = JSON.parse(data) as {
            conversationId: string,
            message: IMessage
        };
        // console.log(message);
        redisClient.get(`user_${message.receiverId}`).then((result) => {
            console.log(result);
            io.to(result!).emit("receive_message", JSON.stringify({
                message,
                conversationId
            }));
        });
    })
    socket.on("disconnect", () => {
        // delete redis 
        redisClient.del(`user_${id}`);
    })
})

server.listen(4004);