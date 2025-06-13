import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { UserLoginSchema, type UserLogin } from "../../hooks/useAuth/schemas"
import { Input } from "../../components/input"
import { useAuth } from "../../hooks/useAuth"
import { useNavigate } from "react-router-dom"

export const Login = () => {
  const { signin } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(UserLoginSchema)
  })
  const navigation = useNavigate()

  const handlerLogin = async (data: UserLogin) => signin.mutate(data)

  return (
    <form onSubmit={handleSubmit(handlerLogin)} className="p-6 flex flex-col gap-8 rounded-xl min-w-[400px]">
      <Input
        label='Email'
        autoFocus
        placeholder="example@example.com"
        id="email"
        error={errors.email?.message}
        {...register("email")}
      />

      <Input
        label='Senha'
        placeholder={'🞄'.repeat(10)}
        id="password"
        type="password"
        error={errors.password?.message}
        {...register("password")}
      />

      <button
        type="submit"
        className="bg-purple-700 p-3 rounded-lg text-white cursor-pointer hover:bg-purple-800/70 duration-300 transition-all">
        Confirmar
      </button>

      <div className="w-full pt-3 border-t border-purple-800">
        <button
          type="button"
          onClick={() => navigation('/auth/register', { replace: true })}
          className="text-slate-200 underline hover:text-purple-600 cursor-pointer transition-colors duration-300">
          Ainda não tem uma conta?
        </button>
      </div>
    </form>
  )
}