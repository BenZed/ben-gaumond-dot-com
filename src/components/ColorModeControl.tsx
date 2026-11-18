import { ActionIcon, Group, Menu, useMantineColorScheme } from '@mantine/core'
import { useMounted } from '@mantine/hooks'
import { IconDeviceDesktop, IconMoon, IconSun } from '@tabler/icons-react'
import { useState } from 'react'

import { HeaderTooltip } from './HeaderTooltip'
import { SiteIcon } from './SiteIcon'

import styles from './ColorModeControl.module.css'

const modes = [
  { value: 'light', label: 'Light', icon: IconSun },
  { value: 'dark', label: 'Dark', icon: IconMoon },
  { value: 'auto', label: 'System', icon: IconDeviceDesktop },
] as const

export function ColorModeControl() {
  const [menuOpened, setMenuOpened] = useState(false)
  const { colorScheme, setColorScheme } = useMantineColorScheme()
  // Stored preferences are browser-only. Keep the first render identical to the server render.
  const mounted = useMounted()
  const selected = mounted ? colorScheme : 'auto'

  const activeMode = modes.find(({ value }) => value === selected) ?? modes[2]
  const label = `Color mode: ${activeMode.label}`

  return (
    <Menu position="bottom-end" offset={8} shadow="sm" onChange={setMenuOpened}>
      <HeaderTooltip label={label} disabled={!mounted || menuOpened}>
        <Menu.Target>
          <ActionIcon variant="subtle" aria-label={label} disabled={!mounted} size={36}>
            <SiteIcon icon={activeMode.icon} />
          </ActionIcon>
        </Menu.Target>
      </HeaderTooltip>
      <Menu.Dropdown className={styles['color-mode-menu']} aria-label="Color mode">
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
