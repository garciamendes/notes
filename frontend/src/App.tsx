import { RouterProvider } from "react-router-dom"
import { routers } from "./routes"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { Toaster } from "sonner"

// eslint-disable-next-line react-refresh/only-export-components
export const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster richColors />
      <RouterProvider router={routers} />
    </QueryClientProvider>
  )
}

export default App
