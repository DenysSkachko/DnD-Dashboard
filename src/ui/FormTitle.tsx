type Props = {
  children: React.ReactNode
}

const FormTitle = ({ children }: Props) => {
  return (
    <h2 className="flex-1 h-11 bg-dark-hover text-accent mr-3 flex items-center rounded-md px-4 py-1.5 text-2xl font-bold uppercase">
      {children}
    </h2>
  )
}

export default FormTitle
