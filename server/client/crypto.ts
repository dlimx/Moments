import bcrypt from 'bcrypt';
import { HASH_SALT_ROUNDS } from '../../constants/constants';

export const hashCrypto = async (password: string) => bcrypt.hash(password, HASH_SALT_ROUNDS);

export const hashCompare = async (password: string, hashedPassword: string) => bcrypt.compare(password, hashedPassword);
