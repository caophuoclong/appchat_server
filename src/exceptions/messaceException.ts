import HttpException from "./httpException";

export default class MessageException extends HttpException {
    status?: string;
    code: number;
    message: string;
    constructor(status: string, message: string) {
        super(400, message);
        this.status = status;
    }
}