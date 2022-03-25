import { IUser, IMessage } from "../Interfaces";
import IConversation from "../Interfaces/IConversation";
import ConversationModel from "./conversation.model";
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
    public static async getConverSationById(id: string, page: number) {
        let perMessageEveryRequest = 20;
        const conversation = await ConversationModel.findById(id);
        const conversationMessagesLength = conversation!.messages.length;
        const isMore = conversationMessagesLength > perMessageEveryRequest * page;
        const messages = await conversation!.populate({
            path: "messages", options: {
                sort: {
                    createAt: -1
                },
                limit: perMessageEveryRequest,
                skip: (page - 1) * perMessageEveryRequest
            }
        })
        return {
            conversation: {
                length: conversationMessagesLength,
                page: page,
                isMore,
                _id: conversation!._id,
                participants: conversation!.participants,
                messages: messages!.messages
            }
        }
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
    public static addToUnReadMessages({ messageId, conversationId }: { messageId: string, conversationId: string }) {
        const update = {
            $push: {
                unreadmessages: messageId,
            },
        };
        const options = {
            new: true,
        };
        return ConversationModel.findByIdAndUpdate(conversationId, update, options);
    }
    public static makeUnReadMessageEmpty({ conversationId }: { conversationId: string }) {
        const update = {
            $set: {
                unreadmessages: [

                ],
            },
        };
        const options = {
            new: true,
        };
        return ConversationModel.findByIdAndUpdate(conversationId, update, options);
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