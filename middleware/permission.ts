import { Request, Response, NextFunction } from 'express';
import response from '../helpers/request.helper';
import RoleModel from '../models/role.model';
import constants from '../config/constants';
import { error } from '../config/logger';

const {
  BAD_REQUEST,
  SERVER_ERROR,
} = constants.RESPONSE_STATUS;

const userType = constants.USER_ROLES;

const Permission = (roleCategory: string, accessType: string, roles: string[] = []) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = req._user;
      if (user?.isSuperAdmin || roles.includes(userType.USER)) return next();  
      const roleDetails = await RoleModel.findOne({_id: user.roleId._id, status: true}).lean();
      if (!roleDetails)
        return response.helper(res, false, 'UN_AUTHORIZED', {unAuthorized: true}, BAD_REQUEST);
      let permissionObj;
      roleDetails?.permissions.forEach((eachP: any) => {
        if (eachP.permissionName == roleCategory) {
          permissionObj = eachP;
        }
      });
      if (!permissionObj) {
        return response.helper(res, false, 'UN_AUTHORIZED', {unAuthorized: true}, BAD_REQUEST);
      }
      if (permissionObj[`${accessType}`]) {
        next();
      } else {
        return response.helper(res, false, 'UN_AUTHORIZED', {unAuthorized: true}, BAD_REQUEST);
      }
    } catch (err) {
      error(err);
      return response.helper(res, false, 'UN_AUTHORIZED', {unAuthorized: true}, SERVER_ERROR);
    }
              
  };
};
export default Permission;