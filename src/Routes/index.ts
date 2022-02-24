import express, { Router } from "express";
import AuthRoute from "./AuthRoute";
import { playlistRoute } from "./PlaylistRoute";

const api: Router = express.Router();

api.get("/test", (req, res) => {
    res.send("hello");
});

api.use("/playlist", playlistRoute);
api.use("/auth", AuthRoute);

export default api;
