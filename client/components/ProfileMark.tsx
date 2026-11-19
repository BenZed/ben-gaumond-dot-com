import { Image } from '@mantine/core'

export type ProfileMarkProps = {
  readonly size: string
}

export function ProfileMark({ size }: ProfileMarkProps) {
  return (
    <Image
      src="./totally-what-i-look-like.png"
      alt=""
      w={size}
      h={size}
      radius="50%"
      width={160}
      height={160}
    />
  )
}
