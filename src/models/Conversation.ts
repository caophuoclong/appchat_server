import { IUser, IMessage } from "../Interfaces";
import IConversation from "../Interfaces/IConversation";
import ConversationModel from "./conversation.model";
import { Query, Document } from "mongoose";
class Conversations implements IConversation {
    _id?: string;
    participants: IUser[];
    messages: IMessage[];
    createAt?: Date;
    modifiedAt?: Date;
    conversation?: IConversation;
    constructor({ _id, participants, messages, modifiedAt, createAt }: IConversation) {
        this._id = _id;
        this.participants = [];
        this.messages = [];
        this.createAt = createAt;
        this.modifiedAt = modifiedAt;
    }
    public static getConverSationById(id: string) {
        return ConversationModel.findById(id).populate("messages").sort({ createAt: -1 });
    }
    public static createConversation({ _id1, _id2 }: { _id1: string, _id2: string }) {
        const conversation = new ConversationModel({
            participants: [_id1, _id2],
            messages: [],
            createAt: new Date(),
        });
        return conversation.save();
    }
    public static addMessage({ messageId, conversationId }: { messageId: string, conversationId: string }) {
        const update = {
            $push: {
                messages: messageId,
            },
        };
        const update2 = {
            $set: {
                latest: messageId,
            }
        }
        const options = {
            new: true,
        };
        const xxx1 = ConversationModel.findByIdAndUpdate(conversationId, update, options);
        const xxx2 = ConversationModel.findByIdAndUpdate(conversationId, update2, options);
        return Promise.all([xxx1, xxx2]);
    }
    public static removeMessage({ messageId, conversationId }: { messageId: string, conversationId: string }) {
        const update = {
            $pull: {
                messages: messageId,
            },
        };
        const options = {
            new: true,
        };
        return ConversationModel.findByIdAndUpdate(conversationId, update, options);
    }
    public static changeNameConversation({ conversationId, name }: { conversationId: string, name: string }) {
        const update = {
            $set: {
                name,
            },
        };
        const options = {
            new: true,
        };
        return ConversationModel.findByIdAndUpdate(conversationId, update, options);
    }
    public static addUserToConversation(..._id: string[]) {
        // for group;
    }
}
export default Conversations;