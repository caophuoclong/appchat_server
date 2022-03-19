import IMessage from "./IMessage";
import IUser from "./IUser";

export default interface IConversation {
    id: string;
    participants: IUser[];
    messages: IMessage[];
    createAt?: Date;
    modifiedAt?: Date;
}