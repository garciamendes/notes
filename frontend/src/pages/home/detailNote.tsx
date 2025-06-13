import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export const DetailNote = () => {

  // if (empyt) {
  //   return (
  //     <div className="flex flex-1 flex-col">
  //       <div className="flex flex-col items-center gap-4">
  //         <EmptyIcon size={32} />
  //         <span>Seleciona uma nota para ver o detalhe</span>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="flex flex-1 flex-col overflow-auto gap-8 no-scrollbar">
      <div className="flex flex-col">
        <div className="flex w-full justify-between gap-6">
          <strong>
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Voluptatibus repudiandae ea veritatis quis iusto, incidunt recusandae laudantium, optio ipsum deserunt quam qui vitae ad sint aliquid minus laborum autem provident!
          </strong>

          <div className="flex self-start gap-3">
            <button>Editar</button>
            <button>Deletar</button>
          </div>
        </div>

        <span className="text-base mt-2 text-gray-300">
          {formatDistanceToNow(new Date(), { locale: ptBR, addSuffix: true })}
        </span>
      </div>

      <div className="flex">
        <p>
          Lorem ipsum dolor, sit amet consectetur adipisicing elit. Sunt, ipsa hic corporis optio odio repudiandae dicta minus nam, voluptas dolorum omnis tempore earum ab minima, asperiores quas fugiat numquam dolores.
        </p>
      </div>
    </div>
  )
}