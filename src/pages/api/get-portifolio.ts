import type { NextApiRequest, NextApiResponse } from 'next'
import { z } from 'zod'
import { prisma } from '@/services/prisma'
import { NextResponse } from 'next/server'
import error from 'next/error'

export async function getData(username: string) {
  try {
    const user = await prisma.user.findUnique({
      where: {
        username,
      },
    })

    if (!user) {
      return {
        notFound: true,
      }
    }

    const repos = await prisma.repo.findMany({
      where: {
        userUsername: user.username,
      },
    })

    const reposSorted = repos.sort((a, b) => {
      return b.stars - a.stars
    })

    const userMapped = {
      name: user.name,
      username: user.username,
      avatar: user.avatarUrl,
      followers: user.followersCount,
      following: user.followingCount,
      bio: user.bio,
      email: user.email,
      mostUsedLanguage: user.mostUsedLang,
      repos: reposSorted,
    }

    return userMapped
  } catch (error) {
    console.log(error) // ---> I want to see what this prints server side, in your terminal
    const message = error instanceof Error ? error.message : 'Unexpected Error'
    return NextResponse.json({ message }, { status: 500 })
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const querySchema = z.object({
    query: z.object({
      username: z.string(),
    }),
  })

  const { query } = querySchema.parse(req)

  if (req.method !== 'GET') return

  if (!query.username) {
    return res.status(400).json({ message: 'Missing username' })
  }

  const user = await getData(query.username)

  res.setHeader('Cache-Control', 's-maxage=2300, stale-while-revalidate') // 38 minutes

  return res.status(200).json(user)
}
