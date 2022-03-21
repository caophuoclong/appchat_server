import IConversation from "./IConversation";

export default interface IUser {
    _id?: string;
    username: string;
    password?: string;
    dateOfBirth?: dateOfBirth;
    email?: string;
    numberPhone?: string;
    gender?: gender;
    salt?: string;
    name?: string;
    imgUrl?: string;
    conversations?: IConversation;
    messages?: Array<string>;
    friends?: Array<string>;
    friendsRequested?: Array<string>;
    friendsPending?: Array<string>;
    friendsRejected?: Array<string>;
}
export interface dateOfBirth {
    date: number;
    month: number;
    year: number;
}
export type gender = "male" | "female" | "other";
export interface IUserData extends IUser {
    username: string;
    name?: string;
    email?: string;
    numberPhone?: string;
    gender?: gender;
    _id: string;
    dateOfBirth?: dateOfBirth;
    imgUrl?: string;

}
export type IUserInformation = Omit<IUserData, "username" | "_id">

