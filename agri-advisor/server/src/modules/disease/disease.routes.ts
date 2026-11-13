import { Router } from 'express';
import { DiseaseController } from './disease.controller.js';
import { requireAuth } from '../../middleware/auth.middleware.js';
import { uploadSingleImage, validateImageSignature } from '../../middleware/upload.middleware.js';
import { aiRateLimiter } from '../../middleware/rateLimit.middleware.js';

export const diseaseRouter = Router();

diseaseRouter.use(requireAuth);

diseaseRouter.post(
  '/',
  aiRateLimiter,
  uploadSingleImage,
  validateImageSignature,
  DiseaseController.analyzeImage
);

diseaseRouter.get('/', DiseaseController.listAnalyses);
diseaseRouter.get('/:id', DiseaseController.getAnalysis);
