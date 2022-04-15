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
    creator: string;
    imgUrl: string;
    type: string;
    unReadMessage: IMessage[];
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
            $set: {
                latest: messageId,
            }
        };

        const options = {
            new: true,
        };
        const xxx1 = ConversationModel.findByIdAndUpdate(conversationId, update, options).populate("participants").select("participants type");
        return Promise.all([xxx1]);
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
    public static addToUnReadGroup({ messageId, conversationId, userId }: { messageId: string, conversationId: string, userId: string }) {
        ConversationModel.findById(conversationId).select("groupUnRead").then((unReadGroups) => {
            unReadGroups?.groupUnRead?.find(gr => gr.user.toString() === userId.toString())?.messages.push(messageId);
            unReadGroups?.save()
        })
    }
    public static makeUnReadMessageEmpty({ conversationId, userId }: { conversationId: string, userId: string }) {
        return ConversationModel.findById(conversationId).then(async (conversation) => {
            if (conversation!.type === "direct") {
                const update = {
                    $set: {
                        unreadmessages: [

                        ],
                    },
                };
                const options = {
                    new: true,
                };
                await ConversationModel.findByIdAndUpdate(conversationId, update, options);
                return ""
            } else if (conversation!.type === "group") {
                conversation?.groupUnRead?.find(gr => gr.user.toString() === userId.toString())?.messages.splice(0, 10000000000);
                await conversation?.save();
                return ""
            } else {
                return ""
            }
        })

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