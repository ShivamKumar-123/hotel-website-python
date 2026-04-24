import { cn } from '../../utils/cn'

export default function Card({ children, className, as, ...props }) {
  const Component = as || 'div'
  return (
    <Component
      className={cn(
        'glass-panel overflow-hidden transition duration-500 hover:border-gold-500/25 hover:shadow-[0_24px_80px_rgba(0,0,0,0.55)]',
        className,
      )}
      {...props}
    >
      {children}
    </Component>
  )
}
