import dataService from '../services/databaseFactoryServices';
import userModel from '../models/user.model';
import roleModel from '../models/roles.model';
import deviceModel from '../models/devices.model';
import rolePolicyModel from '../models/rolePolicy.model';
import modulesModel from '../models/modules.model';

import constants from '../config/constants';
import { config } from '../config/config';
import request from './request.helper';

class Helper extends request{
  
  config = config;
  constants = constants;

  userService: dataService;
  roleService: dataService;
  deviceService: dataService;
  moduleService: dataService;
  rolePolicyService: dataService;
    
  constructor () {
    super();
    this.userService = new dataService(userModel);
    this.roleService = new dataService(roleModel);
    this.deviceService = new dataService(deviceModel);
    this.moduleService = new dataService(modulesModel);
    this.rolePolicyService = new dataService(rolePolicyModel);
  }
  
}

export default Helper;