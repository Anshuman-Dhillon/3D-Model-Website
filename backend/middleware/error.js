import multer from "multer";

const errorHandler = (err, req, res, next) => {
    // Multer-specific errors
    if (err instanceof multer.MulterError) {
        const messages = {
            LIMIT_FILE_SIZE: "File too large. Maximum size is 100MB.",
            LIMIT_FILE_COUNT: "Too many files. Maximum is 10 images.",
            LIMIT_UNEXPECTED_FILE: "Too many files uploaded. Maximum 10 gallery images, 1 thumbnail, and 1 model file.",
            LIMIT_FIELD_KEY: "Field name too long.",
            LIMIT_FIELD_VALUE: "Field value too long.",
            LIMIT_FIELD_COUNT: "Too many fields.",
            LIMIT_PART_COUNT: "Too many parts.",
        };
        return res.status(400).json({
            message: messages[err.code] || `Upload error: ${err.message}`,
            code: err.code,
            field: err.field,
        });
    }

    // Multer file-filter rejection
    if (err.message && err.message.includes("Invalid file type")) {
        return res.status(400).json({ message: err.message });
    }

    const statusCode = err.status || 500;
    res.status(statusCode).json({
        message: err.message || "Internal Server Error",
    });
}

export default errorHandler;