import IMessage from "./IMessage";
import IUser from "./IUser";
import mongoose from "mongoose";
export default interface IConversation {
    _id?: string;
    participants: IUser[];
    messages: IMessage[];
    createAt?: Date;
    modifiedAt?: Date;
    creator: string;
    imgUrl: string;
    type: string;
    unReadMessage: IMessage[];
    groupUnRead?: Array<{
        user: string,
        messages: string[]
    }>
}
