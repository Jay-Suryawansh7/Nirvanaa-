import { Router } from "express";
import { getHearings, createHearing, updateHearing, deleteHearing } from "../controllers/hearingController";
import { authenticateToken } from "../middleware/authMiddleware";

const router = Router();

router.use(authenticateToken);

router.get("/", getHearings);
router.post("/", createHearing);
router.patch("/:id", updateHearing);
router.delete("/:id", deleteHearing);

export default router;
