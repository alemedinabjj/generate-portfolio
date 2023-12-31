// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const user = await fetch('https://api.github.com/users/alemedinabjj')

  const data = await user.json()

  res.status(200).json({ user: data })
}
