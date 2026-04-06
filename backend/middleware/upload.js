import multer from "multer";

const storage = multer.memoryStorage();

const fileFilter = (req, file, cb) => {
  const allowedMimes = [
    "model/obj",
    "model/gltf-binary",
    "model/gltf+json",
    "application/octet-stream", // covers .fbx, .stl, .usdz, .glb, .obj
    "image/jpeg",
    "image/png",
    "image/webp",
  ];
  // Also check file extension
  const allowedExts = /\.(obj|fbx|gltf|glb|stl|usdz|jpg|jpeg|png|webp)$/i;
  if (allowedMimes.includes(file.mimetype) || allowedExts.test(file.originalname)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Allowed: OBJ, FBX, GLTF, GLB, STL, USDZ, JPG, PNG, WEBP"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100MB max
});

export default upload;
