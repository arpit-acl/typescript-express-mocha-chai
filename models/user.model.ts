import { ObjectId, Schema, model } from 'mongoose';
import bcrypt from 'bcrypt';
import constants from '../config/constants';
export interface UserDoc {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  dob: string;
  isDeleted: boolean;
  token: string;
  userType: string;
  isBlocked: boolean;
  confirmPassword(password: string): Promise<boolean>;
  roleId: ObjectId

}

const UserSchema = new Schema<UserDoc>({

  firstName : { type: String, default: '' },
  lastName: { type: String, default: '' },
  userType: { type: String, enum: ['admin', 'user']},
  email: { type: String, unique: true},
  password: { type: String },
  dob: { type: String },
  token: { type: String},
  isDeleted: { type: Boolean, default: false },
  isBlocked: {type: Boolean, default: false},
  roleId: { type: Schema.Types.ObjectId, ref: 'roles'}
}, {
  timestamps: true,
  versionKey: false
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
  const user = this as UserDoc;
  return bcrypt.compare(password, user.password);
};
const User = model<UserDoc>(constants.MODELS.USER, UserSchema);
export default User;