import { Compiler } from 'webpack'
import { RouteMapBuilder, BuilderOptions } from './builder'
import { getConfig } from './config'

export type PluginOptions = BuilderOptions & {
  config: string,
}

export class RouteMapDevPlugin {
  private builder: RouteMapBuilder

  constructor(options?: PluginOptions) {
    const config = {
      ...this.getSafeConfig(options?.config),
      ...options,
    }
    this.builder = new RouteMapBuilder(config)
  }

  async apply(compiler: Compiler) {
    if (compiler.options.mode !== 'development') {
      return
    }
    if (compiler.options.name !== 'client') {
      return
    }
    compiler.hooks.initialize.tap('RouteMapDevPlugin', () => {
      this.builder.build()
    })
  }

  private getSafeConfig(filename: string | undefined) {
    try {
      return getConfig(filename)
    } catch {
      return {}
    }
  }
}
