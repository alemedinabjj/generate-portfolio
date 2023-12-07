export function CardProject({ repo }) {
  return (
    <div key={repo.id} className="w-full">
      <div className="flex flex-col gap-2 p-4 border border-gray-800 hover:border-gray-600 rounded-md  min-h-[10rem]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-2">
            <span className="text-xl font-bold">{repo.name}</span>
            <span className="text-xs text-gray-500">{repo.language}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{repo.stars} stars</span>
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
  )
}
