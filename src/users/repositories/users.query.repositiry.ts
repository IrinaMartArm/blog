import { usersCollection } from '../../db/mongo.db';
import { UserDbModel } from '../types/modelDb';
import { ObjectId } from 'mongodb';
import { UsersQueryInput } from '../types/userInputDto';

export const usersQueryRepository = {
  getAllUsers: async (
    query: UsersQueryInput,
  ): Promise<{ items: UserDbModel[]; totalCount: number }> => {
    const {
      pageNumber,
      pageSize,
      searchEmailTerm,
      searchLoginTerm,
      sortDirection,
      sortBy,
    } = query;

    const skip = (pageNumber - 1) * pageSize;
    const filter: any = {
      $or: [
        { login: { $regex: searchLoginTerm ?? '', $options: 'i' } },
        { email: { $regex: searchEmailTerm ?? '', $options: 'i' } },
      ],
    };

    const items = await usersCollection
      .find(filter)
      .sort({ [sortBy]: sortDirection })
      .skip(skip)
      .limit(pageSize)
      .toArray();

    const totalCount = await usersCollection.countDocuments(filter);

    return { items, totalCount };
  },

  getUserById: async (id: string): Promise<UserDbModel | null> => {
    const user = await usersCollection.findOne({ _id: new ObjectId(id) });
    return user ?? null;
  },
};
