import mongoose, { Document, ObjectId, Schema, model } from 'mongoose';
import constants from '../config/constants';

interface RolePolicyDoc {
  policyName: string;
  moduleId: ObjectId;
  devices: [ObjectId];
  create: boolean;
  read: boolean;
  update: boolean;
  remove: boolean;
  createdBy: ObjectId;
  updatedBy: ObjectId;
  status: boolean;
}

const collectionSchema = new Schema<RolePolicyDoc>({
  policyName: { type: String, required: true },
  moduleId: { type: mongoose.Types.ObjectId , ref: constants.MODELS.MODULES },
  devices: [mongoose.Types.ObjectId],
  create: { type: Boolean, required: true },
  read: { type: Boolean, required: true },
  update: { type: Boolean, required: true },
  remove: {type: Boolean, required: true},
  createdBy: { type: Schema.Types.ObjectId, ref: constants.MODELS.USER },
  updatedBy: { type: Schema.Types.ObjectId, ref: constants.MODELS.USER },
  status: { type: Boolean, default: true },

}, {
  timestamps: true,
  versionKey: false,
  collection: constants.MODELS.ROLES_POLICY
});

const RolePolicyModel = model<RolePolicyDoc>(constants.MODELS.ROLES_POLICY, collectionSchema);
export default RolePolicyModel;
