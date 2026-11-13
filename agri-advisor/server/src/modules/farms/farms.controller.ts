import { Response } from 'express';
import { AuthenticatedRequest } from '../../types/index.js';
import { FarmsService } from './farms.service.js';
import { sendSuccess, sendError } from '../../utils/response.js';

export class FarmsController {
  public static async listFarms(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const farms = await FarmsService.listFarms(req.user!.id);
      sendSuccess(res, farms, 'Farms retrieved successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async getFarm(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const farm = await FarmsService.getFarmById(req.params.id, req.user!.id);
      if (!farm) {
        sendError(res, 'Farm not found or unauthorized', 404, 'NOT_FOUND');
        return;
      }
      sendSuccess(res, farm, 'Farm details retrieved successfully');
    } catch (err: any) {
      sendError(res, err.message, 500);
    }
  }

  public static async createFarm(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const farm = await FarmsService.createFarm(req.user!.id, req.body);
      sendSuccess(res, farm, 'Farm profile created successfully', 201);
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async updateFarm(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      const farm = await FarmsService.updateFarm(req.params.id, req.user!.id, req.body);
      sendSuccess(res, farm, 'Farm profile updated successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }

  public static async deleteFarm(req: AuthenticatedRequest, res: Response): Promise<void> {
    try {
      await FarmsService.deleteFarm(req.params.id, req.user!.id);
      sendSuccess(res, null, 'Farm deleted successfully');
    } catch (err: any) {
      sendError(res, err.message, 400);
    }
  }
}
