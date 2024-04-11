import { Request, Response, NextFunction } from 'express';
import Jwt from 'jsonwebtoken';
import {config} from '../config/config';
import response from '../helpers/request.helper';
import constants from '../config/constants';
import { error } from '../config/logger';
import User from '../models/user.model';

const {
  UNAUTHORIZED
} = constants.RESPONSE_STATUS;
class tokenValidator {
  static tokenValidate(byPass = false, isPublic = false) {
    return async (req: Request, res: Response, next: NextFunction) => {
      const token = <string>req.headers.authorization?.split(' ')[1];
      Jwt.verify(token, config.JWT_SECRET, async (err:any, decoded:any) => {
        req._userId = req.query?.userId || decoded?._id;
        if(err){
          const {userId} = req.query;
          if (byPass && userId) {
            const user = await User.findById({_id: userId});
            req._user = <any> <unknown> user;
            req._userId = userId;
            if (user) {
              next();
            } else {
              return response.helper(res, false, 'UN_AUTHORIZED', {}, UNAUTHORIZED);    
            }
          } else {
            if (isPublic) { return next(); }
            error(err);
            return response.helper(res, false, 'UN_AUTHORIZED', {}, UNAUTHORIZED);
          }
        } else {
          req._user = decoded;
          if (isPublic) { return next(); }
          if (byPass)
          {
            let userId : any = req._user?._id;
            if (userId && req.query?.userId) {
              if (userId && (req.query?.userId == userId)) {
                
              } else {
                userId = req.query?.userId;
              }
            } else {
              if (!userId) {
                userId = req.query?.userId;
              }
            }
            req._userId = userId;  
          }          
          
          const user = await User.findById({_id: decoded._id});
          if (user) {
          }
          next();
        }
      });
    };
  }
  static adminValidate() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const token = <string>req.headers.authorization?.split(' ')[1];
      Jwt.verify(token, config.JWT_SECRET, (err:any, decoded:any) => {
        if(err){
          return response.helper(res, false, 'UN_AUTHORIZED', {}, UNAUTHORIZED);
        } else {
          req._user = decoded;
          if(req._user.isSuperAdmin) return next();
          return response.helper(res, false, 'UN_AUTHORIZED', {}, UNAUTHORIZED);
        }
      });
    };
  }
}
export default tokenValidator;