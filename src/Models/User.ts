import { Schema, model, Document, Types } from "mongoose";
import { IPlaylist } from "./Playlist";

interface IUser extends Document {
    _id: Types.ObjectId;
    googleId?: string;
    name: string;
    username: string;
    email: string;
    playlists?: IPlaylist[];
}

const userSchema: Schema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, required: true },
        googleId: { type: String, required: true },
        name: { type: String, required: true },
        username: { type: String, required: true },
        email: { type: String, required: true, unique: true, dropDups: true },
        playlists: [{ type: Schema.Types.ObjectId, ref: "Playlist", }],
    },
    { timestamps: true }
);

const User = model<IUser>("User", userSchema);

export { IUser, User };
