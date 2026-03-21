import { NextFunction, Request, Response } from 'express'
import { omit } from 'lodash'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { ErrorStatus } from '~/utils/Errors'

export const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof ErrorStatus) {
    return res.status(err.status).json(omit(err, 'status'))
  }

  return res.status(HTTP_STATUS.SERVER_ERROR).json({
    message: err.message
  })
}

export default errorHandler
