import IMessage, { messageType } from "../Interfaces/IMessage";
import MessageModel from "./message.model";
import Conversation from "./Conversation"
import { IResolveRequest } from "../Interfaces/IResolve";
import User from "./User";
class Message implements IMessage {
    _id?: string;
    text: string;
    senderId: string;
    receiverId: string;
    createAt: Date;
    modifiedAt?: Date;
    type: messageType;
    conversationId: string;
    constructor({ text, senderId, receiverId, modifiedAt, type, conversationId }: IMessage) {
        this.text = text;
        this.senderId = senderId;
        this.receiverId = receiverId;
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
                receiverId: this.receiverId,
                type: this.type,
            });
            message.save()
                .then(result => {
                    this._id = result.id;
                    const addToConversation = Conversation.addMessage({ messageId: this._id!, conversationId: this.conversationId! })
                    const addToUser1 = User.addMessage({ messageId: this._id!, userId: this.senderId! });
                    const addToUser2 = User.addMessage({ messageId: this._id!, userId: this.receiverId! });
                    Promise.all([addToConversation, addToUser1, addToUser2]).then(() => {
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