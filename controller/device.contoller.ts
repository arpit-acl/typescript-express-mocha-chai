import { Request, Response, response } from 'express';
import { Types } from 'mongoose';
import serviceHelper from '../helpers/service.helper';
class Device extends serviceHelper{

  create = async (req: Request, res: Response) : Promise<any> => {
    const { name, category, deviceModel } = req.body;
    const uuid = new Date().getTime();
    const device = await this.deviceService.insertDataFactory({
      name, category, deviceModel, uuid
    });
    return this.success(res, 'DEVICE_CREATED', {device});
  };

  update = async (req: Request, res: Response) => {
    const { policyName, moduleId, create, read, update, remove, status, policyId } = req.body;
    const updatedRole = await this.rolePolicyService.updateDataFactory(
      { _id: policyId },
      { policyName, moduleId, create, read, update, remove, status },
      [],
      ''
    );
    return this.success(res, 'DEVICE_UPDATED', updatedRole);
  };

  details = async (req: Request, res: Response)  : Promise<any>  => {
    const { id: policyId } = req.params;
    const details = await this.rolePolicyService.find(policyId);
    return this.success(res, 'DEVICE_DETAILS', details);
  };

  list = async (req: any, res: Response) : Promise<any> => {
    const query: any[] = [];
    query.push(this.rolePolicyService.aggregationDatatable({}));
    const data = await this.rolePolicyService.aggregationQuery(query);
    return this.success(res, 'DEVICE_LIST', data);
  };

  remove = async (req: Request, res: Response) => {
    const { policyId } = req.body;
    const data = await this.rolePolicyService.updateDataFactory(
      { _id: policyId },
      { status: false },
    );
    if (!data) return this.error(res, 'DEVICE_NOT_FOUND', {})
    return this.success(res, 'DEVICE_DELETED', data);
  };
}

export default new Device();