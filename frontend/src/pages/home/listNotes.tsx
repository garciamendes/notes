import {
  ListIcon,
  MagnifyingGlassIcon,
  SignOutIcon,
  XIcon,
} from "@phosphor-icons/react";
import { Input } from "../../components/input";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { useState, useMemo, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import { useUSer } from "../../hooks/useUser";
import { useListNotes } from "../../hooks/useNotes";
import {
  SidePopupEnum,
  ParamsEnum
} from './types'
import { useAuth } from "../../hooks/useAuth";

export const ListNotes = () => {
  const { me } = useUSer();
  const { logout } = useAuth()
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get(ParamsEnum.SEARCH) || '')

  const [params, setParams] = useState(() => {
    const paramMap = new Map();
    for (const [key, value] of searchParams.entries()) {
      paramMap.set(key, value || "");
    }
    return paramMap;
  });

  const [sidePopup, setSidePopup] = useState(() => {
    const state = new Map();
    Object.values(SidePopupEnum).forEach((key) => {
      state.set(key, false);
    });
    return state;
  });

  const { data, fetchNextPage, hasNextPage } = useListNotes({
    search: params.get(ParamsEnum.SEARCH)
  });

  const handleSidePopup = useCallback((key: SidePopupEnum) => {
    setSidePopup((prevState) => {
      const newState = new Map(prevState);
      newState.set(key, !newState.get(key));
      return newState;
    });
  }, []);

  const handleActiveNote = useCallback((id: string) => {
    setParams((prev) => {
      const newParams = new Map(prev);
      newParams.set(ParamsEnum.ACTIVE_NOTE, id);
      return newParams;
    });
    setSearchParams((prev) => {
      prev.set(ParamsEnum.ACTIVE_NOTE, id);
      return prev;
    });
  }, [setSearchParams]);

  const handleSearch = () => {
    setParams((prev) => {
      const newState = new Map(prev);
      newState.set(ParamsEnum.SEARCH, search);
      return newState;
    })

    setSearchParams((prev) => {
      prev.set(ParamsEnum.SEARCH, search);
      return prev;
    });
  }

  const notes = useMemo(() => data?.pages.flatMap((p) => p.notes) ?? [], [data]);

  return (
    <>
      <div className="absolute bottom-3 bg-neutral-700 w-[80px] p-2 -left-7 rounded-r-xl justify-end flex translate-x-0 lg:-translate-x-full items-center transition-all duration-500 z-50">
        {sidePopup.get(SidePopupEnum.LIST_NOTES) ? (
          <XIcon
            className="cursor-pointer"
            onClick={() => handleSidePopup(SidePopupEnum.LIST_NOTES)}
            size={30}
          />
        ) : (
          <ListIcon
            className="cursor-pointer"
            size={30}
            onClick={() => handleSidePopup(SidePopupEnum.LIST_NOTES)}
          />
        )}
      </div>

      <div
        data-open={sidePopup.get(SidePopupEnum.LIST_NOTES)}
        className="fixed lg:relative bg-neutral-900 inset-0 overflow-hidden flex flex-col h-full data-[open=false]:-translate-x-[1200px] lg:data-[open=false]:translate-x-0 transition-all duration-300 gap-3 w-full lg:w-1/3 p-3 lg:border-r lg:border-neutral-700 z-40"
      >
        <div className="relative flex w-full justify-between items-center">
          <strong className="text-2xl">{me.data?.name || "---"}</strong>
        </div>

        <div className="flex w-full gap-2 justify-between items-center">
          <div className="flex-1">
            <Input
              placeholder="Busque pelo nome"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              iconButton={
                <MagnifyingGlassIcon
                  size={27}
                  onClick={handleSearch}
                  role="button"
                  aria-label="Buscar"
                  className="cursor-pointer"
                />
              }
            />
          </div>
        </div>

        <div className="flex flex-col flex-1 overflow-auto no-scrollbar">
          {notes.map((note) => {
            const title =
              note.title.length > 20
                ? note.title.slice(0, 20).concat("...")
                : note.title;
            return (
              <div
                key={note.id}
                data-active={params.get(ParamsEnum.ACTIVE_NOTE) === note.id}
                onClick={() => handleActiveNote(note.id)}
                className="cursor-pointer flex items-center justify-between py-3 px-1.5 not-last:border-b not-last:border-neutral-700 data-[active=true]:bg-neutral-500/70 hover:bg-neutral-500/70 duration-300 transition-all"
              >
                <strong title={note.title}>{title}</strong>
                <span className="text-base text-gray-300">
                  {formatDistanceToNow(note.created_at, {
                    locale: ptBR,
                    addSuffix: true,
                  })}
                </span>
              </div>
            );
          })}

          {hasNextPage && (
            <button onClick={() => fetchNextPage()} className="my-2 cursor-pointer">
              Carregar mais
            </button>
          )}
        </div>

        <div className="flex flex-col gap-6">
          <button onClick={logout} className="flex cursor-pointer items-center justify-center gap-3">
            <SignOutIcon size={25} />
            <span>Sair</span>
          </button>
        </div>
      </div>
    </>
  );
};
