import { INotification } from '../Interfaces';
import { IResolveRequest } from '../Interfaces/IResolve';
import NotificationModel from './notification.model';
import UserModel from './User.model';
class Notification {
    public static newNotification({
        notification,
        _id,
    }: {
        notification: INotification;
        _id: string;
    }) {
        return new Promise<IResolveRequest>((resolve, reject) => {
            const notifi = new NotificationModel(notification);
            notifi.save().then(async (result) => {
                await UserModel.findByIdAndUpdate(_id, {
                    $push: {
                        notifications: result._id
                    }
                })
                resolve({
                    code: 200,
                    status: "success",
                    message: "Add notification successfully!",
                    data: result
                })
            }).catch(error => {
                reject({
                    code: 500,
                    status: "error",
                    message: "Add notification failed!",
                    data: error
                })
            })
        })
    }
    public static markSeenNotification(id: string) {
        return new Promise((resolve, reject) => {
            NotificationModel.findByIdAndUpdate(id, {
                seen: true
            }).then(result => {
                resolve({
                    code: 200,
                    status: "success",
                    message: "Mark seen successfully!",
                    data: id
                })
            }).catch(error => {
                reject({
                    code: 500,
                    status: "error",
                    message: "Mark seen failed!",
                    data: error
                })
            })
        })
    }
    public static getNotifications(id: string) {
        return new Promise<{ code: number, status: string, message: string, data: Array<INotification> }>((resolve, reject) => {
            UserModel.findById(id).populate({
                path: "notifications",
                populate: [{
                    path: "user",
                    select: "username name imgUrl"
                }, {
                    path: "group",
                    select: "name"
                }],
                options: {
                    sort: {
                        date: -1
                    }
                }
            }).then(result => {
                resolve({
                    code: 200,
                    status: "success",
                    message: "Get notifications successfully!",
                    data: result!.notifications!
                })
            }).catch(error => {
                reject({
                    code: 500,
                    status: "error",
                    message: "Get notifications failed!",
                    data: error
                })
            })

        })

    }

}
export default Notification;
