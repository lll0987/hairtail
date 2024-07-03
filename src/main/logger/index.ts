/* eslint-disable @typescript-eslint/no-explicit-any */

import log from 'electron-log';

export class Logger {
    private logger: log.LogFunctions;

    constructor(scope: string) {
        this.logger = log.scope(scope);
    }

    error(...params: any[]) {
        this.logger.error(...params);
    }
    warn(...params: any[]) {
        this.logger.warn(...params);
    }
    info(...params: any[]) {
        this.logger.info(...params);
    }
    verbose(...params: any[]) {
        this.logger.verbose(...params);
    }
    debug(...params: any[]) {
        this.logger.debug(...params);
    }
    silly(...params: any[]) {
        this.logger.silly(...params);
    }
    log(...params: any[]) {
        this.logger.log(...params);
    }
}
