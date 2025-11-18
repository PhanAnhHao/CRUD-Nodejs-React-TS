import multer from "multer";
import sharp from "sharp";

// Multer memory storage
const storage = multer.memoryStorage();

// Upload avatar (cho User)
const uploadAvatar = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 }, // 3MB max
    fileFilter: (req, file, cb) => {
        // Chỉ chấp nhận PNG, JPG, JPEG
        if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG and PNG images allowed.") as any, false);
        }
    },
}).single("avatar");

// Upload nhiều images (cho Product) - tối đa 5 ảnh
const uploadImages = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 }, // 3MB max per file
    fileFilter: (req, file, cb) => {
        // Chỉ chấp nhận PNG, JPG, JPEG
        if (["image/png", "image/jpg", "image/jpeg"].includes(file.mimetype)) {
            cb(null, true);
        } else {
            cb(new Error("Only JPEG and PNG images allowed.") as any, false);
        }
    },
}).array("images", 5); // Cho phép upload tối đa 5 ảnh

// Middleware xử lý upload + resize + nén + Base64 cho avatar
export const uploadAvatarBase64 = (req: any, res: any, next: any) => {
    uploadAvatar(req, res, async (err: any) => {
        if (err) return res.status(400).json({ error: err.message });

        if (req.file) {
            try {
                const mimeType = req.file.mimetype;

                // Resize + nén
                const processedBuffer = await sharp(req.file.buffer)
                    .resize({ width: 500, height: 500, fit: "inside" }) // giữ aspect ratio
                    .toFormat(mimeType === "image/png" ? "png" : "jpeg", { quality: 60 }) // nén JPEG/PNG
                    .toBuffer();

                // Chuyển buffer → Base64
                req.body.avatar = `data:${mimeType};base64,${processedBuffer.toString("base64")}`;
            } catch (error) {
                return res.status(500).json({ error: "Failed to process avatar image" });
            }
        }
        // Nếu FE đã gửi sẵn base64 trong req.body.avatar thì giữ nguyên
        next();
    });
};

// Middleware xử lý upload nhiều images + resize + nén + Base64 (Product)
export const uploadImagesBase64 = (req: any, res: any, next: any) => {
    uploadImages(req, res, async (err: any) => {
        if (err) {
            if (err.code === "LIMIT_FILE_COUNT") {
                return res.status(400).json({ error: "Maximum 5 images allowed" });
            }
            return res.status(400).json({ error: err.message });
        }

        if (req.files && req.files.length > 0) {
            try {
                const processedImages: string[] = [];

                // Xử lý từng ảnh
                for (const file of req.files) {
                    const mimeType = file.mimetype;

                    // Resize + nén
                    const processedBuffer = await sharp(file.buffer)
                        .resize({ width: 800, height: 800, fit: "inside" })
                        .toFormat(mimeType === "image/png" ? "png" : "jpeg", { quality: 70 })
                        .toBuffer();

                    // Chuyển buffer → Base64
                    const base64Image = `data:${mimeType};base64,${processedBuffer.toString("base64")}`;
                    processedImages.push(base64Image);
                }

                // Lưu mảng Base64 images vào req.body.images
                req.body.images = processedImages;
            } catch (error) {
                return res.status(500).json({ error: "Failed to process product images" });
            }
        }
        // Nếu FE đã gửi sẵn base64 trong req.body.images thì giữ nguyên
        next();
    });
};