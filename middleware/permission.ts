import { Request, Response, NextFunction } from 'express';
import RoleModel from '../models/roles.model';
import constants from '../config/constants';
import { error } from '../config/logger';
import response from '../helpers/request.helper';
import mongoose from 'mongoose';

const resp = new response()

const Permission = () => {
  return async (req: Request, res: Response, next: NextFunction) => {
    if(req._user.userType === 'superAdmin') {
      next()
    } else {
      const module = req.path.split('/')[1];
      const method = req.method;

      const user = req._user; 
      if (user.roleId) {
        let action = '';
        if(['POST'].includes(method)) action = 'create'
        else if (['PUT', 'PATCH'].includes(method)) action = 'update'
        else if (['GET'].includes(method)) action = 'read'
        else if (['DELETE'].includes(method)) action = 'remove'
        else return resp.unAuthorized(res);

        
        const [userPermission] = await RoleModel.aggregate([
          {
            '$match': {
              '_id': new mongoose.Types.ObjectId(user.roleId)
            }
          }, {
            '$lookup': {
              'from': 'roles_policies', 
              'localField': 'policies', 
              'foreignField': '_id', 
              'as': 'policies'
            }
          }, {
            '$unwind': {
              'path': '$policies'
            }
          }, {
            '$lookup': {
              'from': 'modules', 
              'localField': 'policies.moduleId', 
              'foreignField': '_id', 
              'as': 'moduleData'
            }
          }, {
            '$unwind': {
              'path': '$moduleData'
            }
          }, {
            '$match': {
              'moduleData.name': module, 
              [`policies.${action}`]: true
            }
          }
        ])

        if(!userPermission) return resp.unAuthorized(res);
        next();
      } else {
        return resp.unAuthorized(res);
      }
    }
    };
};
export default Permission;