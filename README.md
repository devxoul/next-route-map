# next-route-map 🚏

[![npm version](https://badge.fury.io/js/next-route-map.svg)](https://www.npmjs.com/package/next-route-map)
[![CI](https://github.com/devxoul/next-route-map/workflows/CI/badge.svg)](https://github.com/devxoul/next-route-map/actions/workflows/ci.yml)

next-route-map allows you to define a route map. It automatically generates page modules that forward original modules in build time. **Focus on domain, not foldering.**

<img src="https://user-images.githubusercontent.com/931655/147760569-f030eab9-0ed1-4dbf-b548-c81985b3246a.png" alt="cover">

## Background

[Next.js](https://nextjs.org/) provides a consistent way to structure and organize pages. It is very intuitive and easy to use. However, when it comes to a larger application with many business domains, the file system based routing can cause several problems.

First, since it is strongly coupled to the file system, a file name can only represent a piece of url path rather than what it actually does. The larger application becomes the file names should be easier to understand. For example, `DashboardPage.tsx` is much easier to understand than `pages/index.tsx`. `UserSearchPage.tsx` is better than `pages/users.tsx`.

Second, `pages/` directory can only contain page modules so you have to place related modules such as components and hooks in other directory. It means that your project will have two directory trees: one starting from `pages/` and the other starting from `src/`. Same domain files are better to be in the same folder. For example, the second one is more organized that the first one.

```
pages/
  products/
    [id].tsx
products/
  components/
    Thumbnail.tsx
```

```
products/
  ProductDetailPage.tsx
  components/
    Thumbnail.tsx
```

## At a glance

With **next-route-map** you can separate the page modules from routing. It automatically generates page modules from routing file.

**Before 🤔**

```
pages/
  index.tsx
  products/
    index.tsx
    [id].tsx
  orders/
    index.tsx
    [id].tsx
products/
  components/
    Thumbnail.tsx
orders/
  hooks/
    usePlaceOrder.ts
```

**After 😊**

```
home/
  HomePage.tsx
products/
  ProductListPage.tsx
  ProductDetailPage.tsx
  components/
    Thumbnail.tsx
orders/
  OrderListPage.tsx
  OrderDetailPage.tsx
  hooks/
    usePlaceOrder.tsx

(auto generated)
pages/
  index.tsx --> home/HomePage.tsx
  products/
    index.tsx --> products/ProductListPage.tsx
    [id].tsx --> products/ProductDetailPage.tsx
  orders/
    index.tsx --> orders/OrderListPage.tsx
    [id].tsx --> orders/OrderDetailPage.tsx
```

## How it works

**next-route-map** finds all page modules from the project and creates corresponding forwarding modules in the page directory. The forwarding modules look like:

```ts
export { default } from '../src/products/ProductDetailPage'
```

When the page module contains magic functions like `getStaticProps` or `getServerSideProps` it will automatically export them as well.

```ts
export { default, getServerSideProps } from '../src/products/ProductDetailPage'
```

## Getting started

1. Add **`routes.config.js`** file to your project. See the [Options](#options) for detail API usage.

    ```js
    module.exports = {
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
    }
    ```

2. Add `next-route-map` command to your **`package.json`**.

    ```diff
      "scripts": {
    -   "dev": "next dev",
    -   "build": "next build",
    +   "dev": "next-route-map && next dev",
    +   "build": "next-route-map && next build",
        "start": "next start",
        "lint": "next lint"
      },
    ```

3. Then the plugin will generate the proper page modules on `$ yarn build` or `$ yarn dev`.

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
