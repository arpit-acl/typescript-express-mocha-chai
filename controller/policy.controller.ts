import { Request, Response, response } from 'express';
import { Types } from 'mongoose';
import serviceHelper from '../helpers/service.helper';
class Policy extends serviceHelper{

  create = async (req: Request, res: Response) => {
    const { policyName, moduleId, devices, create, read, update, remove } = req.body;
    const roleDetails = await this.rolePolicyService.insertDataFactory({
      policyName, moduleId, devices, create, read, update, remove,
      createdBy: new Types.ObjectId(req._user._id)
    });
    return this.success(res, 'POLICY_CREATED', roleDetails);
  };

  update = async (req: Request, res: Response) => {
    const { roleName, policyId, permissions, status } = req.body;
    const updatedRole = await this.rolePolicyService.updateDataFactory(
      { _id: policyId },
      { roleName, permissions, status },
      [],
      ''
    );
    return this.success(res, 'POLICY_UPDATED', updatedRole);
  };

  details = async (req: Request, res: Response) => {
    const { id: policyId } = req.params;
    const details = await this.rolePolicyService.find(policyId);
    return this.success(res, 'POLICY_DETAILS', details);
  };

  list = async (req: any, res: Response) => {
    const query: any[] = [];
    const data = await this.rolePolicyService.aggregationQuery(query);
    return res.send(data);
  };

  remove = async (req: Request, res: Response) => {
    const { policyId } = req.params;
    const data = await this.rolePolicyService.updateDataFactory(
      { _id: policyId },
      { status: false },
      [],
      ''
    );
    if (!data) return this.error(res, 'ROLE_NOT_FOUND', {})
    return this.success(res, 'POLICY_DELETED', data);
  };
}

export default new Policy();