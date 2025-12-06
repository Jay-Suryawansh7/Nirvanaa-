import { Router } from 'express';
import { getCases, getCaseMetrics } from '../controllers/caseController';
import { manualRemind, receiveConfirmation } from '../controllers/confirmationController';

const router = Router();

router.get('/', getCases);
router.get('/metrics', getCaseMetrics);

// Feature 3 Routes
router.post('/:id/remind', manualRemind);
router.post('/confirmation', receiveConfirmation); // Webhook
router.post('/jobs/trigger', require('../controllers/confirmationController').triggerJobs);

export default router;
