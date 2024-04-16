import { Request, Response, response } from 'express';
import { Types } from 'mongoose';
import serviceHelper from '../helpers/service.helper';
class Role extends serviceHelper{

  create = async (req: Request, res: Response) => {
    const { name, policies,  } = req.body;
    const roleDetails = await this.roleService.insertDataFactory({
      name, policies,
      createdBy: new Types.ObjectId(req._user?._id)
    });
    return this.success(res, 'ROLE_CREATED', roleDetails);
  };

  update = async (req: Request, res: Response) => {
    const { name, policies, status, roleId } = req.body;
    const roleData = await this.roleService.find(name, 'roleName');
    if(roleData && String(roleId) != String(roleData._id)) {
        return this.error(res, 'ROLE_EXIST_WITH_SAME_NAME', {})
    }
    const updatedRole = await this.roleService.updateDataFactory(
      { _id: roleId },
      { name, policies, status },
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
    query.push(this.roleService.aggregationDatatable({}));
    const data = await this.roleService.aggregationQuery(query);
    return this.success(res, 'ROLE_LIST', data);
  };

  remove = async (req: Request, res: Response) => {
    const { roleId } = req.body;
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

export default new Role();