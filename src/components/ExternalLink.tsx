import { ActionIcon, Anchor } from '@mantine/core'
import { IconArrowUpRight, IconBrandGithub } from '@tabler/icons-react'

import { HeaderTooltip } from './HeaderTooltip'
import { SiteIcon } from './SiteIcon'

import typography from '../Typography.module.css'

export type ExternalLinkProps = {
  readonly href: string
  readonly label: string
  readonly iconOnly?: boolean
}

export function ExternalLink({ href, label, iconOnly = false }: ExternalLinkProps) {
  const icon = /^https?:\/\/github\.com(?:[/?#]|$)/iu.test(href)
    ? IconBrandGithub
    : IconArrowUpRight

  if (iconOnly) {
    return (
      <HeaderTooltip label={label}>
        <ActionIcon component="a" href={href} aria-label={label} variant="subtle" size={36}>
          <SiteIcon icon={icon} />
        </ActionIcon>
      </HeaderTooltip>
    )
  }

  return (
    <Anchor href={href} className={typography['text-link']}>
      {label} <SiteIcon icon={icon} />
    </Anchor>
  )
}
