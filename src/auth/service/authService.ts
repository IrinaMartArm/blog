import { passwordHasher } from '../../utils/passwordHasher';
import { jwtService } from './jwtService';
import { RegistrationInputDto } from '../types/inputDto';
import { randomUUID } from 'node:crypto';
import { NodemailerService } from './nodemailerService';
import { emailExamples } from '../utils/emailExamples';
import { add } from 'date-fns';
import { TokensRepository } from '../repositories/tokens.repository';
import { RefreshTokenDb } from '../types/authDbModel';
import { ACCESS_TOKEN_LIFE, REFRESH_TOKEN_LIFE } from '../../core';
import {
  handleBadRequestResult,
  handleForbiddenResult,
  handleNoContentResult,
  handleNotFoundResult,
  handleSuccessResult,
  handleUnauthorizedResult,
} from '../../core/resultCode/result-code';
import { UserDbModel } from '../../users/types/modelDb';
import { UsersRepository } from '../../users/repositories/users.repository';
import { injectable } from 'inversify';
import { RefreshTokenModel } from '../entity/token';

@injectable()
export class AuthService {
  constructor(
    private usersRepository: UsersRepository,
    private tokensRepository: TokensRepository,
    private nodemailerService: NodemailerService,
  ) {}

  async login(
    loginOrEmail: string,
    password: string,
    title: string,
    ip: string,
  ) {
    const user =
      await this.usersRepository.findUserByLoginOrEmail(loginOrEmail);

    if (!user || user.isPasswordRecoveryActive)
      return handleUnauthorizedResult();

    const isValid = await passwordHasher.compare(password, user.passwordHash);
    if (!isValid) return handleUnauthorizedResult();

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

    const token = RefreshTokenModel.createToken({
      userId,
      deviceId,
      issuedAt: new Date(),
      expiresAt: new Date(expiresAt),
      title,
      jti,
      ip,
    });
    await this.tokensRepository.saveToken(token);

    return handleSuccessResult({ accessToken, refreshToken, deviceId });
  }

  async refreshToken(payload: RefreshTokenDb) {
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

    const token = await this.tokensRepository.getTokenDoc(
      payload.userId,
      payload.deviceId,
      payload.jti,
    );

    if (!token) return handleUnauthorizedResult();

    token.jti = jti;
    token.expiresAt = expiresAt;
    token.issuedAt = new Date();
    await this.tokensRepository.saveToken(token);

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

  async logout(payload: RefreshTokenDb) {
    const deleted = await this.tokensRepository.deleteToken(
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
    const existingByEmail = await this.usersRepository.findUserByLoginOrEmail(
      dto.email,
    );
    if (existingByEmail)
      return handleBadRequestResult([
        { message: 'email exists', field: 'email' },
      ]);

    const existingByLogin = await this.usersRepository.findUserByLoginOrEmail(
      dto.login,
    );
    if (existingByLogin)
      return handleBadRequestResult([
        { message: 'login exists', field: 'login' },
      ]);

    const passwordHash = await passwordHasher.hash(dto.password);

    const newUser = new UserDbModel(dto.login, dto.email, passwordHash);

    await this.usersRepository.createUser(newUser);

    try {
      await this.nodemailerService.sendEmail(
        newUser.email,
        newUser.emailConfirmation.confirmationCode!,
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
    const user = await this.usersRepository.findByConfirmationCode(dto.code);

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

    await this.usersRepository.updateUser(user._id, {
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
    const user = await this.usersRepository.findUserByLoginOrEmail(dto.email);

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

    await this.sendEmailConfirmation(
      user,
      dto.email,
      emailExamples.registrationEmail,
      false,
    );

    return handleNoContentResult(null);
  }

  async deleteOtherDevices(userId: string, deviceId: string) {
    const sessions = await this.tokensRepository.getTokensByUserId(userId);

    if (!sessions) {
      return handleNoContentResult(null);
    }

    await this.tokensRepository.deleteAllOtherSessions(userId, deviceId);

    return handleNoContentResult(null);
  }

  async deleteDeviceById(userId: string, deviceId: string) {
    const session = await this.tokensRepository.findTokenByDeviceId(deviceId);

    if (!session) return handleNotFoundResult();

    if (session.userId !== userId) return handleForbiddenResult();

    const result = await this.tokensRepository.deleteToken(
      userId,
      deviceId,
      session.jti,
    );

    if (!result) return handleNotFoundResult();

    return handleNoContentResult(null);
  }

  async passwordRecovery(dto: { email: string }) {
    const user = await this.usersRepository.findUserByLoginOrEmail(dto.email);

    if (user) {
      await this.sendEmailConfirmation(
        user,
        dto.email,
        emailExamples.passwordRecoveryEmail,
        true,
      );
    }

    return handleNoContentResult(null);
  }

  async newPassword(dto: { newPassword: string; recoveryCode: string }) {
    const user = await this.usersRepository.findByConfirmationCode(
      dto.recoveryCode,
    );

    if (
      !user ||
      !user.emailConfirmation?.confirmationCode ||
      user.emailConfirmation.confirmationCode !== dto.recoveryCode ||
      !user.emailConfirmation.expirationDate ||
      user.emailConfirmation.expirationDate < new Date()
    )
      return handleBadRequestResult([
        { message: 'bad request', field: 'recoveryCode' },
      ]);

    const passwordHash = await passwordHasher.hash(dto.newPassword);

    await this.usersRepository.updateUser(user._id, {
      passwordHash,
      isPasswordRecoveryActive: false,
      emailConfirmation: {
        ...user.emailConfirmation,
        confirmationCode: null,
        expirationDate: null,
      },
    });

    return handleNoContentResult(null);
  }

  private async sendEmailConfirmation(
    user: UserDbModel,
    email: string,
    template: (code: string) => string,
    isPasswordRecoveryActive: boolean,
  ) {
    const newCode = randomUUID();

    await this.usersRepository.updateUser(user._id, {
      emailConfirmation: {
        ...user.emailConfirmation,
        confirmationCode: newCode,
        expirationDate: add(new Date(), { hours: 1, minutes: 30 }),
      },
      isPasswordRecoveryActive,
    });

    try {
      await this.nodemailerService.sendEmail(email, newCode, template);
    } catch (e: unknown) {
      console.error('Send email error', e);
      return handleBadRequestResult([
        { message: 'something went wrong', field: 'email' },
      ]);
    }

    return handleNoContentResult(null);
  }
}
