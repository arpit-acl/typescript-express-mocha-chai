import { Request, Response, NextFunction } from 'express';
import response from '../helpers/request.helper';
import RoleModel from '../models/roles.model';
import constants from '../config/constants';
import { error } from '../config/logger';

const {
  BAD_REQUEST,
  SERVER_ERROR,
} = constants.RESPONSE_STATUS;

const userType = constants.USER_ROLES;

const Permission = (roleCategory: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
      const user = req._user;
      next();
    };
};
export default Permission;