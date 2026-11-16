import { Box, Group, Text } from '@mantine/core'

import type { Resume } from '../resume'

export function Toolkit({
  profiles,
  technologies,
}: {
  readonly profiles: Resume['basics']['profiles']
  readonly technologies: Resume['technologies']
}) {
  return (
    <>
      <Box className="print-contact">
        {profiles.map((profile) => (
          <Text component="p" key={profile.network}>
            {profile.network}: {profile.url}
          </Text>
        ))}
      </Box>
      <Box className="technology-strip">
        <Box component="span" className="eyebrow">
          Core toolkit
        </Box>
        <Group gap="xl">
          {technologies.map((technology) => (
            <Box component="span" key={technology}>
              {technology}
            </Box>
          ))}
        </Group>
        <Box component="span" className="strip-note">
          From the interface to the infrastructure.
        </Box>
      </Box>
    </>
  )
}
