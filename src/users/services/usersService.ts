import { UserRequestDto } from '../types/userInputDto';
import { usersRepository } from '../repositories/users.repositiry';
import { ObjectId } from 'mongodb';
import { LoginRequestDto } from '../../auth/types/inputDto';
import bcrypt from 'bcrypt';
import { passwordHasher } from '../../utils/passwordHasher';

export const usersService = {
  async createUser(dto: UserRequestDto): Promise<string> {
    const passwordHash = await passwordHasher.hash(dto.password);

    const newUser = {
      _id: new ObjectId(),
      login: dto.login,
      email: dto.email,
      passwordHash,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: null,
        expirationDate: null,
        isConfirmed: true,
      },
    };

    const existingUserByLogin = await usersRepository.findUserByLoginOrEmail(
      dto.login,
    );
    if (existingUserByLogin) {
      throw new Error('Login already exists');
    }

    const existingUserByEmail = await usersRepository.findUserByLoginOrEmail(
      dto.email,
    );
    if (existingUserByEmail) {
      throw new Error('Email already exists');
    }

    return await usersRepository.createUser(newUser);
  },

  checkCredentials: async (dto: LoginRequestDto): Promise<boolean> => {
    const user = await usersRepository.findUserByLoginOrEmail(dto.loginOrEmail);
    if (!user) {
      return false;
    }
    return bcrypt.compare(dto.password, user.passwordHash);
  },

  async deleteUser(userId: string): Promise<void> {
    await usersRepository.deleteUser(userId);
  },
};
