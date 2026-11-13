import { Router } from 'express';
import { AdvisoriesController } from './advisories.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { aiRateLimiter } from '../../middleware/rateLimit.middleware.js';
import { validateRequest } from '../../middleware/validation.middleware.js';
import {
  CropRecommendationRequestSchema,
  FertilizerRequestSchema,
  IrrigationRequestSchema,
} from './advisories.schema.js';

export const advisoriesRouter = Router();

advisoriesRouter.use(requireAuth);

// General advisory management
advisoriesRouter.get('/', AdvisoriesController.listAdvisories);
advisoriesRouter.get('/:id', AdvisoriesController.getAdvisory);
advisoriesRouter.patch('/:id/save', AdvisoriesController.toggleSave);
advisoriesRouter.delete('/:id', AdvisoriesController.deleteAdvisory);

// AI advisory generation endpoints (rate-limited)
advisoriesRouter.post(
  '/crop-recommendation',
  aiRateLimiter,
  validateRequest({ body: CropRecommendationRequestSchema }),
  AdvisoriesController.createCropRecommendation
);

advisoriesRouter.post(
  '/fertilizer',
  aiRateLimiter,
  validateRequest({ body: FertilizerRequestSchema }),
  AdvisoriesController.createFertilizerAdvisory
);

advisoriesRouter.post(
  '/irrigation',
  aiRateLimiter,
  validateRequest({ body: IrrigationRequestSchema }),
  AdvisoriesController.createIrrigationAdvisory
);
