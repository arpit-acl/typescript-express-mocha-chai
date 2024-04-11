import { Request, Response } from 'express';
import dataService from '../services/databaseFactoryServices';
import RoleModel from './role.model';
import { Types } from 'mongoose';
import response from '../helpers/request.helper';
import constants from '../config/constants';

class Role {
  roleService: dataService;
  constructor() {
    this.roleService = new dataService(RoleModel);
  }

  CreateRole = async (req: Request, res: Response) => {
    const { roleName, permissions } = req.body;
    const roleDetails = await this.roleService.insertDataFactory({
      roleName,
      permissions,
      createdBy: new Types.ObjectId(req._user._id)
    });


    return response.helper(res, true, 'ROLE_CREATED', roleDetails, constants.RESPONSE_STATUS.SUCCESS);
  };

  UpdateRole = async (req: Request, res: Response) => {
    const { roleName, roleId, permissions, status } = req.body;
    const roleData = await this.roleService.find(roleName, 'roleName');
    if(roleData && String(roleId) != String(roleData._id)) {
      return response.helper(res, false, 'ROLE_EXIST_WITH_SAME_NAME', {}, constants.RESPONSE_STATUS.BAD_REQUEST);
    }
    const updatedRole = await this.roleService.updateDataFactory(
      { _id: roleId },
      { roleName, permissions, status },
      [],
      ''
    );
    if (!updatedRole) {
      return response.helper(res, false, 'ROLE_NOT_FOUND', {}, constants.RESPONSE_STATUS.BAD_REQUEST);
    }

    return response.helper(res, true, 'ROLE_UPDATED', updatedRole, constants.RESPONSE_STATUS.SUCCESS);
  };

  RoleDetails = async (req: Request, res: Response) => {
    const { roleId } = req.params;
    const details = await this.roleService.find(roleId);
    return response.helper(res, true, 'ROLE_DETAILS', details, constants.RESPONSE_STATUS.SUCCESS);
  };

  RoleList = async (req: any, res: Response) => {
    const query = [];
    const projection = {
      roleName: 1,
      createdAt: 1,
      permissions: 1,
      'adminDetails.name': 1,
      'roleCount': 1
    };
    query.push(...this.roleService.lookupService('admins', 'createdBy', '_id', [], 'adminDetails'));
    query.push(this.roleService.lookupService('admins', '_id', 'roleId', [{ $count: 'string' }], 'roleCount')[0]);
    const data = await DatatableQuery({
      model: RoleModel,
      matchObj: { status: true },
      reqQuery: req.query,
      searchField: ['adminDetails.name', 'roleName'],
      projection,
      extraQuery: query
    });
    return res.send(data);
  };

  DeleteRole = async (req: Request, res: Response) => {
    const { roleId } = req.params;
    const data = await this.roleService.updateDataFactory(
      { _id: roleId },
      { status: false },
      [],
      ''
    );
    if (!data) return response.helper(res, false, 'ROLE_NOT_FOUND', {}, constants.RESPONSE_STATUS.BAD_REQUEST);

    return response.helper(res, true, 'ROLE_DELETED', data, constants.RESPONSE_STATUS.SUCCESS);
  };
}

export default new Role();
