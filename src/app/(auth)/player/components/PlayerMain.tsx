import Image from "next/image"

type PlayerMainProps = {
  character: {
    avatar: string
    character_name: string
    race: string
    class: string
  }
}

export default function PlayerMain({ character }: PlayerMainProps) {
  return (
    <div className="flex items-center px-5 py-5">
      <div className="w-28 h-28 rounded-lg overflow-hidden border border-alt shadow-lg">
        <Image
          src={character.avatar}
          alt={character.character_name}
          width={112}
          height={112}
          className="object-cover w-full h-full"
        />
      </div>
      <div>
        <div className="rounded-r-lg bg-dark-hover px-6 py-2 border-b border-t border-r border-alt">
          <h2 className="text-4xl font-extrabold text-center text-light tracking-wide drop-shadow-lg">
            {character.character_name}
          </h2>
        </div>
        <div className="mt-3 flex justify-center gap-2 flex-wrap">
          <span className="px-2 py-0.5 text-xs uppercase tracking-wide rounded bg-dark-hover border border-alt text-text-alt">
            {character.race}
          </span>
          <span className="px-2 py-0.5 text-xs uppercase tracking-wide rounded bg-dark-hover border border-alt text-text-alt">
            {character.class}
          </span>
        </div>
      </div>
    </div>
  )
}
