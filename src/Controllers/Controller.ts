import { Response } from "express";
export default class Controller {
    public view(): void { }
    public static handleError(res: Response, statusCode: number, message: string): Response {
        return res.status(statusCode).send({
            error: message,
        });
    }
}
