import express from 'express';
import { getPolicy, updatePolicy, updatePolicySchema } from '../controllers/policyController.js';
import { validateBody } from '../middleware/validate.js';
import { optionalAuth } from '../middleware/auth.js';

const router = express.Router();

router.get('/', optionalAuth, getPolicy);
router.put('/', optionalAuth, validateBody(updatePolicySchema), updatePolicy);

export default router;
