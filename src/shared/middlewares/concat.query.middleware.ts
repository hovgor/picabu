import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';

@Injectable()
export class ConvertQueryToNumberMiddleware implements NestMiddleware {
  use(req: Request, res: Response, next: NextFunction) {
    const convertedQuery: any = {};

    for (const key in req.query) {
      if (req.query.hasOwnProperty(key)) {
        const value = req.query[key];

        if (!isNaN(Number(value))) {
          convertedQuery[key] = Number(value);
        } else {
          convertedQuery[key] = value;
        }
      }
    }

    req.query = convertedQuery;
    next();
  }
}

export function convertQueryToNumberMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
) {
  const middleware = new ConvertQueryToNumberMiddleware();
  middleware.use(req, res, next);
}
