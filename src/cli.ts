#!/usr/bin/env node

import process from 'process'

import { RouteMapBuilder } from './'
import { getConfig } from './config'

const main = async () => {
  const config = getConfig(process.argv[2])
  const builder = new RouteMapBuilder(config)
  await builder.build()
}

main()
