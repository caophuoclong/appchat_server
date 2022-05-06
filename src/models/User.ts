import IUser, { dateOfBirth, gender, IUserData } from '../Interfaces/IUser';
import UserModel from './User.model';
import { Document } from 'mongoose';
import crypto from 'crypto';
import { createAccessToken, createRefreshToken } from '../utils/auth';
import redisClient from '../utils/redis-client';
import { IResolveRequest } from '../Interfaces/IResolve';
import Conversations from './Conversation';
class User {
    private _id?: string | undefined;
    public get id(): string | undefined {
        return this._id;
    }
    public set id(value: string | undefined) {
        this._id = value;
    }
    private _username: string;
    public get username(): string {
        return this._username;
    }
    public set username(value: string) {
        this._username = value;
    }
    private _password?: string | undefined;
    public get password(): string | undefined {
        return this._password;
    }
    public set password(value: string | undefined) {
        this._password = value;
    }
    private _dateOfBirth?: dateOfBirth | undefined;
    public get dateOfBirth(): dateOfBirth | undefined {
        return this._dateOfBirth;
    }
    public set dateOfBirth(value: dateOfBirth | undefined) {
        this._dateOfBirth = value;
    }
    private _gender?: gender | undefined;
    public get gender(): gender | undefined {
        return this._gender;
    }
    public set gender(value: gender | undefined) {
        this._gender = value;
    }
    private _email?: string | undefined;
    public get email(): string | undefined {
        return this._email;
    }
    public set email(value: string | undefined) {
        this._email = value;
    }
    private _numberPhone?: string | undefined;
    public get numberPhone(): string | undefined {
        return this._numberPhone;
    }
    public set numberPhone(value: string | undefined) {
        this._numberPhone = value;
    }
    private _salt?: string | undefined;
    public get salt(): string | undefined {
        return this._salt;
    }
    public set salt(value: string | undefined) {
        this._salt = value;
    }
    private _name?: string | undefined;
    public get name(): string | undefined {
        return this._name;
    }
    public set name(value: string | undefined) {
        this._name = value;
    }
    private _imgUrl?: string | undefined;
    public get imgUrl(): string | undefined {
        return this._imgUrl;
    }
    public set imgUrl(value: string | undefined) {
        this._imgUrl = value;
    }
    private user: IUser & Document;
    public constructor({
        username,
        password,
        dateOfBirth,
        gender,
        email,
        numberPhone,
        name,
        _id,
        imgUrl,
    }: IUser) {
        this.id = _id;
        this.username = username;
        this.password = password;
        this.dateOfBirth = dateOfBirth;
        this.email = email;
        this.gender = gender;
        this.numberPhone = numberPhone;
        this.name = name;
        this.imgUrl = imgUrl;
    }
    private createUser() {
        this.user = new UserModel({
            username: this.username,
            password: this.password,
            dateOfBirth: this.dateOfBirth,
            gender: this.gender,
            email: this.email,
            numberPhone: this.numberPhone,
            salt: this.salt,
            name: this.name,
        });
    }
    public register() {
        const { newPassword, salt } = this.hashPassword();
        this.password = newPassword;
        this.salt = salt;
        this.createUser();
        return this.user.save();
    }
    public login() {
        return new Promise<{
            code: number;
            message: string;
            status: string;
            data: {
                refreshToken?: string;
                accessToken?: string;
            };
        }>((resolve, reject) => {
            UserModel.findOne({ username: this.username })
                .then((user) => {
                    if (user) {
                        let hash = crypto.createHmac('sha512', user.salt!);
                        hash.update(this.password!);
                        let value = hash.digest('hex');
                        if (value === user.password) {
                            const {
                                password: xxx,
                                salt: salt123,
                                __v,
                                dateOfBirth,
                                id,
                                ...userData
                            } = user.toObject();
                            const accessToken = createAccessToken({
                                _id: userData._id,
                                username: userData.username,
                            });
                            const refreshToken = createRefreshToken({
                                _id: userData._id,
                                username: userData.username,
                            });
                            redisClient
                                .set(userData.username, refreshToken)
                                .then((result: any) => {
                                    console.log('Stored successfully!' + result);
                                })
                                .catch((error: any) => {
                                    console.log(error);
                                });
                            resolve({
                                code: 200,
                                message: 'Login Success',
                                status: 'success',
                                data: {
                                    accessToken,
                                    refreshToken,
                                },
                            });
                        } else {
                            reject({
                                code: 401,
                                message: 'Wrong password',
                            });
                        }
                    } else {
                        reject({
                            code: 404,
                            message: 'User is not found!',
                        });
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    public getMe() {
        return new Promise<{
            code: number;
            message: string;
            status: string;
            data: IUserData;
        }>((resolve, reject) => {
            UserModel.findById(this._id)
                .populate({
                    path: 'conversations',
                    populate: {
                        path: 'participants',
                        select: ['username', 'name', 'imgUrl'],
                    },
                })
                .populate({
                    path: 'conversations',
                    populate: {
                        path: 'latest',
                        options: {
                            sort: {
                                createAt: -1,
                            },
                        },
                    },
                })
                .populate({
                    path: 'conversations',
                    populate: {
                        path: 'unreadmessages',
                    },
                })
                .populate({
                    path: "conversations",
                    populate: {
                        path: "creator"
                    }
                })
                .populate({
                    path: 'notifications',
                    populate: [{
                        path: 'user',
                        select: 'name imgUrl username',
                    }, {
                        path: "group",
                        select: "name"
                    }],
                    options: {
                        sort: {
                            date: -1,
                        },
                    },
                })
                .populate({
                    path: 'friends',
                    select: 'name username imgUrl _id',
                })
                .populate({
                    path: "friendsRequested",
                    select: 'name username imgUrl _id',
                })
                .populate({
                    path: "friendsPending",
                    select: 'name username imgUrl _id',
                })
                .then((result) => {
                    delete result!.password;
                    delete result!.salt;
                    resolve({
                        code: 200,
                        message: 'Get user success',
                        status: 'success',
                        data: result!,
                    });
                })
                .catch((error) => {
                    console.log(error);
                    reject({
                        code: 500,
                        message: 'Get user fail',
                        status: 'fail',
                    });
                });
        });
    }
    public updateInformation() {
        return new Promise<IResolveRequest>(async (resolve, reject) => {
            UserModel.findOneAndUpdate(
                { username: this.username },
                {
                    name: this.name,
                    email: this.email,
                    numberPhone: this.numberPhone,
                    gender: this.gender,
                    dateOfBirth: this.dateOfBirth,
                    imgUrl: this._imgUrl,
                },
                {
                    new: true,
                }
            )
                .then((result) => {
                    const { name, email, gender, dateOfBirth, numberPhone, imgUrl } = result!;
                    resolve({
                        code: 200,
                        status: 'success',
                        message: 'Update successfully!',
                        data: {
                            name,
                            email,
                            gender,
                            dateOfBirth,
                            numberPhone,
                            imgUrl,
                        },
                    });
                })
                .catch((error) => {
                    console.log(error);
                    reject({
                        code: 500,
                        status: 'error',
                        message: 'Update failed!',
                    });
                });
        });
    }
    public updatePassword(oldPassword: string, newPassword: string) {
        return new Promise<IResolveRequest>(async (resolve, reject) => {
            UserModel.findOne({ username: this.username })
                .then((user) => {
                    if (user) {
                        let hash = crypto.createHmac('sha512', user.salt!);
                        hash.update(oldPassword);
                        let value = hash.digest('hex');
                        if (value === user.password) {
                            const { newPassword: newPassword123, salt: salt123 } = this.hashPassword();
                            UserModel.findOneAndUpdate(
                                { username: this.username },
                                {
                                    password: newPassword123,
                                    salt: salt123,
                                }
                            )
                                .then((result) => {
                                    resolve({
                                        code: 200,
                                        status: 'success',
                                        message: 'Update successfully!',
                                    });
                                })
                                .catch((error) => {
                                    console.log(error);
                                    reject({
                                        code: 500,
                                        status: 'error',
                                        message: 'Update failed!',
                                    });
                                });
                        } else {
                            reject({
                                code: 401,
                                message: 'Wrong password',
                            });
                        }
                    } else {
                        reject({
                            code: 404,
                            message: 'User is not found!',
                        });
                    }
                })
                .catch((err) => {
                    reject(err);
                });
        });
    }
    public addFriend({ _id }: { _id: string }) {
        return new Promise<IResolveRequest>(async (resolve, reject) => {
            const existed = await UserModel.findById(this._id);
            if (existed!.friends?.includes(_id))
                return reject({
                    code: 401,
                    message: 'User is already your friend!',
                    status: 'fail',
                });
            else {
                const addToPending = UserModel.findOneAndUpdate(
                    {
                        username: this.username,
                    },
                    {
                        $push: {
                            friendsPending: _id,
                        },
                    }
                );
                const addToRequest = UserModel.findByIdAndUpdate(_id, {
                    $push: {
                        friendsRequested: this.id,
                    },
                });
                Promise.all([addToPending, addToRequest])
                    .then(() => {
                        resolve({
                            code: 200,
                            status: 'success',
                            message: 'Sent friend request successfully!',
                        });
                    })
                    .catch((error) => {
                        reject({
                            code: 500,
                            status: 'error',
                            message: 'Send request failed',
                        });
                    });
            }
        });
    }
    public acceptRequest({ _id }: { _id: string }) {
        return new Promise<IResolveRequest>((resolve, reject) => {
            const addToFriendList = UserModel.findByIdAndUpdate(this._id, {
                $push: {
                    friends: _id,
                },
                $pull: {
                    friendsRequested: _id,
                },
            });
            const addToFriendList2 = UserModel.findByIdAndUpdate(_id, {
                $push: {
                    friends: this.id,
                },
                $pull: {
                    friendsPending: this.id,
                },
            });
            Promise.all([addToFriendList, addToFriendList2])
                .then(async () => {
                    const conversation = await Conversations.createConversation({
                        _id1: this.id!,
                        _id2: _id,
                    });
                    const xxx1 = UserModel.findByIdAndUpdate(this._id, {
                        $push: {
                            conversations: conversation._id,
                        },
                    });
                    const xxx2 = UserModel.findByIdAndUpdate(_id, {
                        $push: {
                            conversations: conversation._id,
                        },
                    });
                    Promise.all([xxx1, xxx2]).then(() => {
                        resolve({
                            code: 200,
                            status: 'success',
                            message: 'Agree request successfully!',
                        });
                    });
                })
                .catch((error) => {
                    reject({
                        code: 500,
                        status: 'error',
                        message: 'Agree request failed',
                    });
                });
        });
    }
    public rejectRequest({ _id }: { _id: string }) {
        return new Promise<IResolveRequest>((resolve, reject) => {
            const removeRequest = UserModel.findByIdAndUpdate(this._id, {
                $pull: {
                    friendsRequested: _id,
                },
            });
            const removePending = UserModel.findByIdAndUpdate(_id, {
                $push: {
                    friendsRejected: this._id,
                },
                $pull: {
                    friendsPending: this._id,
                },
            });
            Promise.all([removeRequest, removePending])
                .then(() => {
                    resolve({
                        code: 200,
                        status: 'success',
                        message: 'Reject request successfully!',
                    });
                })
                .catch((error) => {
                    reject({
                        code: 500,
                        status: 'error',
                        message: 'Reject request failed',
                    });
                });
        });
    }
    public deleteFriend({ _id }: { _id: string }) {
        return new Promise<IResolveRequest>(async (resolve, reject) => {
            UserModel.findOneAndUpdate(
                { username: this.username },
                {
                    $pull: {
                        friends: _id,
                    },
                }
            )
                .then((result) => {
                    resolve({
                        code: 200,
                        status: 'success',
                        message: 'Update successfully!',
                    });
                })
                .catch((error) => {
                    console.log(error);
                    reject({
                        code: 500,
                        status: 'error',
                        message: 'Update failed!',
                    });
                });
        });
    }
    public static addMessage({ messageId, userId }: { messageId: string; userId: string }) {
        return UserModel.findByIdAndUpdate(userId, {
            $push: {
                messages: messageId,
            },
        });
    }
    public static handleSearchFriend({
        type,
        value,
    }: {
        type: string | undefined;
        value: string | undefined;
    }) {
        return new Promise<IResolveRequest>(async (resolver, reject) => {
            if (!type || !value) {
                reject({
                    code: 400,
                    status: 'error',
                    message: 'Missing params',
                });
            } else {
                const user = await UserModel.find(
                    {
                        [type]: value,
                    },
                    '_id username name imgUrl'
                );
                if (user) {
                    resolver({
                        code: 200,
                        status: 'success',
                        message: 'Search successfully!',
                        data: user,
                    });
                } else {
                    reject({
                        code: 404,
                        status: 'error',
                        message: 'User is not found!',
                    });
                }
            }
        });
    }
    public static getConversations(_id: string) {
        return new Promise<{ code: number; status: string; message: string; data: any }>(
            (resolve, reject) => {
                UserModel.findById(_id)
                    .populate({
                        path: 'conversations',
                        populate: {
                            path: 'participants',
                            select: ['username', 'name', 'imgUrl'],
                        },
                    })
                    .populate({
                        path: 'conversations',
                        populate: {
                            path: 'latest',
                            options: {
                                sort: {
                                    createAt: -1,
                                },
                            },
                        },
                    })
                    .populate({
                        path: 'conversations',
                        populate: {
                            path: 'unreadmessages',
                        },
                    })
                    .then((result) => {
                        resolve({
                            code: 200,
                            status: 'success',
                            message: 'Get conversations successfully',
                            data: result!.conversations,
                        });
                    })
                    .catch((error) => {
                        reject({
                            code: 401,
                            status: 'failed',
                            message: 'Failed to get conversations',
                        });
                    });
            }
        );
    }
    public static getListFriend(_id: string) {
        return new Promise<{ code: number; status: string; message: string; data: any }>(
            (resolve, reject) => {
                UserModel.findById(_id)
                    .populate({
                        path: 'friends',
                        select: 'name username imgUrl _id',
                    })
                    .populate({
                        path: "friendsRequested",
                        select: 'name username imgUrl _id',
                    })
                    .populate({
                        path: "friendsPending",
                        select: 'name username imgUrl _id',
                    })
                    .then((result) => {
                        resolve({
                            code: 200,
                            status: 'success',
                            message: 'Get list friend successfully',
                            data: {
                                friends: result!.friends,
                                friendsRequested: result!.friendsRequested,
                                friendsPending: result!.friendsPending,
                                friendsRejected: result!.friendsRejected,
                            },
                        });
                    })
                    .catch((error) => {
                        reject({
                            code: 401,
                            status: 'failed',
                            message: 'Failed to get list friend',
                        });
                    });
            }
        );
    }
    private hashPassword() {
        const salt = crypto.randomBytes(20).toString('hex');
        let hash = crypto.createHmac('sha512', salt);
        hash.update(this.password!);
        let value = hash.digest('hex');
        return {
            newPassword: value,
            salt,
        };
    }
}
export default User;
