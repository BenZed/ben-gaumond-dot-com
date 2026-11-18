import { Tooltip } from '@mantine/core'
import type { TooltipProps } from '@mantine/core'

export type HeaderTooltipProps = Pick<TooltipProps, 'children' | 'disabled' | 'label'>

export function HeaderTooltip({ children, disabled = false, label }: HeaderTooltipProps) {
  return (
    <Tooltip
      label={label}
      disabled={disabled}
      position="bottom"
      openDelay={250}
      events={{ hover: true, focus: true, touch: false }}
      interactive
    >
      {children}
    </Tooltip>
  )
}
