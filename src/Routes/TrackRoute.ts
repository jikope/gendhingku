import express, { Router } from "express";
import TrackController from "../Controllers/TrackController";

const trackRoute: Router = express.Router({ mergeParams: true });

trackRoute.get("/:trackId", TrackController.index);
trackRoute.post("/store", TrackController.store);
trackRoute.patch("/:trackId", TrackController.update);
trackRoute.delete("/:trackId", TrackController.remove);

export default trackRoute;
