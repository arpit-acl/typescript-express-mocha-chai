export default {
  DEFAULT_LOG_DIR: 'logs',
  LOG_TYPE: ['error', 'webhook', 'warning', 'cron', 'info', 'debug'],
  RESPONSE_STATUS: {
    SUCCESS: 200,
    BAD_REQUEST: 400,
    SERVER_ERROR: 500,
    NOT_FOUND: 404,
    UNAUTHORIZED: 401,
  },
  MODELS: {
    ROLES: 'roles',
    ROLES_POLICY: 'roles_policies',
    MODULES: 'modules',
    DEVICES: 'devices',
    USER: 'users',
  },
  ROLE_FEATURES:[
    'role_management',
    'admin_management',
    'content_management',
    'user_management',
  ],
  APPLICATION_AUTH_NAME: 'Express Typescript Demo Project',
  DATE_VALIDATION_REGEX: /^(0[1-9]|[12][0-9]|3[01])[- /.](0[1-9]|1[012])[- /.](19|20)\d\d$/,
  USER_ROLES:{
    USER: 'user',
    ADMIN: 'admin',
  },
  EMAIL:{
  },
};
