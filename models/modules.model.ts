import { Document, ObjectId, Schema, model } from 'mongoose';
import constants from '../config/constants';

interface ModuleDoc {
  name: string;
  status: Boolean;
}

const collectionSchema = new Schema<ModuleDoc>({
  name: { type: String, required: true },
  status: { type: Boolean, default: true },
}, {
  timestamps: true,
  versionKey: false,
  collection: constants.MODELS.MODULES
});

const ModulesModel = model<ModuleDoc>(constants.MODELS.MODULES, collectionSchema);
export default ModulesModel;
