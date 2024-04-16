import { Request, Response } from 'express';
import { error, info } from '../config/logger';
import serviceHelper from '../helpers/service.helper';

class moduleController extends serviceHelper {


    // Authentication Functions start

    list = async (req: Request, res: Response) => {
        try {
            const skipLimitQuery = this.moduleService.aggregationDatatable({});
            const list = await this.moduleService.aggregationQuery([skipLimitQuery]);
            return this.success(res, 'MODULE_LIST', list);
        } catch (err: any) {
            return this.error(res, err.message, {});
        }
    };
}
export default new moduleController();
