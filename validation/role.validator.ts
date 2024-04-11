import Joi from 'joi';
import constants from '../config/constants';

export const createRoleValidator = Joi.object({
  roleName: Joi.string().required(),
  permissions: Joi.array()
    .items({
      permissionName: Joi.string().allow(...constants.ROLE_FEATURES).required(),
      create: Joi.boolean().required(),
      update: Joi.boolean().required(),
      remove: Joi.boolean().required(),
      view: Joi.boolean().required(),
    })
    .required(),
});

export const updateRoleValidator = Joi.object({
  roleName: Joi.string(),
  permissions: Joi.array()
    .items({
      permissionName: Joi.string().allow(...constants.ROLE_FEATURES).required(),
      create: Joi.boolean().required(),
      update: Joi.boolean().required(),
      remove: Joi.boolean().required(),
      view: Joi.boolean().required(),
    }),
  roleId: Joi.string().required(),
  status: Joi.string().optional(),
});