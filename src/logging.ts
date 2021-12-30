import chalk from 'chalk'

const prefixes: { [level in keyof Logger]: string } = {
  error: chalk.red('error') + ' -',
  warn: chalk.yellow('warn') + '  -',
  info: chalk.cyan('info') + '  -',
  trace: chalk.magenta('trace') + ' -',
}

export type StandardLogger = {
  error: (message?: any, ...optionalParams: any[]) => void,
  warn: (message?: any, ...optionalParams: any[]) => void,
  info: (message?: any, ...optionalParams: any[]) => void,
  debug: (message?: any, ...optionalParams: any[]) => void,
  log: (message?: any, ...optionalParams: any[]) => void,
}

export type Logger = {
  error: (...message: string[]) => void,
  warn: (...message: string[]) => void,
  info: (...message: string[]) => void,
  trace: (...message: string[]) => void,
}

export const createLogger = (logger: StandardLogger | undefined): Logger => {
  return {
    error: (...message: string[]) => logger?.error(prefixes.error, ...message),
    warn: (...message: string[]) => logger?.warn(prefixes.warn, ...message),
    info: (...message: string[]) => logger?.log(prefixes.info, ...message),
    trace: (...message: string[]) => logger?.log(prefixes.trace, ...message),
  }
}
