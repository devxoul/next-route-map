import { parse } from 'node-html-parser'

import { build } from './utils/build'
import { runServer, Server } from './utils/server'

jest.setTimeout(10000)

let server: Server

beforeAll(async () => {
  await build()
  server = await runServer({
    nextDir: './tests/integration',
    healthCheckPath: '/ping',
  })
})

afterAll(() => {
  server.stop()
})

describe('page forwarding', () => {
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
})
