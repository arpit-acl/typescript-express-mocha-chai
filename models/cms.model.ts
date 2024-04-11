import { Document, Schema, model } from 'mongoose';
import constants from '../config/constants';

interface I_RoleDocument extends Document {
  roleName : string;
  permissions: Array<any>;
  createdBy: Schema.Types.ObjectId;
  status: boolean;
}

const collectionSchema = new Schema<I_RoleDocument>({

  roleName : { type: String },
  permissions: [
    {
      permissionName: {
        type: String,
        default: '',
        enum: constants.ROLE_FEATURES
      },
      create: {
        type: Boolean,
        default: false,
        require: true,
      },
      update: {
        type: Boolean,
        default: false,
        required: true,
      },
      remove: {
        type: Boolean,
        default: false,
        required: true
      },
      view: {
        type: Boolean,
        default: false,
        required: true
      },    
    }
  ],
  createdBy: { type: Schema.Types.ObjectId, ref: constants.MODELS.ADMIN },
  status: { type: Boolean, default: true },

}, {
  timestamps: true,
  versionKey: false
});

const RoleModel = model<I_RoleDocument>(constants.MODELS.ROLES, collectionSchema);
export default RoleModel;
