

const Button = ({ type, isLoading, isDisabled, className = '', children, ...rest }) => {
  let color = 'bg-gray-200'

  if (type === 'primary') {
    color = 'bg-primary text-white'
  } else if (type === 'warn') {
    color = 'bg-error text-white'
  }
  return (
    <button
      disabled={isDisabled}
      className={` hover:bg-slate-100 bg-white inline-flex rounded-xl p-2 opacity-90 shadow-sm outline-none transition-all
       border border-black/50 focus:active:scale-90 hover:opacity-100 ${color} ${className}`}
      onClick={rest.onClick}
    >
      {children}
    </button>
  )
}

export default Button