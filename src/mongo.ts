import { connect } from "mongoose";
import { MONGO_URL } from "./config";
import { Logger } from "./Logger";

const logger = new Logger("MONGO");
// const dbAtlas = "mongodb+srv://jikope:admin123@kampret.3vm8i.mongodb.net/gendhingku?retryWrites=true&w=majority";

export default async function(): Promise<void> {
    await connect(MONGO_URL!);

    logger.info(`Successfully connected to database`);
}
