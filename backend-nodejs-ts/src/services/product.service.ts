import { prisma } from "config/client";

// Create product
const handleCreateProduct = async (
    name: string,
    description: string,
    price: number,
    quantity: number,
    factory: string,
    category: string,
    images: string[], // Mảng các Base64 images
    sold?: number
) => {
    try {
        // Tạo product mới với images
        const newProduct = await prisma.product.create({
            data: {
                name,
                description,
                price,
                quantity,
                factory,
                category,
                ...(sold !== undefined && { sold }),
                images: {
                    create: images.map((imageUrl, index) => ({
                        imageUrl,
                        isPrimary: index === 0, // Ảnh đầu tiên là ảnh chính
                    }))
                }
            },
            include: {
                images: true, // Trả về cả images
            }
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
        include: {
            images: {
                orderBy: {
                    isPrimary: 'desc' // Ảnh chính lên đầu
                }
            }
        },
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
            include: {
                images: {
                    orderBy: {
                        isPrimary: 'desc'
                    }
                }
            },
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
            where: { id: +id },
            include: {
                images: {
                    orderBy: {
                        isPrimary: 'desc'
                    }
                }
            }
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
        // Cascade delete sẽ tự động xóa images
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
    images?: string[], // Mảng images mới
    sold?: number
) => {
    try {
        // Nếu có images mới, xóa images cũ và thêm mới
        const updateData: any = {
            name,
            description,
            price,
            quantity,
            factory,
            category,
            ...(sold !== undefined && { sold })
        };

        if (images && images.length > 0) {
            // Xóa images cũ và tạo mới
            updateData.images = {
                deleteMany: {}, // Xóa tất cả images cũ
                create: images.map((imageUrl, index) => ({
                    imageUrl,
                    isPrimary: index === 0,
                }))
            };
        }

        const updateProduct = await prisma.product.update({
            where: { id: +id },
            data: updateData,
            include: {
                images: true
            }
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