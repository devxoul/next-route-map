module.exports = {
  baseDir: __dirname,
  pagesDir: './src/pages',
  routes: {
    '/': './src/home/HomePage.tsx',
    '/404': './src/errors/404.tsx',
    '/articles/[slug]': './src/articles/ArticlePage.tsx',
    '/users/[username]': './src/users/UserPage.tsx',
  },
  preservePaths: [
    '/ping.ts',
    '/api',
  ],
  logger: console,
}
