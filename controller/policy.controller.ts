import { Request, Response, response } from 'express';
import { Types } from 'mongoose';
import serviceHelper from '../helpers/service.helper';
class Policy extends serviceHelper{

  create = async (req: Request, res: Response) : Promise<any> => {
    const { policyName, moduleId, devices, create, read, update, remove } = req.body;
    const roleDetails = await this.rolePolicyService.insertDataFactory({
      policyName, moduleId, devices, create, read, update, remove,
      createdBy: new Types.ObjectId(req._user?._id)
    });
    return this.success(res, 'POLICY_CREATED', roleDetails);
  };

  update = async (req: Request, res: Response) => {
    const { policyName, moduleId, create, read, update, remove, status, policyId } = req.body;
    const updatedRole = await this.rolePolicyService.updateDataFactory(
      { _id: policyId },
      { policyName, moduleId, create, read, update, remove, status },
      [],
      ''
    );
    return this.success(res, 'POLICY_UPDATED', updatedRole);
  };

  details = async (req: Request, res: Response)  : Promise<any>  => {
    const { id: policyId } = req.params;
    const details = await this.rolePolicyService.find(policyId);
    return this.success(res, 'POLICY_DETAILS', details);
  };

  list = async (req: any, res: Response) : Promise<any> => {
    const query: any[] = [];
    query.push(this.rolePolicyService.aggregationDatatable({}));
    const data = await this.rolePolicyService.aggregationQuery(query);
    return this.success(res, 'POLICY_LIST', data);
  };

  remove = async (req: Request, res: Response) => {
    const { policyId } = req.body;
    const data = await this.rolePolicyService.updateDataFactory(
      { _id: policyId },
      { status: false },
    );
    if (!data) return this.error(res, 'POLICY_NOT_FOUND', {})
    return this.success(res, 'POLICY_DELETED', data);
  };
}

export default new Policy();