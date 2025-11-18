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

// Upload image (cho Product)
const uploadImage = multer({
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
}).single("image");

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

// Middleware xử lý upload + resize + nén + Base64 cho image (Product)
export const uploadImageBase64 = (req: any, res: any, next: any) => {
    uploadImage(req, res, async (err: any) => {
        if (err) return res.status(400).json({ error: err.message });

        if (req.file) {
            try {
                const mimeType = req.file.mimetype;

                // Resize + nén
                const processedBuffer = await sharp(req.file.buffer)
                    .resize({ width: 800, height: 800, fit: "inside" }) // product image có thể lớn hơn
                    .toFormat(mimeType === "image/png" ? "png" : "jpeg", { quality: 70 }) // nén JPEG/PNG
                    .toBuffer();

                // Chuyển buffer → Base64
                req.body.image = `data:${mimeType};base64,${processedBuffer.toString("base64")}`;
            } catch (error) {
                return res.status(500).json({ error: "Failed to process product image" });
            }
        }
        // Nếu FE đã gửi sẵn base64 trong req.body.image thì giữ nguyên
        next();
    });
};