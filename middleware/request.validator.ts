import Joi from 'joi';
import { Request, Response, NextFunction } from 'express';
import response from '../helpers/request.helper';
import constants from '../config/constants';

const {
  BAD_REQUEST
} = constants.RESPONSE_STATUS;

export default (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const params = req.body;
    const valid = schema.validate(params);
    if (valid.error) {
      const errorMessage = valid?.error?.details[0]?.message?.replace(/"/g, '');
      return response.helper(res, false, errorMessage, {}, BAD_REQUEST);
    }
    next();
  };
};

export const QueryValidator = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const params = req.query;
    const valid = schema.validate(params);
    if (valid.error) {
      const errorMessage = valid?.error?.details[0]?.message?.replace(/"/g, '');
      return response.helper(res, false, errorMessage, {}, BAD_REQUEST);
    }
    next();
  };
};
export const ParamsValidator = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { params } = req;
    const valid = schema.validate(params);
    if (valid.error) {
      const errorMessage = valid?.error?.details[0]?.message?.replace(/"/g, '');
      return response.helper(res, false, errorMessage, {}, BAD_REQUEST);
    }
    next();
  };
};