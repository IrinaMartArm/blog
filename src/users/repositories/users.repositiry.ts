import { usersCollection } from '../../db/mongo.db';
import { UserDbModel } from '../types/modelDb';
import { ObjectId } from 'mongodb';

export class UsersRepository {
  async createUser(user: UserDbModel): Promise<string> {
    const insertResult = await usersCollection.insertOne(user);
    return insertResult.insertedId.toString();
  }

  async findUserByLoginOrEmail(
    loginOrEmail: string,
  ): Promise<UserDbModel | null> {
    const user = await usersCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    return user ?? null;
  }

  async findByConfirmationCode(code: string): Promise<UserDbModel | null> {
    const user = await usersCollection.findOne({
      'emailConfirmation.confirmationCode': code,
    });
    return user ?? null;
  }

  async deleteUser(id: string): Promise<void> {
    await usersCollection.deleteOne({ _id: new ObjectId(id) });
  }

  async updateUser(
    userId: ObjectId,
    updateData: Partial<UserDbModel>,
  ): Promise<void> {
    await usersCollection.updateOne({ _id: userId }, { $set: updateData });
  }
}
