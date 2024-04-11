import { Request, Response } from 'express';
import { error, info } from '../config/logger';
import serviceHelper from '../helpers/service.helper';

interface searchVerificationResult {
  attributes: object;
  Creator_Reference__c: string;
  Id: string;
}

const {
  BAD_REQUEST,
  SERVER_ERROR,
  SUCCESS,
} = serviceHelper.constants.RESPONSE_STATUS;
const {
  constants, config, responseHelper : response,
} = serviceHelper;

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
        return response.helper(res, false, 'EMAIL_ALREADY_REGISTERED', {}, BAD_REQUEST);
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
      response.helper(
        res,
        false,
        'SOMETHING_WENT_WRONG',
        {},
        SERVER_ERROR
      );
    }
  };

  login = async (req: Request, res: Response) => {
    try {
      const { email, password, otp, secret } = req.body;
      // admin validation
      const admin = await this.adminService.find(email, 'email', 'roleId');
      if (!admin) {
        return response.helper(
          res,
          true,
          'ADMIN_NOT_FOUND',
          {},
          BAD_REQUEST
        );
      }
      // password validation
      if (!(await bcrypt.compare(password, admin.password))) {
        return response.helper(
          res,
          false,
          'WRONG_CREDENTIALS',
          {},
          BAD_REQUEST
        );
      }
      if(!admin._2faSecret && !secret && !otp) {
        const secret = oAuthSecret(email);
        return response.helper(res, true, 'SET_2FA', {secret},SUCCESS);
      }
      delete admin.password;
      if(admin.isDeleted){
        return response.helper(res, false, 'ACCOUNT_IN_ACTIVE', {}, BAD_REQUEST);
      }
      if(admin.isBlock){
        return response.helper(res, false, 'ACCOUNT_IN_ACTIVE', {}, BAD_REQUEST);
      }
      const secretCode = admin._2faSecret ? admin._2faSecret : secret.secret;
      if (otp) { 
        const validateOtp = verifyOAuthCode(secretCode, otp);
        if(validateOtp) {
          if(!admin._2faSecret && secret) {
            await this.adminService.updateDataFactory({email}, {_2faSecret: secretCode}, [],'');        
          }
        } else {
          return response.helper(res, false, '2FA_CODE_EXPIRED', {}, BAD_REQUEST);
        }
      } else {
        return response.helper(res, false, '2FA_REQUIRED', {}, BAD_REQUEST);
      }
      const token = Jwt.sign({_id:admin._id, email:admin.email, isSuperAdmin: admin.isSuperAdmin, roleId: admin.roleId, fcmToken: admin?.fcmToken }, config.JWT_SECRET, { expiresIn: '1d' });
      const responseData = {
        token,
        user: admin,
      };
      await this.adminService.updateDataFactory({email}, {token}, [],'');        
      return response.helper(
        res,
        true,
        'LOGIN_SUCCESS',
        responseData,
        SUCCESS
      );
    } catch (err: any) {
      response.helper(
        res,
        false,
        err.toString(),
        {},
        SERVER_ERROR
      );
    }
  };

}
export default new authController();
