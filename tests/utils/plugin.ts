import execa from 'execa'

export type BuildOptions = {
  verbose?: boolean,
}

export const buildPlugin = async (options?: BuildOptions) => {
  const isVerbose = options?.verbose ?? process.argv.includes('--verbose')
  const execaOptions: execa.Options = {
    shell: true,
    stdio: isVerbose ? 'inherit' : undefined,
  }
  await execa('yarn', ['clean'], execaOptions)
  await execa('yarn', ['build'], execaOptions)
}
