import express, { Express } from "express";
import {
    createUser, getUsersPageWithPaginate, getUsersPage,
    updateUser, getViewUser, deleteUser
} from "controllers/user.controller";
import { uploadAvatarBase64 } from "src/middlewares/uploadMiddleware";


const router = express.Router();

const webRoute = (app: Express) => {
    router.get("/users/all", getUsersPage);
    router.post("/users", uploadAvatarBase64, createUser);
    router.get("/users", getUsersPageWithPaginate);
    router.get("/users/:id", getViewUser);
    router.put("/users/:id", uploadAvatarBase64, updateUser);
    router.delete("/users/:id", deleteUser);

    app.use("/", router);
};

export default webRoute;
