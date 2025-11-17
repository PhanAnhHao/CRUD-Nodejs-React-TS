import multer from "multer";
import sharp from "sharp";

// Multer memory storage
const storage = multer.memoryStorage();
const upload = multer({
    storage,
    limits: { fileSize: 3 * 1024 * 1024 }, // 3MB max
    fileFilter: (req, file, cb) => {
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

                let processedBuffer: Buffer;

                if (mimeType === "image/jpeg" || mimeType === "image/jpg") {
                    // JPEG: resize + giảm chất lượng
                    processedBuffer = await sharp(req.file.buffer)
                        .resize({ width: 500, height: 500, fit: "inside" })
                        .jpeg({ quality: 60 }) // giảm chất lượng xuống 60%
                        .toBuffer();
                } else if (mimeType === "image/png") {
                    // PNG: resize + nén
                    processedBuffer = await sharp(req.file.buffer)
                        .resize({ width: 500, height: 500, fit: "inside" })
                        .png({ compressionLevel: 9 }) // nén PNG
                        .toBuffer();
                } else {
                    processedBuffer = req.file.buffer;
                }

                // Chuyển buffer → Base64
                req.body.avatar = `data:${mimeType};base64,${processedBuffer.toString(
                    "base64"
                )}`;
            } catch (error) {
                return res.status(500).json({ error: "Failed to process image" });
            }
        }

        next();
    });
};
