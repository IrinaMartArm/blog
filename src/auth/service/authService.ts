import { passwordHasher } from '../../utils/passwordHasher';
import { usersRepository } from '../../users/repositories/users.repositiry';
import { jwtService } from '../applications/jwtService';
import { RegistrationInputDto } from '../types/inputDto';
import { randomUUID } from 'node:crypto';
import { nodemailerService } from './nodemailerService';
import { emailExamples } from '../applications/emailExamples';
import { ObjectId } from 'mongodb';
import { add } from 'date-fns';
import { tokensRepository } from '../repositories/tokens.repository';
import { RefreshToken } from '../types/authDbModel';
import { ACCESS_TOKEN_LIFE, REFRESH_TOKEN_LIFE } from '../../core';
import {
  handleBadRequestResult,
  handleSuccessResult,
} from '../../core/resultCode/result-code';

export const authService = {
  async issueTokens(userId: string, deviceId?: string) {
    const accessToken = jwtService.createToken(userId, ACCESS_TOKEN_LIFE);
    const {
      token: refreshToken,
      jti,
      deviceId: newDeviceId,
    } = jwtService.createRefreshToken(userId, REFRESH_TOKEN_LIFE);

    const payload = jwtService.verifyToken<{ exp: number }>(refreshToken);
    const expiresAt = payload?.exp ? new Date(payload.exp * 1000) : '';

    await tokensRepository.saveToken({
      userId,
      jti,
      deviceId: deviceId ?? newDeviceId,
      expiresAt: new Date(expiresAt),
    });

    return handleSuccessResult({
      accessToken,
      refreshToken,
      deviceId: deviceId ?? newDeviceId,
    });
  },

  async login(loginOrEmail: string, password: string) {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user)
      return handleBadRequestResult([
        { message: 'user not found', field: 'email' },
      ]);

    const isValid = await passwordHasher.compare(password, user.passwordHash);
    if (!isValid)
      return handleBadRequestResult([
        { message: 'password not found', field: 'password' },
      ]);

    return await this.issueTokens(user._id.toString());
  },

  async refreshToken(payload: RefreshToken) {
    const token = await tokensRepository.findToken(
      payload.userId,
      payload.deviceId,
      payload.jti,
    );

    if (!token) return null;
    if (new Date(token.expiresAt) < new Date()) return null;

    await tokensRepository.deleteToken(
      payload.userId,
      payload.deviceId,
      payload.jti,
    );

    return await this.issueTokens(payload.userId, payload.deviceId);
  },

  async logout(payload: RefreshToken) {
    await tokensRepository.deleteToken(
      payload.userId,
      payload.deviceId,
      payload.jti,
    );

    return true;
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
