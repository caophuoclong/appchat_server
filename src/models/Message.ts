import IMessage, { messageType } from "../Interfaces/IMessage";
import MessageModel from "./message.model";
import Conversation from "./Conversation"
import { IResolveRequest } from "../Interfaces/IResolve";
import redisClient from "../utils/redis-client";
import User from "./User";
class Message implements IMessage {
    _id?: string;
    text: string;
    senderId: string;
    createAt: Date;
    modifiedAt?: Date;
    type: messageType;
    conversationId: string;
    constructor({ text, senderId, modifiedAt, type, conversationId }: IMessage) {
        this.text = text;
        this.senderId = senderId;
        this.createAt = new Date();
        this.modifiedAt = modifiedAt;
        this.type = type;
        this.conversationId = conversationId;
    }
    public newMessage() {
        return new Promise<IResolveRequest>((resolve, reject) => {
            const message = new MessageModel({
                text: this.text,
                senderId: this.senderId,
                type: this.type,
            });
            message.save()
                .then(async (result) => {
                    this._id = result.id;
                    const addToConversation = await Conversation.addMessage({ messageId: this._id!, conversationId: this.conversationId! })
                    const promises: Promise<any>[] = [];
                    addToConversation[0]!.participants.forEach(async (participant) => {
                        promises.push(User.addMessage({ messageId: this._id!, userId: participant._id! }) as any)
                        const userChoosen = await redisClient.get(`choose_conversation_${participant._id}`);
                        if (participant._id?.toString() !== this.senderId && addToConversation[0]!.type === "direct") {
                            userChoosen === this.conversationId ? null : await Conversation.addToUnReadMessages({ messageId: this._id!, conversationId: this.conversationId! });
                        } else if (participant._id?.toString() !== this.senderId && addToConversation[0]!.type === "group") {
                            userChoosen === this.conversationId ? null : await Conversation.addToUnReadGroup({
                                messageId: this._id!,
                                conversationId: this.conversationId!,
                                userId: participant._id!
                            })
                        }
                    })
                    Promise.all([addToConversation, ...promises]).then(() => {
                        resolve({
                            code: 200,
                            status: "success",
                            message: "Message created",
                        })
                    })
                        .catch((error) => {
                            console.log("47" + error);
                            reject({
                                code: 500,
                                status: "failed",
                                message: "Message not created because cannot push to conversations",
                            })
                        })
                        ;

                })
                .catch((error) => {
                    console.log("57" + error);
                    reject({
                        code: 500,
                        status: "failed",
                        message: "Message not created",
                    })
                });
        })

    }

}

export default Message;