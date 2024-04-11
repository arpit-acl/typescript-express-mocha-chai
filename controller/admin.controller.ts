import { Request, Response } from 'express';
import mongoose from 'mongoose';
import moment from 'moment';
import Jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

import {GenerateRandomString, decryptString, encryptString, oAuthSecret, otp, sortJSON, verifyOAuthCode} from '../helpers/utils.helper';

import serviceHelper from '../helpers/service.helper';

const {
  BAD_REQUEST,
  SERVER_ERROR,
  SUCCESS,
} = serviceHelper.constants.RESPONSE_STATUS;
const response = serviceHelper.responseHelper;
const config = serviceHelper.config;
class adminController extends serviceHelper {

  
  /**
   * This is the login function which is used to authenticate user
   * @param req Http Request
   * @param res Http Response
   * @returns {token: String}
   */
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

  /**
   * This is the forgot password function, where you can reset your password by entering the otp which has send on your email
   * @param req Http Request
   * @param res Http Response
   * @returns {otp: Number}
   */
  forgotPassword = async (req: Request, res: Response) => {
    try {
      const { email } = req.body;
      const userData = await this.adminService.find(email, 'email');
      if (!userData) {
        return response.helper(res, false, 'ADMIN_NOT_FOUND', {}, 400);
      }
      const aotp = otp(6);
      const otpExpiry = moment().add(5, 'minute');
      await this.adminService.updateDataFactory({ email }, { resetPasswordOtp: aotp, resetPasswordOtpExpiry: otpExpiry }, [], '');

      return response.helper(res, true, 'RESET_PASSWORD_OTP_SENT', {}, SUCCESS);
    } catch (err) {
      response.helper(
        res,
        false,
        'SOMETHING_WENT_WRONG',
        {},
        SERVER_ERROR
      );
    }
  };

  /**
   * This is the verify otp function which is used to verify the user's otp for email verification
   * @param req Http Request
   * @param res Http Response
   * @returns {token: String}
   */
  forogtPasswordVerifyOtp = async (req: Request, res: Response) => {
    try {
      const { email, otp } = req.body;
      const userData = await this.adminService.find(email, 'email');
      if (!userData) {
        return response.helper(res, false, 'ADMIN_NOT_FOUND', {}, 400);
      }
      if (userData.resetPasswordOtp !== Number(otp)) {
        return response.helper(res, false, 'OTP_WRONG', {}, BAD_REQUEST);
      }
      if (userData.resetPasswordOtpExpiry < moment()) {
        return response.helper(res, false, 'OTP_EXPIRED', {}, BAD_REQUEST);
      }
      const resetToken = encryptString(JSON.stringify({
        userId: userData._id,
        expiryTime: moment().add(5, 'minutes').toDate(),
        otp,
      }));
      return response.helper(res, true, 'OTP_VERIFIED', { resetToken }, SUCCESS);
    } catch (err) {
      response.helper(
        res,
        false,
        'SOMETHING_WENT_WRONG',
        {},
        SERVER_ERROR
      );
    }
  };
  
  /**
     * This is the reset password function, where you can type the respective otp and your password has been reset
     * @param req Http Request
     * @param res Http Response
     * @returns {password: String}
     */
  resetPassword = async (req: Request, res: Response) => {
    try {
      const { token, newPassword } = req.body;
      const descryptPassword = await decryptString(token);
      const jsonData = JSON.parse(descryptPassword);
      const userData = await this.adminService.find(jsonData.userId);
      if (!userData) {
        return response.helper(res, false, 'ADMIN_NOT_FOUND', {}, 200);
      }
      if (moment(jsonData.expiryTime).toDate() < moment().toDate()) {
        return response.helper(res, false, 'RESET_TOKEN_EXPIRED', {}, 200);
      }
      if (userData.resetPasswordOtp !== Number(jsonData.otp)) {
        return response.helper(res, false, 'RESET_TOKEN_EXPIRED', {}, BAD_REQUEST);
      }
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(newPassword, salt);
      const validPass = await bcrypt.compare(hash, userData.password);
      if (validPass) {
        return response.helper(res, false, 'PASSWORD_SHOULD_BE_UNIQUE', {}, BAD_REQUEST);
      }
      await this.adminService.updateDataFactory({ _id: new mongoose.Types.ObjectId(jsonData.userId) }, { password: hash, resetPasswordOtp: null, resetPasswordOtpExpiry: null }, [], '');
     
      return response.helper(res, true, 'PASSWORD_RESETED', {}, 200);
    } catch (err) {
      response.helper(
        res,
        false,
        'SOMETHING_WENT_WRONG',
        {},
        SERVER_ERROR
      );
    }
  };

  
}
export default new adminController();
