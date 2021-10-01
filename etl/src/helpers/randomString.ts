import { randomBytes } from 'crypto';

export function randomString(length = 16): string {
  return randomBytes(length).toString('hex').substr(0, length);
}
