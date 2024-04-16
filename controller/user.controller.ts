import { Request, Response } from 'express';
import { error, info } from '../config/logger';
import serviceHelper from '../helpers/service.helper';
import {GenerateRandomString} from '../helpers/utils.helper'

class userController  extends serviceHelper {

  // Authentication Functions start

  create = async (req: Request, res: Response) => {
    try {
      const { firstName, lastName, email, roleId, userType, superAdmin } = req.body;

      // validation start
      const emailUser = await this.userService.find(email, 'email');
      if (emailUser) {
        info('email already used error in signup');
        return this.error(res, 'EMAIL_ALREADY_REGISTERED', {});
      }
      // insert user to database
      const password = GenerateRandomString(10);
      const user = await this.userService.insertDataFactory({
        firstName,
        lastName,
        email,
        password,
        roleId,
        userType,
        superAdmin,
      });
      console.log(user);
      return this.success(res, 'USER_CREATED', {password});
    } catch (err: any) {
      error(`Error in signup controller ${err}`);
      return this.error(res, err.message, {});
   }
  };
  

}
export default new userController();
