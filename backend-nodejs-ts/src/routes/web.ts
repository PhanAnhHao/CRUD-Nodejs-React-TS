import express, { Express } from "express";
import {
    createUser, getUsersPageWithPaginate, getUsersPage,
    updateUser, getViewUser, deleteUser
} from "controllers/user.controller";

const router = express.Router();

const webRoute = (app: Express) => {
    router.post("/users", createUser);
    router.get("/users", getUsersPageWithPaginate);
    router.get("/users/all", getUsersPage);
    router.get("/users/:id", getViewUser);
    router.put("/users/:id", updateUser);
    router.delete("/users/:id", deleteUser);

    app.use("/", router);
};

export default webRoute;
