import type { TablerIcon } from '@tabler/icons-react'

import styles from './SiteIcon.module.css'

export type SiteIconProps = {
  readonly icon: TablerIcon
  readonly size?: number
  readonly className?: string | undefined
}

/** Decorative icons inherit their accessible name from the adjacent text or button. */
export function SiteIcon({ icon: Icon, size = 17, className }: SiteIconProps) {
  return (
    <Icon
      size={size}
      stroke={1.6}
      aria-hidden="true"
      focusable="false"
      className={[styles['icon'], className].filter(Boolean).join(' ')}
    />
  )
}
