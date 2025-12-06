import { Router } from 'express';
import { getCases, getCaseMetrics } from '../controllers/caseController';

const router = Router();

router.get('/', getCases);
router.get('/metrics', getCaseMetrics);

export default router;
