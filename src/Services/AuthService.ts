import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { IUser, User } from "../Models/User";

import { Logger } from '../Logger'
import UserService from "./UserService";
const logger = new Logger("AuthService");

namespace AuthService {
    export function login(username: string, password: string) : Promise<boolean> {
        return new Promise<boolean>(async (resolve, reject) => {
            const user: IUser | null = await User.findOne({
                username: username 
            }).select("+password");

            if (!user) { reject(false); return; }

            const check = await bcrypt.compare(password, user.password!);
            if (!check) { reject(false); return; }
            resolve(true);
        })
    }
}

export default AuthService;
