import bcrypt from 'bcrypt';
import { hashingSalt } from '@src/config';

export const passwordHash = async (password: string) => {
  return await bcrypt.hash(password, Number(hashingSalt));
};

export const passwordCompare = async (password: string, hash: string) => {
  return await bcrypt.compare(password, hash);
};