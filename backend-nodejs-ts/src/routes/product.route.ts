import express, { Express } from "express";
import {
    createProduct,
    getProductsPageWithPaginate,
    getProductsPage,
    updateProduct,
    getViewProduct,
    deleteProduct
} from "controllers/product.controller";
import { uploadImageBase64 } from "src/middlewares/uploadMiddleware";

const router = express.Router();

const webRoute = (app: Express) => {
    router.get("/products/all", getProductsPage);
    router.post("/products", uploadImageBase64, createProduct);
    router.get("/products", getProductsPageWithPaginate);
    router.get("/products/:id", getViewProduct);
    router.put("/products/:id", uploadImageBase64, updateProduct);
    router.delete("/products/:id", deleteProduct);

    app.use("/", router);
};

export default webRoute;