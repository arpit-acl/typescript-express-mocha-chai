import { Document, ObjectId, Schema, model } from 'mongoose';
import constants from '../config/constants';

interface DevicesDoc {
  name: string;
  category: string;
  deviceModel : string;
  uuid: string;
  status: Boolean;
}

const collectionSchema = new Schema<DevicesDoc>({
  name: { type: String, required: true },
  category: { type: String, required: true },
  deviceModel: { type: String, required: true },
  uuid: { type: String, required: true },
  status: { type: Boolean, default: true },
}, {
  timestamps: true,
  versionKey: false,
  collection: constants.MODELS.DEVICES
});

const RoleModel = model<DevicesDoc>(constants.MODELS.DEVICES, collectionSchema);
export default RoleModel;
