import { Document, ObjectId, Schema, model } from 'mongoose';
import constants from '../config/constants';

interface ModuleDoc {
  policyName: string;
  status: Boolean;
}

const collectionSchema = new Schema<ModuleDoc>({
  policyName: { type: String, required: true },
  status: { type: Boolean, default: true },
}, {
  timestamps: true,
  versionKey: false,
  collection: constants.MODELS.ROLES_MODULES
});

const RoleModel = model<ModuleDoc>(constants.MODELS.ROLES_MODULES, collectionSchema);
export default RoleModel;
