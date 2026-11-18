import { Image } from '@mantine/core'
import type { ImageProps } from '@mantine/core'

export type ProfileMarkProps = {
  readonly size: string
  readonly radius?: ImageProps['radius']
}

export function ProfileMark({ size, radius = 'sm' }: ProfileMarkProps) {
  return (
    <Image
      src="./totally-what-i-look-like.png"
      alt=""
      w={size}
      h={size}
      radius={radius}
      width={160}
      height={160}
    />
  )
}
