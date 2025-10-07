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
import { RefreshTokenDbModel } from '../types/authDbModel';
import { ACCESS_TOKEN_LIFE, REFRESH_TOKEN_LIFE } from '../../core';
import {
  handleBadRequestResult,
  handleForbiddenResult,
  handleNoContentResult,
  handleNotFoundResult,
  handleSuccessResult,
  handleUnauthorizedResult,
} from '../../core/resultCode/result-code';
import { tokensQueryRepository } from '../repositories/tokensQuery.repository';

class AuthService {
  async login(
    loginOrEmail: string,
    password: string,
    title: string,
    ip: string,
  ) {
    const user = await usersRepository.findUserByLoginOrEmail(loginOrEmail);
    if (!user) return handleUnauthorizedResult();

    const isValid = await passwordHasher.compare(password, user.passwordHash);
    if (!isValid)
      return handleBadRequestResult([
        { message: 'password not found', field: 'password' },
      ]);

    const userId = user._id.toString();
    const deviceId = randomUUID();
    const accessToken = jwtService.createToken(userId, ACCESS_TOKEN_LIFE);
    const jti = randomUUID();
    const { token: refreshToken } = jwtService.createRefreshToken(
      userId,
      deviceId,
      jti,
      REFRESH_TOKEN_LIFE,
    );

    const payload = jwtService.verifyToken<{ exp: number; deviceId: string }>(
      refreshToken,
    );
    const expiresAt = payload?.exp ? new Date(payload.exp * 1000) : new Date();

    await tokensRepository.saveToken({
      userId,
      deviceId,
      issuedAt: new Date(),
      expiresAt: new Date(expiresAt),
      title,
      jti,
      ip,
    });

    return handleSuccessResult({ accessToken, refreshToken, deviceId });
  }

  async refreshToken(payload: RefreshTokenDbModel) {
    const jti = randomUUID();
    const { token: refreshToken } = jwtService.createRefreshToken(
      payload.userId,
      payload.deviceId,
      jti,
      REFRESH_TOKEN_LIFE,
    );

    const tokenPayload = jwtService.verifyToken<{ exp: number }>(refreshToken);
    const expiresAt = tokenPayload?.exp
      ? new Date(tokenPayload.exp * 1000)
      : new Date();

    const updated = await tokensRepository.updateRToken(
      payload.userId,
      payload.deviceId,
      payload.jti,
      jti,
      expiresAt,
    );

    if (!updated) return handleUnauthorizedResult();

    const accessToken = jwtService.createToken(
      payload.userId,
      ACCESS_TOKEN_LIFE,
    );

    return handleSuccessResult({
      accessToken,
      refreshToken,
      deviceId: payload.deviceId,
    });
  }

  async logout(payload: RefreshTokenDbModel) {
    const deleted = await tokensRepository.deleteToken(
      payload.userId,
      payload.deviceId,
      payload.jti,
    );

    if (!deleted) {
      return handleUnauthorizedResult();
    }

    return handleNoContentResult(null);
  }

  async registration(dto: RegistrationInputDto) {
    const existingByEmail = await usersRepository.findUserByLoginOrEmail(
      dto.email,
    );
    if (existingByEmail)
      return handleBadRequestResult([
        { message: 'email exists', field: 'email' },
      ]);

    const existingByLogin = await usersRepository.findUserByLoginOrEmail(
      dto.login,
    );
    if (existingByLogin)
      return handleBadRequestResult([
        { message: 'login exists', field: 'login' },
      ]);

    const passwordHash = await passwordHasher.hash(dto.password);

    const confirmationCode = randomUUID();

    const newUser = {
      _id: new ObjectId(),
      email: dto.email,
      passwordHash,
      login: dto.login,
      createdAt: new Date().toISOString(),
      emailConfirmation: {
        confirmationCode,
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
        isConfirmed: false,
      },
    };
    await usersRepository.createUser(newUser);

    try {
      nodemailerService.sendEmail(
        newUser.email,
        confirmationCode,
        emailExamples.registrationEmail,
      );
    } catch (e: unknown) {
      console.error('Send email error', e);
      // await usersRepository.deleteUser(userId);
      return handleBadRequestResult([
        { message: 'Something went wrong', field: '' },
      ]);
    }
    return handleNoContentResult(null);
  }

  async confirmation(dto: { code: string }) {
    const user = await usersRepository.findByConfirmationCode(dto.code);

    if (
      !user ||
      !user.emailConfirmation ||
      user.emailConfirmation.isConfirmed ||
      !user.emailConfirmation.expirationDate ||
      user.emailConfirmation.expirationDate < new Date()
    )
      return handleBadRequestResult([
        { message: 'bad request', field: 'code' },
      ]);

    await usersRepository.updateUser(user._id, {
      emailConfirmation: {
        ...user.emailConfirmation,
        isConfirmed: true,
        confirmationCode: null,
        expirationDate: null,
      },
    });

    return handleNoContentResult(null);
  }

  async resending(dto: { email: string }) {
    const user = await usersRepository.findUserByLoginOrEmail(dto.email);

    if (!user) {
      return handleBadRequestResult([
        { message: 'User not found', field: 'email' },
      ]);
    }

    if (user.emailConfirmation?.isConfirmed) {
      return handleBadRequestResult([
        { message: 'Email already confirmed', field: 'email' },
      ]);
    }

    const newCode = randomUUID();

    await usersRepository.updateUser(user._id, {
      emailConfirmation: {
        ...user.emailConfirmation,
        confirmationCode: newCode,
        expirationDate: add(new Date(), {
          hours: 1,
          minutes: 30,
        }),
      },
    });

    try {
      await nodemailerService.sendEmail(
        dto.email,
        newCode,
        emailExamples.registrationEmail,
      );
    } catch (e: unknown) {
      console.error('Send email error', e);
      return handleBadRequestResult([
        { message: 'something went wrong', field: 'email' },
      ]);
    }
    return handleNoContentResult(null);
  }

  async deleteOtherDevices(userId: string, deviceId: string) {
    const sessions = await tokensQueryRepository.findSessions(userId);

    console.log('sessions', sessions);

    if (!sessions) {
      return handleNoContentResult(null);
    }

    await tokensRepository.deleteAllOtherSessions(userId, deviceId);

    return handleNoContentResult(null);
  }

  async deleteDeviceById(userId: string, deviceId: string) {
    const session = await tokensQueryRepository.findTokenByDeviceId(deviceId);

    if (!session) return handleNotFoundResult();

    if (session.userId !== userId) return handleForbiddenResult();

    const result = await tokensRepository.deleteToken(
      userId,
      deviceId,
      session.jti,
    );

    if (!result) return handleNotFoundResult();

    return handleNoContentResult(null);
  }
}

export const authService = new AuthService();
