import { GetStaticPaths, GetStaticProps } from 'next'

type Article = {
  title: string,
}

type Props = {
  article: Article,
}

export default function ArticlePage({ article }: Props) {
  return (
    <h1>{article.title}</h1>
  )
}

const articles: { [slug: string]: Article } = {
  'next-12': { title: 'Next.js 12' },
  'next-11-1': { title: 'Next.js 11.1' },
  'next-11': { title: 'Next.js 11' },
}

type Query = {
  slug: string,
}

export const getStaticPaths: GetStaticPaths<Query> = () => {
  return {
    paths: Object.keys(articles).map(slug => ({
      params: {
        slug,
      }
    })),
    fallback: 'blocking',
  }
}

export const getStaticProps: GetStaticProps<Props, Query> = async ({ params }) => {
  const article = articles[params.slug]
  if (!article) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      article,
    }
  }
}
