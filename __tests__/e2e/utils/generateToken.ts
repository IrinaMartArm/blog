import {
  PASSWORD,
  USERNAME,
} from '../../../src/core/middlewares/validations/auth.middleware';

export const generateBasicAuthToken = () => {
  const credentials = `${USERNAME}:${PASSWORD}`;
  const token = Buffer.from(credentials).toString('base64');
  return `Basic ${token}`;
};
