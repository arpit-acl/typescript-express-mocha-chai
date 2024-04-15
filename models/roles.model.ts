import { Document, ObjectId, Schema, model } from 'mongoose';
import constants from '../config/constants';

interface RoleDoc  {
  roleName : string;
  rolePolicies: Array<ObjectId>;
  createdBy: ObjectId;
  updatedBy: ObjectId;
  status: boolean;
}

const collectionSchema = new Schema<RoleDoc>({

  roleName : { type: String },
  rolePolicies: [ Schema.Types.ObjectId ],
  createdBy: { type: Schema.Types.ObjectId, ref: constants.MODELS.USER },
  updatedBy: { type: Schema.Types.ObjectId, ref: constants.MODELS.USER},
  status: { type: Boolean, default: true },

}, {
  timestamps: true,
  versionKey: false,
  collection: constants.MODELS.ROLES
});

const RoleModel = model<RoleDoc>(constants.MODELS.ROLES, collectionSchema);
export default RoleModel;
