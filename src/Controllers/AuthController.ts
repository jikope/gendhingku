// Packages import
import axios from "axios";
import { Types } from "mongoose";
import { Request, Response } from "express";

// Local import
import Controller from "./Controller";
import AuthService from "../Services/AuthService"
import UserService, { createUserPayload } from "../Services/UserService"

import { IUser } from "../Models/User";

export default class AuthController extends Controller {
    private static FRONTEND_URL = "/";
    /**
     * Get user profile
     */
    public static async me(req: Request, res: Response) {
        return res.send({ me: {
            'id': req.session.user!._id
        } });
    }

    /**
     * Register. Create session
     */
    public static async register(req: Request, res: Response) {
        let { username, password } = req.body;
        if (!username || !password) { return super.handleError(res, 400, "Empty inputs"); }

        const payload: createUserPayload = {
            username: username,
            password: password,
        };

        const user = await UserService.createUser(payload);

        if (!user) {
            return super.handleError(res, 400, "Username already exists.");
        }

        return res.status(200).send({ status: "success", message: { username: user.username }});
    }

    /**
     * Logout. Create user's session
     */
    public static async login(req: Request, res: Response) {
        let { username, password } = req.body;

        if (!username || !password) { return super.handleError(res, 400, "Empty inputs"); }

        const check = await AuthService.login(username, password); 

        if (!check) { return super.handleError(res, 401, "Email or Password don't match."); };

        const user = await UserService.getUser(username);
        if (!user) { return super.handleError(res, 500, "Internal Error"); }
        req.session.user = user;

        return res.status(200).send({
            status: "success",
            message: {
                user: user
            },
        });
    }

    /**
     * Logout. Destroy user's session
     */
    public static logout(req: Request, res: Response) {
        req.session.destroy((err) => {
            if (err) {
                console.error(err);
            } else {
                return res.redirect(AuthController.FRONTEND_URL);
            }
        });
    }

    /**
     * Check if user logged in or not (used in browser application)
     */
    public static isLoggedIn(req: Request, res: Response) {
        let isLoggedIn = req.session.user ? true : false;
        return res.send({
            isLoggedIn: isLoggedIn,
        });
    }
}
