import { Request, Response } from "express";
import {
    handleCreateProduct,
    handleGetAllProducts,
    handleGetProductsWithPaginate,
    handleGetProductById,
    handleDeleteProduct,
    handleUpdateProductById
} from "services/product.service";

// Create
export const createProduct = async (req: Request, res: Response) => {
    try {
        const { name, description, price, quantity, factory, category, sold } = req.body;

        // Nhận mảng images từ req.body.images (có thể từ middleware hoặc frontend)
        let images: string[] = [];
        if (req.body.images) {
            // Nếu frontend gửi mảng Base64
            images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        } else if (req.body.image) {
            // Nếu chỉ có 1 image (backward compatible)
            images = [req.body.image];
        }

        if (!name || !description || price === undefined || quantity === undefined || !factory || !category) {
            return res.status(400).json({
                status: 400,
                message: "Missing required fields: name, description, price, quantity, factory, category",
            });
        }

        if (images.length === 0) {
            return res.status(400).json({
                status: 400,
                message: "At least one image is required",
            });
        }

        const newProduct = await handleCreateProduct(
            name,
            description,
            +price,
            +quantity,
            factory,
            category,
            images,
            sold !== undefined ? +sold : undefined
        );

        return res.status(201).json({
            status: 201,
            message: "Create product success",
            data: newProduct,
        });
    } catch (error: any) {
        console.error("createProduct error:", error);
        return res.status(500).json({
            status: 500,
            message: error?.message || "Internal server error",
        });
    }
};

// Get all
export const getProductsPage = async (req: Request, res: Response) => {
    try {
        const products = await handleGetAllProducts();
        return res.status(200).json({
            status: 200,
            message: "Get all products success",
            data: products,
        });
    } catch (error) {
        console.error("getProductsPage error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// Pagination
export const getProductsPageWithPaginate = async (req: Request, res: Response) => {
    try {
        const { current, pageSize } = req.query;
        const currentPage = Math.max(Number(current) || 1, 1);
        const size = Math.max(Number(pageSize) || 10, 1);

        const result = await handleGetProductsWithPaginate(currentPage, size);

        if (!result.success) {
            return res.status(500).json({
                status: 500,
                message: result.errorMessage || "Failed to get products with pagination",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Get products with pagination success",
            data: result.products,
            pagination: {
                currentPage,
                pageSize: size,
                totalItems: result.totalItems,
                totalPages: result.totalPages,
            },
        });
    } catch (error) {
        console.error("getProductsPageWithPaginate error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// Get by ID
export const getViewProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await handleGetProductById(id);

        if (!result.success) {
            const status = result.message === "Product not found" ? 404 : 500;
            return res.status(status).json({
                status,
                message: result.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: result.message,
            data: result.data,
        });
    } catch (error) {
        console.error("getViewProduct error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// Delete
export const deleteProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const result = await handleDeleteProduct(id);
        if (!result.success) {
            const status = result.message === "Product not found" ? 404 : 500;
            return res.status(status).json({
                status,
                message: result.message,
            });
        }

        return res.status(200).json({
            status: 200,
            message: result.message
        });
    } catch (error) {
        console.error("deleteProduct error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};

// Update
export const updateProduct = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        const { name, description, price, quantity, factory, category, sold } = req.body;

        // Nhận mảng images mới (optional)
        let images: string[] | undefined;
        if (req.body.images) {
            images = Array.isArray(req.body.images) ? req.body.images : [req.body.images];
        } else if (req.body.image) {
            images = [req.body.image];
        }

        const updatedProduct = await handleUpdateProductById(
            id,
            name,
            description,
            +price,
            +quantity,
            factory,
            category,
            images,
            sold !== undefined ? +sold : undefined
        );

        if (!updatedProduct) {
            return res.status(404).json({
                status: 404,
                message: "Product not found or update failed",
            });
        }

        return res.status(200).json({
            status: 200,
            message: "Update product success",
            data: updatedProduct,
        });
    } catch (error) {
        console.error("updateProduct error:", error);
        return res.status(500).json({
            status: 500,
            message: "Internal server error",
        });
    }
};