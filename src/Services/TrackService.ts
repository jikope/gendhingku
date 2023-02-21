import { Types } from "mongoose";
import { ITrack, Track } from "../Models/Track";
import { IPlaylist } from "../Models/Playlist";

import { Logger } from '../Logger'
const logger = new Logger("TrackService");

export type createTrackPayload = {
    name: string;
    videoId: string;
    startTime: number | null;
    endTime: number | null;
    duration: number;
    playlist: IPlaylist;
};

namespace TrackService {
    /**
     * @param {createTrackPayload} data - Track data and Playlist object
     * @returns Promise<ITrack | null>
     */
    export async function createTrack(data: createTrackPayload): Promise<ITrack | null> {
        let playlist: IPlaylist = data.playlist;

        const newTrack = await Track.create({
            _id: new Types.ObjectId(),
            name: data.name,
            videoId: data.videoId,
            startTime: data.startTime,
            endTime: data.endTime,
            duration: data.duration,
        }).catch((err) => {
            logger.error(err);
        });

        if (!newTrack) return null;

        playlist.tracks.push(newTrack._id);
        await newTrack.save();
        await playlist.save();

        return newTrack;
    }

    /**
     * @param {createTrackPayload} data - Track data and Playlist object
     * @returns Promise<ITrack | null>
     */
    export async function updateTrack(id: Types.ObjectId | string, data: createTrackPayload): Promise<ITrack | null> {
        const track: ITrack | null = await Track.findById(id);
        if (!track) return null;

        try {
            track.name = data.name;
            track.duration = data.duration;
            track.videoId = data.videoId;
            track.startTime = data.startTime;
            track.endTime = data.endTime;
            await track.save();
            const playlist: IPlaylist = data.playlist;
            await playlist.save()
        } catch (e) {
            logger.error(e);
            return null;
        }

        return track;
    }

    /**
     * @param trackId - Track's ObjectId
     * @returns Promise<boolean>
     */
    export function deleteTrack(trackId: Types.ObjectId | string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            Track.deleteOne({ _id: trackId }, (err) => {
                if (err) {
                    logger.error(err);
                    reject(false);
                }
                resolve(true);
            });
        });
    }
}

export default TrackService;
