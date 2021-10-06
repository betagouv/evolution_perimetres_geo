import createConsole from 'console-log-level';
import { console } from '../config';

export function getConsole() {
    return createConsole(console as any);
}