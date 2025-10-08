import { UserRequestDto } from '../types/userInputDto';
import { LoginRequestDto } from '../../auth/types/inputDto';
import bcrypt from 'bcrypt';
import 'reflect-metadata';
import { passwordHasher } from '../../utils/passwordHasher';
import { UsersRepository } from '../repositories/users.repository';
import { UserDbModel } from '../types/modelDb';
import { injectable } from 'inversify';

@injectable()
export class UsersService {
  constructor(private usersRepository: UsersRepository) {}

  async createUser(dto: UserRequestDto): Promise<string> {
    const passwordHash = await passwordHasher.hash(dto.password);

    const newUser = new UserDbModel(dto.login, dto.email, passwordHash);

    const existingUserByLogin =
      await this.usersRepository.findUserByLoginOrEmail(dto.login);
    if (existingUserByLogin) {
      throw new Error('Login already exists');
    }

    const existingUserByEmail =
      await this.usersRepository.findUserByLoginOrEmail(dto.email);
    if (existingUserByEmail) {
      throw new Error('Email already exists');
    }

    return await this.usersRepository.createUser(newUser);
  }

  async checkCredentials(dto: LoginRequestDto): Promise<boolean> {
    const user = await this.usersRepository.findUserByLoginOrEmail(
      dto.loginOrEmail,
    );
    if (!user) {
      return false;
    }
    return bcrypt.compare(dto.password, user.passwordHash);
  }

  async deleteUser(userId: string): Promise<void> {
    await this.usersRepository.deleteUser(userId);
  }
}
