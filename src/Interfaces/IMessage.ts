export default interface IMessage {
    text: string;
    senderId: string;
    receiverId: string;
    senderUsername: string;
    receiverUsername: string;
    createAt: Date;
    modifiedAt: Date;
    type: "text" | "image",
}