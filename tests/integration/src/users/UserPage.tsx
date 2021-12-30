import { GetServerSideProps } from 'next'

type User = {
  name: string,
}

type Props = {
  user: User,
}

export default function UserPage({ user }: Props) {
  return (
    <h1>Hi, {user.name}!</h1>
  )
}

const users: { [username: string]: User } = {
  steve: { name: 'Steve Jobs' },
  elon: { name: 'Elon Musk' },
  mark: { name: 'Mark Zuckerberg' },
}

type Query = {
  username: string,
}

export const getServerSideProps: GetServerSideProps<Props, Query> = async ({ params }) => {
  const user = users[params.username]
  if (!user) {
    return {
      notFound: true,
    }
  }

  return {
    props: {
      user,
    }
  }
}
