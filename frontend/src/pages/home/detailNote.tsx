import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useNotes } from '../../hooks/useNotes'
import { useSearchParams } from 'react-router-dom';
import { ParamsEnum } from './types';
import { EmptyIcon } from '@phosphor-icons/react';

export const DetailNote = () => {
  const [params,] = useSearchParams();
  const { getNote } = useNotes({ id: params.get(ParamsEnum.ACTIVE_NOTE)! })

  if (!getNote.data && !getNote.isLoading) {
    return (
      <div className="flex flex-1 flex-col">
        <div className="flex flex-col items-center gap-4">
          <EmptyIcon size={32} />
          <span>Seleciona uma nota para ver o detalhe</span>
        </div>
      </div>
    )
  }

  return (
    <div className="relative flex flex-1 h-full w-full flex-col overflow-auto gap-8 no-scrollbar lg:block lg:w-2/3">
      <div className="flex flex-col">
        <div className="relative flex w-full gap-6 overflow-hidden">
          <strong className='flex-1'>{getNote.data?.title || '---'}</strong>
        </div>

        <span className="text-base mt-2 text-gray-300">
          {getNote.data?.created_at && formatDistanceToNow(getNote.data.created_at, { locale: ptBR, addSuffix: true })}
        </span>
      </div>

      <div className="flex mt-5">
        <p>{getNote.data?.content || '---'}</p>
      </div>
    </div>
  )
}