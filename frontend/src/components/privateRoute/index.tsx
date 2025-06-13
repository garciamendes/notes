import { Outlet, useNavigate } from "react-router-dom"
import { useAuth } from "../../hooks/useAuth"
import { useEffect } from "react"

export const RequireAuth = () => {
  const { isAuthenticated } = useAuth()
  const navigation = useNavigate()

  useEffect(() => {
    const authenticated = () => {
      if (!isAuthenticated()) {
        navigation('/auth/login', { replace: true })
        return
      }

    }

    authenticated()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <Outlet />
}