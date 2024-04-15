import { Request, Response } from 'express';
import bcrypt from 'bcrypt';
import Jwt from 'jsonwebtoken';
import { error, info } from '../config/logger';
import serviceHelper from '../helpers/service.helper';

interface searchVerificationResult {
  attributes: object;
  Creator_Reference__c: string;
  Id: string;
}

class authController extends serviceHelper {

  
  // Authentication Functions start

  signup = async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, dob, password } = req.body;

      // validation start
      const verificationData = await this.userService.find(email, 'email');
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
      return {
        user
      }
    } catch (err: any) {
      error(`Error in signup controller ${err}`);
      return this.error(res, err.message, {});
   }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password, otp, secret } = req.body;
      // admin validation
      const admin = await this.userService.find(email, 'email', 'roleId');
      if (!admin) {
        return this.error(res, 'ADMIN_NOT_FOUND' , {});
      }
      // password validation
      if (!(await bcrypt.compare(password, admin.password))) {
        return this.error(res, 'WRONG_CREDENTIALS', {});
      }
      // token create 
      const token = Jwt.sign({_id:admin._id, email:admin.email, isSuperAdmin: admin.isSuperAdmin, roleId: admin.roleId, fcmToken: admin?.fcmToken }, this.config.JWT_SECRET, { expiresIn: '1d' });
      const responseData = {
        token,
        user: admin,
      };
      await this.userService.updateDataFactory({email}, {token}, [],'');        
      return this.success(res, 'LOGIN_SUCCESS', responseData);
    } catch (err: any) {
      return this.error(res, err.message, {});
    }
  };

}
export default new authController();
