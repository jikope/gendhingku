import express, { Router } from "express";
import { isLoggedIn } from "../Middlewares/isLoggedIn";
import AuthController from "../Controllers/AuthController";

const authRoute: Router = express.Router();

authRoute.get("/google/url", AuthController.getGoogleAuthURI);
authRoute.get("/google", AuthController.handleGoogleSignIn);
authRoute.get("/me", isLoggedIn, AuthController.me);
authRoute.get("/logout", isLoggedIn, AuthController.logout);
authRoute.get("/isLoggedIn", AuthController.isLoggedIn);

export default authRoute;
