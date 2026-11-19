import {
  ActionIcon,
  Group,
  Menu,
  useMantineColorScheme,
  type MantineColorScheme as ColorMode,
} from '@mantine/core'
import { useMounted } from '@mantine/hooks'
import { IconDeviceDesktop, IconMoon, IconSun, type TablerIcon } from '@tabler/icons-react'
import { useState } from 'react'

import { HeaderTooltip } from './HeaderTooltip'
import { SiteIcon } from './SiteIcon'

import styles from './ColorModeControl.module.css'

const COLOR_MODES = {
  light: { label: 'Light', icon: IconSun },
  dark: { label: 'Dark', icon: IconMoon },
  auto: { label: 'System', icon: IconDeviceDesktop },
} as const satisfies Record<ColorMode, { readonly label: string; readonly icon: TablerIcon }>

export function ColorModeControl() {
  const mounted = useMounted()
  const [menuOpened, setMenuOpened] = useState(false)
  const [{ selected, icon, label }, setColorMode] = useColorMode(mounted)

  return (
    <Menu position="bottom-end" offset={8} shadow="sm" onChange={setMenuOpened}>
      <HeaderTooltip label={label} disabled={!mounted || menuOpened}>
        <Menu.Target>
          <ActionIcon variant="subtle" aria-label={label} disabled={!mounted} size={36}>
            <SiteIcon icon={icon} />
          </ActionIcon>
        </Menu.Target>
      </HeaderTooltip>

      <Menu.Dropdown className={styles['color-mode-menu']} aria-label="Color mode">
        <Menu.RadioGroup
          value={selected}
          onChange={(value: string) => {
            if (isColorMode(value)) setColorMode(value)
          }}
        >
          {Object.entries(COLOR_MODES).map(([key, { label, icon }]) => (
            <Menu.RadioItem key={key} value={key} closeMenuOnClick>
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

// Internal

const isColorMode = (value: string): value is ColorMode => Object.hasOwn(COLOR_MODES, value)

const useColorMode = (mounted: boolean) => {
  const { colorScheme, setColorScheme } = useMantineColorScheme()

  const selected = mounted ? colorScheme : 'auto'
  const { icon, label } = COLOR_MODES[selected]

  return [{ selected, icon, label }, setColorScheme] as const
}
