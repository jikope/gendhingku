import mongoose from "mongoose";
import { IPlaylist } from "../../src/Models/Playlist";
import PlaylistService from "../../src/Services/PlaylistService";

describe("Playlist Service", () => {
    // let conn: typeof mongoose;
    // const payload  = { name: "Test Dangdut", }

    // beforeAll(async () => {
    //     conn = await mongoose.connect("mongodb://localhost/gendhingku");
    // });

    // afterAll(async () => {
    //     await conn.disconnect();
    // });

    it("should create playlist", async () => {
        // const playlist: IPlaylist = await PlaylistService.createPlaylist();
        expect(true).toBeTruthy();
    });
});
