import { NextFunction, Request, RequestHandler, Response } from 'express'

export const wrapHandler = (func: RequestHandler<any, any, any>) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
