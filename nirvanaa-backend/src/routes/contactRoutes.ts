import { Router } from "express";
import { getContacts, createContact, updateContact, deleteContact } from "../controllers/contactController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.get("/", getContacts);
router.post("/", createContact);
router.patch("/:id", updateContact);
router.delete("/:id", deleteContact);

export default router;
