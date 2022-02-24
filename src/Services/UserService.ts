import { Types } from "mongoose";
import { IUser, User } from "../Models/User";

export type createUserPayload = {
    googleId: string;
    name: string;
    username: string;
    email: string;
    password: string;
};

namespace UserService {
    /**
     * @param createUserPayload - user's credentials
     * @returns Promise<IUser | undefined>
     */
    export async function createUser(createUserPayload: createUserPayload): Promise<IUser | null> {
        const user: IUser | null = await User.findOne({
            $or: [{ email: createUserPayload.email }, { username: createUserPayload.username }],
        });

        if (user) {
            return null;
        } else {
            const newUser: IUser = await User.create({
                _id: new Types.ObjectId(),
                googleId: createUserPayload.googleId,
                name: createUserPayload.name,
                username: createUserPayload.username,
                email: createUserPayload.email,
                password: createUserPayload.password,
            });

            await newUser.save();

            return newUser;
        }
    }

    export function deleteUser(user: IUser): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            User.deleteOne({ _id: user._id }, (err) => {
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
