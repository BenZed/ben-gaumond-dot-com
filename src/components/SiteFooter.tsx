import { Anchor, Box } from '@mantine/core'
import { IconArrowUp } from '@tabler/icons-react'

import { SiteIcon } from './SiteIcon'

export type SiteFooterProps = {
  readonly name: string
}

export function SiteFooter({ name }: SiteFooterProps) {
  return (
    <Box component="footer" className="site-footer">
      <Box component="span">
        {name}{' '}
        <Box component="span" aria-hidden="true">
          /
        </Box>{' '}
        Software developer
      </Box>
      <Anchor href="#top">
        Back to top <SiteIcon icon={IconArrowUp} />
      </Anchor>
    </Box>
  )
}
