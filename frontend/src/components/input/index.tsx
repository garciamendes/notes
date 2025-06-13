import type { ComponentProps, ReactNode } from "react"

export interface IInputProps extends ComponentProps<'input'> {
  label?: string | ReactNode
  error?: string
  iconButton?: ReactNode
}
export const Input = ({ label, error, iconButton, ...props }: IInputProps) => {

  const RenderLabel = () => {
    if (!label) return

    if (typeof label === 'object')
      return label

    return <label className="text-base text-neutral-400" htmlFor={props.id}>{label}</label>
  }

  const RenderErrors = () => {
    if (!error) return

    return <span className="text-red-700">{error}</span>
  }

  const RenderIconButton = () => {
    if (!iconButton) return

    return iconButton
  }

  return (
    <div className="flex flex-col gap-1.5">
      <RenderLabel />

      <div
        data-error={!!error}
        data-hasIcon={!!iconButton}
        className="flex flex-1 items-center border border-neutral-700 rounded-lg focus-within:outline-1 focus-within:outline-purple-700 data-[error=true]:border-red-700 data-[error=true]:focus-within:outline-0 data-[hasIcon=true]:pr-3 transition-all duration-300">
        <input
          className="p-3 bg-transparent border-none flex outline-0 h-full flex-1 text-zinc-100"
          {...props} />

        <RenderIconButton />
      </div>

      <RenderErrors />
    </div>
  )
}