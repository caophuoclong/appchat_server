import { IConversation } from "../Interfaces"
import conversationModel from "./conversation.model"
import userModel from "./User.model"

class Group {
    private static addConversation(_idConversation: string, _idUser: string) {
        return new Promise<string>(async (resolve, reject) => {
            const options: {
                user: string,
                messages: string[]
            } = {
                user: _idUser,
                messages: []
            }
            try {
                const x = await userModel.findByIdAndUpdate((_idUser), {
                    $push: {
                        conversations: _idConversation
                    }
                })
                await conversationModel.findByIdAndUpdate(_idConversation, {
                    $push: {
                        groupUnRead: options
                    }
                })
                resolve("Add successfully")
            } catch (error) {
                reject("Add failed!")
            }
        })
    }
    public static async createGroupConversation({ creator, name, participants }: {
        creator: string,
        name: string,
        participants: Array<string>
    }) {
        const grConversation = await new conversationModel({
            creator,
            name,
            participants,
            message: [],
            createAt: new Date(),
            type: "group"
        }
        ).save()
        const promises: Array<Promise<string>> = [];

        const promise1 = Group.addConversation(grConversation._id, creator);
        participants.forEach(participant => {
            promises.push(Group.addConversation(grConversation._id, participant))
        })
        return Promise.all([...promises, promise1])

    }
    public static addMemberToGroup({
        _idConversation,
        _id
    }: {
        _idConversation: string,
        _id: Array<string>
    }) {
        const addToConversation = new Promise<string>(async (resolve, reject) => {
            try {

                const x = await conversationModel.findByIdAndUpdate(_idConversation, {
                    $push: {
                        participants: _id
                    }
                }
                )
                resolve("Add success")
            } catch (error) {
                reject("Add user to conversation failed")
            }
        })
        const promises: Array<Promise<string>> = [];
        _id.forEach(_id => {
            promises.push(Group.addConversation(_idConversation, _id))
        })
        return Promise.all([addToConversation, ...promises])
    }
}
export default Group;