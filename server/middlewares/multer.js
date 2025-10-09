import multer from "multer";

const storage = multer.memoryStorage(); // keeps file in req.file.buffer
const upload = multer({ storage });

export default upload;
