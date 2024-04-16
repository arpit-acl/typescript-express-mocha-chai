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
const resp = new response()

class tokenValidator {
  
  static tokenValidate() {
    return async (req: Request, res: Response, next: NextFunction) => {
      const token = <string> req.headers.authorization?.split(' ')[1];
      Jwt.verify(token, config.JWT_SECRET, async (err:any, decoded:any) => {
        if(err){
          return resp.unAuthorized(res);
        } else {
          const user = await User.findById({_id: decoded._id});
          console.log(user);
          req._user = user;
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
          return resp.unAuthorized(res);
        } else {
          req._user = decoded;
          if(req._user?.superAdmin) return next();
          return resp.unAuthorized(res);
        }
      });
    };
  }
}
export default tokenValidator;