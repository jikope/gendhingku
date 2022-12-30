import { Schema, model, Document, Types } from "mongoose";
import { IPlaylist } from "./Playlist";

interface IUser extends Document {
    _id: Types.ObjectId;
    googleId?: string;
    name?: string;
    username: string;
    password?: string;
    email?: string;
    playlists?: IPlaylist[];
}

const userSchema: Schema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, required: true },
        googleId: { type: String, required: false },
        name: { type: String, required: false },
        username: { type: String, required: true, unique: true, dropDups: true },
        password: { type: String, required: true, select: false },
        email: { type: String, unique: true, sparse: true },
        playlists: [{ type: Schema.Types.ObjectId, ref: "Playlist", }],
    },
    { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export { IUser, User };
