import { Request, Response, NextFunction } from "express";

export function isLoggedIn(req: Request, res: Response, next: NextFunction) {
    if (!req.session.user) {
        return res.sendStatus(403);
    }

    next();
}

export default isLoggedIn;
