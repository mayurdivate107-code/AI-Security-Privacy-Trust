import { Response } from 'express';
import { AuthenticatedRequest } from '../../types/index.js';
import { AdvisoriesService } from './advisories.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class AdvisoriesController {
  public static async listAdvisories(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const type = req.query.type as string | undefined;
      const data = await AdvisoriesService.listAdvisories(req.user!.id, type);
      sendSuccess(res, data, 'Advisories retrieved successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async getAdvisory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = await AdvisoriesService.getAdvisoryById(req.params.id, req.user!.id);
      if (!data) {
        sendError(res, 'Advisory record not found', 404, 'NOT_FOUND');
        return;
      }
      sendSuccess(res, data, 'Advisory details retrieved successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async toggleSave(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = await AdvisoriesService.toggleSaveAdvisory(req.params.id, req.user!.id);
      sendSuccess(res, data, 'Advisory save status updated');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async deleteAdvisory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await AdvisoriesService.deleteAdvisory(req.params.id, req.user!.id);
      sendSuccess(res, null, 'Advisory deleted successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async createCropRecommendation(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = await AdvisoriesService.generateCropRecommendation(req.user!.id, req.body);
      sendSuccess(res, data, 'Crop recommendation generated successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async createFertilizerAdvisory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = await AdvisoriesService.generateFertilizerAdvisory(req.user!.id, req.body);
      sendSuccess(res, data, 'Fertilizer guidance generated successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async createIrrigationAdvisory(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const data = await AdvisoriesService.generateIrrigationAdvisory(req.user!.id, req.body);
      sendSuccess(res, data, 'Irrigation recommendation generated successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }
}
