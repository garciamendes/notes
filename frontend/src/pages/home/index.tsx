import { ListNotes } from "./listNotes"
import { DetailNote } from "./detailNote"

export const Home = () => {
  return (
    <div className="relative flex h-full justify-center items-center w-full lg:max-w-[1200px] lg:gap-8 lg:mx-auto p-4 overflow-hidden">
      <ListNotes />

      <DetailNote />
    </div>
  )
}