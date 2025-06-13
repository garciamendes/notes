import { ListIcon, MagnifyingGlassIcon } from "@phosphor-icons/react"
import { Input } from "../../components/input"
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const ListNotes = () => {
  return (
    <div className="flex flex-col gap-3 w-1/3 px-3 border-r border-neutral-700">
      <div className="flex w-full justify-between items-center">
        <span>Matheus</span>

        <ListIcon size={32} />
      </div>

      <div className="flex w-full gap-2 justify-between items-center">
        <div className="flex-1">
          <Input
            placeholder="Busque pelo nome"
            iconButton={<MagnifyingGlassIcon size={27} />} />
        </div>
      </div>

      <div className="flex flex-col flex-1 overflow-auto no-scrollbar">
        {Array.from({ length: 200 }).map((_, index) => {
          const fullTitle = `Nome ${index + 1}`
          const title = fullTitle.length > 60 ? fullTitle.slice(0, 60).concat('...') : fullTitle

          return (
            <div
              className="cursor-pointer flex items-center justify-between py-3 px-1.5 not-last:border-b not-last:border-neutral-700 first:bg-neutral-500/70 hover:bg-neutral-500/70 duration-300 transition-all">
              <strong title={fullTitle}>{title}</strong>

              <span className="text-base text-gray-300">
                {formatDistanceToNow(new Date(), { locale: ptBR, addSuffix: true })}
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}