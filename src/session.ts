import redis from "redis";
import { REDIS_HOST, REDIS_PORT, REDIS_SECRET, SESSION_SECRET } from "./config";
import { Application } from "express";
import session from "express-session";

import { Logger } from "./Logger";
const logger = new Logger("SESSION");

let RedisStore = require("connect-redis")(session);
let redisClient = redis.createClient(REDIS_PORT, REDIS_HOST, {password: REDIS_SECRET});

redisClient.on("connect", function() {
    logger.info(`Successfully connected to redis on ${REDIS_HOST}:${REDIS_PORT}`);
});

redisClient.on("error", function() {
    logger.info(
        `Unable to create redis connection on ${REDIS_HOST}:${REDIS_PORT}`
    );
});

export default function(app: Application): void {
    app.use(
        session({
            store: new RedisStore({ client: redisClient }),
            saveUninitialized: false,
            secret: SESSION_SECRET!,
            resave: false,
            cookie: {
                secure: false,
                httpOnly: true,
            },
        })
    );
}
