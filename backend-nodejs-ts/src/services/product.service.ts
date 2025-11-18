import { prisma } from "config/client";

// Create product
const handleCreateProduct = async (
    name: string,
    description: string,
    price: number,
    quantity: number,
    factory: string,
    category: string,
    image: string | null,
    sold?: number
) => {
    try {

        // Tạo product mới
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price,
                quantity,
                factory,
                category,
                image: image || null,
                ...(sold !== undefined && { sold }),
            },
        });

        return newProduct;
    } catch (error: any) {
        console.error("handleCreateProduct error:", error);
        throw new Error(error?.message || "Failed to create product");
    }
};

// Get all products
const handleGetAllProducts = async () => {
    const products = await prisma.product.findMany({
        orderBy: {
            createdAt: 'desc'
        }
    });
    return products;
};

// Pagination
const handleGetProductsWithPaginate = async (currentPage: number, pageSize: number) => {
    try {
        const totalItems = await prisma.product.count();
        const totalPages = Math.ceil(totalItems / pageSize);
        const skip = (currentPage - 1) * pageSize;

        const products = await prisma.product.findMany({
            skip,
            take: pageSize,
            orderBy: {
                createdAt: 'desc'
            }
        });

        return {
            success: true,
            products,
            totalItems,
            totalPages,
        };
    } catch (error) {
        console.error("getProductsWithPaginate error:", error);
        return {
            success: false,
            products: [],
            totalItems: 0,
            totalPages: 0,
            errorMessage: "Database error when fetching products.",
        };
    }
};

// Get product by id
const handleGetProductById = async (id: string) => {
    try {
        const product = await prisma.product.findUnique({
            where: { id: +id }
        });

        if (!product) {
            return { success: false, message: "Product not found", data: null };
        }

        return { success: true, message: "Get product success", data: product };
    } catch (error) {
        console.error("getProductById error:", error);
        return { success: false, message: "Internal server error", data: null };
    }
};

// Delete product
const handleDeleteProduct = async (id: string) => {
    try {
        const result = await prisma.product.delete({
            where: { id: +id },
        });
        return { success: true, message: "Product deleted successfully", data: result };
    } catch (error: any) {
        if (error.code === "P2025") {
            return { success: false, message: "Product not found", data: null };
        }
        console.error("Delete product error:", error);
        return { success: false, message: "Internal server error", data: null };
    }
};

// Update product
const handleUpdateProductById = async (
    id: string,
    name: string,
    description: string,
    price: number,
    quantity: number,
    factory: string,
    category: string,
    image?: string,
    sold?: number
) => {
    try {
        const updateProduct = await prisma.product.update({
            where: { id: +id },
            data: {
                name,
                description,
                price,
                quantity,
                factory,
                category,
                ...(image && { image }),
                ...(sold !== undefined && { sold })
            },
        });

        return updateProduct;
    } catch (error) {
        console.error("updateProductById error:", error);
        return null;
    }
};

export {
    handleCreateProduct,
    handleGetAllProducts,
    handleGetProductsWithPaginate,
    handleGetProductById,
    handleDeleteProduct,
    handleUpdateProductById,
};