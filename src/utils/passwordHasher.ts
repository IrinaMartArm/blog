import bcrypt from 'bcrypt';

export const passwordHasher = {
  async hash(password: string) {
    return bcrypt.hash(password, 10);
  },
  async compare(password: string, hash: string) {
    return bcrypt.compare(password, hash);
  },
};
