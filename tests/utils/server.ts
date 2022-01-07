import fetch from 'cross-fetch'
import execa from 'execa'
import waitOn from 'wait-on'

export type Server = {
  fetch: typeof _fetch,
  stop: () => void,
}

export type RunServerOptions = {
  environment: 'dev' | 'prod',
  routesCliPath: string,
  nextDir: string,
  healthCheckHost?: string,
  healthCheckPort?: number,
  healthCheckPath?: string,
  waitInterval?: number,
  waitTimout?: number,
  verbose?: boolean,
}

export const runServer = ({
  environment,
  routesCliPath,
  nextDir,
  healthCheckHost = 'localhost',
  healthCheckPort = 3000,
  healthCheckPath = '/',
  waitInterval = 1000,
  waitTimout = 5000,
  verbose: isVerbose = process.argv.includes('--verbose'),
}: RunServerOptions): Promise<Server> => {
  return new Promise(async (resolve, reject) => {
    const routesCommand = `yarn node ${routesCliPath} ${nextDir}/routes.config.js`
    const command = environment == 'dev'
      ? `$SHELL -c "${routesCommand} && yarn next dev ${nextDir}"`
      : `$SHELL -c "${routesCommand} && yarn next build ${nextDir} && yarn next start ${nextDir}"`
    const server = execa(command, undefined, {
      shell: true,
      stdio: isVerbose ? 'inherit' : undefined,
    })
    server.addListener('close', () => {
      reject('Server closed unexpectedly')
    })

    if (!healthCheckPath.startsWith('/')) {
      healthCheckPath = `/${healthCheckPath}`
    }

    await waitOn({
      resources: [`http://${healthCheckHost}:${healthCheckPort}${healthCheckPath}`],
      interval: waitInterval,
      timeout: waitTimout,
      verbose: isVerbose,
      log: isVerbose,
      validateStatus: status => 200 <= status && status < 400,
    }).catch((error) => {
      server.kill()
      reject(error)
    })

    resolve({
      fetch: (input, init) => {
        const request = getFetchRequest(input, healthCheckHost, healthCheckPort)
        return fetch(request, init)
      },
      stop: () => {
        server.removeAllListeners()
        server.kill()
      },
    })
  })
}

const getFetchRequest = (input: RequestInfo, host: string, port: number): RequestInfo => {
  if (typeof input !== 'string') {
    return input
  }

  if (input.startsWith('http://') || input.startsWith('https://')) {
    return input
  }

  const path = input
  return `http://${host}:${port}${path}`
}
