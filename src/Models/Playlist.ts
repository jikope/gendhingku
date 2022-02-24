import { IUser } from "./User";
import { ITrack } from "./Track";
import { Schema, model, Document, Types } from "mongoose";

interface IPlaylist extends Document {
    _id: Types.ObjectId;
    name: string;
    tracks: Types.ObjectId[];
    createdBy: IUser;
}

const playlistSchema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        tracks: [{ type: Schema.Types.ObjectId, required: true, ref: "Track" }],
        createdBy: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    },
    { timestamps: true }
);

const Playlist = model<IPlaylist>("Playlist", playlistSchema);

export { IPlaylist, Playlist };
