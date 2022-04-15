import Express from "./App";
import { createServer } from "http";
import { Server } from "socket.io";
import { AppController, ConversationController, MessageController, TokenController, UserController, NotificationController, GroupController } from "./controllers";
import redisClient from "./utils/redis-client";
import { IMessage } from "./Interfaces";
import { PORT } from "./configs"
import ConversationModel from "./models/conversation.model";
const app = new Express([
    new AppController().router,
    new TokenController().router,
    new UserController().router,
    new MessageController().router,
    new ConversationController().router,
    new NotificationController().router,
    new GroupController().router,
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
    socket.on("join_room", (id) => {
        socket.join(`group_${id}`);
    })
    socket.on("send_message", (data: string) => {
        const { conversationId, message, type } = JSON.parse(data) as {
            conversationId: string,
            message: IMessage,
            type: string
        };
        if (type === "direct") {
            ConversationModel.findById(conversationId).select("participants").then(conversation => {
                const receiver = conversation?.participants.find(participant => participant._id?.toString() !== message.senderId);
                redisClient.get(`user_${receiver}`).then((result) => {
                    io.to(result!).emit("receive_message", JSON.stringify({
                        message,
                        conversationId,
                        type: "direct"
                    }));
                });
            })
        } else {
            socket.broadcast.to(`group_${conversationId}`).emit("receive_message", JSON.stringify({
                message,
                conversationId,
                type: "group"
            }))
        }
    })
    socket.on("check_online", async (data: string) => {
        const user = await redisClient.get(`user_${data}`);
        if (user) {
            socket.emit("re_check_online", {
                id: data,
                check: true,
            });
        } else {
            socket.emit("re_check_online", {
                id: data,
                check: false
            });
        }
    })
    socket.on("disconnect", () => {
        const userId = socket.users[0] && socket.users[0].id;
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
    socket.on("on_typing", async (data: {
        senderId: string,
        conversationId: string,
    }) => {
        const id = await redisClient.get(`user_${data.senderId}`);
        if (id) {
            io.to(id).emit("reply_typing", {
                conversationId: data.conversationId,
                isTyping: true
            });
        }
    })
    socket.on("not_typing", async (data: {
        senderId: string,
        conversationId: string,
    }) => {
        const id = await redisClient.get(`user_${data.senderId}`);
        if (id) {
            io.to(id).emit("reply_typing", {
                conversationId: data.conversationId,
                isTyping: false
            });
        }
    })
    socket.on("live_noti", async (param: string) => {
        const id = await redisClient.get(`user_${param}`);
        if (id) {
            io.to(id).emit("rep_live_noti");
        }
    })
    socket.on("accept_friend", async (param) => {
        const id = await redisClient.get(`user_${param}`);
        console.log("123", id);
        if (id) {
            io.to(id).emit("rep_accept_friend");
        }
    })
})

server.listen(PORT, () => {
    console.log("App is runnign on port " + PORT)
});