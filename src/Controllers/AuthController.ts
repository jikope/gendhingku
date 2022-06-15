// Packages import
import axios from "axios";
import { Types } from "mongoose";
import { google } from "googleapis";
import { Request, Response } from "express";

// Local import
import { Logger } from '../Logger'
import Controller from "./Controller";
import { IUser, User } from "../Models/User";
import { GOOGLE_CALLBACK_URI, GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET } from "../config";

const logger = new Logger("AuthController");

export default class AuthController extends Controller {
    private static FRONTEND_URL = "/";
    /**
     * Generate user login and consent screen to user
     */
    public static getGoogleAuthURI(req: Request, res: Response) {
        const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URI);

        const scopes = [
            "https://www.googleapis.com/auth/userinfo.profile",
            "https://www.googleapis.com/auth/userinfo.email",
        ];

        const authURL = oauth2Client.generateAuthUrl({
            access_type: "offline",
            prompt: "consent",
            scope: scopes,
        });

        return res.redirect(authURL);
    }

    /**
     * Get user's info after getting consent from user
     */
    public static async handleGoogleSignIn(req: Request, res: Response) {
        const code = req.query.code as string;
        if (!code) {
            return res.sendStatus(401);
        }

        const oauth2Client = new google.auth.OAuth2(GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET, GOOGLE_CALLBACK_URI);

        try {
            const { tokens } = await oauth2Client.getToken(code);

            const googleUser = await axios
                .get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${tokens.access_token}`, {
                    headers: {
                        Authorization: `Bearer ${tokens.id_token}`,
                    },
                })
                .then((res) => res.data)
                .catch((error) => {
                    logger.error("err");
                    throw new Error(error.message);
                });

            let user: IUser | null = await User.findOne({ email: googleUser.email }).exec();
            if (!user) {
                user = await User.create({
                    _id: new Types.ObjectId(),
                    name: googleUser.name,
                    email: googleUser.email,
                    googleId: googleUser.id,
                    username: googleUser.given_name,
                    playlists: []
                });

                await user.save();
            }

            req.session.user = user;

            return res.redirect(AuthController.FRONTEND_URL);
        } catch (e) {
            logger.error(e);
            return res.sendStatus(401);
        }
    }

    /**
     * Get user profile
     */
    public static async me(req: Request, res: Response) {
        return res.send({ me: {
            'id': req.session.user!._id,
            'name': req.session.user!.name
        } });
    }

    /**
     * Logout. Destroy user's session
     */
    public static logout(req: Request, res: Response) {
        req.session.destroy((err) => {
            if (err) {
                logger.error(err);
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
