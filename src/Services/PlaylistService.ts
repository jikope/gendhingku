import { Types } from "mongoose";
import { IUser, User } from "../Models/User";
import { IPlaylist, Playlist } from "../Models/Playlist";
import { ITrack } from "../Models/Track";

import { Logger } from '../Logger'
const logger = new Logger("PlaylistService");

export type createPlaylistPayload = {
    name: string;
    createdBy: IUser;
};

namespace PlaylistService {
    export async function getPlaylistById(playlistId: Types.ObjectId | string): Promise<IPlaylist | null> {
        const playlist: IPlaylist | null = await Playlist.findById(playlistId);
        if (!playlist) return null;

        return playlist;
    }

    /**
     * @param user - Instance of IUser
     * @returns Array<IPlaylist> | null
     */
    export async function getMyPlaylists(userId: Types.ObjectId): Promise<Array<IPlaylist> | null> {
        const u: IUser | null = await User.findById(userId)
            .select({ playlists: 1 })
            .populate({ path: "playlists", model: "Playlist" });

        if (!u?.playlists) {
            return null;
        }

        return u.playlists;
    }

    export function getPlaylistTracks(playlist: IPlaylist): Promise<IPlaylist> {
        return new Promise<IPlaylist>((resolve, reject) => {
            Playlist.populate(playlist, [{ path: "tracks", model: "Track" }, {path: "createdBy", model: "User", select: ["_id", "name"]}], function(err, playlist) {
                if (err) {
                    logger.error(err);
                    reject(false);
                }

                resolve(playlist);
            });
        });
    }

    /**
     * @param createPlaylistPayload - playlist's name and user's ObjectId
     * @returns Promise<IPlaylist | null>
     */
    export async function createPlaylist(data: createPlaylistPayload): Promise<IPlaylist | null> {
        const user: IUser | null = await User.findById(data.createdBy);

        if (!user) return null;

        const playlist = await Playlist.create({
            _id: new Types.ObjectId(),
            name: data.name,
            createdBy: data.createdBy._id,
        }).catch((err) => {
            logger.error(err);
        });

        if (!playlist) return null;

        if (!user.playlists) {
            user.playlists = new Array();
        }
        user.playlists?.push(playlist);
        await playlist.save();
        await user.save();

        return playlist;
    }

    export async function updatePlaylistSequence(playlistId: Types.ObjectId | string, trackSequence: Array<Types.ObjectId>): Promise<boolean> {
        const playlist: IPlaylist | null = await Playlist.findById(playlistId);
        if (!playlist) return false;

        playlist.tracks = trackSequence;
        await playlist.save();

        return true;
    }

    /**
     * @param playlistId - Playlist's ObjectId
     * @param updatePlaylistPayload - createPlaylistPayload
     * @returns Promise<IUser | null>
     */
    export async function updatePlaylist(playlistId: Types.ObjectId | string, data: createPlaylistPayload): Promise<IPlaylist | null> {
        const user: IUser | null = await User.findById(data.createdBy);

        if (!user) return null;
        const playlist: IPlaylist | null = await getPlaylistById(playlistId);

        if (!playlist) return null;
        if (!playlist.createdBy._id.equals(user._id)) return null;

        try {
            playlist.name = data.name;
            await playlist.save();
        } catch (e) {
            logger.error(e);
            return null;
        }

        return playlist;
    }

    /**
     * @param playlistId - Playlist's ObjectId
     * @returns Promise<boolean>
     */
    export function deletePlaylist(playlistId: Types.ObjectId | string, userID: Types.ObjectId | string): Promise<boolean> {
        return new Promise<boolean>((resolve, reject) => {
            Playlist.deleteOne({ _id: playlistId }, (err) => {
                if (err) {
                    logger.error(err);
                    reject(false);
                }
                resolve(true);
            });
        });
    }
}

export default PlaylistService;
