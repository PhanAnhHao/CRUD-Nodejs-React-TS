import multer from "multer";
import sharp from "sharp";

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
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

// Middleware xử lý upload + resize + nén + Base64
export const uploadAvatarBase64 = (req: any, res: any, next: any) => {
    upload(req, res, async (err: any) => {
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
                return res.status(500).json({ error: "Failed to process image" });
            }
        }
        // Nếu FE đã gửi sẵn base64 trong req.body.avatar thì giữ nguyên
        next();
    });
};