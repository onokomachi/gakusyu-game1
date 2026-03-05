import { forwardRef, type ComponentPropsWithoutRef } from 'react'
import * as ProgressPrimitive from '@radix-ui/react-progress'
import { cn } from '@/lib/utils'

const Progress = forwardRef<
  React.ComponentRef<typeof ProgressPrimitive.Root>,
  ComponentPropsWithoutRef<typeof ProgressPrimitive.Root> & { indicatorClassName?: string }
>(({ className, value, indicatorClassName, ...props }, ref) => (
  <ProgressPrimitive.Root
    ref={ref}
    className={cn('relative h-3 w-full overflow-hidden rounded-full bg-muted', className)}
    {...props}
  >
    <ProgressPrimitive.Indicator
      className={cn('h-full rounded-full transition-all duration-500 ease-out', indicatorClassName || 'bg-primary')}
      style={{ width: `${value || 0}%` }}
    />
  </ProgressPrimitive.Root>
))
Progress.displayName = 'Progress'

export { Progress }
