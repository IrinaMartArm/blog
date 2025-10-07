import { HttpStatus, REFRESH_TOKEN_LIFE } from '../../core';
import { Response } from 'express';

type TokensType = {
  accessToken: string;
  refreshToken: string;
  deviceId: string;
};

export const sendTokens = (res: Response, tokens: TokensType) => {
  const { accessToken, refreshToken, deviceId } = tokens;

  res.cookie('refreshToken', refreshToken, {
    httpOnly: true,
    secure: true,
    sameSite: 'strict', //чтобы токен не утекал на другие сайты
    maxAge: 20 * 1000, //чтобы кука жила столько же, сколько refreshToken
  });
  res.status(HttpStatus.Ok).json({ accessToken, deviceId });
};
