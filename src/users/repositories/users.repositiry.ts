import { usersCollection } from '../../db/mongo.db';
import { UserDbModel } from '../types/modelDb';
import { ObjectId } from 'mongodb';

export const usersRepository = {
  createUser: async (user: UserDbModel): Promise<string> => {
    const insertResult = await usersCollection.insertOne(user);
    return insertResult.insertedId.toString();
  },

  findUserByLoginOrEmail: async (
    loginOrEmail: string,
  ): Promise<UserDbModel | null> => {
    const user = await usersCollection.findOne({
      $or: [{ email: loginOrEmail }, { login: loginOrEmail }],
    });
    return user ?? null;
  },

  findByConfirmationCode: async (
    confirmationCode: string,
  ): Promise<UserDbModel | null> => {
    const user = await usersCollection.findOne({ confirmationCode });
    return user ?? null;
  },

  deleteUser: async (id: string): Promise<void> => {
    await usersCollection.deleteOne({ _id: new ObjectId(id) });
  },

  updateUser: async (
    userId: ObjectId,
    updateData: Partial<UserDbModel>,
  ): Promise<void> => {
    await usersCollection.updateOne({ _id: userId }, { $set: updateData });
  },
};
