import { parse } from 'node-html-parser'

import { buildCLI } from './utils/build'
import { runServer, Server } from './utils/server'

const timeoutDev = 10 * 1000
const timeoutProd = 60 * 1000

jest.setTimeout(Math.max(timeoutDev, timeoutProd))

beforeAll(async () => {
  await buildCLI()
})

describe('page forwarding', () => {
  let server: Server

  describe.each(['dev', 'prod'] as const)('in %s environment', (environment) => {
    beforeAll(async () => {
      server = await runServer({
        environment,
        routesCliPath: './build/cli.js',
        nextDir: './tests/integration',
        healthCheckPath: '/ping',
        waitTimout: environment === 'dev' ? timeoutDev : timeoutProd,
      })
    })

    afterAll(() => {
      server.stop()
    })

    it.each([
      ['/', 'Welcome'],
      ['/undefined', 'This is a custom 404 error page'],
      ['/articles/next-12', 'Next.js 12'],
      ['/articles/next-11-1', 'Next.js 11.1'],
      ['/articles/next-11', 'Next.js 11'],
      ['/articles/next-10', 'This is a custom 404 error page'],
      ['/users/steve', 'Hi, Steve Jobs!'],
      ['/users/elon', 'Hi, Elon Musk!'],
      ['/users/mark', 'Hi, Mark Zuckerberg!'],
      ['/users/jack', 'This is a custom 404 error page'],
    ])('generates forwarding page module for %s', async (path, pattern) => {
      const response = await server.fetch(path)
      const text = await response.text()
      const html = parse(text)
      expect(html.rawText).toMatch(pattern)
    })

    it.each([
      ['/ping', 'pong'],
      ['/api/greeting', 'This is a preserved path!'],
    ])('preserves path for %s', async (path, pattern) => {
      const response = await server.fetch(path)
      const text = await response.text()
      const html = parse(text)
      expect(html.rawText).toMatch(pattern)
    })
  })
})
