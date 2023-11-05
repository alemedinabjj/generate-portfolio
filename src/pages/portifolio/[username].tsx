import { GetServerSideProps } from 'next'
import { z } from 'zod'

interface PortfolioPageParams {
  name: string
  username: string
  avatar: string
  followers: number
  following: number
  repos: number
  bio: string
  email: string
  mostUsedLanguage: string
}

interface PortfolioPageProps {
  portfolio: PortfolioPageParams
}

export default function PortfolioPage({ portfolio }: PortfolioPageProps) {
  console.log(portfolio)
  return (
    <>
      <header className="w-full p-4 mx-auto border-b border-gray-800">
        <div className="max-w-[65rem] w-full mx-auto flex items-center justify-between">
          <picture className="flex items-center gap-4">
            <img
              src={portfolio.avatar}
              alt="Avatar"
              className="w-16 h-16 rounded-full"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold">
                {portfolio.name}
                <span className="text-xs ml-2 opacity-50">{portfolio.bio}</span>
              </span>
              <span className="text-gray-500">@{portfolio.username}</span>
            </div>
          </picture>

          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {portfolio.followers}
                </span>
                <span className="text-gray-500">followers</span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-2xl font-bold">
                  {portfolio.following}
                </span>
                <span className="text-gray-500">following</span>
              </div>
            </div>
            <div className="flex items-center gap-2 text-xs">
              <span>Most used Lang:</span>{' '}
              <span className="font-bold">{portfolio.mostUsedLanguage}</span>
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-[65rem] w-full p-4 mx-auto">
        <h1>Portfolio</h1>
      </div>
    </>
  )
}

export const getServerSideProps: GetServerSideProps = async (context) => {
  const schema = z.object({
    username: z.string(),
  })

  const { username } = schema.parse(context.params)

  if (!username) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  const baseUrl = process.env.VERCEL_URL || 'http://localhost:3000'

  const url = new URL('/api/get-portifolio', baseUrl)
  url.searchParams.append('username', 'alemedinabjj')

  const response = await fetch(url.toString())

  const data = await response.json()

  if (response.status !== 200) {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    }
  }

  return {
    props: {
      portfolio: data,
    },
  }
}
