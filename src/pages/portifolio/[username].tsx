import { GetServerSideProps } from 'next'
import { z } from 'zod'
import { getData } from '../api/get-portifolio'
import dynamic from 'next/dynamic'
import successfully from '../../../public/animations/successfully.json'
import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { CardProject } from '../../components/CardProject'
import { Card } from '@/components/card'

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
  company: string
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
        <h1 className="text-center text-2xl mb-4">
          Hello, {"I'm "}
          {portfolio.name} 👋
        </h1>
        <h2 className="text-center text-gray-500 text-sm mb-4">
          My name is {portfolio.name}, {"I'm"} a {portfolio.bio} and {"I'm"}
          currently working at {portfolio.company}
        </h2>

        <div className="flex flex-col gap-4">
          <p>{"It's my side projects, I hope you enjoy it!"}</p>

          <section className="w-full">
            <Card repos={portfolio.repos} />
          </section>
        </div>
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
