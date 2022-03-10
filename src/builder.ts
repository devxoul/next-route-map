import directoryTree from 'directory-tree'
import * as fs from 'fs'
import * as path from 'path'
import ts from 'typescript'

import { createLogger, Logger, StandardLogger } from './logging'

export type BuilderOptions = {
  /** A Next.js project directory. Defaults to cwd. */
  baseDir?: string,

  /** A directory to generate pages. */
  pagesDir: string,

  /**
   * A route map for url paths and page file paths.
   *
   * @example
   * {
   *   '/': './src/home/HomePage.tsx',
   *   '/users/[username]': './src/users/UserPage.tsx',
   * }
   */
   routes: { [path: string]: string },

  /**
   * Paths to preserve on clean.
   *
   * @example
   * ['/ping.ts', '/404.tsx']
   * */
  preservePaths?: string[],

  /**
   * A logger.
   *
   * @example
   * console
   * */
  logger?: StandardLogger,
}

export class RouteMapBuilder {
  private baseDir: string
  private pagesDir: string
  private routes: { [path: string]: string }
  private preservePaths: string[]
  private logger: Logger

  constructor(options: BuilderOptions) {
    this.baseDir = options.baseDir ?? process.cwd()
    this.pagesDir = path.join(this.baseDir, options.pagesDir)
    this.routes = options.routes
    this.preservePaths = options.preservePaths ?? []
    this.logger = createLogger(options.logger)
  }

  async build() {
    this.cleanPagesDir()
    this.createForwardingModules()
  }

  private cleanPagesDir() {
    const tree = directoryTree(this.pagesDir)
    const pathsToDelete = new Set(this.flattenTree(tree))

    this.preservePaths?.forEach(relativePath => {
      const absolutePath = path.resolve(path.join(this.pagesDir, relativePath))
      const isDirectory = fs.lstatSync(absolutePath).isDirectory()
      if (!isDirectory) {
        pathsToDelete.delete(absolutePath)
      } else {
        pathsToDelete.forEach(p => {
          if (p.startsWith(absolutePath)) {
            pathsToDelete.delete(p)
          }
        })
      }
    })

    pathsToDelete.forEach(filePath => {
      if (fs.lstatSync(filePath).isDirectory()) {
        fs.rmdirSync(filePath)
      } else {
        fs.unlinkSync(filePath)
      }

      const dir = path.dirname(filePath)
      const isDirEmpty = fs.readdirSync(dir).length === 0
      if (isDirEmpty) {
        fs.rmdirSync(dir)
      }
    })

    this.logger.trace(`cleaned pages directory`)
  }

  private flattenTree(tree: directoryTree.DirectoryTree): string[] {
    if (tree.children?.length ?? 0 > 0) {
      return tree.children?.map(child => this.flattenTree(child)).flat() ?? []
    } else {
      return [tree.path]
    }
  }

  private async createForwardingModules() {
    const tasks = Object.entries(this.routes).map(([urlPath, filePath]) => {
      this.createForwardingModule({ urlPath, filePath })
    })
    await Promise.all(tasks)
  }

  private async createForwardingModule(entry: { urlPath: string, filePath: string }) {
    const filePath = path.join(this.baseDir, entry.filePath)
    const content = fs.readFileSync(filePath, 'utf-8')
    const ast = ts.createSourceFile(filePath, content, ts.ScriptTarget.Latest)
    const exportMembers = this.getExportMembersThatMatters(ast)
    if (!exportMembers) {
      return
    }

    const forwardingModulePath = path.join(this.pagesDir, entry.urlPath, 'index.ts')
    const forwardingModuleDir = path.dirname(forwardingModulePath)
    const originalModulePath = this.getRelativeModulePath(forwardingModuleDir, filePath)

    const forwardingModuleContent = `export { ${exportMembers.join(', ')} } from '${originalModulePath}'\n`
    fs.mkdirSync(forwardingModuleDir, { recursive: true })
    fs.writeFileSync(forwardingModulePath, forwardingModuleContent, 'utf-8')

    this.logger.info(`created page module for ${entry.urlPath}`)
  }

  private getExportMembersThatMatters(ast: ts.SourceFile): string[] {
    const isExportedMember = (statement: ts.Statement): boolean => {
      return statement.modifiers?.find(modifier => modifier.kind === ts.SyntaxKind.ExportKeyword) !== undefined
    }
  
    const allExportedMembers = ast.statements.flatMap((statement) => {
      if (!isExportedMember(statement)) {
        return []
      }
  
      if (ts.isFunctionDeclaration(statement)) {
        const name = statement.name?.getText(ast)
        return name ? [name] : []
      }

      if (ts.isVariableStatement(statement)) {
        return statement.declarationList.declarations.flatMap(decl => (
          ts.isVariableDeclaration(decl) ? [decl.name.getText(ast)] : []
        ))
      }
  
      return []
    })
  
    const allowlist = new Set(['getStaticProps', 'getStaticPaths', 'getServerSideProps'])
    const exportedMembers = allExportedMembers.filter(member => allowlist.has(member))
    return ['default', ...exportedMembers]
  }
  
  private getRelativeModulePath(pagesDir: string, filePath: string) {
    return path.relative(pagesDir, filePath).replace(/\.tsx?$/, '')
  }
}
