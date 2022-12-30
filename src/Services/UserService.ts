import bcrypt from "bcrypt";

import { Types } from "mongoose";
import { IUser, User } from "../Models/User";

export type createUserPayload = {
    // googleId: string;
    // name: string;
    // email: string;
    username: string;
    password: string;
};

namespace UserService {
    /**
     * @param createUserPayload - user's credentials
     * @returns Promise<IUser | undefined>
     */
    export async function getUser(username: String): Promise<IUser | null> {
        const user: IUser | null = await User.findOne({
            // $or: [{ email: createUserPayload.email }, { username: createUserPayload.username }],
            username: username
        });

        if (!user) { return null }

        return user;
    }

    /**
     * @param createUserPayload - user's credentials
     * @returns Promise<IUser | undefined>
     */
    export async function createUser(createUserPayload: createUserPayload): Promise<IUser | null> {
        const user: IUser | null = await User.findOne({
            // $or: [{ email: createUserPayload.email }, { username: createUserPayload.username }],
            username: createUserPayload.username
        });

        if (user) {
            return null;
        } else {
            const hashedPassword = await bcrypt.hash(createUserPayload.password, 10);
            const newUser: IUser = await User.create({
                _id: new Types.ObjectId(),
                username: createUserPayload.username,
                password: hashedPassword,
            });

            await newUser.save();

            return newUser;
        }
    }

    export function deleteUser(userId: Types.ObjectId | string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            User.deleteOne({ _id: userId }, (err) => {
                if (err) {
                    console.log(err);
                    reject(false);
                }
                resolve(true);
            });
        });
    }
}

export default UserService;
