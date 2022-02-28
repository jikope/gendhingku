import { ITrack } from "../Models/Track";
import { IPlaylist } from "../Models/Playlist";
import { NextFunction, Request, Response } from "express";
import PlaylistService from "../Services/PlaylistService";
import TrackService, { createTrackPayload } from "../Services/TrackService";

import Controller from "./Controller";

export default class TrackController extends Controller {
    public static index() { }

    public static async store(req: Request, res: Response) {
        let { playlistId } = req.params;
        if (!playlistId) {
            return super.handleError(res, 400, "Playlist Id can't be empty");
        }

        const playlist: IPlaylist | null = await PlaylistService.getPlaylistById(playlistId);
        if (!playlist) {
            return super.handleError(res, 404, "Can't find playlist with id " + playlistId);
        }

        const trackData: createTrackPayload = {
            name: req.body.name,
            videoId: req.body.videoId,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            duration: req.body.duration,
            playlist: playlist,
        };

        const newTrack = await TrackService.createTrack(trackData);
        if (!newTrack) {
            return super.handleError(res, 500, "Can't create new Track");
        }

        return res.status(201).send({
            status: "success",
            newTrack: newTrack,
        });
    }

    public static async update(req: Request, res: Response) {
        let { playlistId } = req.params;
        if (!playlistId) {
            return super.handleError(res, 400, "Playlist Id can't be empty");
        }

        const playlist: IPlaylist | null = await PlaylistService.getPlaylistById(playlistId);
        if (!playlist) {
            return super.handleError(res, 404, "Can't find playlist with id " + playlistId);
        }
        if (!playlist.createdBy._id.equals(req.session.user!._id)) {
            return super.handleError(res, 403, "Forbidden");
        }

        const trackData: createTrackPayload = {
            name: req.body.name,
            videoId: req.body.videoId,
            startTime: req.body.startTime,
            endTime: req.body.endTime,
            duration: req.body.duration,
            playlist: playlist,
        };

        const track = await TrackService.updateTrack(req.params.trackId, trackData);
        if (!track) {
            return super.handleError(res, 500, "Can't create new Track");
        }

        return res.status(201).send({
            track: track,
        });
    }

    public static async remove(req: Request, res: Response) {
        let { trackId, playlistId } = req.params;

        const playlist: IPlaylist | null = await PlaylistService.getPlaylistById(playlistId);

        if (!trackId || !playlist) {
            return super.handleError(res, 400, "Not Found");
        }

        if (!playlist.createdBy._id.equals(req.session.user!._id)) {
            return super.handleError(res, 403, "Forbidden");
        }

        await TrackService.deleteTrack(trackId).then((deleted) => {
            if (deleted) {
                return res.status(204).send({
                    status: "success",
                    message: "Track with id " + trackId + " successfully deleted",
                });
            } else {
                return super.handleError(res, 500, "Unable to delete track");
            }
        });
    }
}
