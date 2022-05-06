export type messageType = "text" | "image";
export default interface IMessage {
    _id?: string;
    text: string;
    senderId: string;
    createAt?: Date;
    modifiedAt?: Date;
    type: messageType;
    conversationId: string;
}