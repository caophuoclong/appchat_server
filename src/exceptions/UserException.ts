import HttpException from "./httpException";

export default class UserException extends HttpException {
    constructor(username: string) {
        super(400, `Invalid username: ${username} is existed!`);
    }

}