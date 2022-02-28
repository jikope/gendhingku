import { IPlaylist } from "../Models/Playlist";
import { Types, isValidObjectId } from "mongoose";
import { NextFunction, Request, Response } from "express";
import PlaylistService, { createPlaylistPayload } from "../Services/PlaylistService";

import Controller from "./Controller";

export default class PlaylistController extends Controller {
    /**
     * Get user's Playlist
     */
    public static getMyPlaylists(req: Request, res: Response, next: NextFunction) {
        PlaylistService.getMyPlaylists(req.session.user!._id)
            .then((playlists) => {
                return res.status(200).send({
                    myPlaylists: playlists
                });
            })
            .catch(() => {
                return super.handleError(res, 400, "Error when fetching data");
            });
    }

    /**
     * Get playlist's track
     */
    public static async getPlaylistTracks(req: Request, res: Response) {
        let { playlistId } = req.params;
        if (!isValidObjectId(playlistId)) {
            return res.status(404).send({
                error: "playlist not found",
            });
        }

        const playlist: IPlaylist | null = await PlaylistService.getPlaylistById(playlistId);
        if (!playlist) {
            return super.handleError(res, 404, "Playlist not Found");
        }
        PlaylistService.getPlaylistTracks(playlist)
            .then((playlist) => {
                return res.status(200).send({
                    playlist: playlist,
                });
            })
            .catch(() => {
                return super.handleError(res, 400, "Error when fetching data");
            });
    }

    /**
     * Store
     */
    public static async store(req: Request, res: Response, next: NextFunction) {
        if (!req.body.name) {
            return super.handleError(res, 400, "Playlist's name must be provided");
        }

        const data: createPlaylistPayload = {
            name: req.body.name,
            createdBy: req.session.user!,
        };

        const playlist: IPlaylist | null = await PlaylistService.createPlaylist(data);
        if (!playlist) {
            return super.handleError(res, 500, "Unable to create playlist");
        }
        res.status(201).send({
            playlist: playlist,
        });
    }

    /**
     * Update playlist sequence
     */
    public static async updateSequence(req: Request, res: Response, next: NextFunction) {
        if(await PlaylistService.updatePlaylistSequence(req.session.user!._id, req.params.playlistId, req.body.trackSequence)){
            return res.sendStatus(200);
        }
    }

    /**
     * Update
     */
    public static async update(req: Request, res: Response) {
        if (!req.body.name) {
            return super.handleError(res, 400, "Playlist's name must be provided");
        }

        const data: createPlaylistPayload = {
            name: req.body.name,
            createdBy: req.session.user!,
        };

        const playlist: IPlaylist | null = await PlaylistService.updatePlaylist(req.params.playlistId, data);

        if (!playlist) return super.handleError(res, 500, "Can't update playlist");

        return res.status(200).send({
            playlist: playlist
        })
    }

    /**
     * Delete
     */
    public static async remove(req: Request, res: Response, next: NextFunction) {
        let { playlistId } = req.params;
        if (!playlistId) {
            return next({
                name: "EmptyInput",
                statusCode: 400,
                message: "PlaylistId must be provided",
            });
        }

        if (req.session.user) {
            await PlaylistService.deletePlaylist(playlistId, req.session.user._id).then((deleted) => {
                if (deleted) {
                    console.log(deleted);
                    return res.status(204).send({
                        status: true,
                        message: "Playlist with id " + playlistId + " successfully deleted",
                    });
                } else {
                    return next({
                        name: "InternalError",
                        statusCode: 500,
                        message: "Unable to remove playlist",
                    });
                }
            });
        }
    }
}
