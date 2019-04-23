import { configure, User, getConfig, Model, UserGroup } from 'radiks-shim';

export class PrivateMessage extends Model {
  static className = 'Message';
  static schema = {
    content: {
      type: String
    },
    userGroupId: {
      type: String,
      decrypted: true,
    },
    createdBy: {
      type: String,
    }
  };
}
