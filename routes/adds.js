import { Router } from 'express';
import { ApiGuard } from '../middlewares/auth.js';
import { DeleteAdd, EditAdd, GetAddById, GetAllAdds, createAdd, serveImage } from '../controllers/add.js';
import { Upload } from '../utils/Multer.js';
var router = Router();

router.post("/create", ApiGuard, Upload.single("image"), createAdd);
router.post("/edit", ApiGuard, Upload.single("image"), EditAdd);
router.delete("/delete/:add_id", ApiGuard, DeleteAdd);
router.get("get-user-adds", ApiGuard,)
router.get("/get-all-adds", GetAllAdds);
router.get("/image/:id", serveImage);
router.get("/get/:id", GetAddById);

export default router;