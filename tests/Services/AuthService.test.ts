import bcrypt from "bcrypt";
import mongoose from "mongoose";
import { IUser } from "../../src/Models/User";
import AuthService from "../../src/Services/AuthService";
import UserService from "../../src/Services/UserService";

describe("Auth Service test cases", () => {
    // let conn: typeof mongoose;
    let hashedPassword: string;
    let createUserPayload;
    let user: IUser | null;

    beforeAll(async () => {
        await mongoose.connect("mongodb://127.0.0.1:27017/gendhingku-test");
    });

    afterAll(async () => {
        await mongoose.disconnect();
    });

    // Resemble user registration
    it("should hash password", async () => {
        // hashedPassword = await AuthService.hashPassword("kampret");

        hashedPassword = await bcrypt.hash("kampret", 10);
        const check = await bcrypt.compare("kampret", hashedPassword);

        expect(check).toBeTruthy();
    });

    it("Register ", async () => {
        createUserPayload = {
            username: "kampret_username",
            password: "kampret",
        };
        user = await UserService.createUser(createUserPayload);
        expect(user != null).toBeTruthy();

        if (user) {
            expect(user.username).toEqual(createUserPayload.username);
        }
    });

    it("Login ", async () => {
        const checkLogin = await AuthService.login("kampret_username", "kampret");
        expect(checkLogin).toBeTruthy();
    });

    it("Not login", async () => {
        const checkLoginFalse = await AuthService.login("kampret_username", "Kampret");
        expect(checkLoginFalse).toBeFalsy();
    });

    it("delete", async () => {
        if (user) {
            expect(await UserService.deleteUser(user._id)).toBeTruthy();
        }
    });
});
