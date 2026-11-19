import { ActionIcon, Anchor } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'

import { GitHubMark } from './GitHubMark'
import { HeaderTooltip } from './HeaderTooltip'
import { SiteIcon } from './SiteIcon'

import typography from '../Typography.module.css'

export type ExternalLinkProps = {
  readonly href: string
  readonly label: string
  readonly iconOnly?: boolean
}

export function ExternalLink({ href, label, iconOnly = false }: ExternalLinkProps) {
  const isGitHub = /^https?:\/\/github\.com(?:[/?#]|$)/iu.test(href)
  const icon = isGitHub ? <GitHubMark /> : <SiteIcon icon={IconArrowUpRight} />

  if (iconOnly) {
    return (
      <HeaderTooltip label={label}>
        <ActionIcon component="a" href={href} aria-label={label} variant="subtle" size={36}>
          {icon}
        </ActionIcon>
      </HeaderTooltip>
    )
  }

  return (
    <Anchor href={href} className={typography['text-link']}>
      {isGitHub ? 'View on GitHub' : label} {icon}
    </Anchor>
  )
}
