import { Request, Response } from 'express';
import Cms from '../components/cms/cms.model';
import dataService from '../services/databaseFactoryServices';
import constants from '../config/constants';
import response from '../helpers/request.helper';
import { info } from '../config/logger';
import messages from '../config/messages';

const {
  RESPONSE_STATUS: {
    BAD_REQUEST,
  }
} = constants;

class cmsController {
  cmsDataFactory: dataService;
  constructor() {
    this.cmsDataFactory = new dataService(Cms);
  }

  
  /**
   * This is cms create function to create cms data
   * @param req Http Request
   * @param res Http Response
   * @returns {token: String}
   */
  create = async (req: Request, res: Response) => {
    try {
      const { cmsType, description, language } = req.body;
      const cmsData = await this.cmsDataFactory.getSingleData({ cmsType, language } , [], '');
      if (cmsData) {
        return response.helper(res, false, 'CMS_ALREADY_EXIST', {}, BAD_REQUEST);
      }
      await this.cmsDataFactory.insertDataFactory({cmsType, description, language, createdBy: req._user._id});        
      return response.helper(
        res,
        true,
        'CMS_CREATED',
        {},
        constants.RESPONSE_STATUS.SUCCESS
      );
    } catch (err) {
      response.helper(
        res,
        false,
        'SOMETHING_WENT_WRONG',
        {},
        constants.RESPONSE_STATUS.SERVER_ERROR
      );
    }
  };

  /**
   * This is cms update function to update cms data
   * @param req Http Request
   * @param res Http Response
   * @returns {otp: Number}
   */
  update = async (req: Request, res: Response) => {
    info('Inside update cms');
    try {
      const { cmsId, cmsType, description, language } = req.body;
      const cms = await this.cmsDataFactory.find(cmsId);
      if (!cms) {
        await this.cmsDataFactory.insertDataFactory({cmsType, description, language, createdBy: req._user._id});        
        return response.helper(res, true, 'CMS_UPDATED', {}, constants.RESPONSE_STATUS.SUCCESS);
      }
      await this.cmsDataFactory.updateDataFactory({ _id: cmsId }, { cmsType, description, language }, [], '', true);
    
      return response.helper(res, true, 'CMS_UPDATED', {}, constants.RESPONSE_STATUS.SUCCESS);
    } catch (err:any) {
      response.helper(
        res,
        false,
        err.toString(),
        {},
        constants.RESPONSE_STATUS.SERVER_ERROR
      );
    }
  };

  delete = async (req: Request, res: Response) => {
    info('Inside get cms');
    try {
      const data = await this.cmsDataFactory.getDataFactory({});
      if (!data)
        return response.helper(
          res,
          false,
          messages.en.USER_NOT_FOUND,
          {},
          constants.RESPONSE_STATUS.BAD_REQUEST
        );
      return response.helper(res, true, 'CMS_DETAILS', data ,constants.RESPONSE_STATUS.SUCCESS);
    } catch (err) {
      response.helper(
        res,
        false,
        '',
        {},
        constants.RESPONSE_STATUS.SERVER_ERROR
      );
    }
  };

  details = async (req: Request, res: Response) => {
    info('Inside get cms details');
    try {
      const {language,cmsType} = req.query;
      if(!language || !cmsType){
        return response.helper(res, false, 'PROVIDE_VALID_DETAILS', {}, BAD_REQUEST);
      } 
      const cmsDetails = await this.cmsDataFactory.getDetails(cmsType, 'cmsType', 'language cmsType description createdBy',Cms);
      res.json(cmsDetails);
    } catch (err) {
      response.helper(
        res,
        false,
        '',
        {},
        constants.RESPONSE_STATUS.SERVER_ERROR
      );
    }
  };
  list = async (req: Request, res: Response) => {
    info('Inside get cms details');
    try {
      const {language,cmsType} = req.query;
      if(!language || !cmsType){
        return response.helper(res, false, 'PROVIDE_VALID_DETAILS', {}, BAD_REQUEST);
      } 
      const cmsDetails = await this.cmsDataFactory.getDetails(cmsType, 'cmsType', 'language cmsType description createdBy',Cms);
      res.json(cmsDetails);
    } catch (err) {
      response.helper(
        res,
        false,
        '',
        {},
        constants.RESPONSE_STATUS.SERVER_ERROR
      );
    }
  };
}
export default new cmsController();
