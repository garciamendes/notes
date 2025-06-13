import { ListNotes } from "./listNotes"
import { DetailNote } from "./detailNote"

export const Home = () => {
  return (
    <div className="flex h-full p-4 mx-auto gap-12 lg:max-w-[1200px]">
      <ListNotes />

      <DetailNote />
    </div>
  )
}