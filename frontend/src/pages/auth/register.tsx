import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { UserRegisterSchema, type UserRegister } from "../../hooks/useAuth/schemas"
import { Input } from "../../components/input"
import { useAuth } from "../../hooks/useAuth"
import { ArrowLeftIcon } from '@phosphor-icons/react'
import { useNavigate } from "react-router-dom"

export const Register = () => {
  const { signup } = useAuth()
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(UserRegisterSchema)
  })
  const navigation = useNavigate()

  const handlerRegister = async (data: UserRegister) => signup.mutate(data)

  return (
    <form onSubmit={handleSubmit(handlerRegister)} className="p-6 flex flex-col gap-8 rounded-xl min-w-[400px]">
      <Input
        label='Nome (Opcional)'
        autoFocus
        placeholder="Joe Doe"
        id="name"
        {...register("name")}
      />

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
          onClick={() => navigation('/auth/login', { replace: true })}
          className="text-slate-200 group flex items-center gap-3 cursor-pointer hover:text-purple-600 transition-all duration-300">
          <ArrowLeftIcon size={24} />
          <span className="group-hover:translate-x-2 transition-all duration-300">Voltar</span>
        </button>
      </div>
    </form>
  )
}