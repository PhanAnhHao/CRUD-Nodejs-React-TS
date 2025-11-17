import express, { Express } from "express";
import {
    createUser, getUsersPageWithPaginate, getUsersPage,
    updateUser, getViewUser, deleteUser
} from "controllers/user.controller";
import { uploadAvatarBase64 } from "src/middlewares/uploadMiddleware";


const router = express.Router();

const webRoute = (app: Express) => {
    router.post("/users", uploadAvatarBase64, createUser);
    router.get("/users", getUsersPageWithPaginate);
    router.get("/users/all", getUsersPage);
    router.get("/users/:id", getViewUser);
    router.put("/users/:id", updateUser);
    router.delete("/users/:id", deleteUser);

    app.use("/", router);
};

export default webRoute;
