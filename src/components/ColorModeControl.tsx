import { ActionIcon, Group, Menu, useMantineColorScheme } from '@mantine/core'
import { useMounted } from '@mantine/hooks'
import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react'

import { SiteIcon } from './SiteIcon'

const modes = [
  { value: 'light', label: 'Light mode', icon: IconSun },
  { value: 'dark', label: 'Dark mode', icon: IconMoon },
  { value: 'auto', label: 'System mode', icon: IconDeviceDesktop },
] as const

export function ColorModeControl() {
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  // Stored preferences are browser-only. Keep the first render identical to the server render.
  const mounted = useMounted()
  const selected = mounted ? colorScheme : 'auto'

  const activeMode = modes.find(({ value }) => value === selected) ?? modes[2]

  return (
    <Menu position="bottom-end" offset={8} shadow="sm">
      <Menu.Target>
        <ActionIcon
          className="color-mode-button"
          variant="subtle"
          aria-label={`Color mode: ${activeMode.label}`}
          disabled={!mounted}
          size={36}
        >
          <SiteIcon icon={activeMode.icon} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown className="color-mode-menu" aria-label="Color mode">
        <Menu.RadioGroup
          value={selected}
          onChange={(value) => {
            const mode = modes.find((mode) => mode.value === value)
            if (mode) setColorScheme(mode.value)
          }}
        >
          {modes.map(({ value, label, icon }) => (
            <Menu.RadioItem key={value} value={value} closeMenuOnClick>
              <Group gap="xs" wrap="nowrap">
                <SiteIcon icon={icon} size={15} />
                {label}
              </Group>
            </Menu.RadioItem>
          ))}
        </Menu.RadioGroup>
      </Menu.Dropdown>
    </Menu>
  )
}
