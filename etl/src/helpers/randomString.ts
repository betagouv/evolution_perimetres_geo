import { randomBytes } from "crypto";

export function randomString(length: number = 16): string {
    return randomBytes(length).toString('hex').substr(0, length);
}