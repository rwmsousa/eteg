import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { User } from '../entities/user.entity';
import * as jwt from 'jsonwebtoken';

interface CustomRequest extends Request {
  user?: User;
}

@Injectable()
export class AuthMiddleware implements NestMiddleware {
  use(req: CustomRequest, res: Response, next: NextFunction) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (token) {
      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET) as User;
        req.user = decoded;
      } catch (err) {
        console.error('Invalid token', err);
      }
    }
    next();
  }
}
