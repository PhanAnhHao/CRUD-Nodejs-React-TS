import express, { Express } from "express";
import {
    getUsersPage,
    postCreateUser, postDeleteUser, getViewUser, postUpdateUser
} from "controllers/user.controller";

const router = express.Router();

const webRoute = (app: Express) => {
    router.get("/user", getUsersPage);
    router.post("/user", postCreateUser);
    router.post("/user/:id", postDeleteUser);
    router.get("/user/:id", getViewUser);
    router.post("/user/:id", postUpdateUser);



    app.use("/", router);
};

export default webRoute;
