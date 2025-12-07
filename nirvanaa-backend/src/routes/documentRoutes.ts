import { Router } from "express";
import { getDocuments, createDocument, updateDocument, deleteDocument } from "../controllers/documentController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.get("/", getDocuments);
router.post("/", createDocument);
router.patch("/:id", updateDocument);
router.delete("/:id", deleteDocument);

export default router;
