import { Model, ObjectId, Schema, Types, model } from 'mongoose';
import bcrypt from 'bcrypt';
import constants from '../config/constants';

export interface userProfile {
  _id? : ObjectId;
firstName? : string
lastName? : string
email :string
token? : string
profilePic?: string
createdBy?: ObjectId
}

export interface UserDoc extends userProfile  {
password: string
}


export interface UserDoc {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string;
  isDeleted: boolean;
  token: string;
  superAdmin: ObjectId,
  userType: string;
  isBlocked: boolean;
  confirmPassword(password: string): Promise<boolean>;
  roleId: ObjectId
}

const UserSchema = new Schema<UserDoc>({

  firstName : { type: String, default: '' },
  lastName: { type: String, default: '' },
  userType: { type: String, enum: ['admin', 'user', 'subAdmin']},
  roleId: { type: Types.ObjectId, ref: 'roles' },
  email: { type: String, unique: true},
  password: { type: String },
  dob: { type: String },
  token: { type: String},
  superAdmin: { type: Schema.Types.ObjectId, ref: constants.MODELS.USER },
  isDeleted: { type: Boolean, default: false },
  isBlocked: {type: Boolean, default: false},
}, {
  timestamps: true,
  versionKey: false,
  collection: constants.MODELS.USER
});

UserSchema.pre('save', async function () {
  const user = this as UserDoc;
  if (user.password) {
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(user.password, salt);
    user.password = hash;
  }
});
UserSchema.methods.confirmPassword = async function (password: string) {
  const user = this;
  return bcrypt.compare(password, user.password);
};

const User = model<UserDoc>(constants.MODELS.USER, UserSchema);
export default User;