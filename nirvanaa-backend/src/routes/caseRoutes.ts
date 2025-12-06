import { Router } from "express";
import { getAllCases, getCaseById, updateCaseConfirmation, rescheduleCase, createCase } from "../controllers/caseController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken); // Protect all routes

router.get("/", getAllCases);
router.get("/:id", getCaseById);
router.post("/:id/confirm", updateCaseConfirmation);
router.patch("/:id/reschedule", rescheduleCase);
router.post("/", createCase);

export default router;
