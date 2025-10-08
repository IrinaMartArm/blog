import { ObjectId } from 'mongodb';
import { randomUUID } from 'node:crypto';
import { add } from 'date-fns';

export class UserDbModel {
  _id: ObjectId;
  createdAt: string;
  isPasswordRecoveryActive: boolean;
  emailConfirmation: {
    confirmationCode: string | null;
    expirationDate: Date | null;
    isConfirmed: boolean;
  };
  constructor(
    public login: string,
    public email: string,
    public passwordHash: string,
  ) {
    this._id = new ObjectId();
    this.createdAt = new Date().toISOString();
    this.isPasswordRecoveryActive = false;
    this.emailConfirmation = {
      confirmationCode: randomUUID(),
      expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
      isConfirmed: false,
    };
  }
}
