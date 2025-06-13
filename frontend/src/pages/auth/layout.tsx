import { useEffect } from "react"
import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"

export const LayoutAuth = () => {
  const { isAuthenticated } = useAuth()
  const navigation = useNavigate()

  useEffect(() => {
    const authenticated = () => {
      if (isAuthenticated()) {
        navigation('/', { replace: true })
        return
      }
    }

    authenticated()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <div className="relative flex items-center h-full overflow-hidden">
      <div className="max-w-[1200px] z-1">
        <div className="flex flex-wrap justify-center items-center md:-mx-3">
          <div className="flex flex-col w-full max-w-full md:px-12 mx-auto flex-0 md:w-8/12 lg:w-6/12 xl:w-5/12">
            <Outlet />
          </div>

          <div className="w-full max-w-full px-3 my-auto shrink-0 md:flex-0 md:w-6/12">
            <div className="absolute top-0 hidden w-3/5 h-full -mr-32 overflow-hidden -skew-x-10 -right-40 md:block bg-purple-900"></div>
          </div>
        </div>
      </div>
    </div>
  )
}