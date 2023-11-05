import  type { NextApiRequest,  NextApiResponse } from 'next'
import { z } from 'zod'
import { prisma } from '@/services/prisma'

interface Repo {
  name: string
  description: string
  language: string
  stars: number
  link: string
  fork: boolean
  stargazers_count: number
  html_url: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== 'GET') return

  const querySchema = z.object({
    query: z.object({
      username: z.string(),
    }),
  })

  const { query } = querySchema.parse(req)

  console.log(query)

  try {
    const fetchUser = await fetch(
      `https://api.github.com/users/${query.username}`,
    )
    const fetchRepos = await fetch(
      `https://api.github.com/users/${query.username}/repos`,
    )

    const userComplete = await Promise.all([
      fetchUser.json(),
      fetchRepos.json(),
    ])

    const user = userComplete[0]

    const repos: Repo[] = userComplete[1]

    const reposFiltered = repos.filter((repo) => !repo.fork)

    const reposSorted = reposFiltered.sort((a, b) => {
      return b.stargazers_count - a.stargazers_count
    })

    const reposMapped = reposSorted.map((repo) => {
      return {
        name: repo.name,
        description: repo.description,
        language: repo.language,
        stars: repo.stargazers_count,
        link: repo.html_url,
      }
    })

    const userMapped = {
      name: user.name,
      username: user.login,
      avatar: user.avatar_url,
      followers: user.followers,
      following: user.following,
      bio: user.bio,
      repos: reposMapped,
      email: user.email,
      mostUsedLanguage: reposMapped[0].language,
    }

    const userExists = await prisma.user.findUnique({
      where: {
        username: userMapped.username,
      },
    })

    if (userExists) {
      return res.status(200).json({ message: 'user already exists' })
    }

    if (!userExists) {
      await prisma.user.create({
        data: {
          name: userMapped.name,
          username: userMapped.username,
          avatarUrl: userMapped.avatar,
          followersCount: userMapped.followers,
          followingCount: userMapped.following,
          bio: userMapped.bio,
          email: userMapped.email,
          mostUsedLang: userMapped.mostUsedLanguage,
          repos: {
            create: userMapped.repos,
          },
        },
      })
    }

    return res.status(200).json(userMapped)
  } catch (error) {
    console.log(error) // ---> I want to see what this prints server side, in your terminal
    const message = error instanceof Error ? error.message : 'Unexpected Error'
    return NextApiResponse.json({ message }, { status: 500 })
  }
}
