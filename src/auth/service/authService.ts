import { passwordHasher } from '../../utils/passwordHasher';
import { usersRepository } from '../../users/repositories/users.repositiry';
import { jwtService } from '../applications/jwtService';
import { RegistrationInputDto } from '../types/inputDto';
import { randomUUID } from 'node:crypto';
import { nodemailerService } from './nodemailerService';
import { emailExamples } from '../applications/emailExamples';
import { ObjectId } from 'mongodb';
import { add } from 'date-fns';

export const authService = {
  async login(loginOrEmail: string, password: string) {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) return null;

    const isValid = await passwordHasher.compare(password, user.passwordHash);
    if (!isValid) return null;

    return jwtService.createToken(user._id.toString());
  },

  async registration(dto: RegistrationInputDto) {
    const existingByEmail = await usersRepository.findUserByLoginOrEmail(
      dto.email,
    );
    if (existingByEmail) return 'emailExists';

    const existingByLogin = await usersRepository.findUserByLoginOrEmail(
      dto.login,
    );
    if (existingByLogin) return 'loginExists';

    const passwordHash = await passwordHasher.hash(dto.password);

    const newUser = {
      _id: new ObjectId(),
      email: dto.email,
      passwordHash,
      login: dto.login,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode: randomUUID(),
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
    };
    await usersRepository.createUser(newUser);

    try {
      await nodemailerService.sendEmail(
        newUser.email,
        newUser.emailConfirmation.confirmationCode,
        emailExamples.registrationEmail,
      );
    } catch (e: unknown) {
      console.error('Send email error', e);
      // await usersRepository.deleteUser(userId);
      return null;
    }
    return true;
  },

  async confirmation(dto: string) {
    const user = await usersRepository.findByConfirmationCode(dto);
    if (!user) return false;

    if (!user.emailConfirmation || user.emailConfirmation.isConfirmed) {
      return false;
    }

    if (
      !user.emailConfirmation.expirationDate ||
      user.emailConfirmation.expirationDate < new Date()
    ) {
      return false;
    }

    user.emailConfirmation.isConfirmed = true;
    user.emailConfirmation.confirmationCode = null;
    user.emailConfirmation.expirationDate = null;

    await usersRepository.updateUser(user._id, {
      emailConfirmation: user.emailConfirmation,
    });

    return true;
  },

  resending: async (dto: string) => {
    const user = await usersRepository.findUserByLoginOrEmail(dto);
    if (!user) return false;

    const code = user.emailConfirmation.confirmationCode;
    if (!code) return false;

    try {
      await nodemailerService.sendEmail(
        dto,
        code,
        emailExamples.registrationEmail,
      );
    } catch (e: unknown) {
      console.error('Send email error', e);
      return false;
    }
    return true;
  },
};
