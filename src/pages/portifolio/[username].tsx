import { GetServerSideProps } from 'next'
import { z } from 'zod'
import { getData } from '../api/get-portifolio'
import dynamic from 'next/dynamic'
import successfully from '../../../public/animations/successfully.json'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'

const Lottie = dynamic(() => import('lottie-react'), { ssr: false })

interface Repos {
  id: number
  name: string
  description: string
  language: string
  stars: number
  forks: number
  link: string
}

interface PortfolioPageParams {
  name: string
  username: string
  avatar: string
  followers: number
  following: number
  repos: Repos[]
  bio: string
  email: string
  mostUsedLanguage: string
}

interface PortfolioPageProps {
  portfolio: PortfolioPageParams
}

export default function PortfolioPage({ portfolio }: PortfolioPageProps) {
  const [hasAnimationPlayed, setHasAnimationPlayed] = useState(true)

  const searchParams = useSearchParams()

  const newCreated = searchParams.get('newCreated')

  console.log(portfolio)

  return (
    <>
      {hasAnimationPlayed && newCreated && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <Lottie
            animationData={successfully}
            loop={false}
            className="w-full h-full"
            onComplete={() => setHasAnimationPlayed(false)}
          />
        </div>
      )}
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
        <h1 className="text-center text-2xl mb-4">My Projects</h1>

        <section className="grid grid-cols md:grid-cols-2 gap-4">
          {portfolio.repos.map((repo) => (
            <div key={repo.id} className="w-full">
              <div className="flex flex-col gap-2 p-4 border border-gray-800 hover:border-gray-600 rounded-md  min-h-[10rem]">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-2">
                    <span className="text-xl font-bold">{repo.name}</span>
                    <span className="text-xs text-gray-500">
                      {repo.language}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-500">
                      {repo.stars} stars
                    </span>
                    <span className="text-xs text-gray-500">
                      {repo.forks ?? 0} forks
                    </span>
                  </div>
                </div>
                <p className="text-sm">{repo.description}</p>

                <div className="flex items-center justify-between mt-auto">
                  <a
                    href={repo.link}
                    className="text-xs text-gray-500 px-5 py-2 border border-gray-800 rounded"
                  >
                    View on Github
                  </a>
                </div>
              </div>
            </div>
          ))}
        </section>
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

  const data = await getData(username)

  if (!data) {
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
