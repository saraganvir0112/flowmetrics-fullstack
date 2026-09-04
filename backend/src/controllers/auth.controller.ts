import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth.service.js';
import { ApiSuccessResponse } from '../types/api.js';
import { AuthResponseData, JwtUserPayload } from '../types/auth.js';

export class AuthController {
  public static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const { email, password } = req.body;
      const data = await AuthService.login(email, password);

      const response: ApiSuccessResponse<AuthResponseData> = {
        success: true,
        data,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async getCurrentUser(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response: ApiSuccessResponse<JwtUserPayload | undefined> = {
        success: true,
        data: req.user,
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }

  public static async adminTest(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const response: ApiSuccessResponse<{ message: string; user: JwtUserPayload | undefined }> = {
        success: true,
        data: {
          message: 'Admin authorization verified successfully',
          user: req.user,
        },
        meta: {
          timestamp: new Date().toISOString(),
        },
      };

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  }
}
