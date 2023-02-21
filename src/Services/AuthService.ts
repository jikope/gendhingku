import bcrypt from "bcrypt";
import { Types } from "mongoose";
import { IUser, User } from "../Models/User";

import { Logger } from '../Logger'
import UserService from "./UserService";
const logger = new Logger("AuthService");

namespace AuthService {
    export async function login(username: string, password: string) : Promise<boolean> {
        const user: IUser | null = await User.findOne({
            username: username 
        }).select("+password");

        if (!user) { return false; }

        const check = await bcrypt.compare(password, user.password!);
        if (!check) { return false; }

        return true;
    }
}

export default AuthService;
