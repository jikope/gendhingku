#!/usr/bin/env node
process.title = "Gendhingku Server";
process.env.DEBUG = process.env.DEBUG || "*INFO* *WARN* *ERROR*";

import dotenv from "dotenv";
dotenv.config();

// Package import
import history from "connect-history-api-fallback";
import express, { Application } from "express";
import cookieParser from "cookie-parser";
import cors from "cors";

// Local import
import apiRoute from "./Routes/index";
import { IUser } from "./Models/User";
import initSession from "./session";
import { Logger } from "./Logger";
import initDB from "./mongo";

const PORT: number = parseInt(process.env.PORT!) || 3000;
const logger = new Logger();
const app: Application = express();

declare module "express-session" {
    interface SessionData {
        user?: IUser;
    }
}

app.use(
    cors({
        origin: ["http://localhost:8080"],
        credentials: true,
        exposedHeaders: ["set-cookie"],
    })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// DB INIT
initDB().catch((err) => logger.error(err));

// SESSION INIT
initSession(app);

// LOAD ROUTES
app.use("/api", apiRoute);

// Router History problem
app.use(history({
    index: '/index.html'
}));

// Serve Vue App
app.use('/', express.static('public/'));

// START LISTENING
app.listen(PORT, () => {
    logger.info(`Server is listening on port ${PORT}`);
});
