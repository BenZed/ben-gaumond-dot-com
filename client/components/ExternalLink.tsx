import { ActionIcon, Anchor } from '@mantine/core'
import { IconArrowUpRight } from '@tabler/icons-react'

import { HEADER_ACTION_SIZE } from '../util/theme'
import { GitHubMark } from './GitHubMark'
import { HeaderTooltip } from './HeaderTooltip'
import { SiteIcon } from './SiteIcon'

import typography from '../Typography.module.css'

const GITHUB_REGEXP = /^https?:\/\/github\.com(?:[/?#]|$)/iu

export type ExternalLinkProps = {
  readonly href: string
  readonly label: string
  readonly iconOnly?: boolean
}

export function ExternalLink({ href, label, iconOnly = false }: ExternalLinkProps) {
  const isGitHub = GITHUB_REGEXP.test(href)
  const icon = isGitHub ? <GitHubMark /> : <SiteIcon icon={IconArrowUpRight} />

  if (iconOnly) {
    return (
      <HeaderTooltip label={label}>
        <ActionIcon
          component="a"
          href={href}
          aria-label={label}
          variant="subtle"
          size={HEADER_ACTION_SIZE}
        >
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
