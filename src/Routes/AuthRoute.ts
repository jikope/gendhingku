import express, { Router } from "express";
import { isLoggedIn } from "../Middlewares/isLoggedIn";
import AuthController from "../Controllers/AuthController";

const authRoute: Router = express.Router();

// TODO : Add Login and Register
authRoute.post("/login", AuthController.login);
authRoute.post("/register", AuthController.register);

// authRoute.get("/google/url", AuthController.getGoogleAuthURI);
// authRoute.get("/google", AuthController.handleGoogleSignIn);
authRoute.get("/me", isLoggedIn, AuthController.me);
authRoute.get("/logout", isLoggedIn, AuthController.logout);
authRoute.get("/isLoggedIn", AuthController.isLoggedIn);

export default authRoute;
