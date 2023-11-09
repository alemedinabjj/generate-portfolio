import { Inter } from 'next/font/google'
import { useRouter } from 'next/router'
import { useState } from 'react'

const inter = Inter({ subsets: ['latin'] })

export default function Home() {
  const [loading, setLoading] = useState(false)
  const [formLoading, setFormLoading] = useState(false)
  const [username, setUsername] = useState('')

  const wellcomeTextSteps = [
    'Hello there,',
    'for generate your portfolio, put your github username',
    'Github Username',
  ]

  const generationSteps = [
    'preparing your portfolio',
    'awaiting for your portfolio',
    'generating your portfolio',
    'your portfolio is ready',
  ]

  const router = useRouter()

  async function generatePortfolio(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!username) return

    setFormLoading(true)

    const response = await fetch(`/api/github-profile?username=${username}`, {
      method: 'GET',
    })

    const data = await response.json()

    setFormLoading(false)

    if (response.status !== 200) return

    if (data.message === 'user already exists') {
      router.push(`/portifolio/${username}`)
      return
    }

    setLoading(true)

    console.log(data)

    await new Promise((resolve) => setTimeout(resolve, 9000))

    setLoading(false)

    router.push(`/portifolio/${username}?newCreated=true`)
  }

  return (
    <main
      className={`flex min-h-screen flex-col items-center justify-between p-24 ${inter.className}`}
    >
      {loading && (
        <div className="fixed inset-0 flex z-10 items-center justify-center bg-black/90 w-full min-h-screen">
          <div className="bg-transparent rounded-md p-8">
            <div className="flex flex-col items-center gap-4">
              {generationSteps.map((text, index) => {
                return (
                  <div
                    className={`generate-portfolio-step-${index + 1}`}
                    key={index}
                  >
                    <span className="text-4xl font-bold text-center">
                      {text}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      )}
      {wellcomeTextSteps && (
        <div className="text-4xl font-bold text-center">
          {wellcomeTextSteps.map((text, index) => {
            if (index !== 2)
              return (
                <>
                  <span key={index} className={`step-${index}`}>
                    {text}
                  </span>
                </>
              )

            if (index === 2) {
              return (
                <form
                  key={index}
                  className="step-2 flex flex-col items-center gap-2 max-w-xs w-full"
                  onSubmit={generatePortfolio}
                >
                  <fieldset disabled={formLoading}>
                    <label htmlFor="github" className={`step-${index}`}>
                      {text}
                    </label>

                    <input
                      className="w-full border rounded-md px-2 py-2 text-sm bg-transparent border-green-500 outline-green-500 focus:outline-none focus:shadow-sm focus:shadow-green-500"
                      type="text"
                      name="github"
                      id="github"
                      placeholder="Github Username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    <button
                      type="submit"
                      className="w-full border border-green-500 rounded-md px-4 py-2 text-sm hover:bg-transparent hover:text-green-500 bg-green-500 text-white transition duration-300"
                    >
                      {formLoading ? (
                        <div className="flex items-center justify-center gap-2">
                          <svg
                            className="animate-spin w-4 h-4"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8"
                            ></path>
                          </svg>
                          <span>Generating</span>
                        </div>
                      ) : (
                        'Generate'
                      )}
                    </button>
                  </fieldset>
                </form>
              )
            }
          })}
        </div>
      )}
    </main>
  )
}
