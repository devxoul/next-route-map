# next-route-map 🚏

[![npm version](https://badge.fury.io/js/next-route-map.svg)](https://www.npmjs.com/package/next-route-map)
[![CI](https://github.com/devxoul/next-route-map/workflows/CI/badge.svg)](https://github.com/devxoul/next-route-map/actions/workflows/ci.yml)

next-route-map allows you to define a route map. It automatically generates page modules that forward original modules in build time. **Focus on domain, not foldering.**

<img src="https://user-images.githubusercontent.com/931655/147760569-f030eab9-0ed1-4dbf-b548-c81985b3246a.png" alt="cover">

## At a Glance

**Before 🤔**

A name of each page module represents an url path.

```
pages/
  index.tsx
  products/
    index.tsx
    [id].tsx
  orders/
    index.tsx
    [id].tsx
```

**After 😊**

A name of each page module represents what exactly it is.

```
home/
  HomePage.tsx
products/
  ProductListPage.tsx
  ProductDetailPage.tsx
orders/
  OrderListPage.tsx
  OrderDetailPage.tsx

pages/ (auto generated)
```

## Getting Started

Add webpack configuration to your **`next.config.js`**.

For example:

```js
const RouteMapPlugin = require('next-route-map')

module.exports = {
  webpack(config) {
    config.plugins.push(new RouteMapPlugin({
      pagesDir: './pages',
      routes: {
        '/': './src/home/HomePage.tsx',
        '/products': './src/products/ProductListPage.tsx',
        '/products/[id]': './src/products/ProductDetailPage.tsx',
        '/orders': './src/orders/OrderListPage.tsx',
        '/orders/[id]': './src/orders/OrderDetailPage.tsx',
        '/404': './src/errors/404.tsx',
      },
      preservePaths: [
        '_app.tsx',
        '_document.tsx',
      ],
      logger: console,
    }))
    return config
  }
}
```

Then the plugin will generate the proper page modules on `$ next build` or `$ next dev`.

* `./pages/index.ts`
* `./pages/products/index.ts`
* `./pages/products/[id].ts`
* `./pages/orders/index.ts`
* `./pages/orders/[id].ts`
* `./pages/404.ts`

It is safe to add the pages directory to **`.gitignore`**.

```gitignore
/pages/*
!/pages/_app.tsx
!/pages/_document.tsx
```

## Options

#### baseDir

A Next.js project directory. Use this option if your Next.js application is located in somewhere else. Defaults to `cwd`.

#### pagesDir

A directory to generate pages. This value may be `./pages` or `./src/pages`.

#### routes

A route map for url paths and page file paths.

For example:

```js
{
  '/': './src/home/HomePage.tsx',
  '/products': './src/products/ProductListPage.tsx',
  '/products/[id]': './src/products/ProductDetailPage.tsx',
  '/orders': './src/orders/OrderListPage.tsx',
  '/orders/[id]': './src/orders/OrderDetailPage.tsx',
  '/404': './src/errors/404.tsx',
}
```

#### preservePaths

Paths to preserve on clean. Use this option if there is a non-forwarding module in the pages directory. The paths are relative to pages directory.

For example:

```js
['_app.tsx', '_document.tsx']
```

Note that this option does not guarantee that the path is not ignored from `.gitignore`. If you makde the pages directory be ignored, you need to explicitly add a rule.

```diff
  # next.js
  /pages/*
+ !/pages/_app.tsx
+ !/pages/_document.tsx
```

#### logger

If you want log build output, use `console`.

## Installation

* Using [**Yarn**](https://yarnpkg.com/):
    ```console
    $ yarn add next-route-map --dev
    ```
* Using [**npm**](https://www.npmjs.com/):
    ```console
    $ npm install next-route-map --save-dev
    ```

## License

react-route-map is under MIT license. See the [LICENSE] file for more info.
