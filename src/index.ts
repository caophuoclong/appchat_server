import Express from "./App";
import { createServer } from "http";
import { Server } from "socket.io";
import { AppController, ConversationController, MessageController, TokenController, UserController } from "./controllers";
import redisClient from "./utils/redis-client";
import { IMessage } from "./Interfaces";
import { PORT } from "./configs"
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
    socket.users = [];
    io.to(id).emit("new_connection", id);
    socket.on("init_user", (data: string) => {

        socket.users.push({
            id: data
        })
        redisClient.set(`user_${data}`, id);
    })

    socket.on("send_message", (data: string) => {
        const { conversationId, message } = JSON.parse(data) as {
            conversationId: string,
            message: IMessage
        };
        redisClient.get(`user_${message.receiverId}`).then((result) => {
            console.log(result);
            io.to(result!).emit("receive_message", JSON.stringify({
                message,
                conversationId
            }));
        });
    })
    socket.on("check_online", async (data: string) => {
        console.log(1, data);
        const user = await redisClient.get(`user_${data}`);
        if (user) {
            socket.emit("re_check_online", true);
        } else {
            socket.emit("re_check_online", false);
        }
    })
    socket.on("disconnect", () => {
        const userId = socket.users[0] && socket.users[0].id;
        console.log(userId);
        redisClient.del(`user_${userId}`);
        redisClient.del(`choose_conversation_${userId}`)

    }),
        socket.on("choose_conversation", (data: string) => {
            const { user_id, conversation_id }: {
                user_id: string,
                conversation_id: string
            } = JSON.parse(data);
            redisClient.set(`choose_conversation_${user_id}`, conversation_id);
        })
})

server.listen(PORT, () => {
    console.log("App is runnign on port " + PORT)
});