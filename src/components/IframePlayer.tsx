import { AspectRatio, Box, Button, Stack } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { IconPlayerPlay, IconX } from '@tabler/icons-react'
import { useId } from 'react'

import { SiteIcon } from './SiteIcon'

export type IframePlayerProps = {
  readonly src: string
  readonly title: string
}

export function IframePlayer({ src, title }: IframePlayerProps) {
  const [opened, { toggle }] = useDisclosure(false)
  const playerId = useId()

  return (
    <Stack align="flex-start" gap="sm" w="100%">
      <Button
        size="xs"
        variant="subtle"
        aria-expanded={opened}
        aria-controls={playerId}
        leftSection={<SiteIcon icon={opened ? IconX : IconPlayerPlay} />}
        onClick={toggle}
      >
        {opened ? 'Close player' : 'Play inline'}
      </Button>
      <Box id={playerId} w="100%" hidden={!opened}>
        {opened && (
          <AspectRatio ratio={16 / 9}>
            <Box
              component="iframe"
              src={src}
              title={title}
              sandbox="allow-scripts"
              referrerPolicy="no-referrer"
              allowFullScreen
              style={{ border: 0 }}
            />
          </AspectRatio>
        )}
      </Box>
    </Stack>
  )
}
