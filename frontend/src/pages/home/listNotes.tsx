/* eslint-disable react-refresh/only-export-components */
import { ListIcon, MagnifyingGlassIcon, SignOutIcon, XIcon } from "@phosphor-icons/react"
import { Input } from "../../components/input"
import { formatDistanceToNow } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { useState } from "react"
import { useSearchParams } from "react-router-dom"

export enum SidePopupEnum {
  PROFILE = 'profile',
  LIST_NOTES = 'list_notes'
}

export enum ParamsEnum {
  SEARCH = 'search',
  ACTIVE_NOTE = 'active_note'
}

export const ListNotes = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [params, setParams] = useState<Map<ParamsEnum, string>>(() => {
    const params = new Map()

    searchParams.forEach(([key, value]) => {
      params.set(key, value || '')
    })

    return params
  })
  const [sidePopup, setSidePopup] = useState<Map<SidePopupEnum, boolean>>(() => {
    const state = new Map()
    Object.values(SidePopupEnum).forEach(key => {
      if (!state.get(key))
        state.set(key, false)
    })

    return state
  })

  const handleSidePopup = (key: SidePopupEnum) => {
    setSidePopup(prevState => {
      const newState = new Map(prevState)
      const currentKeyState = newState.get(key) || false
      newState.set(key, !currentKeyState)
      return newState
    })
  }

  const handleActiveNote = (id: number) => {
    setParams(prevState => {
      const newState = new Map(prevState)
      newState.set(ParamsEnum.ACTIVE_NOTE, String(id))
      return newState
    })

    setSearchParams(prevSearchParams => {
      prevSearchParams.set(ParamsEnum.ACTIVE_NOTE, params.get(ParamsEnum.ACTIVE_NOTE)!)
      return prevSearchParams
    })
  }

  return (
    <>
      <div
        className="absolute bottom-3 bg-neutral-700 w-[80px] p-2 -left-7 rounded-r-xl justify-end flex translate-x-0 lg:-translate-x-full items-center transition-all duration-500 z-50">
        {sidePopup.get(SidePopupEnum.LIST_NOTES) ? (
          <XIcon className="cursor-pointer" onClick={() => handleSidePopup(SidePopupEnum.LIST_NOTES)} size={30} />
        ) : (
          <ListIcon className="cursor-pointer" size={30} onClick={() => handleSidePopup(SidePopupEnum.LIST_NOTES)} />
        )}
      </div>

      <div
        data-open={sidePopup.get(SidePopupEnum.LIST_NOTES)}
        className="fixed lg:relative bg-neutral-900 inset-0 overflow-hidden flex flex-col h-full data-[open=false]:-translate-x-[1200px] lg:data-[open=false]:translate-x-0 transition-all duration-300 gap-3 w-full lg:w-1/3 p-3 lg:border-r lg:border-neutral-700 z-40">

        <div className="relative flex w-full justify-between items-center">
          <strong className="text-2xl">Matheus</strong>
        </div>

        <div className="flex w-full gap-2 justify-between items-center">
          <div className="flex-1">
            <Input
              placeholder="Busque pelo nome"
              value={params.get(ParamsEnum.SEARCH)}
              onChange={event => setParams(prevState => {
                const newState = new Map(prevState)
                newState.set(ParamsEnum.SEARCH, event.target.value)
                return newState
              })}
              iconButton={
                <MagnifyingGlassIcon
                  size={27}
                  onClick={() => setSearchParams(prevSearchParams => {
                    prevSearchParams.set(ParamsEnum.SEARCH, params.get(ParamsEnum.SEARCH)!)
                    return prevSearchParams
                  })} />
              } />
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-auto no-scrollbar">
          {Array.from({ length: 200 }).map((_, index) => {
            const fullTitle = `Nome ${index + 1}`
            const title = fullTitle.length > 60 ? fullTitle.slice(0, 60).concat('...') : fullTitle

            return (
              <div
                data-active={params.get(ParamsEnum.ACTIVE_NOTE) === String(index)}
                onClick={() => handleActiveNote(index)}
                className="cursor-pointer flex items-center justify-between py-3 px-1.5 not-last:border-b not-last:border-neutral-700 data-[active=true]:bg-neutral-500/70 hover:bg-neutral-500/70 duration-300 transition-all">
                <strong title={fullTitle}>{title}</strong>

                <span className="text-base text-gray-300">
                  {formatDistanceToNow(new Date(), { locale: ptBR, addSuffix: true })}
                </span>
              </div>
            )
          })}
        </div>

        <div className="flex flex-col gap-6">
          <button className="flex cursor-pointer items-center justify-center gap-3">
            <SignOutIcon size={25} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </>
  )
}