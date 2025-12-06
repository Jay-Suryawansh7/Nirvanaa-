"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const caseController_1 = require("../controllers/caseController");
const confirmationController_1 = require("../controllers/confirmationController");
const router = (0, express_1.Router)();
router.get('/', caseController_1.getCases);
router.get('/metrics', caseController_1.getCaseMetrics);
// Feature 3 Routes
router.post('/:id/remind', confirmationController_1.manualRemind);
router.post('/confirmation', confirmationController_1.receiveConfirmation); // Webhook
router.post('/jobs/trigger', require('../controllers/confirmationController').triggerJobs);
exports.default = router;
//# sourceMappingURL=caseRoutes.js.map