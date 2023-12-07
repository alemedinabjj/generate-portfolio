import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  Card as UiCard,
} from '@/components/ui/card'
import { AvatarImage, AvatarFallback, Avatar } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

interface Repos {
  id: number
  name: string
  description: string
  language: string
  stars: number
  forks: number
  link: string
}

export function Card({ repos }: { repos: Repos[] }) {
  return (
    <UiCard className="p-4 rounded shadow-lg">
      <CardHeader>
        <CardTitle className="text-lg font-bold">Side Projects</CardTitle>
        <CardDescription className="text-gray-500 text-sm">
          Here are some of my side projects. Explore them!
        </CardDescription>
      </CardHeader>
      <div className="grid grid-cols-2 gap-4">
        {repos?.map((repo, index) => (
          <CardContent className="space-y-4 bg-gray-900 p-4" key={index}>
            <div className="flex items-center space-x-3">
              <Avatar>
                <AvatarImage
                  alt="Project 1"
                  src={`https://picsum.photos/seed/${index}/200/200`}
                />
                <AvatarFallback>P{index + 1}</AvatarFallback>
              </Avatar>
              <div className="space-y-1">
                <h2 className="text-sm font-bold">
                  <Link className="text-blue-500" href={repo.link}>
                    {repo.name}
                  </Link>
                </h2>
                <p className="text-sm text-gray-500">{repo.description}</p>
                <div className="flex items-center space-x-2">
                  <Badge>{repo.language}</Badge>
                </div>
                <Button variant="outline" className="mt-auto">
                  <Link className="text-blue-500" href={repo.link}>
                    Learn More
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        ))}
      </div>
    </UiCard>
  )
}
