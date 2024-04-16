import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import { error, info } from '../config/logger';
import serviceHelper from '../helpers/service.helper';
import {generateToken} from '../helpers/utils.helper'

interface searchVerificationResult {
  attributes: object;
  Creator_Reference__c: string;
  Id: string;
}

class authController  extends serviceHelper {

  // Authentication Functions start

  signup = async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, dob, password } = req.body;

      // validation start
      const emailUser = await this.userService.find(email, 'email');
      if (emailUser) {
        info('email already used error in signup');
        return this.error(res, 'EMAIL_ALREADY_REGISTERED', {});
      }
      // insert user to database
      const user = await this.userService.insertDataFactory({
        firstName,
        lastName,
        email,
        dob, 
        password
      });
      
      const token = await generateToken(JSON.stringify({email, _id: user._id}));
      await this.userService.updateDataFactory({email}, {token});
      return this.success(res, 'USER_REGISTERED', {token});
    } catch (err: any) {
      error(`Error in signup controller ${err}`);
      return this.error(res, err.message, {});
   }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password, otp, secret } = req.body;
      // admin validation
      const user = await this.userService.find(email, 'email', 'roleId password' , true);
      if (!user) {
        return this.error(res, 'ADMIN_NOT_FOUND' , {});
      }
      // password validation
      if (!(await bcrypt.compare(password, user.password))) {
        return this.error(res, 'WRONG_CREDENTIALS', {});
      }
      // token create 
      delete user.password;
      delete user.token;
      const token = Jwt.sign({_id:user._id, email:user.email, isSuperAdmin: user.isSuperAdmin, roleId: user.roleId, fcmToken: user?.fcmToken }, this.config.JWT_SECRET, { expiresIn: '1d' });
      await this.userService.updateDataFactory({email}, {token});        
      const responseData = {
        token,
        user,
      };
      return this.success(res, 'LOGIN_SUCCESS', responseData);
    } catch (err: any) {
      return this.error(res, err.message, {});
    }
  };

}
export default new authController();
