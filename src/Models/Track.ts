import { Schema, model, Document, Types } from "mongoose";

interface ITrack extends Document {
    _id: Types.ObjectId;
    name: string;
    videoId: string;
    startTime: number | null;
    endTime: number | null;
    duration: number;
}

const trackSchema = new Schema(
    {
        _id: { type: Schema.Types.ObjectId, required: true },
        name: { type: String, required: true },
        videoId: { type: String, required: true },
        startTime: { type: Number, default: null },
        endTime: { type: Number, default: null },
        duration: { type: Number, default: null },
    },
    { timestamps: true }
);

const Track = model<ITrack>("Track", trackSchema);

export { ITrack, Track };
