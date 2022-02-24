import express, { Router } from "express";
import trackRoute from "./TrackRoute";
import { isLoggedIn } from "../Middlewares/isLoggedIn";
import PlaylistController from "../Controllers/PlaylistController";

const playlistRoute: Router = express.Router();

playlistRoute.get("/me", isLoggedIn, PlaylistController.getMyPlaylists);
playlistRoute.post("/store", isLoggedIn, PlaylistController.store);
playlistRoute.get("/:playlistId", PlaylistController.getPlaylistTracks);
playlistRoute.patch("/:playlistId/update", isLoggedIn, PlaylistController.update);
playlistRoute.patch("/:playlistId/updateSequence", isLoggedIn, PlaylistController.updateSequence);
playlistRoute.delete("/:playlistId/delete", isLoggedIn, PlaylistController.remove);

playlistRoute.use("/:playlistId/track", trackRoute);

export { playlistRoute };
