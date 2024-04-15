import { Request, Response, response } from 'express';
import { Types } from 'mongoose';
import serviceHelper from '../helpers/service.helper';
class Policy extends serviceHelper{

  create = async (req: Request, res: Response) => {
    const { policyName, moduleId, devices, create, read, update, remove } = req.body;
    const roleDetails = await this.roleService.insertDataFactory({
      policyName, moduleId, devices, create, read, update, remove,
      createdBy: new Types.ObjectId(req._user._id)
    });
    return this.success(res, 'ROLE_CREATED', roleDetails);
  };

  update = async (req: Request, res: Response) => {
    const { roleName, roleId, permissions, status } = req.body;
    const roleData = await this.roleService.find(roleName, 'roleName');
    if(roleData && String(roleId) != String(roleData._id)) {
        return this.error(res, 'ROLE_EXIST_WITH_SAME_NAME', {})
    }
    const updatedRole = await this.roleService.updateDataFactory(
      { _id: roleId },
      { roleName, permissions, status },
      [],
      ''
    );
    if (!updatedRole) {
        return this.error(res, 'ROLE_NOT_FOUND', {})
    }
    return this.success(res, 'ROLE_UPDATED', updatedRole);
  };

  details = async (req: Request, res: Response) => {
    const { id: roleId } = req.params;
    const details = await this.roleService.find(roleId);
    return this.success(res, 'ROLE_DETAILS', details);
  };

  list = async (req: any, res: Response) => {
    const query: any[] = [];
    const data = await this.roleService.aggregationQuery(query);
    return res.send(data);
  };

  remove = async (req: Request, res: Response) => {
    const { roleId } = req.params;
    const data = await this.roleService.updateDataFactory(
      { _id: roleId },
      { status: false },
      [],
      ''
    );
    if (!data) return this.error(res, 'ROLE_NOT_FOUND', {})
    return this.success(res, 'ROLE_DELETED', data);
  };
}

export default new Policy();