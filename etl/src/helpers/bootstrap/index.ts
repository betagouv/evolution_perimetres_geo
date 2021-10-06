import { catchErrors } from './catchErrors';
import { INameToValueMap, interceptConsole } from './interceptConsole';
import { registerGracefulShutdown } from './registerGracefulShutdown';

export function bootstrap(
    customConsole: INameToValueMap = console, 
    closeHandlers: Array<() => Promise<any>> = [],
) {
    interceptConsole(customConsole);
    catchErrors(closeHandlers);
    registerGracefulShutdown(closeHandlers);
}