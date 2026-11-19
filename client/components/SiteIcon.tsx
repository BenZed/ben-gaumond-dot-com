import type { TablerIcon } from '@tabler/icons-react'

import styles from './SiteIcon.module.css'

const DEFAULT_ICON_SIZE = 17
const ICON_STROKE_WIDTH = 1.6

export type SiteIconProps = {
  readonly icon: TablerIcon
  readonly size?: number
  readonly className?: string | undefined
}

/**
 * Decorative icons inherit their accessible name from the adjacent text or button.
 */
export function SiteIcon({ icon: Icon, size = DEFAULT_ICON_SIZE, className }: SiteIconProps) {
  return (
    <Icon
      size={size}
      stroke={ICON_STROKE_WIDTH}
      aria-hidden="true"
      focusable="false"
      className={[styles['icon'], className].filter(Boolean).join(' ')}
    />
  )
}
