import dataService from '../services/databaseFactoryServices';
import userModel from '../models/user.model';
import cmsModel from '../models/cms.model';
import roleModel from '../models/role.model';

import constants from '../config/constants';
import { config } from '../config/config';
import response from './request.helper';

class Helper {
  
  static config = config;
  static constants = constants;
  static responseHelper = response;

  userService: dataService;
  cmsService: dataService;
  roleService: dataService;
    
  constructor () {
    this.userService = new dataService(userModel);
    this.cmsService = new dataService(cmsModel);
    this.roleService = new dataService(roleModel);
  }
  
}

export default Helper;